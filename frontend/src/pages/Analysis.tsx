import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

interface StepProps {
  title: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface AnalysisData {
  compliance: {
    eligibility: 'eligible' | 'partial' | 'not eligible';
    results: Array<{
      title: string;
      status: 'pass' | 'fail' | 'pending';
      description: string;
    }>;
  };
  eligibility: {
    status: 'eligible' | 'partial' | 'not eligible';
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

  const handleDownloadChecklist = () => {
    if (!analysisData) return;
  
    // Create a more professional document structure
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1000,    // 1 inch margin
                right: 1000,
                bottom: 1000,
                left: 1000,
              }
            }
          },
          children: [
            // Header with logo and title
            new Paragraph({
              children: [
                new TextRun({
                  text: "RFP Submission Checklist",
                  bold: true,
                  size: 36,
                  font: "Calibri",
                  color: "2E5984", // Dark blue
                }),
              ],
              alignment: "center",
              spacing: { after: 400 },
              border: {
                bottom: {
                  color: "2E5984",
                  space: 20,
                  value: "single",
                  size: 8,
                },
              },
            }),
  
            // Document metadata
            new Paragraph({
              children: [
                new TextRun({
                  text: `Prepared for: ${companyId}`,
                  size: 22,
                  color: "555555",
                }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `RFP ID: ${rfpId}`,
                  size: 22,
                  color: "555555",
                }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Date: ${new Date().toLocaleDateString()}`,
                  size: 22,
                  color: "555555",
                }),
              ],
              spacing: { after: 600 },
            }),
  
            // Checklist items header
            new Paragraph({
              children: [
                new TextRun({
                  text: "Submission Requirements",
                  bold: true,
                  size: 28,
                  color: "2E5984",
                  font: "Calibri",
                }),
              ],
              spacing: { before: 400, after: 400 },
              border: {
                bottom: {
                  color: "2E5984",
                  space: 10,
                  value: "single",
                  size: 6,
                },
              },
            }),
  
            // Checklist items
            ...analysisData.submission.items.map((item, index) => [
              // Item header with status
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${index + 1}. ${item.name}`,
                    bold: true,
                    size: 24,
                    color: item.completed ? "2E5984" : "C00000", // Blue or red
                    font: "Calibri",
                  }),
                  new TextRun({
                    text: ` [${item.completed ? "COMPLETED" : "MISSING"}]`,
                    bold: true,
                    size: 22,
                    color: item.completed ? "2E5984" : "C00000",
                  }),
                ],
                spacing: { before: 400, after: 200 },
              }),
  
              // Requirements
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Requirements:",
                    bold: true,
                    size: 22,
                  }),
                ],
                indent: { left: 400 },
                spacing: { before: 100, after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: item.requirements,
                    size: 22,
                  }),
                ],
                indent: { left: 800 },
                spacing: { after: 300 },
              }),
  
              // Status indicator
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Status: ",
                    bold: true,
                    size: 22,
                  }),
                  new TextRun({
                    text: item.completed ? "✓ Verified" : "✗ Not Completed",
                    bold: true,
                    color: item.completed ? "00AA00" : "FF0000",
                    size: 22,
                  }),
                ],
                indent: { left: 400 },
                spacing: { after: 400 },
              }),
  
              // Divider
              new Paragraph({
                border: {
                  bottom: {
                    color: "DDDDDD",
                    space: 10,
                    value: "single",
                    size: 2,
                  },
                },
                spacing: { after: 400 },
              }),
            ]).flat(),
  
            // Summary section
            new Paragraph({
              children: [
                new TextRun({
                  text: "Submission Summary",
                  bold: true,
                  size: 28,
                  color: "2E5984",
                  font: "Calibri",
                }),
              ],
              spacing: { before: 800, after: 400 },
              border: {
                bottom: {
                  color: "2E5984",
                  space: 10,
                  value: "single",
                  size: 6,
                },
              },
            }),
  
            // Summary statistics
            new Paragraph({
              children: [
                new TextRun({
                  text: `Total Requirements: ${analysisData.submission.items.length}`,
                  size: 22,
                }),
              ],
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Completed: ${analysisData.submission.items.filter(i => i.completed).length}`,
                  size: 22,
                  color: "00AA00",
                }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Missing: ${analysisData.submission.items.filter(i => !i.completed).length}`,
                  size: 22,
                  color: "FF0000",
                }),
              ],
              spacing: { after: 400 },
            }),
  
            // Footer
            new Paragraph({
              children: [
                new TextRun({
                  text: "Generated by RFP Analysis Tool",
                  size: 18,
                  color: "777777",
                  italics: true,
                }),
              ],
              alignment: "center",
              spacing: { before: 800 },
            }),
          ],
        },
      ],
    });
  
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `RFP_Checklist_${companyId}_${new Date().toISOString().slice(0,10)}.docx`);
    });
  };

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
          compliance: response.data.compliance?.compliance || { 
            eligibility: 'not eligible',
            results: [] 
          },
          eligibility: response.data.eligibility?.eligibility || { 
            status: 'not eligible',
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
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h3 className="text-2xl font-bold text-secondary">Compliance Check Results</h3>
        
              <div
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
                  analysisData.compliance.eligibility === 'eligible'
                    ? 'bg-green-100 text-green-700'
                    : analysisData.compliance.eligibility === 'partial'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {analysisData.compliance.eligibility === 'eligible' ? (
                  <>
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Eligible
                  </>
                ) : analysisData.compliance.eligibility === 'partial' ? (
                  <>
                    <div className="h-5 w-5 mr-2 rounded-full bg-yellow-400 animate-pulse"></div>
                    Partially Eligible
                  </>
                ) : (
                  <>
                    <XCircleIcon className="h-5 w-5 mr-2" />
                    Not Eligible
                  </>
                )}
              </div>
            </div>
        
            <div className="space-y-6">
              {analysisData.compliance.results
                ?.filter((result) => result.status !== 'pending')
                .map((result, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                      {result.status === 'pass' ? (
                        <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
                      ) : (
                        <XCircleIcon className="h-8 w-8 text-red-500 mr-3" />
                      )}
                      <div>
                        <h4
                          className={`text-lg font-medium ${
                            result.status === 'fail' ? 'text-red-500' : 'text-green-600'
                          }`}
                        >
                          {result.title}
                        </h4>
                        <p className="text-gray-600 mt-1">{result.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
        
            {analysisData.compliance.results?.some((r) => r.status === 'pending') && (
              <div className="space-y-4 mt-10">
                <h4 className="text-xl font-semibold text-yellow-700 flex items-center">
                  <span className="mr-2">💡</span> Suggestions for Better Compliance
                </h4>
        
                {analysisData.compliance.results
                  .filter((result) => result.status === 'pending')
                  .map((result, index) => (
                    <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg shadow-sm">
                      <div className="flex items-start">
                        <div className="h-8 w-8 mr-3">
                          <div className="animate-pulse h-full w-full rounded-full bg-yellow-300"></div>
                        </div>
                        <div>
                          <h4 className="text-md font-medium text-yellow-800">{result.title}</h4>
                          <p className="text-yellow-700 mt-1">{result.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h3 className="text-2xl font-bold text-secondary">
                Mandatory Eligibility Requirements
              </h3>
        
              <div
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
                  analysisData.eligibility.status === 'eligible'
                    ? 'bg-green-100 text-green-700'
                    : analysisData.eligibility.status === 'partial'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {analysisData.eligibility.status === 'eligible' ? (
                  <>
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Eligible
                  </>
                ) : analysisData.eligibility.status === 'partial' ? (
                  <>
                    <div className="h-5 w-5 mr-2 rounded-full bg-yellow-400 animate-pulse" />
                    Partially Eligible
                  </>
                ) : (
                  <>
                    <XCircleIcon className="h-5 w-5 mr-2" />
                    Not Eligible
                  </>
                )}
              </div>
            </div>
        
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
                onClick={handleDownloadChecklist}
                className="mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                Download Submission Checklist
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