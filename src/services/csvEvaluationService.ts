// CSV Evaluation Service for CYPHER 4.0
// Parses Round 1 evaluation CSV files for Atrians, Non-Atrians, and Winners.
// Confidentiality Rule: Marks and criteria breakdown are strictly confidential and NEVER exposed to users.
// Selection Rule: Teams with total marks >= 80 are eligible for Round 2 evaluation (SELECTED), < 80 are ELIMINATED (Round 1 Concluded).

import { SEED_LEADERBOARD_RECORDS, KD_GARAGE_WINNERS } from '../data/seedLeaderboardData';

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
  isEligibleForRound2: boolean;
  isWinner: boolean;
  winnerRank?: 1 | 2 | 3 | null;
  winnerTitle?: string | null;
  winnerAward?: string | null;
  // Strictly internal score for ranking and cutoff computation; NEVER rendered in the UI
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

export const SELECTION_CUTOFF_SCORE = 80;
const STORAGE_KEY = 'cypher4_leaderboard_round2_eval_v3';
const LEGACY_STORAGE_KEYS = ['cypher4_leaderboard_round1_records', 'cypher4_official_evaluations'];

export class CSVEvaluationService {
  /**
   * Helper to map problem statement number or string to formatted code and title
   */
  public static resolveProblemStatement(psRaw: string): { code: string; title: string } {
    const trimmed = (psRaw || '').trim();
    if (PROBLEM_MAP[trimmed]) {
      return PROBLEM_MAP[trimmed];
    }

    const numMatch = trimmed.match(/\b(?:ps[-_ ]*)?(\d{1,2})\b/i);
    if (numMatch && PROBLEM_MAP[numMatch[1]]) {
      return PROBLEM_MAP[numMatch[1]];
    }

    return {
      code: trimmed ? `PS-${trimmed.padStart(2, '0')}` : 'PS-UNASSIGNED',
      title: "KD's Garage Challenge Track",
    };
  }

