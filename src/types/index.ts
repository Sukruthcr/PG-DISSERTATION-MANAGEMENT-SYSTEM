export type UserRole = 'student' | 'guide' | 'coordinator' | 'ethics_committee' | 'admin';

export type TopicStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'in_progress' | 'completed';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'requires_changes';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  department?: string;
  specialization?: string;
  phone?: string;
  employee_id?: string;
  student_id?: string;
  max_students?: number;
  current_students?: number;
  profile_image?: string;
  created_at: string;
  updated_at: string;
  status?: 'Active' | 'Pending' | 'Rejected';
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  domain: string;
  methodology: string;
  objectives: string;
  literature_review?: string;
  expected_outcomes: string;
  student_id: string;
  guide_id?: string;
  co_guide_id?: string;
  status: TopicStatus;
  submitted_at: string;
  approved_at?: string;
  rejected_reason?: string;
  similarity_score?: number;
  ethics_approval_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface GuideAssignment {
  id: string;
  student_id: string;
  guide_id: string;
  co_guide_id?: string;
  status: ApprovalStatus;
  assigned_at: string;
  approved_by?: string;
  notes?: string;
}

export interface ProgressMilestone {
  id: string;
  topic_id: string;
  title: string;
  description: string;
  due_date: string;
  completion_date?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  documents: Document[];
  feedback?: string;
  grade?: number;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploaded_by: string;
  uploaded_at: string;
}

export interface Approval {
  id: string;
  entity_type: 'topic' | 'milestone' | 'assignment' | 'publication';
  entity_id: string;
  approver_id: string;
  status: ApprovalStatus;
  comments?: string;
  approved_at?: string;
  digital_signature?: string;
  created_at: string;
}

export interface Publication {
  id: string;
  topic_id: string;
  title: string;
  authors: string[];
  journal_name?: string;
  conference_name?: string;
  publication_type: 'journal' | 'conference' | 'book_chapter' | 'patent';
  doi?: string;
  url?: string;
  publication_date?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'published';
  impact_factor?: number;
  citation_count?: number;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  action_url?: string;
  created_at: string;
}

export interface DashboardStats {
  total_topics: number;
  active_topics: number;
  completed_topics: number;
  pending_approvals: number;
  overdue_milestones: number;
  publications: number;
}
