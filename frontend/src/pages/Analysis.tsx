import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

interface StepProps {
  title: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface AnalysisData {
  compliance: {
    results: Array<{
      title: string;
      status: 'pass' | 'fail' | 'pending';
      description: string;
    }>;
  };
  eligibility: {
    requirements: Array<{
      description: string;
      met: boolean;
    }>;
    missing_requirements: string[];
  };
  risk: {
    risks: Array<{
      title: string;
      severity: 'high' | 'medium' | 'low';
      description: string;
      suggestion: string;
    }>;
  };
  submission: {
    items: Array<{
      name: string;
      requirements: string;
      completed: boolean;
    }>;
  };
}

interface LocationState {
  rfpId: string;
  companyId: string;
}

const Step: React.FC<StepProps> = ({ title, isActive, isCompleted }) => (
  <div className={`flex items-center ${isActive ? 'text-primary' : 'text-gray-500'}`}>
    <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full
      ${isCompleted ? 'bg-primary text-white' : isActive ? 'border-2 border-primary' : 'border-2 border-gray-300'}`}>
      {isCompleted ? '✓' : ''}
    </div>
    <div className="ml-4">
      <p className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-gray-500'}`}>{title}</p>
    </div>
  </div>
);

const Analysis: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const { rfpId, companyId } = state || {};
  const [activeStep, setActiveStep] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const steps = [
    { id: 1, title: 'Compliance Check' },
    { id: 2, title: 'Mandatory Eligibility' },
    { id: 3, title: 'Risk Analysis' },
    { id: 4, title: 'Submission Checklist' },
  ];

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!rfpId || !companyId) {
          throw new Error('Missing required RFP or Company ID');
        }

        const response = await axios.post('http://localhost:8000/api/analyze-rfp/', {
          rfp_id: rfpId,
          company_id: companyId
        });

        // Normalize the nested API response
        const normalizedData: AnalysisData = {
          compliance: response.data.compliance?.compliance || { results: [] },
          eligibility: response.data.eligibility?.eligibility || { 
            requirements: [], 
            missing_requirements: [] 
          },
          risk: response.data.risk?.risk || { risks: [] },
          submission: response.data.submission?.submission || { items: [] }
        };

        setAnalysisData(normalizedData);
      } catch (err: any) {
        console.error('API call failed:', err);
        let errorMsg = 'Failed to fetch analysis data.';
        
        if (err.response) {
          errorMsg = `Server error: ${err.response.status} - ${err.response.data?.error || err.response.statusText}`;
        } else if (err.message.includes('Missing required')) {
          errorMsg = err.message;
        } else {
          errorMsg = 'Network error. Please check your connection.';
        }
        
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysisData();
  }, [rfpId, companyId]);

  if (!rfpId || !companyId) {
    return (
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <XCircleIcon className="mx-auto h-16 w-16 text-red-500" />
            <h2 className="text-2xl font-bold text-red-500 mt-4">Missing Data</h2>
            <p className="mt-2 text-gray-600">
              Required analysis data was not provided. Please upload your RFP again.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Go Back to Upload
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }
    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-8 w-8 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Error</h3>
              <p className="text-red-700 mt-1">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      );
    }
    if (!analysisData) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">No analysis data available</p>
        </div>
      );
    }
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-secondary mb-8">Compliance Check Results</h3>
            <div className="space-y-6">
              {analysisData.compliance.results?.map((result, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center">
                    {result.status === 'pass' ? (
                      <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
                    ) : result.status === 'pending' ? (
                      <div className="h-8 w-8 mr-3">
                        <div className="animate-pulse h-full w-full rounded-full bg-yellow-300"></div>
                      </div>
                    ) : (
                      <XCircleIcon className="h-8 w-8 text-red-500 mr-3" />
                    )}
                    <div>
                      <h4 className={`text-lg font-medium ${result.status === 'fail' ? 'text-red-500' : result.status === 'pending' ? 'text-yellow-500' : ''}`}>
                        {result.title}
                      </h4>
                      <p className="text-gray-600 mt-1">{result.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-secondary mb-8">Mandatory Eligibility Requirements</h3>
            {analysisData.eligibility.missing_requirements?.length > 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg mb-8">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-medium text-yellow-800">Missing Requirements</h4>
                    <p className="text-yellow-700 mt-1">
                      {analysisData.eligibility.missing_requirements.join(', ')} are required for this RFP
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <ul className="space-y-4">
                {analysisData.eligibility.requirements?.map((req, index) => (
                  <li key={index} className="flex items-center">
                    {req.met ? (
                      <>
                        <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
                        <span className="text-green-600">{req.description}</span>
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="h-6 w-6 text-red-500 mr-2" />
                        <span className="text-red-500">{req.description} (Not Found)</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-secondary mb-8">Risk Analysis</h3>
            <div className="space-y-6">
              {analysisData.risk.risks?.map((risk, index) => (
                <div 
                  key={index} 
                  className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${
                    risk.severity === 'high' ? 'border-red-500' : 
                    risk.severity === 'medium' ? 'border-yellow-500' : 'border-blue-500'
                  }`}
                >
                  <h4 className={`text-lg font-medium ${
                    risk.severity === 'high' ? 'text-red-500' : 
                    risk.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                  } mb-2`}>
                    {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)} Risk: {risk.title}
                  </h4>
                  <p className="text-gray-600">{risk.description}</p>
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-700">Suggestion:</p>
                    <p className="text-sm text-gray-600 mt-1">{risk.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-secondary mb-8">Submission Checklist</h3>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <ul className="space-y-4">
                {analysisData.submission.items?.map((item, index) => (
                  <li key={index} className="flex items-center">
                    {item.completed ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                    ) : (
                      <XCircleIcon className="h-6 w-6 text-red-500 mr-3" />
                    )}
                    <div>
                      <h4 className={`font-medium ${item.completed ? '' : 'text-red-500'}`}>
                        {item.name}
                      </h4>
                      <p className={`text-sm ${item.completed ? 'text-gray-600' : 'text-red-500'}`}>
                        {item.requirements}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setShowSummary(true)}
                className="mt-8 w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                Download Checklist
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const isEligible = () => {
    if (!analysisData) return false;
    return analysisData.eligibility.missing_requirements.length === 0;
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <nav aria-label="Progress">
                <ol className="space-y-6">
                  {steps.map((step) => (
                    <li key={step.id} onClick={() => setActiveStep(step.id)} className="cursor-pointer">
                      <Step
                        title={step.title}
                        isActive={step.id === activeStep}
                        isCompleted={step.id < activeStep}
                      />
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
            <div className="md:col-span-3">
              {renderStepContent()}
              {!isLoading && !error && analysisData && (
                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                    disabled={activeStep === 1}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => {
                      if (activeStep < 4) {
                        setActiveStep((prev) => prev + 1);
                      } else {
                        setShowSummary(true);
                      }
                    }}
                    className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
                  >
                    {activeStep === 4 ? 'Complete Analysis' : 'Next'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="text-center">
              {isEligible() ? (
                <>
                  <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">Eligible for Submission</h3>
                  <p className="mt-4 text-gray-600">
                    Your company meets all the requirements for this RFP. You can proceed with the submission.
                  </p>
                </>
              ) : (
                <>
                  <XCircleIcon className="mx-auto h-16 w-16 text-red-500" />
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">Not Eligible</h3>
                  <p className="mt-4 text-gray-600">
                    Missing compliance requirements: {analysisData?.eligibility.missing_requirements.join(', ')}.
                    Please address these issues before proceeding with the submission.
                  </p>
                </>
              )}
              <div className="mt-6">
                <button
                  onClick={() => setShowSummary(false)}
                  className="inline-flex justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis;