from PyPDF2 import PdfReader
from langchain.embeddings import OpenAIEmbeddings
import os

embeddings_model = OpenAIEmbeddings()

def process_pdf(file):
    """Extract text and generate embedding from PDF"""
    reader = PdfReader(file)
    text = "\n".join(page.extract_text() for page in reader.pages)
    embedding = embeddings_model.embed_query(text)
    return text, embedding