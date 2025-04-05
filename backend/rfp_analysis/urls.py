from django.urls import path
from .views import UploadPDFsView, AnalyzeRFPAPIView

urlpatterns = [
    path('api/upload-pdfs/', UploadPDFsView.as_view(), name='upload-pdfs'),
    path('api/analyze-rfp/', AnalyzeRFPAPIView.as_view(), name='analyze-rfp'),
]