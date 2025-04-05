import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface StepProps {
  title: string;
  isActive: boolean;
  isCompleted: boolean;
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
  const [activeStep, setActiveStep] = useState(1);
  const [showSummary, setShowSummary] = useState(false);

  const steps = [
    { id: 1, title: 'Compliance Check' },
    { id: 2, title: 'Mandatory Eligibility' },
    { id: 3, title: 'Risk Analysis' },
    { id: 4, title: 'Submission Checklist' },
  ];

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-secondary mb-8">Compliance Check Results</h3>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <h4 className="text-lg font-medium">State Registration</h4>
                    <p className="text-gray-600 mt-1">Complete and valid registration found</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <XCircleIcon className="h-8 w-8 text-red-500 mr-3" />
                  <div>
                    <h4 className="text-lg font-medium text-red-500">Certification Match</h4>
                    <p className="text-gray-600 mt-1">Missing required ISO 27001 certification</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <h4 className="text-lg font-medium">Past Performance</h4>
                    <p className="text-gray-600 mt-1">Meets minimum requirements with 5+ years experience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-secondary mb-8">Mandatory Eligibility Requirements</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-medium text-yellow-800">Missing Requirements</h4>
                  <p className="text-yellow-700 mt-1">
                    ISO 27001 Certification is required for this RFP
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <ul className="space-y-4">
                <li className="flex items-center text-green-600">
                  <CheckCircleIcon className="h-6 w-6 mr-2" />
                  <span>Minimum 5 years of federal contracting experience</span>
                </li>
                <li className="flex items-center text-green-600">
                  <CheckCircleIcon className="h-6 w-6 mr-2" />
                  <span>Active SAM.gov registration</span>
                </li>
                <li className="flex items-center text-green-600">
                  <CheckCircleIcon className="h-6 w-6 mr-2" />
                  <span>Secret Facility Clearance</span>
                </li>
                <li className="flex items-center text-red-500">
                  <XCircleIcon className="h-6 w-6 mr-2" />
                  <span>ISO 27001 Certification (Not Found)</span>
                </li>
              </ul>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-secondary mb-8">Risk Analysis</h3>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                <h4 className="text-lg font-medium text-red-500 mb-2">High Risk: Unilateral Termination Clause</h4>
                <p className="text-gray-600">
                  The contract can be terminated with 30 days notice without cause.
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium text-gray-700">Suggestion:</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Request modification to include mutual termination rights and extend notice period to 60 days.
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                <h4 className="text-lg font-medium text-yellow-500 mb-2">Medium Risk: Payment Terms</h4>
                <p className="text-gray-600">
                  Net-60 payment terms identified.
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium text-gray-700">Suggestion:</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Negotiate for Net-30 payment terms in the proposal response. Include past performance examples of timely payments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-secondary mb-8">Submission Checklist</h3>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <ul className="space-y-4">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                  <div>
                    <h4 className="font-medium">Technical Proposal</h4>
                    <p className="text-sm text-gray-600">50 pages max, 12pt Times New Roman</p>
                  </div>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                  <div>
                    <h4 className="font-medium">Past Performance References</h4>
                    <p className="text-sm text-gray-600">3 references required</p>
                  </div>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                  <div>
                    <h4 className="font-medium">Pricing Schedule</h4>
                    <p className="text-sm text-gray-600">Excel format required</p>
                  </div>
                </li>
                <li className="flex items-center">
                  <XCircleIcon className="h-6 w-6 text-red-500 mr-3" />
                  <div>
                    <h4 className="font-medium text-red-500">ISO 27001 Certificate</h4>
                    <p className="text-sm text-red-500">Required - Not Available</p>
                  </div>
                </li>
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

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Steps Navigation */}
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

            {/* Step Content */}
            <div className="md:col-span-3">
              {renderStepContent()}

              {/* Navigation Buttons */}
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
            </div>
          </div>
        </div>
      </div>

      {/* Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="text-center">
              <XCircleIcon className="mx-auto h-16 w-16 text-red-500" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Not Eligible</h3>
              <p className="mt-4 text-gray-600">
                Missing compliance requirements: ISO 27001 Certification is required for this RFP.
                Please obtain the certification before proceeding with the submission.
              </p>
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