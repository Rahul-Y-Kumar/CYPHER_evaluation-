export type NavigationTab = 
  | 'home' 
  | 'problems' 
  | 'resources' 
  | 'results' 
  | 'how-it-works' 
  | 'submit' 
  | 'judge-login' 
  | 'judge-dashboard' 
  | 'admin';

export interface ProblemStatement {
  id: string;
  code: string; // e.g. 'PS-01'
  title: string;
  track: string;
  bounty?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Hardcore';
  sponsor: string;
  sponsorBadge?: string;
  shortDesc: string;
  description: string;
  deliverables: string[];
  evaluationCriteria: {
    criterion: string;
    weight: number;
  }[];
  constraints: string[];
  tags: string[];
}

export interface SubmissionPayload {
  submissionId: string; // e.g. 'CYP-1047'
  teamName: string;
  teamLead: string;
  email: string;
  membersCount: number;
  problemStatementCode: string;
  projectTitle: string;
  tagline: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  deployUrl: string;
  demoVideoUrl?: string;
  fileName?: string;
  fileSize?: string;
  submittedAt: string;
  status: 'SUBMITTED' | 'IN_REVIEW' | 'EVALUATED' | 'SELECTED' | 'ELIMINATED' | 'PENDING';
  aiSummary?: {
    summary: string;
    technicalComplexityScore: number;
    keyHighlights: string[];
    riskAnalysis: string;
  };
}

export interface LeaderboardEntry {
  rank: number;
  submissionId: string;
  blindAlias: string;
  projectTitle: string;
  track: string;
  problemCode: string;
  round: 'Round 1 (Blind)' | 'Round 2 (AI + Panel)' | 'Final Round';
  score: number;
  breakdown: {
    technical: number; // out of 30
    innovation: number; // out of 25
    execution: number; // out of 25
    designDoc: number; // out of 20
  };
  status: 'QUALIFIED' | 'TOP_3' | 'RUNNER_UP' | 'SPECIAL_MENTION' | 'FINALIST' | 'RESULTS PENDING';
  feedbackSummary: string;
}

export interface RoundInfo {
  number: string;
  title: string;
  timeline: string;
  status: 'COMPLETED' | 'LIVE NOW' | 'UPCOMING' | 'RESULTS PENDING';
  description: string;
  criteria: string[];
  eliminationRate: string;
}

export interface JudgeAssignedProject {
  submissionId: string;
  projectName: string;
  blindAlias: string;
  psCode: string;
  track: string;
  status: 'PENDING' | 'EVALUATED' | 'UNDER REVIEW';
  score?: number;
  repoUrl: string;
  demoUrl: string;
}