  /**
   * Split a CSV line respecting quoted strings with commas
   */
  public static parseCSVLine(line: string): string[] {
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
   * Parse winners CSV
   */
  public static parseWinnersCSV(csvText: string): Map<string, { rank: 1 | 2 | 3; title: string; award: string }> {
    const winnersMap = new Map<string, { rank: 1 | 2 | 3; title: string; award: string }>();
    const lines = csvText.trim().split('\n').filter(line => line.trim().length > 0);

    for (const line of lines) {
      const row = this.parseCSVLine(line);
      if (row.length < 2) continue;
      // Skip header if line starts with 'Pass' or 'Category'
      if (row[0].toLowerCase().includes('pass') || row[1].toLowerCase().includes('team')) continue;

      const teamName = (row[1] || '').trim();
      if (!teamName) continue;

      let rankNum: 1 | 2 | 3 = 1;
      const lastCol = (row[row.length - 1] || '').trim();
      if (lastCol === '2') rankNum = 2;
      else if (lastCol === '3') rankNum = 3;

      const title =
        rankNum === 1
          ? "KD's Garage Champion (1st Place)"
          : rankNum === 2
          ? '1st Runner Up (2nd Place)'
          : '2nd Runner Up (3rd Place)';
      
      const award = rankNum === 1 ? 'Champion' : rankNum === 2 ? '1st Runner Up' : '2nd Runner Up';

      winnersMap.set(teamName.toLowerCase(), { rank: rankNum, title, award });
    }

    return winnersMap;
  }

  /**
   * Parse a single CSV string for Atrians or Non-Atrians.
   */
  public static parseTeamCSV(
    csvText: string,
    defaultCategory: 'ATRIANS' | 'NON-ATRIANS',
    winnersMap: Map<string, { rank: 1 | 2 | 3; title: string; award: string }> = new Map()
  ): TeamLeaderboardRecord[] {
    const lines = csvText.trim().split('\n').filter(line => line.trim().length > 0);
    if (lines.length < 2) return [];

    const headers = this.parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());
    const records: TeamLeaderboardRecord[] = [];

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

      const totalMarksVal = totalMarksIdx !== -1 && row[totalMarksIdx] !== undefined 
        ? row[totalMarksIdx].trim() 
        : getCol('total marks', 'total');
      
      const parsedTotal = parseFloat(totalMarksVal);

      // Only include evaluated teams with calculated total marks > 0
      if (isNaN(parsedTotal) || parsedTotal <= 0) {
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

      // Check if team is in winners list
      const winnerInfo = winnersMap.get(teamName.toLowerCase());
      const isWinner = !!winnerInfo;

      const isEligibleForRound2 = parsedTotal >= SELECTION_CUTOFF_SCORE;
      const status: 'SELECTED' | 'ELIMINATED' = isEligibleForRound2 ? 'SELECTED' : 'ELIMINATED';

      records.push({
        id: `${category === 'ATRIANS' ? 'ATR' : 'NATR'}-${i}`,
        slNo: 0,
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
        isEligibleForRound2,
        isWinner,
        winnerRank: winnerInfo?.rank,
        winnerTitle: winnerInfo?.title,
        winnerAward: winnerInfo?.award,
        _internalScore: parsedTotal,
      });
    }

    return records;
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
   * Fetch Atrians, Non-Atrians, and Winners CSV files from public folder
   */
  public static async fetchOfficialDatasets(): Promise<TeamLeaderboardRecord[]> {
    try {
      // Clean legacy caches
      try {
        LEGACY_STORAGE_KEYS.forEach(key => localStorage.removeItem(key));
      } catch {}

      // URLs to try (with proper encoding)
      const winnersUrls = [
        "/team%20data/winners/cypher%204.0%20KD's%20Garage%20-%20winners.csv",
        '/team%20data/winners/winners.csv',
      ];
      const atriansUrls = [
        "/team%20data/atrians/cypher%204.0%20KD's%20Garage%20-%20atrians.csv",
        '/team%20data/atrians/atrians.csv',
      ];
      const nonAtriansUrls = [
        "/team%20data/non-atrians/cypher%204.0%20KD's%20Garage%20-%20non%20atrians.csv",
        '/team%20data/non-atrians/non-atrians.csv',
      ];

      // 1. Fetch Winners
      let winnersMap = new Map<string, { rank: 1 | 2 | 3; title: string; award: string }>();
      for (const url of winnersUrls) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const text = await res.text();
            winnersMap = this.parseWinnersCSV(text);
            break;
          }
        } catch {}
      }

      // If winners couldn't be loaded from network, use seed winners map
      if (winnersMap.size === 0) {
        KD_GARAGE_WINNERS.forEach(w => {
          if (w.winnerRank) {
            winnersMap.set(w.teamName.toLowerCase(), {
              rank: w.winnerRank,
              title: w.winnerTitle || "KD's Garage Winner",
              award: w.winnerAward || 'Winner',
            });
          }
        });
      }

      // 2. Fetch Atrians CSV
      let atrianRecords: TeamLeaderboardRecord[] = [];
      for (const url of atriansUrls) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const text = await res.text();
            atrianRecords = this.parseTeamCSV(text, 'ATRIANS', winnersMap);
            if (atrianRecords.length > 0) break;
          }
        } catch {}
      }

      // 3. Fetch Non-Atrians CSV
      let nonAtrianRecords: TeamLeaderboardRecord[] = [];
      for (const url of nonAtriansUrls) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const text = await res.text();
            nonAtrianRecords = this.parseTeamCSV(text, 'NON-ATRIANS', winnersMap);
            if (nonAtrianRecords.length > 0) break;
          }
        } catch {}
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

    // Fallback: return verified seed leaderboard records
    return this.getCachedRecords();
  }

  /**
   * Retrieve cached records from localStorage, falling back to seed records
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
    return SEED_LEADERBOARD_RECORDS;
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
   * Retrieve official KD's Garage winners
   */
  public static getWinners(records?: TeamLeaderboardRecord[]): TeamLeaderboardRecord[] {
    const list = records || this.getCachedRecords();
    return list
      .filter(r => r.isWinner)
      .sort((a, b) => (a.winnerRank || 99) - (b.winnerRank || 99));
  }
}
