import type { 
  CompetitionTypeRecord, 
  ProblemStatementRecord, 
  SubmissionRecord, 
  AuditLogRecord,
  UserContext
} from './types';

// Stable deterministic IDs for default competition types
export const COMPETITION_TYPE_IDS = {
  HACKATHON: '00000000-0000-0000-0000-000000000001',
  IDEATHON: '00000000-0000-0000-0000-000000000002',
};

// Initial Seed Data
const INITIAL_COMPETITIONS: CompetitionTypeRecord[] = [
  {
    id: COMPETITION_TYPE_IDS.HACKATHON,
    code: 'HACKATHON',
    name: 'Hackathon Track',
    description: '48-Hour Technical Prototype & Code Implementation Track',
    is_active: true,
    display_order: 1,
    created_at: new Date('2026-10-01T00:00:00Z').toISOString(),
    updated_at: new Date('2026-10-01T00:00:00Z').toISOString(),
  },
  {
    id: COMPETITION_TYPE_IDS.IDEATHON,
    code: 'IDEATHON',
    name: 'Ideathon Track',
    description: 'Innovation, Product Architecture & Problem Solving Design Track',
    is_active: true,
    display_order: 2,
    created_at: new Date('2026-10-01T00:00:00Z').toISOString(),
    updated_at: new Date('2026-10-01T00:00:00Z').toISOString(),
  },
];

