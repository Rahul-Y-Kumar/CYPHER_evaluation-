// CSV Evaluation Service for CYPHER 4.0
// Parses Round 1 evaluation CSV files for Atrians and Non-Atrians.
// Confidentiality Rule: Marks and criteria breakdown are strictly confidential and NEVER exposed to users.
// Selection Rule: Teams with score >= 50 are SELECTED, < 50 are ELIMINATED.
// Qualification Rule: Only teams where ALL evaluation criteria are marked and total marks is calculated are considered.

export interface TeamLeaderboardRecord {
  id: string;
  slNo: number;
  teamName: string;
  teamLeader: string;
  email: string;
  collegeName: string;
  category: 'ATRIANS' | 'NON-ATRIANS';
  problemStatementCode: string;
  problemStatementTitle: string;
  teamSize: number;
  members: string[];
  status: 'SELECTED' | 'ELIMINATED';
  // Note: score is stored internally for sorting only and NEVER rendered in the UI
  _internalScore: number;
}

const PROBLEM_MAP: Record<string, { code: string; title: string }> = {
  '1': { code: 'PS-01', title: 'The Spare Parts Desk (Kaveri Spares & Hydraulics)' },
  '2': { code: 'PS-02', title: 'The Festival Rush (VoltKart Electronics)' },
  '3': { code: 'PS-03', title: 'The Wrong Sizes (BigFit Apparel)' },
  '4': { code: 'PS-04', title: 'Head Office, 8:30 a.m. (FreshBasket Franchise Network)' },
  '5': { code: 'PS-05', title: 'The Blocked Bed (Sanjeevani Multispeciality Hospital)' },
  '6': { code: 'PS-06', title: 'Before the Match Starts (Zipcart)' },
  '7': { code: 'PS-07', title: 'Batch B2231 (Arogya Pharma Distributors)' },
  '8': { code: 'PS-08', title: 'The Truck Near Hubli (Sudha Home Products)' },
  '9': { code: 'PS-09', title: 'One Missing Part (Precision Axle Components)' },
  '10': { code: 'PS-10', title: 'What Came Back (Gadgetbay)' },
  '11': { code: 'PS-11', title: 'Three Small Warnings (Malnad Industrial Pumps)' },
  '12': { code: 'PS-12', title: 'AI Voice Commerce Agent' },
  '13': { code: 'PS-13', title: 'Predictive Stock Depletion' },
  '14': { code: 'PS-14', title: 'Real-Time Driver Payout Engine' },
};

export const SELECTION_CUTOFF_SCORE = 50;
const STORAGE_KEY = 'cypher4_leaderboard_round1_records';

export class CSVEvaluationService {
  /**
   * Helper to map problem statement number or string to formatted code and title
   */
  public static resolveProblemStatement(psRaw: string): { code: string; title: string } {
    const trimmed = (psRaw || '').trim();
    if (PROBLEM_MAP[trimmed]) {
      return PROBLEM_MAP[trimmed];
    }

    // Check if matches PS-01, PS-1, etc.
    const numMatch = trimmed.match(/\b(?:ps[-_ ]*)?(\d{1,2})\b/i);
    if (numMatch && PROBLEM_MAP[numMatch[1]]) {
      return PROBLEM_MAP[numMatch[1]];
    }

    return {
      code: trimmed ? `PS-${trimmed.padStart(2, '0')}` : 'PS-UNASSIGNED',
      title: 'Challenge Track',
    };
  }

  /**
   * Parse a single CSV string for Atrians or Non-Atrians.
   * Only includes teams where each and every criterion is marked and total marks is calculated.
   */
  public static parseTeamCSV(csvText: string, defaultCategory: 'ATRIANS' | 'NON-ATRIANS'): TeamLeaderboardRecord[] {
    const lines = csvText.trim().split('\n').filter(line => line.trim().length > 0);
    if (lines.length < 2) return [];

    // Parse header
    const headers = this.parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());

    const records: TeamLeaderboardRecord[] = [];

    // Identify criteria column indices
    // Columns: Supply-chain reasoning, Agentic behaviour, Decision quality, Working prototype, Innovation, UX & presentation
    const criteriaIndices: number[] = [];
    headers.forEach((h, idx) => {
      if (
        h.includes('supply') ||
        h.includes('agentic') ||
        h.includes('decision') ||
        h.includes('prototype') ||
        h.includes('innovation') ||
        h.includes('ux') ||
        h.includes('presentation')
      ) {
        criteriaIndices.push(idx);
      }
    });

    const totalMarksIdx = headers.findIndex(h => h.includes('total marks') || h.includes('total score'));

