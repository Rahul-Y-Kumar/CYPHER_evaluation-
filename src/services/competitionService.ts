import { db } from '../backend/db';
import type { CompetitionTypeRecord, UserContext } from '../backend/types';

export class CompetitionService {
  /**
   * Get active competition types (for participants / public)
   */
  public static getActiveCompetitions(): CompetitionTypeRecord[] {
    return db.getCompetitions({ role: 'participant', userId: 'public', email: 'public@cypher.org' });
  }

  /**
   * Get all competition types (for admin)
   */
  public static getAllCompetitions(userContext?: UserContext | null): CompetitionTypeRecord[] {
    if (userContext && userContext.role !== 'admin') {
      throw new Error('Unauthorized: Only administrators can view all competition types including inactive ones.');
    }
    return db.getCompetitions(userContext);
  }

  /**
   * Get competition type by code (e.g. 'HACKATHON', 'IDEATHON')
   */
  public static getByCode(code: string): CompetitionTypeRecord | undefined {
    return db.getCompetitionByCode(code);
  }

  /**
   * Get competition type by ID
   */
  public static getById(id: string): CompetitionTypeRecord | undefined {
    return db.getCompetitionById(id);
  }

  /**
   * Create competition type (Admin only)
   */
  public static createCompetition(
    userContext: UserContext,
    data: {
      code: string;
      name: string;
      description?: string;
      display_order?: number;
      is_active?: boolean;
    }
  ): CompetitionTypeRecord {
    if (userContext.role !== 'admin') {
      throw new Error('Unauthorized: Only administrators can create competition types.');
    }

    const created = db.insertCompetition({
      code: data.code,
      name: data.name,
      description: data.description || null,
      display_order: data.display_order || 1,
      is_active: data.is_active !== undefined ? data.is_active : true,
    });

    db.insertAuditLog({
      user_id: userContext.userId,
      action: 'COMPETITION_CREATED',
      entity_type: 'competition_type',
      entity_id: created.id,
      metadata: { code: created.code, name: created.name },
    });

    return created;
  }

  /**
   * Update competition type (Admin only)
   */
  public static updateCompetition(
    userContext: UserContext,
    id: string,
    updates: Partial<CompetitionTypeRecord>
  ): CompetitionTypeRecord {
    if (userContext.role !== 'admin') {
      throw new Error('Unauthorized: Only administrators can modify competition types.');
    }

    const updated = db.updateCompetition(id, updates);

    let action: any = 'COMPETITION_UPDATED';
    if (updates.is_active === true) action = 'COMPETITION_ACTIVATED';
    if (updates.is_active === false) action = 'COMPETITION_DEACTIVATED';

    db.insertAuditLog({
      user_id: userContext.userId,
      action,
      entity_type: 'competition_type',
      entity_id: updated.id,
      metadata: { updates },
    });

    return updated;
  }

  /**
   * Deactivate competition type (Admin only)
   */
  public static deactivateCompetition(userContext: UserContext, id: string): CompetitionTypeRecord {
    return this.updateCompetition(userContext, id, { is_active: false });
  }

  /**
   * Reactivate competition type (Admin only)
   */
  public static reactivateCompetition(userContext: UserContext, id: string): CompetitionTypeRecord {
    return this.updateCompetition(userContext, id, { is_active: true });
  }
}
