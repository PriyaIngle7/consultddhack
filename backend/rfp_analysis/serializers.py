from rest_framework import serializers

class AnalyzeRFPSerializer(serializers.Serializer):
    rfp_id = serializers.IntegerField()
    company_id = serializers.IntegerField()

class AnalysisResultSerializer(serializers.Serializer):
    compliance = serializers.CharField()
    eligibility = serializers.CharField()
    submission = serializers.CharField()
    risk = serializers.CharField()