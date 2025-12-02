import { Topic, User, Publication, ProgressMilestone } from '../types';

export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (Array.isArray(value)) {
          return `"${value.join('; ')}"`;
        }
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value || '';
      }).join(',')
    )
  ].join('\n');

  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
};

export const exportTopicsToCSV = (topics: Topic[]) => {
  const exportData = topics.map(topic => ({
    ID: topic.id,
    Title: topic.title,
    Domain: topic.domain,
    Status: topic.status,
    'Student ID': topic.student_id,
    'Guide ID': topic.guide_id || 'Not Assigned',
    'Submitted Date': new Date(topic.submitted_at).toLocaleDateString(),
    'Similarity Score': topic.similarity_score || 'N/A',
    'Ethics Required': topic.ethics_approval_required ? 'Yes' : 'No',
    Keywords: topic.keywords.join('; '),
    Methodology: topic.methodology,
  }));

  exportToCSV(exportData, 'topics_export');
};

export const exportPublicationsToCSV = (publications: Publication[]) => {
  const exportData = publications.map(pub => ({
    ID: pub.id,
    Title: pub.title,
    Authors: pub.authors.join('; '),
    Type: pub.publication_type,
    Venue: pub.journal_name || pub.conference_name || 'N/A',
    Status: pub.status,
    DOI: pub.doi || 'N/A',
    'Publication Date': pub.publication_date ? new Date(pub.publication_date).toLocaleDateString() : 'N/A',
    'Impact Factor': pub.impact_factor || 'N/A',
    Citations: pub.citation_count || 0,
  }));

  exportToCSV(exportData, 'publications_export');
};

export const exportProgressToCSV = (milestones: ProgressMilestone[]) => {
  const exportData = milestones.map(milestone => ({
    ID: milestone.id,
    Title: milestone.title,
    Status: milestone.status,
    'Due Date': new Date(milestone.due_date).toLocaleDateString(),
    'Completion Date': milestone.completion_date ? new Date(milestone.completion_date).toLocaleDateString() : 'N/A',
    Grade: milestone.grade || 'N/A',
    'Documents Count': milestone.documents.length,
    'Has Feedback': milestone.feedback ? 'Yes' : 'No',
  }));

  exportToCSV(exportData, 'progress_export');
};

export const generateTopicReport = (topic: Topic) => {
  const reportContent = `
DISSERTATION TOPIC REPORT
========================

Topic ID: ${topic.id}
Title: ${topic.title}
Student ID: ${topic.student_id}
Domain: ${topic.domain}
Status: ${topic.status.toUpperCase()}

DESCRIPTION
-----------
${topic.description}

RESEARCH OBJECTIVES
------------------
${topic.objectives}

EXPECTED OUTCOMES
----------------
${topic.expected_outcomes}

METHODOLOGY
-----------
${topic.methodology}

KEYWORDS
--------
${topic.keywords.join(', ')}

SUBMISSION DETAILS
-----------------
Submitted: ${new Date(topic.submitted_at).toLocaleString()}
${topic.approved_at ? `Approved: ${new Date(topic.approved_at).toLocaleString()}` : ''}
Last Updated: ${new Date(topic.updated_at).toLocaleString()}

SIMILARITY ANALYSIS
------------------
Similarity Score: ${topic.similarity_score || 'N/A'}%
Ethics Approval Required: ${topic.ethics_approval_required ? 'Yes' : 'No'}

${topic.guide_id ? `GUIDE ASSIGNMENT\n---------------\nGuide ID: ${topic.guide_id}${topic.co_guide_id ? `\nCo-Guide ID: ${topic.co_guide_id}` : ''}` : ''}

${topic.rejected_reason ? `REJECTION REASON\n---------------\n${topic.rejected_reason}` : ''}

Generated on: ${new Date().toLocaleString()}
  `.trim();

  downloadFile(reportContent, `topic_report_${topic.id}.txt`, 'text/plain');
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};