const INITIAL_PROBLEM_STATEMENTS: ProblemStatementRecord[] = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    competition_type_id: COMPETITION_TYPE_IDS.HACKATHON,
    code: 'HACK-01',
    title: 'Autonomous Multi-Agent Threat Neutralization Engine',
    short_description: 'Build a decentralized swarm of AI agents that detect, quarantine, and remediate zero-day memory exploits in real time.',
    description: 'Modern infrastructure requires sub-millisecond anomaly detection and automated counter-response. Teams must architect a multi-agent system where peer agents collaborate across node clusters to patch live binaries, isolate malicious memory allocations, and produce tamper-proof cryptographic audit logs.',
    organization: 'CyberVoid Labs',
    category: 'CyberSecurity',
    is_active: true,
    display_order: 1,
    created_at: new Date('2026-10-01T00:00:00Z').toISOString(),
    updated_at: new Date('2026-10-01T00:00:00Z').toISOString(),
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    competition_type_id: COMPETITION_TYPE_IDS.HACKATHON,
    code: 'HACK-02',
    title: 'Zero-Knowledge Privacy-Preserving Algorithmic Settlement Layer',
    short_description: 'Design a high-throughput settlement engine that validates cross-border liquidity without exposing participant identities.',
    description: 'Financial transactions demand extreme privacy without compromising regulatory verifiability. This challenge requires building a zk-SNARK or zk-STARK powered order-matching engine capable of batching 10,000+ tx/sec with confidential state proofs.',
    organization: 'Nexus Capital',
    category: 'FinTech',
    is_active: true,
    display_order: 2,
    created_at: new Date('2026-10-01T00:00:00Z').toISOString(),
    updated_at: new Date('2026-10-01T00:00:00Z').toISOString(),
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    competition_type_id: COMPETITION_TYPE_IDS.HACKATHON,
    code: 'HACK-03',
    title: 'Self-Healing Distributed Knowledge Graph for Medical Diagnostics',
    short_description: 'Create a localized neuro-symbolic graph memory that resolves conflicting medical research and surfaces diagnostic insights.',
    description: 'Clinical practitioners face information overload and contradictory paper abstracts. Build a neuro-symbolic memory network that dynamically updates confidence scores on medical hypotheses as new clinical trial data arrives.',
    organization: 'Synapse Bio-Tech',
    category: 'AI/ML',
    is_active: true,
    display_order: 3,
    created_at: new Date('2026-10-01T00:00:00Z').toISOString(),
    updated_at: new Date('2026-10-01T00:00:00Z').toISOString(),
  },
  {
    id: '20000000-0000-0000-0000-000000000001',
    competition_type_id: COMPETITION_TYPE_IDS.IDEATHON,
    code: 'IDEA-01',
    title: 'Decentralized Clean Energy Microgrid Tokenization Architecture',
    short_description: 'Design an equitable peer-to-peer neighborhood renewable energy distribution & automated settlement framework.',
    description: 'Urban energy grids face massive distribution inefficiencies. Propose a scalable architectural blueprint for localized solar and battery storage microgrids that enables automated dynamic pricing and consumer-to-consumer power routing.',
    organization: 'Solaris Foundation',
    category: 'CleanTech & Sustainability',
    is_active: true,
    display_order: 1,
    created_at: new Date('2026-10-01T00:00:00Z').toISOString(),
    updated_at: new Date('2026-10-01T00:00:00Z').toISOString(),
  },
  {
    id: '20000000-0000-0000-0000-000000000002',
    competition_type_id: COMPETITION_TYPE_IDS.IDEATHON,
    code: 'IDEA-02',
    title: 'Next-Generation Universal Healthcare Accessibility Blueprint',
    short_description: 'Architect a privacy-preserving telemedicine triage protocol for underserved rural populations.',
    description: 'Remote communities suffer from acute specialist shortages. Design an end-to-end operational and technical architecture connecting frontline health workers with remote diagnostic intelligence.',
    organization: 'Global Health Initiative',
    category: 'Healthcare Access',
    is_active: true,
    display_order: 2,
    created_at: new Date('2026-10-01T00:00:00Z').toISOString(),
    updated_at: new Date('2026-10-01T00:00:00Z').toISOString(),
  },
  {
    id: '20000000-0000-0000-0000-000000000003',
    competition_type_id: COMPETITION_TYPE_IDS.IDEATHON,
    code: 'IDEA-03',
    title: 'Adaptive AI-Driven Micro-Curriculum System for Neurodivergent Learners',
    short_description: 'Formulate an empathetic sensory-adaptive personalized education protocol.',
    description: 'Traditional educational platforms fail learners with neurodivergent needs. Create an architecture for dynamic multi-modal pacing, automated cognitive load modulation, and individualized skill graph mapping.',
    organization: 'NeuroLearn Alliance',
    category: 'EdTech Innovation',
    is_active: true,
    display_order: 3,
    created_at: new Date('2026-10-01T00:00:00Z').toISOString(),
    updated_at: new Date('2026-10-01T00:00:00Z').toISOString(),
  },
];

class DatabaseEngine {
  private competitions: CompetitionTypeRecord[] = [];
  private problemStatements: ProblemStatementRecord[] = [];
  private submissions: SubmissionRecord[] = [];
  private auditLogs: AuditLogRecord[] = [];
  private isStorageInitialized = false;

  constructor() {
    this.init();
  }

