import { db } from '../backend/db';
import type { LeaderboardItem } from '../backend/types';

export class LeaderboardService {
  /**
   * Get the unified Round 1 Leaderboard for a specific competition type.
   * All problem statements within the competition compete together on the same leaderboard.
   * 
   * Example:
   * competitionCode = 'HACKATHON' -> Returns one unified leaderboard ranking all HACK-01, HACK-02, HACK-03 submissions together.
   * competitionCode = 'IDEATHON' -> Returns one unified leaderboard ranking all IDEA-01, IDEA-02, IDEA-03 submissions together.
   */
  public static getRound1Leaderboard(competitionCode: 'HACKATHON' | 'IDEATHON' | string): LeaderboardItem[] {
    const comp = db.getCompetitionByCode(competitionCode);
    if (!comp) {
      return [];
    }

    // Fetch all submissions for this competition type
    const submissions = db.getSubmissions({ competitionTypeId: comp.id });

    // Filter submissions that have been scored or evaluated, then sort by score descending
    const rankedSubmissions = submissions
      .filter((s) => s.score !== null && s.score !== undefined)
      .sort((a, b) => (b.score || 0) - (a.score || 0));

    return rankedSubmissions.map((sub, index) => {
      const ps = db.getProblemStatementById(sub.problem_statement_id);
      return {
        rank: index + 1,
        submissionId: sub.id,
        submissionCode: sub.submission_code,
        projectTitle: sub.project_title,
        teamName: sub.team_name,
        competitionTypeCode: comp.code,
        problemStatementCode: ps ? ps.code : 'UNKNOWN',
        score: sub.score || 0,
        status: sub.status,
        submittedAt: sub.submitted_at,
      };
    });
  }
}
