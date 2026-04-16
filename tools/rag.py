from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List

model = SentenceTransformer("all-MiniLM-L6-v2")

# Simple in-memory store
_documents = []
_embeddings = []


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

    embeddings = model.encode(all_chunks)
    _documents.extend(all_chunks)
    _embeddings.extend(embeddings)
    print(f"[RAG] Added {len(all_chunks)} chunks from {source}")


def query(question: str, n_results: int = 4) -> str:
    global _documents, _embeddings

    if not _documents:
        return "No past event intelligence available."

    query_embedding = model.encode([question])[0]
    embeddings_matrix = np.array(_embeddings)

    # Cosine similarity
    norms = np.linalg.norm(embeddings_matrix, axis=1) * np.linalg.norm(query_embedding)
    norms = np.where(norms == 0, 1, norms)
    similarities = np.dot(embeddings_matrix, query_embedding) / norms

    top_indices = np.argsort(similarities)[-n_results:][::-1]
    top_chunks = [_documents[i] for i in top_indices]

    return "\n---\n".join(top_chunks)