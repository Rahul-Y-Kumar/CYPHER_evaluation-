import { db } from '../backend/db';
import type { ProblemStatementRecord, UserContext } from '../backend/types';

export class ProblemStatementService {
  /**
   * Get active problem statements for a specific competition type (for participants / public)
   */
  public static getByCompetition(
    competitionCodeOrId: string,
    activeOnly = true
  ): ProblemStatementRecord[] {
    // Resolve competition type ID if code was passed
    let compId = competitionCodeOrId;
    const comp = db.getCompetitionByCode(competitionCodeOrId) || db.getCompetitionById(competitionCodeOrId);
    if (comp) {
      compId = comp.id;
    }

    return db.getProblemStatements({
      competitionTypeId: compId,
      activeOnly,
    });
  }

  /**
   * Get all problem statements (Admin view)
   */
  public static getAll(userContext?: UserContext | null): ProblemStatementRecord[] {
    if (userContext && userContext.role !== 'admin') {
      throw new Error('Unauthorized: Only administrators can view all problem statements.');
    }
    return db.getProblemStatements({ user: userContext, activeOnly: false });
  }

  /**
   * Get problem statement by ID
   */
  public static getById(id: string): ProblemStatementRecord | undefined {
    return db.getProblemStatementById(id);
  }

  /**
   * Create Problem Statement (Admin only)
   */
  public static create(
    userContext: UserContext,
    data: {
      competition_type_id: string;
      code: string;
      title: string;
      short_description?: string;
      description: string;
      organization?: string;
      category?: string;
      display_order?: number;
      is_active?: boolean;
    }
  ): ProblemStatementRecord {
    if (userContext.role !== 'admin') {
      throw new Error('Unauthorized: Only administrators can create problem statements.');
    }

    const created = db.insertProblemStatement({
      competition_type_id: data.competition_type_id,
      code: data.code,
      title: data.title,
      short_description: data.short_description || null,
      description: data.description,
      organization: data.organization || null,
      category: data.category || null,
      display_order: data.display_order || 1,
      is_active: data.is_active !== undefined ? data.is_active : true,
    });

    db.insertAuditLog({
      user_id: userContext.userId,
      action: 'PROBLEM_STATEMENT_CREATED',
      entity_type: 'problem_statement',
      entity_id: created.id,
      metadata: { code: created.code, title: created.title, competition_type_id: created.competition_type_id },
    });

    return created;
  }

  /**
   * Update Problem Statement (Admin only)
   */
  public static update(
    userContext: UserContext,
    id: string,
    updates: Partial<ProblemStatementRecord>
  ): ProblemStatementRecord {
    if (userContext.role !== 'admin') {
      throw new Error('Unauthorized: Only administrators can edit problem statements.');
    }

    const updated = db.updateProblemStatement(id, updates);

    let action: any = 'PROBLEM_STATEMENT_UPDATED';
    if (updates.is_active === true) action = 'PROBLEM_STATEMENT_ACTIVATED';
    if (updates.is_active === false) action = 'PROBLEM_STATEMENT_DEACTIVATED';

    db.insertAuditLog({
      user_id: userContext.userId,
      action,
      entity_type: 'problem_statement',
      entity_id: updated.id,
      metadata: { updates },
    });

    return updated;
  }

  /**
   * Deactivate Problem Statement (Soft Delete / Archive)
   */
  public static deactivate(userContext: UserContext, id: string): ProblemStatementRecord {
    return this.update(userContext, id, { is_active: false });
  }

  /**
   * Reactivate Problem Statement
   */
  public static reactivate(userContext: UserContext, id: string): ProblemStatementRecord {
    return this.update(userContext, id, { is_active: true });
  }

  /**
   * Reorder Problem Statements (Admin only)
   */
  public static reorder(userContext: UserContext, orderedIds: string[]): ProblemStatementRecord[] {
    if (userContext.role !== 'admin') {
      throw new Error('Unauthorized: Only administrators can reorder problem statements.');
    }

    const updatedList: ProblemStatementRecord[] = [];
    orderedIds.forEach((id, index) => {
      const updated = db.updateProblemStatement(id, { display_order: index + 1 });
      updatedList.push(updated);
    });

    db.insertAuditLog({
      user_id: userContext.userId,
      action: 'PROBLEM_STATEMENT_REORDERED',
      entity_type: 'problem_statement',
      entity_id: orderedIds[0] || 'reorder-batch',
      metadata: { orderedIds },
    });

    return updatedList;
  }

  /**
   * Delete Problem Statement (Permanently delete if no submissions exist, otherwise error)
   */
  public static delete(userContext: UserContext, id: string) {
    if (userContext.role !== 'admin') {
      throw new Error('Unauthorized: Only administrators can delete problem statements.');
    }

    return db.deleteProblemStatement(id);
  }
}
