from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework import status
from PyPDF2 import PdfReader
from django.shortcuts import get_object_or_404
from .models import RFPDocument, CompanyData, ComplianceResult, EligibilityResult, SubmissionChecklistResult, ContractRiskResult
from .serializers import AnalyzeRFPSerializer, AnalysisResultSerializer
from .langchain_services import (
    run_compliance_analysis,
    run_eligibility_extraction,
    run_submission_checklist,
    run_risk_analysis
)

import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework import status
from PyPDF2 import PdfReader
from .models import RFPDocument, CompanyData
from .serializers import AnalyzeRFPSerializer, AnalysisResultSerializer
from .langchain_services import (
    run_compliance_analysis,
    run_eligibility_extraction,
    run_submission_checklist,
    run_risk_analysis
)


import logging
logger = logging.getLogger(__name__)

class UploadPDFsView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        try:
            logger.info("Upload request received")
            rfp_pdf = request.FILES.get('rfp_pdf')
            
            if not rfp_pdf:
                logger.error("No RFP PDF provided")
                return Response(
                    {"error": "'rfp_pdf' is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            logger.info(f"Processing RFP: {rfp_pdf.name}")
            
            # Process RFP PDF
            try:
                rfp_reader = PdfReader(rfp_pdf)
                rfp_text = "\n".join(page.extract_text() or "" for page in rfp_reader.pages)
                logger.info("RFP PDF processed successfully")
            except Exception as e:
                logger.error(f"RFP PDF processing failed: {str(e)}")
                return Response(
                    {"error": f"RFP PDF processing failed: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Process Company PDF
            company_pdf_path = os.path.join(settings.BASE_DIR, 'company_data.pdf')
            logger.info(f"Looking for company data at: {company_pdf_path}")
            
            if not os.path.exists(company_pdf_path):
                logger.error("Company data PDF not found")
                return Response(
                    {"error": "Company data PDF not found on server."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            try:
                with open(company_pdf_path, 'rb') as f:
                    company_reader = PdfReader(f)
                    company_text = "\n".join(page.extract_text() or "" for page in company_reader.pages)
                logger.info("Company PDF processed successfully")
            except Exception as e:
                logger.error(f"Company PDF processing failed: {str(e)}")
                return Response(
                    {"error": f"Company PDF processing failed: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # Save to database
            try:
                rfp_doc = RFPDocument.objects.create(
                    title=rfp_pdf.name,
                    pdf_file=rfp_pdf,
                    content=rfp_text
                )
                logger.info(f"RFP document created with ID: {rfp_doc.id}")
                
                company_data = CompanyData.objects.create(
                    name="company_data.pdf",
                    pdf_file="company_data.pdf",
                    data=company_text
                )
                logger.info(f"Company data created with ID: {company_data.id}")

                return Response({
                    "rfp_id": rfp_doc.id,
                    "company_id": company_data.id
                }, status=status.HTTP_201_CREATED)
                
            except Exception as e:
                logger.error(f"Database save failed: {str(e)}")
                return Response(
                    {"error": f"Database operation failed: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}", exc_info=True)
            return Response(
                {"error": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AnalyzeRFPAPIView(APIView):
    def post(self, request):
        serializer = AnalyzeRFPSerializer(data=request.data)
        print("done")
        if serializer.is_valid():
            rfp_id = serializer.validated_data['rfp_id']
            company_id = serializer.validated_data['company_id']
            
            rfp = get_object_or_404(RFPDocument, id=rfp_id)
            company = get_object_or_404(CompanyData, id=company_id)
            
            try:
                # Run analysis
                compliance = run_compliance_analysis(company.data, rfp.content)
                eligibility = run_eligibility_extraction(rfp.content)
                submission = run_submission_checklist(rfp.content)
                risk = run_risk_analysis(rfp.content)
            except Exception as e:
                return Response(
                    {"error": f"Analysis failed: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # Save results without user association
            ComplianceResult.objects.create(rfp_document=rfp, result=compliance)
            EligibilityResult.objects.create(rfp_document=rfp, result=eligibility)
            SubmissionChecklistResult.objects.create(rfp_document=rfp, result=submission)
            ContractRiskResult.objects.create(rfp_document=rfp, result=risk)
            
            return Response({
                "compliance": compliance,
                "eligibility": eligibility,
                "submission": submission,
                "risk": risk
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)