// CSV Evaluation Service for CYPHER 4.0
// Parses Google Sheets CSV files containing judge scores and ranks teams.
// Rule: Teams with score > 70 are SELECTED (Qualified), <= 70 are ELIMINATED.

export interface TeamEvaluationRecord {
  id: string; // e.g. REG-2026-B827AC
  teamName: string;
  teamLeader: string;
  contactNumber: string;
  email: string;
  collegeName: string;
  passType: 'ATRIANS' | 'NON-ATRIANS';
  competitionTrack: 'HACKATHON' | 'IDEATHON';
  problemStatementCode: string;
  problemStatementTitle: string;
  teamSize: number;
  members: string[];
  // Judges marks (out of 100)
  score: number;
  breakdown: {
    innovation: number;       // out of 30
    technicalComplexity: number; // out of 30
    execution: number;        // out of 25
    presentation: number;     // out of 15
  };
  status: 'SELECTED' | 'ELIMINATED';
  judgeRemarks: string;
  evaluatedAt: string;
  rank?: number;
}

// Pre-seeded real teams from the official registration CSVs with judge scoring matrix
const INITIAL_EVALUATIONS: TeamEvaluationRecord[] = [];

const STORAGE_KEY = 'cypher4_official_evaluations';

export class CSVEvaluationService {
  /**
   * Load evaluations from localStorage or initialize empty
   */
  public static getEvaluations(): TeamEvaluationRecord[] {
    try {
      // Clear legacy mock data if present
      localStorage.removeItem('cypher4_evaluations_v1');
      localStorage.removeItem('cypher4_mock_teams');
      
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return this.rankRecords(parsed);
        }
      }
    } catch {
      // Fallback
    }

    return [];
  }

  /**
   * Persist evaluations to localStorage
   */
  public static saveEvaluations(records: TeamEvaluationRecord[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to persist evaluations to localStorage', e);
    }
  }

  /**
   * Compute ranks and status (> 70 is SELECTED, <= 70 is ELIMINATED)
   */
  public static rankRecords(records: TeamEvaluationRecord[]): TeamEvaluationRecord[] {
    const sorted = [...records].sort((a, b) => b.score - a.score);
    return sorted.map((r, idx) => ({
      ...r,
      rank: idx + 1,
      status: r.score > 70 ? 'SELECTED' : 'ELIMINATED',
    }));
  }

  /**
   * Parse a Google Sheets CSV string and update evaluations
   * Expected columns: Team Name / ID, Leader, Track, PS Code, Score / Marks (out of 100), Remarks, College, etc.
   */
  public static parseAndImportCSV(csvText: string): { success: boolean; count: number; error?: string } {
    try {
      const lines = csvText.trim().split('\n').filter(line => line.trim().length > 0);
      if (lines.length < 2) {
        return { success: false, count: 0, error: 'CSV file is empty or missing data rows.' };
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
      
      const newRecords: TeamEvaluationRecord[] = [];

      for (let i = 1; i < lines.length; i++) {
        // Basic CSV line splitting supporting quoted values
        const row: string[] = [];
        let inQuotes = false;
        let token = '';

        for (const char of lines[i]) {
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            row.push(token.trim());
            token = '';
          } else {
            token += char;
          }
        }
        row.push(token.trim());

        // Extract fields
        const getCol = (...colNames: string[]) => {
          for (const name of colNames) {
            const idx = headers.findIndex(h => h.includes(name.toLowerCase()));
            if (idx !== -1 && row[idx] !== undefined) {
              return row[idx].replace(/^"|"$/g, '').trim();
            }
          }
          return '';
        };

        const id = getCol('registration id', 'reg id', 'id') || `REG-${2026}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const teamName = getCol('team name', 'team') || `Team ${i}`;
        const leader = getCol('team leader name', 'team leader', 'leader', 'name') || 'Team Lead';
        const contact = getCol('contact number', 'contact', 'phone') || '910000000000';
        const email = getCol('email', 'mail') || `team${i}@cypher.org`;
        const college = getCol('college name', 'college', 'institute') || 'Atria Institute of Technology';
        const pass = (getCol('pass', 'category').toUpperCase().includes('ATRIAN') ? 'ATRIANS' : 'NON-ATRIANS') as 'ATRIANS' | 'NON-ATRIANS';
        const track = (getCol('track', 'competition').toUpperCase().includes('IDEA') ? 'IDEATHON' : 'HACKATHON') as 'HACKATHON' | 'IDEATHON';
        const psCode = getCol('problem statement code', 'ps code', 'ps', 'problem') || (track === 'HACKATHON' ? `PS-0${(i % 6) + 1}` : `IDEA-0${(i % 3) + 1}`);
        const psTitle = getCol('problem statement title', 'title') || 'Dynamic Engineering Challenge';
        const teamSize = parseInt(getCol('team size', 'size')) || 4;

        // Parse Marks / Score (out of 100)
        let rawScore = parseFloat(getCol('score', 'marks', 'points', 'total marks', 'total score'));
        if (isNaN(rawScore)) {
          // Check if individual criteria exist
          const inn = parseFloat(getCol('innovation')) || 22;
          const tech = parseFloat(getCol('technical', 'complexity')) || 22;
          const exec = parseFloat(getCol('execution', 'demo')) || 18;
          const pres = parseFloat(getCol('presentation')) || 12;
          rawScore = inn + tech + exec + pres;
        }

        const score = Math.min(100, Math.max(0, Math.round(rawScore * 10) / 10));
        const status = score > 70 ? 'SELECTED' : 'ELIMINATED';
        const remarks = getCol('judge remarks', 'remarks', 'feedback') || (score > 70 ? 'Meets qualification criteria.' : 'Below evaluation threshold.');

        newRecords.push({
          id,
          teamName,
          teamLeader: leader,
          contactNumber: contact,
          email,
          collegeName: college,
          passType: pass,
          competitionTrack: track,
          problemStatementCode: psCode,
          problemStatementTitle: psTitle,
          teamSize,
          members: [leader],
          score,
          breakdown: {
            innovation: Math.round(score * 0.3 * 10) / 10,
            technicalComplexity: Math.round(score * 0.3 * 10) / 10,
            execution: Math.round(score * 0.25 * 10) / 10,
            presentation: Math.round(score * 0.15 * 10) / 10,
          },
          status,
          judgeRemarks: remarks,
          evaluatedAt: `Round 1 — ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        });
      }

      const ranked = this.rankRecords(newRecords);
      this.saveEvaluations(ranked);
      return { success: true, count: ranked.length };
    } catch (err: any) {
      return { success: false, count: 0, error: err.message || 'Error parsing CSV.' };
    }
  }

  /**
   * Reset evaluations back to original seed data
   */
  public static resetToSeedData(): TeamEvaluationRecord[] {
    const ranked = this.rankRecords(INITIAL_EVALUATIONS);
    this.saveEvaluations(ranked);
    return ranked;
  }
}
