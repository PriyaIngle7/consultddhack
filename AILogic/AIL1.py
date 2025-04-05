from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
import json

# Step 1: Load chunks
rfps, company_chunks = preprocess_documents()

# Step 2: Init LLM and parser
llm = ChatGroq(
    model_name="llama-3.3-70b-versatile",
    temperature=0.7
)

parser = JsonOutputParser(pydantic_object={
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "price": {"type": "number"},
        "features": {
            "type": "array",
            "items": {"type": "string"}
        }
    }
})

prompt = ChatPromptTemplate.from_messages([
    ("system", """Extract product details into JSON with this structure:
    {{
        "name": "product name here",
        "price": number_here_without_currency_symbol,
        "features": ["feature1", "feature2", "feature3"]
    }}"""),
    ("user", "{input}")
])

chain = prompt | llm | parser

# Step 3: Use this on each chunk
def parse_chunks(chunks: list, label="chunk"):
    results = []
    for i, chunk in enumerate(chunks):
        try:
            print(f"\n--- {label.upper()} [{i+1}] ---")
            result = chain.invoke({"input": chunk})
            print(json.dumps(result, indent=2))
            results.append(result)
        except Exception as e:
            print(f"Error parsing chunk {i+1}: {e}")
    return results

# Step 4: Run on company and RFPs
company_results = parse_chunks(company_chunks, label="Company Profile")

for rfp_name, rfp_chunks in rfps.items():
    print(f"\n########## Parsing RFP: {rfp_name} ##########")
    parse_chunks(rfp_chunks, label=rfp_name)
