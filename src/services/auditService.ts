import { db } from '../backend/db';
import type { AuditLogRecord, UserContext } from '../backend/types';

export class AuditService {
  /**
   * Get audit logs (Admin only)
   */
  public static getLogs(userContext: UserContext, limit = 100): AuditLogRecord[] {
    if (userContext.role !== 'admin') {
      throw new Error('Unauthorized: Only administrators can view audit logs.');
    }
    return db.getAuditLogs(limit);
  }
}