    for (let i = 1; i < lines.length; i++) {
      const row = this.parseCSVLine(lines[i]);
      if (row.length === 0) continue;

      const getCol = (...colNames: string[]) => {
        for (const name of colNames) {
          const idx = headers.findIndex(h => h.includes(name.toLowerCase()));
          if (idx !== -1 && row[idx] !== undefined) {
            return row[idx].trim();
          }
        }
        return '';
      };

      const teamName = getCol('team name', 'team');
      if (!teamName) continue;

      // Rule check: All criteria must be marked and total marks must be calculated
      let allCriteriaMarked = criteriaIndices.length > 0;
      for (const idx of criteriaIndices) {
        const val = (row[idx] || '').trim();
        if (val === '' || isNaN(Number(val))) {
          allCriteriaMarked = false;
          break;
        }
      }

      const totalMarksVal = totalMarksIdx !== -1 && row[totalMarksIdx] !== undefined 
        ? row[totalMarksIdx].trim() 
        : getCol('total marks', 'total');
      
      const parsedTotal = parseFloat(totalMarksVal);

      // Skip teams that were NOT evaluated (missing criteria or 0/empty total marks)
      if (!allCriteriaMarked || isNaN(parsedTotal) || parsedTotal <= 0) {
        continue;
      }

      const passVal = getCol('pass', 'category').toUpperCase();
      const category: 'ATRIANS' | 'NON-ATRIANS' = passVal.includes('NON') 
        ? 'NON-ATRIANS' 
        : passVal.includes('ATRIAN') 
        ? 'ATRIANS' 
        : defaultCategory;

      const leader = getCol('team leader name', 'team leader', 'leader', 'name') || 'Team Lead';
      const email = getCol('email', 'mail');
      const college = getCol('college name', 'college', 'institute') || (category === 'ATRIANS' ? 'Atria Institute of Technology' : 'Engineering Institution');
      const teamSize = parseInt(getCol('team size', 'size')) || 4;

      const psRaw = getCol('problem statement', 'problem', 'ps');
      const psInfo = this.resolveProblemStatement(psRaw);

      // Members list
      const member1 = getCol('member 1');
      const member2 = getCol('member 2');
      const member3 = getCol('member 3');
      const member4 = getCol('member 4');
      const members = [member1, member2, member3, member4].filter(m => m && m.trim().length > 0);
      if (members.length === 0 && leader) {
        members.push(leader);
      }

      const status: 'SELECTED' | 'ELIMINATED' = parsedTotal >= SELECTION_CUTOFF_SCORE ? 'SELECTED' : 'ELIMINATED';

      records.push({
        id: `${category === 'ATRIANS' ? 'ATR' : 'NATR'}-${i}`,
        slNo: 0, // will be assigned after full sorting
        teamName,
        teamLeader: leader,
        email,
        collegeName: college,
        category,
        problemStatementCode: psInfo.code,
        problemStatementTitle: psInfo.title,
        teamSize,
        members,
        status,
        _internalScore: parsedTotal,
      });
    }

    return records;
  }

  /**
   * Split a CSV line respecting quoted strings with commas
   */
  private static parseCSVLine(line: string): string[] {
    const row: string[] = [];
    let inQuotes = false;
    let token = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(token.trim().replace(/^"|"$/g, ''));
        token = '';
      } else {
        token += char;
      }
    }
    row.push(token.trim().replace(/^"|"$/g, ''));
    return row;
  }

  /**
   * Sorts records descending from highest score to lowest score and assigns SL NO (1, 2, 3...)
   */
  public static sortAndAssignSlNo(records: TeamLeaderboardRecord[]): TeamLeaderboardRecord[] {
    const sorted = [...records].sort((a, b) => b._internalScore - a._internalScore);
    return sorted.map((r, idx) => ({
      ...r,
      slNo: idx + 1,
    }));
  }

  /**
   * Fetch both Atrians and Non-Atrians CSV files from public folder
   */
  public static async fetchOfficialDatasets(): Promise<TeamLeaderboardRecord[]> {
    try {
      const atriansUrl = '/team%20data/atrians/atrians.csv';
      const nonAtriansUrl = '/team%20data/non-atrians/non-atrians.csv';
      const nonAtriansFallbackUrl = '/team%20data/non-atrians/%20non%20atrians.csv';

      let atrianRecords: TeamLeaderboardRecord[] = [];
      let nonAtrianRecords: TeamLeaderboardRecord[] = [];

      // Fetch Atrians CSV
      try {
        const res = await fetch(atriansUrl);
        if (res.ok) {
          const text = await res.text();
          atrianRecords = this.parseTeamCSV(text, 'ATRIANS');
        }
      } catch (err) {
        console.warn('Failed fetching Atrians CSV', err);
      }

      // Fetch Non-Atrians CSV
      try {
        let res = await fetch(nonAtriansUrl);
        if (!res.ok) {
          res = await fetch(nonAtriansFallbackUrl);
        }
        if (res.ok) {
          const text = await res.text();
          nonAtrianRecords = this.parseTeamCSV(text, 'NON-ATRIANS');
        }
      } catch (err) {
        console.warn('Failed fetching Non-Atrians CSV', err);
      }

      const combined = [...atrianRecords, ...nonAtrianRecords];
      if (combined.length > 0) {
        const sorted = this.sortAndAssignSlNo(combined);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
        } catch {}
        return sorted;
      }
    } catch (e) {
      console.error('Error fetching official datasets', e);
    }

    // If fetch failed, return any cached records or seed data
    return this.getCachedRecords();
  }

  /**
   * Retrieve cached records from localStorage
   */
  public static getCachedRecords(): TeamLeaderboardRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return this.sortAndAssignSlNo(parsed);
        }
      }
    } catch {}
    return [];
  }

  /**
   * Save uploaded or updated records
   */
  public static saveRecords(records: TeamLeaderboardRecord[]) {
    try {
      const sorted = this.sortAndAssignSlNo(records);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
      return sorted;
    } catch (e) {
      console.error('Failed saving leaderboard records', e);
      return records;
    }
  }

  /**
   * Import custom CSV content for testing or live updates
   */
  public static importCustomCSV(csvText: string, category: 'ATRIANS' | 'NON-ATRIANS'): TeamLeaderboardRecord[] {
    const current = this.getCachedRecords();
    const otherCategory = current.filter(r => r.category !== category);
    const newForCategory = this.parseTeamCSV(csvText, category);
    const combined = [...otherCategory, ...newForCategory];
    return this.saveRecords(combined);
  }
}
