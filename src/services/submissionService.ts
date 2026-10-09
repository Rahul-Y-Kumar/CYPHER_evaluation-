import { db } from '../backend/db';
import type { SubmissionRecord, UserContext } from '../backend/types';

export class SubmissionService {
  // Configurable submission deadline (default: 30 days in future)
  private static submissionDeadline: Date | null = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  /**
   * Set submission deadline (for admin or testing deadline expiration)
   */
  public static setDeadline(deadline: Date | null) {
    this.submissionDeadline = deadline;
  }

  public static getDeadline(): Date | null {
    return this.submissionDeadline;
  }

  public static isDeadlinePassed(): boolean {
    if (!this.submissionDeadline) return false;
    return Date.now() > this.submissionDeadline.getTime();
  }

  /**
   * Server-side submission validation
   */
  public static validateSubmission(data: {
    competition_type_id: string;
    problem_statement_id: string;
    team_name?: string;
    team_lead_name?: string;
    team_lead_email?: string;
    project_title?: string;
    description?: string;
    github_url?: string;
    userContext?: UserContext | null;
  }) {
    // 1. Check Submission Deadline
    if (this.isDeadlinePassed()) {
      throw new Error('Submission deadline has passed. Submissions are closed.');
    }

    // 2. Validate Competition Type
    if (!data.competition_type_id) {
      throw new Error('Competition type is required.');
    }
    const comp = db.getCompetitionById(data.competition_type_id);
    if (!comp) {
      throw new Error(`Competition type with ID '${data.competition_type_id}' does not exist.`);
    }
    if (!comp.is_active) {
      throw new Error(`Competition '${comp.code}' is currently inactive and cannot accept submissions.`);
    }

    // 3. Validate Problem Statement
    if (!data.problem_statement_id) {
      throw new Error('Problem statement is required.');
    }
    const ps = db.getProblemStatementById(data.problem_statement_id);
    if (!ps) {
      throw new Error(`Problem statement with ID '${data.problem_statement_id}' not found.`);
    }
    if (!ps.is_active) {
      throw new Error(`Problem statement '${ps.code}' is inactive and cannot accept submissions.`);
    }

    // 4. Validate Problem Statement belongs to Selected Competition
    if (ps.competition_type_id !== data.competition_type_id) {
      throw new Error(
        `Validation Error: Problem statement '${ps.code}' belongs to competition ID '${ps.competition_type_id}', but submission specified competition ID '${data.competition_type_id}'.`
      );
    }

    // 5. Validate Required Project Fields
    if (!data.team_name || data.team_name.trim() === '') {
      throw new Error('Team name is required.');
    }
    if (!data.team_lead_name || data.team_lead_name.trim() === '') {
      throw new Error('Team lead name is required.');
    }
    if (!data.team_lead_email || data.team_lead_email.trim() === '') {
      throw new Error('Team lead email is required.');
    }
    if (!data.project_title || data.project_title.trim() === '') {
      throw new Error('Project title is required.');
    }
    if (!data.description || data.description.trim() === '') {
      throw new Error('Project description is required.');
    }
    if (!data.github_url || data.github_url.trim() === '') {
      throw new Error('GitHub repository URL is required.');
    }

    return { comp, ps };
  }

  /**
   * Submit Project (Final submission)
   */
  public static createSubmission(data: {
    competition_type_id: string;
    problem_statement_id: string;
    team_name: string;
    team_lead_name: string;
    team_lead_email: string;
    members_count?: number;
    project_title: string;
    tagline?: string;
    description: string;
    tech_stack?: string[];
    github_url: string;
    deploy_url?: string;
    demo_video_url?: string;
    file_name?: string;
    file_size?: string;
    ai_summary?: Record<string, any>;
    userContext?: UserContext | null;
  }): SubmissionRecord {
    // Perform server-side validation
    this.validateSubmission(data);

    // Duplicate check: Check if same team lead already submitted to this competition
    const existing = db.getSubmissions({ competitionTypeId: data.competition_type_id })
      .find(s => s.team_lead_email.toLowerCase() === data.team_lead_email.toLowerCase() && s.status === 'SUBMITTED');
    
    if (existing) {
      throw new Error(`Team lead '${data.team_lead_email}' already has an active submission (${existing.submission_code}) in this competition.`);
    }

    const created = db.insertSubmission({
      competition_type_id: data.competition_type_id,
      problem_statement_id: data.problem_statement_id,
      team_name: data.team_name.trim(),
      team_lead_name: data.team_lead_name.trim(),
      team_lead_email: data.team_lead_email.trim(),
      members_count: data.members_count || 1,
      project_title: data.project_title.trim(),
      tagline: data.tagline ? data.tagline.trim() : null,
      description: data.description.trim(),
      tech_stack: data.tech_stack || [],
      github_url: data.github_url.trim(),
      deploy_url: data.deploy_url ? data.deploy_url.trim() : '',
      demo_video_url: data.demo_video_url ? data.demo_video_url.trim() : null,
      file_name: data.file_name || null,
      file_size: data.file_size || null,
      score: null,
      status: 'SUBMITTED',
      ai_summary: data.ai_summary || null,
    });

    db.insertAuditLog({
      user_id: data.userContext?.userId || null,
      action: 'SUBMISSION_CREATED',
      entity_type: 'submission',
      entity_id: created.id,
      metadata: {
        submission_code: created.submission_code,
        team_name: created.team_name,
        competition_type_id: created.competition_type_id,
        problem_statement_id: created.problem_statement_id,
      },
    });

    return created;
  }

