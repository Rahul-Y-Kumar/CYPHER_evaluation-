export type UserRole = 'admin' | 'judge' | 'participant';

export interface UserContext {
  userId: string;
  email: string;
  role: UserRole;
  fullName?: string;
}

export interface CompetitionTypeRecord {
  id: string;
  code: string; // e.g. 'HACKATHON', 'IDEATHON'
  name: string;
  description: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProblemStatementRecord {
  id: string;
  competition_type_id: string;
  code: string; // e.g. 'HACK-01', 'IDEA-01'
  title: string;
  short_description: string | null;
  description: string;
  organization: string | null;
  category: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface SubmissionRecord {
  id: string;
  submission_code: string; // e.g. 'CYP-1047'
  competition_type_id: string;
  problem_statement_id: string;
  team_name: string;
  team_lead_name: string;
  team_lead_email: string;
  members_count: number;
  project_title: string;
  tagline: string | null;
  description: string;
  tech_stack: string[];
  github_url: string;
  deploy_url: string;
  demo_video_url: string | null;
  file_name: string | null;
  file_size: string | null;
  score: number | null;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'EVALUATED' | 'SELECTED' | 'ELIMINATED' | 'PENDING';
  ai_summary: Record<string, any> | null;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export type AuditAction = 
  | 'COMPETITION_CREATED'
  | 'COMPETITION_UPDATED'
  | 'COMPETITION_ACTIVATED'
  | 'COMPETITION_DEACTIVATED'
  | 'PROBLEM_STATEMENT_CREATED'
  | 'PROBLEM_STATEMENT_UPDATED'
  | 'PROBLEM_STATEMENT_ACTIVATED'
  | 'PROBLEM_STATEMENT_DEACTIVATED'
  | 'PROBLEM_STATEMENT_REORDERED'
  | 'SUBMISSION_CREATED'
  | 'SUBMISSION_UPDATED'
  | 'SUBMISSION_ADMIN_REASSIGNED';

export interface AuditLogRecord {
  id: string;
  user_id: string | null;
  action: AuditAction;
  entity_type: 'competition_type' | 'problem_statement' | 'submission';
  entity_id: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface LeaderboardItem {
  rank: number;
  submissionId: string;
  submissionCode: string;
  projectTitle: string;
  teamName: string;
  competitionTypeCode: string;
  problemStatementCode: string;
  score: number;
  status: string;
  submittedAt: string;
}
