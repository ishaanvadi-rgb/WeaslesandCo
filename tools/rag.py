import chromadb
from chromadb.utils import embedding_functions
from typing import List


# Initialize ChromaDB in-memory (resets each run — perfect for our use case)
client = chromadb.Client()

# Use sentence-transformers for embeddings — runs locally, no API needed
embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

# One collection per run
collection = None


def init_collection():
    global collection
    global client
    # Fresh client each time
    client = chromadb.Client()
    collection = client.create_collection(
        name="conference_intel",
        embedding_function=embedding_fn,
    )
    print("[RAG] Collection initialized")


def chunk_text(text: str, chunk_size: int = 300, overlap: int = 50) -> List[str]:
    """
    Splits text into overlapping chunks.
    overlap means consecutive chunks share some text — 
    so context at chunk boundaries isn't lost.
    """
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks


def add_documents(texts: List[str], source: str):
    """
    Chunks and embeds a list of texts, stores in ChromaDB.
    source is metadata so we know where each chunk came from.
    """
    if collection is None:
        init_collection()

    all_chunks = []
    all_ids = []
    all_metadata = []

    for i, text in enumerate(texts):
        chunks = chunk_text(text)
        for j, chunk in enumerate(chunks):
            all_chunks.append(chunk)
            all_ids.append(f"{source}_{i}_{j}")
            all_metadata.append({"source": source})

    if all_chunks:
        collection.add(
            documents=all_chunks,
            ids=all_ids,
            metadatas=all_metadata,
        )
        print(f"[RAG] Added {len(all_chunks)} chunks from {source}")


def query(question: str, n_results: int = 4) -> str:
    """
    Queries ChromaDB for the most relevant chunks.
    Returns them as a single string for the LLM prompt.
    """
    if collection is None or collection.count() == 0:
        return "No past event intelligence available."

    results = collection.query(
        query_texts=[question],
        n_results=min(n_results, collection.count()),
    )

    chunks = results["documents"][0] if results["documents"] else []
    if not chunks:
        return "No relevant context found."

    return "\n---\n".join(chunks)