  public init() {
    // Check if localStorage exists (in browser context)
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const storedComp = localStorage.getItem('cypher_db_competitions');
        const storedPS = localStorage.getItem('cypher_db_problem_statements');
        const storedSub = localStorage.getItem('cypher_db_submissions');
        const storedAudit = localStorage.getItem('cypher_db_audit_logs');

        if (storedComp && storedPS) {
          this.competitions = JSON.parse(storedComp);
          this.problemStatements = JSON.parse(storedPS);
          this.submissions = storedSub ? JSON.parse(storedSub) : [];
          this.auditLogs = storedAudit ? JSON.parse(storedAudit) : [];
          this.isStorageInitialized = true;
          return;
        }
      } catch (e) {
        // Fallback to in-memory
      }
    }

    this.resetToSeedData();
  }

  public resetToSeedData() {
    this.competitions = JSON.parse(JSON.stringify(INITIAL_COMPETITIONS));
    this.problemStatements = JSON.parse(JSON.stringify(INITIAL_PROBLEM_STATEMENTS));
    this.submissions = [];
    this.auditLogs = [];
    this.persist();
  }

  private persist() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('cypher_db_competitions', JSON.stringify(this.competitions));
        localStorage.setItem('cypher_db_problem_statements', JSON.stringify(this.problemStatements));
        localStorage.setItem('cypher_db_submissions', JSON.stringify(this.submissions));
        localStorage.setItem('cypher_db_audit_logs', JSON.stringify(this.auditLogs));
      } catch (e) {
        // Storage limit or sandbox
      }
    }
  }

  // --- Helpers ---
  public generateUUID(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // --- Competitions Access ---
  public getCompetitions(user?: UserContext | null): CompetitionTypeRecord[] {
    const list = this.competitions.slice().sort((a, b) => a.display_order - b.display_order);
    if (user && user.role === 'admin') {
      return list;
    }
    return list.filter((c) => c.is_active);
  }

  public getCompetitionById(id: string): CompetitionTypeRecord | undefined {
    return this.competitions.find((c) => c.id === id);
  }

  public getCompetitionByCode(code: string): CompetitionTypeRecord | undefined {
    return this.competitions.find((c) => c.code.toUpperCase() === code.toUpperCase());
  }

  public insertCompetition(comp: Omit<CompetitionTypeRecord, 'id' | 'created_at' | 'updated_at'>): CompetitionTypeRecord {
    // Validate unique code
    const existing = this.getCompetitionByCode(comp.code);
    if (existing) {
      throw new Error(`Competition type with code '${comp.code}' already exists.`);
    }

    const now = new Date().toISOString();
    const newRecord: CompetitionTypeRecord = {
      id: this.generateUUID(),
      code: comp.code.toUpperCase().trim(),
      name: comp.name.trim(),
      description: comp.description || null,
      is_active: comp.is_active !== undefined ? comp.is_active : true,
      display_order: comp.display_order || this.competitions.length + 1,
      created_at: now,
      updated_at: now,
    };

    this.competitions.push(newRecord);
    this.persist();
    return newRecord;
  }

  public updateCompetition(id: string, updates: Partial<CompetitionTypeRecord>): CompetitionTypeRecord {
    const idx = this.competitions.findIndex((c) => c.id === id);
    if (idx === -1) {
      throw new Error(`Competition type with ID '${id}' not found.`);
    }

    if (updates.code && updates.code !== this.competitions[idx].code) {
      const existing = this.getCompetitionByCode(updates.code);
      if (existing && existing.id !== id) {
        throw new Error(`Competition type with code '${updates.code}' already exists.`);
      }
    }

    const updated: CompetitionTypeRecord = {
      ...this.competitions[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    this.competitions[idx] = updated;
    this.persist();
    return updated;
  }

  // --- Problem Statements Access ---
  public getProblemStatements(options?: {
    competitionTypeId?: string;
    activeOnly?: boolean;
    user?: UserContext | null;
  }): ProblemStatementRecord[] {
    let list = this.problemStatements.slice().sort((a, b) => a.display_order - b.display_order);

    if (options?.competitionTypeId) {
      list = list.filter((p) => p.competition_type_id === options.competitionTypeId);
    }

    const isAdmin = options?.user?.role === 'admin';
    if (options?.activeOnly || !isAdmin) {
      // Must only return active PS that also belong to active competition types
      const activeCompIds = new Set(this.competitions.filter((c) => c.is_active).map((c) => c.id));
      list = list.filter((p) => p.is_active && activeCompIds.has(p.competition_type_id));
    }

    return list;
  }

  public getProblemStatementById(id: string): ProblemStatementRecord | undefined {
    return this.problemStatements.find((p) => p.id === id);
  }

  public getProblemStatementByCode(competitionTypeId: string, code: string): ProblemStatementRecord | undefined {
    return this.problemStatements.find(
      (p) => p.competition_type_id === competitionTypeId && p.code.toUpperCase() === code.toUpperCase()
    );
  }

  public insertProblemStatement(
    ps: Omit<ProblemStatementRecord, 'id' | 'created_at' | 'updated_at'>
  ): ProblemStatementRecord {
    // Verify valid competition type
    const comp = this.getCompetitionById(ps.competition_type_id);
    if (!comp) {
      throw new Error(`Invalid competition_type_id '${ps.competition_type_id}'. Competition type does not exist.`);
    }

    // Verify non-duplicate PS code within the same competition
    const existing = this.getProblemStatementByCode(ps.competition_type_id, ps.code);
    if (existing) {
      throw new Error(`Problem statement code '${ps.code}' already exists for competition '${comp.code}'.`);
    }

    const now = new Date().toISOString();
    const newRecord: ProblemStatementRecord = {
      id: this.generateUUID(),
      competition_type_id: ps.competition_type_id,
      code: ps.code.toUpperCase().trim(),
      title: ps.title.trim(),
      short_description: ps.short_description || null,
      description: ps.description.trim(),
      organization: ps.organization || null,
      category: ps.category || null,
      is_active: ps.is_active !== undefined ? ps.is_active : true,
      display_order: ps.display_order || this.problemStatements.filter((p) => p.competition_type_id === ps.competition_type_id).length + 1,
      created_at: now,
      updated_at: now,
    };

    this.problemStatements.push(newRecord);
    this.persist();
    return newRecord;
  }

  public updateProblemStatement(id: string, updates: Partial<ProblemStatementRecord>): ProblemStatementRecord {
    const idx = this.problemStatements.findIndex((p) => p.id === id);
    if (idx === -1) {
      throw new Error(`Problem statement with ID '${id}' not found.`);
    }

    const current = this.problemStatements[idx];
    const targetCompId = updates.competition_type_id || current.competition_type_id;
    const targetCode = updates.code ? updates.code.toUpperCase().trim() : current.code;

    // Validate target competition
    if (updates.competition_type_id && updates.competition_type_id !== current.competition_type_id) {
      const comp = this.getCompetitionById(updates.competition_type_id);
      if (!comp) {
        throw new Error(`Invalid competition_type_id '${updates.competition_type_id}'.`);
      }
    }

    // Validate code uniqueness within the target competition
    if (targetCode !== current.code || targetCompId !== current.competition_type_id) {
      const existing = this.getProblemStatementByCode(targetCompId, targetCode);
      if (existing && existing.id !== id) {
        throw new Error(`Problem statement code '${targetCode}' already exists for this competition.`);
      }
    }

    const updated: ProblemStatementRecord = {
      ...current,
      ...updates,
      code: targetCode,
      updated_at: new Date().toISOString(),
    };

    this.problemStatements[idx] = updated;
    this.persist();
    return updated;
  }

  public deleteProblemStatement(id: string): { success: boolean; softDeleted?: boolean; hardDeleted?: boolean } {
    const idx = this.problemStatements.findIndex((p) => p.id === id);
    if (idx === -1) {
      throw new Error(`Problem statement with ID '${id}' not found.`);
    }

    // Check if submissions exist for this problem statement
    const hasSubmissions = this.submissions.some((s) => s.problem_statement_id === id);
    if (hasSubmissions) {
      throw new Error(
        `Cannot permanently delete problem statement '${this.problemStatements[idx].code}' because it has associated submissions. Set is_active = false (soft delete) instead.`
      );
    }

    // Safe to hard delete if never used
    this.problemStatements.splice(idx, 1);
    this.persist();
    return { success: true, hardDeleted: true };
  }

  // --- Submissions Access ---
  public getSubmissions(filter?: {
    competitionTypeId?: string;
    problemStatementId?: string;
    status?: string;
  }): SubmissionRecord[] {
    let list = this.submissions.slice();
    if (filter?.competitionTypeId) {
      list = list.filter((s) => s.competition_type_id === filter.competitionTypeId);
    }
    if (filter?.problemStatementId) {
      list = list.filter((s) => s.problem_statement_id === filter.problemStatementId);
    }
    if (filter?.status) {
      list = list.filter((s) => s.status === filter.status);
    }
    return list;
  }

  public getSubmissionById(id: string): SubmissionRecord | undefined {
    return this.submissions.find((s) => s.id === id || s.submission_code === id);
  }

  public insertSubmission(
    sub: Omit<SubmissionRecord, 'id' | 'submission_code' | 'created_at' | 'updated_at' | 'submitted_at'> & {
      submission_code?: string;
    }
  ): SubmissionRecord {
    // 1. Verify Competition Type is active
    const comp = this.getCompetitionById(sub.competition_type_id);
    if (!comp || !comp.is_active) {
      throw new Error(`Cannot submit to inactive or invalid competition type '${sub.competition_type_id}'.`);
    }

    // 2. Verify Problem Statement exists & is active
    const ps = this.getProblemStatementById(sub.problem_statement_id);
    if (!ps) {
      throw new Error(`Problem statement '${sub.problem_statement_id}' not found.`);
    }

    if (!ps.is_active) {
      throw new Error(`Cannot submit to deactivated problem statement '${ps.code}'.`);
    }

    // 3. BACKEND ENFORCEMENT: problem_statement.competition_type_id MUST MATCH submission.competition_type_id
    if (ps.competition_type_id !== sub.competition_type_id) {
      throw new Error(
        `Security validation failed: Problem statement '${ps.code}' belongs to competition '${ps.competition_type_id}', not '${sub.competition_type_id}'.`
      );
    }

    const now = new Date().toISOString();
    const submissionCode = sub.submission_code || `CYP-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRecord: SubmissionRecord = {
      id: this.generateUUID(),
      submission_code: submissionCode,
      competition_type_id: sub.competition_type_id,
      problem_statement_id: sub.problem_statement_id,
      team_name: sub.team_name,
      team_lead_name: sub.team_lead_name,
      team_lead_email: sub.team_lead_email,
      members_count: sub.members_count || 1,
      project_title: sub.project_title,
      tagline: sub.tagline || null,
      description: sub.description,
      tech_stack: sub.tech_stack || [],
      github_url: sub.github_url,
      deploy_url: sub.deploy_url,
      demo_video_url: sub.demo_video_url || null,
      file_name: sub.file_name || null,
      file_size: sub.file_size || null,
      score: sub.score !== undefined ? sub.score : null,
      status: sub.status || 'SUBMITTED',
      ai_summary: sub.ai_summary || null,
      submitted_at: now,
      created_at: now,
      updated_at: now,
    };

    this.submissions.push(newRecord);
    this.persist();
    return newRecord;
  }

  public updateSubmission(id: string, updates: Partial<SubmissionRecord>): SubmissionRecord {
    const idx = this.submissions.findIndex((s) => s.id === id || s.submission_code === id);
    if (idx === -1) {
      throw new Error(`Submission '${id}' not found.`);
    }

    const updated: SubmissionRecord = {
      ...this.submissions[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    this.submissions[idx] = updated;
    this.persist();
    return updated;
  }

  // --- Audit Logs Access ---
  public insertAuditLog(log: Omit<AuditLogRecord, 'id' | 'created_at'>): AuditLogRecord {
    const record: AuditLogRecord = {
      id: this.generateUUID(),
      user_id: log.user_id || null,
      action: log.action,
      entity_type: log.entity_type,
      entity_id: log.entity_id,
      metadata: log.metadata || {},
      created_at: new Date().toISOString(),
    };

    this.auditLogs.unshift(record);
    this.persist();
    return record;
  }

  public getAuditLogs(limit = 100): AuditLogRecord[] {
    return this.auditLogs.slice(0, limit);
  }
}

export const db = new DatabaseEngine();
