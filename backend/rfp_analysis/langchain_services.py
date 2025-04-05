import json
import re
from langchain_google_genai import ChatGoogleGenerativeAI
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
1. Standard Compliance Checks*  
- Determine if ConsultAdd is legally eligible to bid.  
- Consider factors like required state registrations, certifications, and past performance.  
- Clearly identify any disqualifying criteria or deal-breakers.

Company Data:
{company_data}

RFP Content:
{rfp_content}

Respond ONLY with JSON in the following format:
{{
  "compliance": {{
    "results": [
      {{
        "title": "<check title>",
        "description": "<brief explanation>",
        "status": "pass" or "fail"
      }}
    ]
  }}
}}
"""
)

eligibility_template = PromptTemplate(
    input_variables=["rfp_content"],
    template="""
2. *Mandatory Eligibility Criteria*  
- Extract and summarize all must-have qualifications, certifications, and experience needed to bid.  
- Highlight any missing elements in ConsultAdd’s profile that may affect eligibility.

RFP Content:
{rfp_content}

Respond ONLY with JSON in the following format:
{{
  "eligibility": {{
    "requirements": [
      {{
        "description": "<requirement description>",
        "met": true or false
      }}
    ],
    "missing_requirements": ["<missing1>", "<missing2>"]
  }}
}}
"""
)

risk_template = PromptTemplate(
    input_variables=["rfp_content"],
    template="""
4. Contract Risk Analysis*  
- Identify clauses that may present risk or bias against ConsultAdd, such as unilateral termination rights, unreasonable penalties, or strict SLAs.  
- Suggest potential modifications or negotiation points to mitigate these risks.

RFP Content:
{rfp_content}

Respond ONLY with JSON in the following format:
{{
  "risk": {{
    "risks": [
      {{
        "title": "<risk title>",
        "description": "<risk explanation>",
        "severity": "low" | "medium" | "high",
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
3. *Submission Checklist*  
- Generate a checklist of submission requirements including:  
    - Document formatting (e.g., font size, line spacing, page limits, TOC, etc.)  
    - Required attachments (e.g., forms, certificates, pricing sheets)  
    - Submission method and deadlines

RFP Content:
{rfp_content}

Respond ONLY with JSON in the following format:
{{
  "submission": {{
    "items": [
      {{
        "name": "<item name>",
        "requirements": "<item requirements>",
        "completed": true or false
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
