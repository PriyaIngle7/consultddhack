import json
import re
from langchain_google_genai import (
    ChatGoogleGenerativeAI
)
from langchain.prompts import PromptTemplate
from django.conf import settings

# Initialize Gemini LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    google_api_key=settings.GOOGLE_API_KEY
)

# ==== Prompt Templates ====

compliance_template = PromptTemplate(
    input_variables=["company_data", "rfp_content"],
    template="""
You are a compliance expert. Check if the company meets the RFP requirements.

Company Data:
{company_data}

RFP Content:
{rfp_content}

Respond ONLY with JSON in the following format:
{{
  "step1": {{
    "title": "Compliance Check",
    "results": [
      {{
        "type": "success" or "error",
        "title": "<check title>",
        "message": "<brief explanation>"
      }}
    ]
  }}
}}
"""
)

eligibility_template = PromptTemplate(
    input_variables=["rfp_content"],
    template="""
Extract the mandatory eligibility requirements from the RFP.

RFP Content:
{rfp_content}

Respond ONLY with JSON in the following format:
{{
  "step2": {{
    "title": "Mandatory Eligibility",
    "warning": "<optional overall warning if any major requirement is missing>",
    "checklist": [
      {{ "status": "pass" or "fail", "text": "<requirement>" }}
    ]
  }}
}}
"""
)

risk_template = PromptTemplate(
    input_variables=["rfp_content"],
    template="""
Identify contractual risks in the RFP.

RFP Content:
{rfp_content}

Respond ONLY with JSON in the following format:
{{
  "step3": {{
    "title": "Risk Analysis",
    "risks": [
      {{
        "severity": "low" | "medium" | "high",
        "title": "<risk title>",
        "message": "<explanation>",
        "suggestion": "<remedy suggestion>"
      }}
    ]
  }}
}}
"""
)

submission_template = PromptTemplate(
    input_variables=["rfp_content"],
    template="""
Generate a checklist of submission requirements from the RFP including formatting and attachments.

RFP Content:
{rfp_content}

Respond ONLY with JSON in the following format:
{{
  "step4": {{
    "title": "Submission Checklist",
    "items": [
      {{
        "status": "pass" or "fail",
        "title": "<requirement title>",
        "description": "<requirement description>"
      }}
    ]
  }}
}}
"""
)

# ==== LangChain Chains ====

compliance_chain = compliance_template | llm
eligibility_chain = eligibility_template | llm
risk_chain = risk_template | llm
submission_chain = submission_template | llm

# ==== Utility Functions ====

def get_response_text(response):
    if hasattr(response, "content"):
        return response.content
    elif isinstance(response, str):
        return response
    return str(response)

def extract_json(text: str) -> dict:
    """Extract and parse the first JSON object from text."""
    try:
        json_match = re.search(r'({[\s\S]+})', text)
        if json_match:
            return json.loads(json_match.group(1))
        else:
            raise ValueError("No JSON found in response")
    except json.JSONDecodeError as e:
        raise ValueError(f"JSON parsing failed: {e}\nRaw text: {text}")

# ==== Individual Execution Functions ====

def run_compliance_analysis(company_data: str, rfp_content: str) -> dict:
    response = compliance_chain.invoke({
        "company_data": company_data,
        "rfp_content": rfp_content
    })
    return extract_json(get_response_text(response))

def run_eligibility_extraction(rfp_content: str) -> dict:
    response = eligibility_chain.invoke({
        "rfp_content": rfp_content
    })
    return extract_json(get_response_text(response))

def run_risk_analysis(rfp_content: str) -> dict:
    response = risk_chain.invoke({
        "rfp_content": rfp_content
    })
    return extract_json(get_response_text(response))

def run_submission_checklist(rfp_content: str) -> dict:
    response = submission_chain.invoke({
        "rfp_content": rfp_content
    })
    return extract_json(get_response_text(response))

# ==== Final Combined Function ====

def run_full_rfp_analysis(company_data: str, rfp_content: str) -> dict:
    try:
        result = {}
        result.update(run_compliance_analysis(company_data, rfp_content))
        result.update(run_eligibility_extraction(rfp_content))
        result.update(run_risk_analysis(rfp_content))
        result.update(run_submission_checklist(rfp_content))
        return result
    except Exception as e:
        return {"error": f"Analysis failed: {str(e)}"}
