from django.db import models

class RFPDocument(models.Model):
    title = models.CharField(max_length=255)
    pdf_file = models.FileField(upload_to='rfps/')
    content = models.TextField(blank=True)
    
    def __str__(self):
        return self.title

class CompanyData(models.Model):
    name = models.CharField(max_length=255)
    pdf_file = models.FileField(upload_to='company_data/')
    data = models.TextField(blank=True)
    
    def __str__(self):
        return self.name

class ComplianceResult(models.Model):
    rfp_document = models.ForeignKey(RFPDocument, on_delete=models.CASCADE)
    result = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class EligibilityResult(models.Model):
    rfp_document = models.ForeignKey(RFPDocument, on_delete=models.CASCADE)
    result = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class SubmissionChecklistResult(models.Model):
    rfp_document = models.ForeignKey(RFPDocument, on_delete=models.CASCADE)
    result = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class ContractRiskResult(models.Model):
    rfp_document = models.ForeignKey(RFPDocument, on_delete=models.CASCADE)
    result = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)