  /**
   * Save Submission as Draft
   */
  public static saveDraft(data: {
    competition_type_id: string;
    problem_statement_id: string;
    team_name?: string;
    team_lead_name?: string;
    team_lead_email?: string;
    project_title?: string;
    description?: string;
    tech_stack?: string[];
    github_url?: string;
    deploy_url?: string;
    userContext?: UserContext | null;
  }): SubmissionRecord {
    if (this.isDeadlinePassed()) {
      throw new Error('Submission deadline has passed.');
    }

    const created = db.insertSubmission({
      competition_type_id: data.competition_type_id,
      problem_statement_id: data.problem_statement_id,
      team_name: data.team_name || 'Draft Team',
      team_lead_name: data.team_lead_name || 'Draft Lead',
      team_lead_email: data.team_lead_email || 'draft@cypher.org',
      members_count: 1,
      project_title: data.project_title || 'Untitled Draft',
      tagline: null,
      description: data.description || 'Draft description',
      tech_stack: data.tech_stack || [],
      github_url: data.github_url || 'https://github.com/draft/repo',
      deploy_url: data.deploy_url || '',
      demo_video_url: null,
      file_name: null,
      file_size: null,
      score: null,
      status: 'DRAFT',
      ai_summary: null,
    });

    return created;
  }

  /**
   * Update an existing submission (Enforces participant immutability vs admin authority)
   */
  public static updateSubmission(
    submissionId: string,
    updates: Partial<SubmissionRecord>,
    userContext?: UserContext | null
  ): SubmissionRecord {
    const existing = db.getSubmissionById(submissionId);
    if (!existing) {
      throw new Error(`Submission '${submissionId}' not found.`);
    }

    // IMMUTABILITY RULE:
    // Once submitted, participant CANNOT change competition_type_id or problem_statement_id.
    const isChangingCompetitionOrPS =
      (updates.competition_type_id && updates.competition_type_id !== existing.competition_type_id) ||
      (updates.problem_statement_id && updates.problem_statement_id !== existing.problem_statement_id);

    if (isChangingCompetitionOrPS) {
      if (!userContext || userContext.role !== 'admin') {
        throw new Error('Unauthorized: Participants cannot change competition type or problem statement after submission. Only an administrator can reassign competition tracks.');
      }

      // If admin is changing, verify the new PS belongs to the new competition
      const targetCompId = updates.competition_type_id || existing.competition_type_id;
      const targetPSId = updates.problem_statement_id || existing.problem_statement_id;
      const targetPS = db.getProblemStatementById(targetPSId);

      if (targetPS && targetPS.competition_type_id !== targetCompId) {
        throw new Error(`Validation Error: Target problem statement '${targetPS.code}' belongs to competition ID '${targetPS.competition_type_id}', not '${targetCompId}'.`);
      }

      // Record in audit log
      db.insertAuditLog({
        user_id: userContext.userId,
        action: 'SUBMISSION_ADMIN_REASSIGNED',
        entity_type: 'submission',
        entity_id: existing.id,
        metadata: {
          submission_code: existing.submission_code,
          old_competition_type_id: existing.competition_type_id,
          new_competition_type_id: targetCompId,
          old_problem_statement_id: existing.problem_statement_id,
          new_problem_statement_id: targetPSId,
          reason: 'Admin Reassignment',
        },
      });
    }

    const updated = db.updateSubmission(submissionId, updates);
    return updated;
  }

  /**
   * Get all submissions (Admin / Judge view)
   */
  public static getAllSubmissions(filter?: {
    competitionTypeId?: string;
    problemStatementId?: string;
    status?: string;
  }): SubmissionRecord[] {
    return db.getSubmissions(filter);
  }

  /**
   * Get submission by ID or Code
   */
  public static getById(id: string): SubmissionRecord | undefined {
    return db.getSubmissionById(id);
  }

  /**
   * Score / Evaluate a submission (Judge / Admin)
   */
  public static scoreSubmission(
    userContext: UserContext,
    submissionId: string,
    score: number,
    status: 'EVALUATED' | 'SELECTED' | 'UNDER_REVIEW' = 'EVALUATED'
  ): SubmissionRecord {
    if (userContext.role !== 'admin' && userContext.role !== 'judge') {
      throw new Error('Unauthorized: Only judges and administrators can evaluate submissions.');
    }

    return db.updateSubmission(submissionId, {
      score,
      status,
    });
  }
}
