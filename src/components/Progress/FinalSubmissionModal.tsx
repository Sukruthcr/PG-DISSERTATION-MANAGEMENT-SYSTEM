import React, { useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader, ExternalLink } from 'lucide-react';

interface FinalSubmissionModalProps {
  onClose: () => void;
  onSubmit: (fileName: string, confidenceScore: number) => Promise<void>;
}

export const FinalSubmissionModal: React.FC<FinalSubmissionModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [confidenceScore, setConfidenceScore] = useState<string>('');
  const [hasVerified, setHasVerified] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setErrorMessage('');
    }
  };

  const handleSubmitFinal = async () => {
    // Validation
    if (!selectedFile) {
      setErrorMessage('Please select a file to upload.');
      return;
    }

    if (!hasVerified) {
      setErrorMessage('Please verify your file using the analyzer tool first and check the verification box.');
      return;
    }

    const score = parseFloat(confidenceScore);
    if (isNaN(score) || score < 0 || score > 100) {
      setErrorMessage('Please enter a valid confidence score between 0 and 100.');
      return;
    }

    if (score < 80) {
      setErrorMessage('Confidence score must be at least 80% to submit. Please revise your dissertation formatting.');
      return;
    }

    setSubmissionStatus('submitting');
    setErrorMessage('');

    try {
      await onSubmit(selectedFile.name, score);
      // Modal will be closed by parent component
    } catch (error) {
      console.error('Error submitting:', error);
      setErrorMessage('Failed to submit. Please try again.');
      setSubmissionStatus('idle');
    }
  };

  const scoreNum = parseFloat(confidenceScore);
  const isScoreValid = !isNaN(scoreNum) && scoreNum >= 0 && scoreNum <= 100;
  const canSubmit = selectedFile && hasVerified && isScoreValid && scoreNum >= 80;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">📄 Final Dissertation Submission</h3>
            <p className="text-sm text-gray-600 mt-1">Verify and submit your final dissertation</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            disabled={submissionStatus === 'submitting'}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Step 1: Analyzer Verification */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-5">
            <div className="space-y-3">
              <div className="flex items-start">
                <AlertCircle className="h-6 w-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-blue-900 text-base mb-2">📄 Step 1: Verify Your Dissertation</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    Before submitting, you must verify your dissertation format and similarity using the official analyzer tool.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <p className="text-xs font-semibold text-blue-900 mb-2">🔗 Official Analyzer Tool:</p>
                <a 
                  href="https://pg-dissertation-research-paper-analyzer.onrender.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium group"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  <span className="underline">pg-dissertation-research-paper-analyzer.onrender.com</span>
                </a>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-blue-900">✅ Instructions:</p>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-blue-800 ml-2">
                  <li>Click the link above to open the analyzer tool in a new tab</li>
                  <li>Upload your final PDF document to the analyzer</li>
                  <li>Wait for the tool to process and return the <strong>confidence percentage</strong></li>
                  <li>Note down the confidence score (must be <strong>≥80%</strong> to proceed)</li>
                  <li>Return here and enter the score below</li>
                </ol>
              </div>

              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
                <p className="text-xs font-semibold text-yellow-900 mb-1.5">📌 Important:</p>
                <ul className="space-y-1 text-xs text-yellow-800">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Only the percentage shown by the analyzer will be considered valid</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Screenshots or manual calculations will not be accepted</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Minimum confidence score of <strong>80%</strong> required for submission</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 2: File Upload */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">📤 Step 2: Upload Your Dissertation</h4>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                disabled={submissionStatus === 'submitting'}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600">
                  Click to upload your final dissertation
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOC, or DOCX
                </p>
              </label>
            </div>

            {selectedFile && (
              <div className="mt-3 flex items-center bg-green-50 border border-green-200 rounded-lg p-3">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-xs text-gray-600">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Enter Confidence Score */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">📊 Step 3: Enter Analyzer Confidence Score</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confidence Score from Analyzer (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={confidenceScore}
                  onChange={(e) => setConfidenceScore(e.target.value)}
                  placeholder="Enter score (e.g., 85.5)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={submissionStatus === 'submitting'}
                />
                {isScoreValid && (
                  <p className={`text-sm mt-1 font-medium ${
                    scoreNum >= 80 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {scoreNum >= 80 ? '✅ Score meets minimum requirement' : '❌ Score below 80% - revision required'}
                  </p>
                )}
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="verify-checkbox"
                  checked={hasVerified}
                  onChange={(e) => setHasVerified(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={submissionStatus === 'submitting'}
                />
                <label htmlFor="verify-checkbox" className="ml-2 text-sm text-gray-700">
                  I confirm that I have verified my dissertation using the official analyzer tool and the confidence score entered above is accurate.
                </label>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmitFinal}
            disabled={!canSubmit || submissionStatus === 'submitting'}
            className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {submissionStatus === 'submitting' ? (
              <>
                <Loader className="h-5 w-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Submit Final Dissertation
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            By submitting, you confirm that the information provided is accurate and your dissertation meets the required standards.
          </p>
        </div>
      </div>
    </div>
  );
};
