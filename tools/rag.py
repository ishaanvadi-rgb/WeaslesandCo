import os
import requests
import numpy as np
from typing import List
from dotenv import load_dotenv

load_dotenv()

HF_API_URL = "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction"
HF_TOKEN = os.getenv("HF_TOKEN", "")

_documents = []
_embeddings = []


def get_embeddings(texts: List[str]) -> List[List[float]]:
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    response = requests.post(
        HF_API_URL,
        headers=headers,
        json={"inputs": texts, "options": {"wait_for_model": True}},
        timeout=30,
    )
    if response.status_code == 200:
        return response.json()
    print(f"[RAG] Embedding API error: {response.status_code} {response.text[:100]}")
    return [[0.0] * 384 for _ in texts]


def init_collection():
    global _documents, _embeddings
    _documents = []
    _embeddings = []
    print("[RAG] Collection initialized")


def chunk_text(text: str, chunk_size: int = 300, overlap: int = 50) -> List[str]:
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks


def add_documents(texts: List[str], source: str):
    global _documents, _embeddings

    all_chunks = []
    for text in texts:
        all_chunks.extend(chunk_text(text))

    if not all_chunks:
        return

    try:
        embeddings = get_embeddings(all_chunks)
        _documents.extend(all_chunks)
        _embeddings.extend(embeddings)
        print(f"[RAG] Added {len(all_chunks)} chunks from {source}")
    except Exception as e:
        print(f"[RAG] Failed: {e}")


def query(question: str, n_results: int = 4) -> str:
    if not _documents:
        return "No past event intelligence available."

    try:
        query_embedding = get_embeddings([question])[0]
        embeddings_matrix = np.array(_embeddings)
        query_vec = np.array(query_embedding)

        norms = np.linalg.norm(embeddings_matrix, axis=1) * np.linalg.norm(query_vec)
        norms = np.where(norms == 0, 1, norms)
        similarities = np.dot(embeddings_matrix, query_vec) / norms

        top_indices = np.argsort(similarities)[-n_results:][::-1]
        return "\n---\n".join([_documents[i] for i in top_indices])
    except Exception as e:
        print(f"[RAG] Query failed: {e}")
        return "No relevant context found."