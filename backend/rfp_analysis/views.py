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

class UploadPDFsView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        # Get files from request
        rfp_pdf = request.FILES.get('rfp_pdf')
        company_pdf = request.FILES.get('company_pdf')

        # Validate both files are present
        if not rfp_pdf or not company_pdf:
            return Response(
                {"error": "Both 'rfp_pdf' and 'company_pdf' are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Process RFP PDF
            rfp_reader = PdfReader(rfp_pdf)
            rfp_text = "\n".join(page.extract_text() for page in rfp_reader.pages)
            
            # Process Company PDF
            company_reader = PdfReader(company_pdf)
            company_text = "\n".join(page.extract_text() for page in company_reader.pages)
        except Exception as e:
            return Response(
                {"error": f"PDF processing failed: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Save to database
        rfp_doc = RFPDocument.objects.create(
            title=rfp_pdf.name,
            pdf_file=rfp_pdf,
            content=rfp_text
        )

        company_data = CompanyData.objects.create(
            name=company_pdf.name,
            pdf_file=company_pdf,
            data=company_text
        )

        return Response({
            "rfp_id": rfp_doc.id,
            "company_id": company_data.id
        }, status=status.HTTP_201_CREATED)

class AnalyzeRFPAPIView(APIView):
    def post(self, request):
        serializer = AnalyzeRFPSerializer(data=request.data)
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