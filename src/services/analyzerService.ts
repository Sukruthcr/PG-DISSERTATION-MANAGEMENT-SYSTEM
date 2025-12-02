/**
 * Service for integrating with PG Dissertation Research Paper Analyzer
 * API Endpoint: https://pg-dissertation-research-paper-analyzer.onrender.com
 */

export interface AnalyzerResult {
  fileName: string;
  format: string;
  confidenceScore: number;
  similarityScore?: number;
  feedback?: string;
  details?: any;
}

const ANALYZER_API_URL = 'https://pg-dissertation-research-paper-analyzer.onrender.com';
const MINIMUM_CONFIDENCE_SCORE = 90; // Must be >= 90% to qualify

/**
 * Analyzes a dissertation file and returns format detection and confidence score
 * @param file - The file to analyze
 * @returns Promise with the analysis result
 */
export async function analyzeDissertation(file: File): Promise<AnalyzerResult> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${ANALYZER_API_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Analyzer API returned status ${response.status}`);
    }

    const data = await response.json();
    
    return {
      fileName: file.name,
      format: data.format || 'Unknown',
      confidenceScore: data.confidence_score || data.confidence || 0,
      similarityScore: data.similarity_score || data.similarity,
      feedback: data.feedback,
      details: data.details,
    };
  } catch (error) {
    console.error('Error analyzing dissertation:', error);
    throw new Error('Failed to analyze dissertation. Please try again.');
  }
}

/**
 * Analyzes multiple dissertation files
 * @param files - Array of files to analyze
 * @returns Promise with array of analysis results
 */
export async function analyzeMultipleDissertations(files: File[]): Promise<AnalyzerResult[]> {
  const results: AnalyzerResult[] = [];
  
  for (const file of files) {
    try {
      const result = await analyzeDissertation(file);
      results.push(result);
    } catch (error) {
      console.error(`Error analyzing ${file.name}:`, error);
      results.push({
        fileName: file.name,
        format: 'Unknown',
        confidenceScore: 0,
        feedback: 'Analysis failed',
      });
    }
  }
  
  return results;
}

/**
 * Determines submission outcome based on analyzer results
 * @param results - Array of analyzer results
 * @returns Submission decision and message
 */
export function determineSubmissionOutcome(results: AnalyzerResult[]): {
  status: 'accepted' | 'rejected' | 'choose' | 'need_similarity';
  message: string;
  acceptedFiles?: AnalyzerResult[];
  reason?: string;
} {
  if (results.length === 0) {
    return {
      status: 'rejected',
      message: 'No files were analyzed.',
      reason: 'no_files',
    };
  }
  
  // Check if we need similarity check (requires 2 files)
  if (results.length === 1 && results[0].confidenceScore >= MINIMUM_CONFIDENCE_SCORE && !results[0].similarityScore) {
    return {
      status: 'need_similarity',
      message: 'Upload a second paper to enable similarity comparison. At least two papers are required for similarity check.',
      reason: 'need_second_file',
    };
  }
  
  // Filter files that meet confidence score requirement
  const passingFiles = results.filter(r => r.confidenceScore >= MINIMUM_CONFIDENCE_SCORE);
  
  if (passingFiles.length === 0) {
    // All files failed confidence check
    if (results.length === 1) {
      return {
        status: 'rejected',
        message: `Format: ${results[0].format} | Confidence: ${results[0].confidenceScore}% ❌\n\nYour file's confidence score is below 90%. Please revise the formatting and re-upload.`,
        reason: 'low_confidence',
      };
    } else {
      return {
        status: 'rejected',
        message: 'Both files have confidence scores below 90%. Please revise the formatting and re-upload.',
        reason: 'low_confidence',
      };
    }
  } else if (passingFiles.length === 1 && results.length === 1) {
    // Single file passed but needs similarity check
    return {
      status: 'need_similarity',
      message: `Format: ${passingFiles[0].format} | Confidence: ${passingFiles[0].confidenceScore}% ✅\n\nUpload a second paper to enable similarity comparison.`,
      acceptedFiles: passingFiles,
      reason: 'need_second_file',
    };
  } else if (passingFiles.length === 1 && results.length === 2) {
    // One of two files passed
    const passedFile = passingFiles[0];
    return {
      status: 'accepted',
      message: `Format: ${passedFile.format} | Confidence: ${passedFile.confidenceScore}% ✅\n\nYour file has been accepted and is ready for review.`,
      acceptedFiles: passingFiles,
      reason: 'single_pass',
    };
  } else if (passingFiles.length === 2) {
    // Both files passed - let student choose
    return {
      status: 'choose',
      message: 'Both files have confidence scores ≥90%. Please select which file you would like to submit officially.',
      acceptedFiles: passingFiles,
      reason: 'both_pass',
    };
  } else {
    // Default case
    return {
      status: 'accepted',
      message: 'File analysis complete. Ready for submission.',
      acceptedFiles: passingFiles,
      reason: 'default',
    };
  }
}

/**
 * Gets the minimum confidence score required
 */
export function getMinimumConfidenceScore(): number {
  return MINIMUM_CONFIDENCE_SCORE;
}
