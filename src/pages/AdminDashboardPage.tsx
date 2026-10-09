import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Users, 
  FileText, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  TrendingUp, 
  Download, 
  Settings, 
  Search, 
  Sliders, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Power,
  ArrowUp,
  ArrowDown,
  Activity,
  ChevronRight,
  Sparkles,
  Save,
  X
} from 'lucide-react';
import { NeoCard } from '../components/ui/NeoCard';
import { TechnicalLabel } from '../components/ui/TechnicalLabel';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { CompetitionService } from '../services/competitionService';
import { ProblemStatementService } from '../services/problemStatementService';
import { SubmissionService } from '../services/submissionService';
import { AuditService } from '../services/auditService';
import type { 
  CompetitionTypeRecord, 
  ProblemStatementRecord, 
  SubmissionRecord, 
  AuditLogRecord,
  UserContext 
} from '../backend/types';
import type { NavigationTab } from '../types';

interface AdminDashboardPageProps {
  onSelectTab: (tab: NavigationTab) => void;
}

type AdminSidebarTab = 
  | 'OVERVIEW'
  | 'PROBLEM STATEMENTS'
  | 'SUBMISSIONS'
  | 'AUDIT LOGS'
  | 'COMPETITIONS'
  | 'JUDGES'
  | 'ASSIGNMENTS'
  | 'EVALUATIONS'
  | 'AI ANALYSIS'
  | 'SETTINGS';

const ADMIN_USER: UserContext = {
  userId: '00000000-0000-0000-0000-000000000000',
  email: 'admin@cypher.org',
  role: 'admin',
  fullName: 'CYPHER Administrator',
};

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onSelectTab }) => {
  const [activeSidebarTab, setActiveSidebarTab] = useState<AdminSidebarTab>('OVERVIEW');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCompFilter, setSelectedCompFilter] = useState<string>('ALL');

  // Backend state
  const [competitions, setCompetitions] = useState<CompetitionTypeRecord[]>([]);
  const [problemStatements, setProblemStatements] = useState<ProblemStatementRecord[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal State for Problem Statement Create/Edit
  const [isPSModalOpen, setIsPSModalOpen] = useState(false);
  const [editingPS, setEditingPS] = useState<ProblemStatementRecord | null>(null);
  const [psFormData, setPSFormData] = useState({
    competition_type_id: '',
    code: '',
    title: '',
    short_description: '',
    description: '',
    organization: '',
    category: '',
    display_order: 1,
    is_active: true,
  });

  // Modal State for Competition Type
  const [isCompModalOpen, setIsCompModalOpen] = useState(false);
  const [compFormData, setCompFormData] = useState({
    code: '',
    name: '',
    description: '',
    display_order: 1,
    is_active: true,
  });

  // Load Data
  const reloadData = () => {
    try {
      const comps = CompetitionService.getAllCompetitions(ADMIN_USER);
      const psList = ProblemStatementService.getAll(ADMIN_USER);
      const subs = SubmissionService.getAllSubmissions();
      const logs = AuditService.getLogs(ADMIN_USER, 50);

      setCompetitions(comps);
      setProblemStatements(psList);
      setSubmissions(subs);
      setAuditLogs(logs);

      if (comps.length > 0 && !psFormData.competition_type_id) {
        setPSFormData(prev => ({ ...prev, competition_type_id: comps[0].id }));
      }
    } catch (err: any) {
      showToast(err.message || 'Error fetching data', 'error');
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handler: Open Create PS Modal
  const handleOpenCreatePS = () => {
    setEditingPS(null);
    const defaultCompId = competitions[0]?.id || '';
    setPSFormData({
      competition_type_id: defaultCompId,
      code: '',
      title: '',
      short_description: '',
      description: '',
      organization: 'CYPHER DAO',
      category: 'CyberSecurity',
      display_order: problemStatements.length + 1,
      is_active: true,
    });
    setIsPSModalOpen(true);
  };

  // Handler: Open Edit PS Modal
  const handleOpenEditPS = (ps: ProblemStatementRecord) => {
    setEditingPS(ps);
    setPSFormData({
      competition_type_id: ps.competition_type_id,
      code: ps.code,
      title: ps.title,
      short_description: ps.short_description || '',
      description: ps.description,
      organization: ps.organization || '',
      category: ps.category || '',
      display_order: ps.display_order,
      is_active: ps.is_active,
    });
    setIsPSModalOpen(true);
  };

  // Handler: Save PS (Create or Update)
  const handleSavePS = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPS) {
        ProblemStatementService.update(ADMIN_USER, editingPS.id, {
          competition_type_id: psFormData.competition_type_id,
          code: psFormData.code.trim().toUpperCase(),
          title: psFormData.title.trim(),
          short_description: psFormData.short_description.trim() || null,
          description: psFormData.description.trim(),
          organization: psFormData.organization.trim() || null,
          category: psFormData.category.trim() || null,
          display_order: Number(psFormData.display_order),
          is_active: psFormData.is_active,
        });
        showToast(`Problem Statement ${psFormData.code} updated successfully.`);
      } else {
        ProblemStatementService.create(ADMIN_USER, {
          competition_type_id: psFormData.competition_type_id,
          code: psFormData.code.trim().toUpperCase(),
          title: psFormData.title.trim(),
          short_description: psFormData.short_description.trim() || undefined,
          description: psFormData.description.trim(),
          organization: psFormData.organization.trim() || undefined,
          category: psFormData.category.trim() || undefined,
          display_order: Number(psFormData.display_order),
          is_active: psFormData.is_active,
        });
        showToast(`Problem Statement ${psFormData.code} created successfully.`);
      }
      setIsPSModalOpen(false);
      reloadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save problem statement.', 'error');
    }
  };

  // Handler: Toggle Active Status
  const handleTogglePSActive = (ps: ProblemStatementRecord) => {
    try {
      if (ps.is_active) {
        ProblemStatementService.deactivate(ADMIN_USER, ps.id);
        showToast(`Deactivated ${ps.code}. Historical submissions remain intact.`);
      } else {
        ProblemStatementService.reactivate(ADMIN_USER, ps.id);
        showToast(`Reactivated ${ps.code}.`);
      }
      reloadData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Handler: Reorder PS
  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const list = [...filteredProblemStatements];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    const orderedIds = list.map(item => item.id);
    ProblemStatementService.reorder(ADMIN_USER, orderedIds);
    showToast('Display order updated.');
    reloadData();
  };

  // Handler: Delete PS
  const handleDeletePS = (ps: ProblemStatementRecord) => {
    const hasSubs = submissions.some(s => s.problem_statement_id === ps.id);
    if (hasSubs) {
      if (confirm(`Problem Statement ${ps.code} has existing submissions. Delete is not allowed to preserve integrity. Do you want to DEACTIVATE it instead?`)) {
        ProblemStatementService.deactivate(ADMIN_USER, ps.id);
        showToast(`Deactivated ${ps.code} (soft delete).`);
        reloadData();
      }
      return;
    }

    if (confirm(`Are you sure you want to permanently delete unused Problem Statement ${ps.code}?`)) {
      try {
        ProblemStatementService.delete(ADMIN_USER, ps.id);
        showToast(`Problem statement ${ps.code} permanently deleted.`);
        reloadData();
      } catch (err: any) {
        showToast(err.message, 'error');
      }
    }
  };

  // Handler: Create Competition Type
  const handleCreateCompetition = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      CompetitionService.createCompetition(ADMIN_USER, {
        code: compFormData.code.trim().toUpperCase(),
        name: compFormData.name.trim(),
        description: compFormData.description.trim() || undefined,
        display_order: Number(compFormData.display_order),
        is_active: compFormData.is_active,
      });
      showToast(`Competition type ${compFormData.code} created.`);
      setIsCompModalOpen(false);
      reloadData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleCompActive = (comp: CompetitionTypeRecord) => {
    try {
      if (comp.is_active) {
        CompetitionService.deactivateCompetition(ADMIN_USER, comp.id);
        showToast(`Competition ${comp.code} deactivated.`);
      } else {
        CompetitionService.reactivateCompetition(ADMIN_USER, comp.id);
        showToast(`Competition ${comp.code} reactivated.`);
      }
      reloadData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Sidebar list
  const sidebarTabs: { id: AdminSidebarTab; icon: React.ReactNode; badge?: number }[] = [
    { id: 'OVERVIEW', icon: <Terminal size={14} /> },
    { id: 'PROBLEM STATEMENTS', icon: <Layers size={14} />, badge: problemStatements.length },
    { id: 'SUBMISSIONS', icon: <FileText size={14} />, badge: submissions.length },
    { id: 'AUDIT LOGS', icon: <Activity size={14} />, badge: auditLogs.length },
    { id: 'COMPETITIONS', icon: <Sliders size={14} />, badge: competitions.length },
    { id: 'JUDGES', icon: <ShieldCheck size={14} /> },
    { id: 'ASSIGNMENTS', icon: <Users size={14} /> },
    { id: 'EVALUATIONS', icon: <TrendingUp size={14} /> },
    { id: 'AI ANALYSIS', icon: <Cpu size={14} /> },
    { id: 'SETTINGS', icon: <Settings size={14} /> },
  ];

  // Filtered Problem Statements
  const filteredProblemStatements = problemStatements.filter(ps => {
    const comp = competitions.find(c => c.id === ps.competition_type_id);
    const matchesComp = selectedCompFilter === 'ALL' || comp?.code === selectedCompFilter;
    const matchesSearch = 
      ps.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
      ps.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (ps.category && ps.category.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesComp && matchesSearch;
  });

  // Filtered Submissions
  const filteredSubmissions = submissions.filter(sub => {
    const ps = problemStatements.find(p => p.id === sub.problem_statement_id);
    const comp = competitions.find(c => c.id === sub.competition_type_id);
    const matchesComp = selectedCompFilter === 'ALL' || comp?.code === selectedCompFilter;
    const matchesSearch = 
      sub.submission_code.toLowerCase().includes(searchFilter.toLowerCase()) ||
      sub.team_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (ps && ps.code.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesComp && matchesSearch;
  });

  return (
    <div style={{ position: 'relative', zIndex: 1, paddingTop: '2rem', paddingBottom: '6rem' }}>
      <div className="container-custom">
        {/* Toast Notification */}
        {notification && (
          <div
            style={{
              position: 'fixed',
              top: '5rem',
              right: '2rem',
              zIndex: 9999,
              background: notification.type === 'success' ? 'var(--acid)' : 'var(--danger)',
              color: 'var(--ink)',
              padding: '0.85rem 1.5rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              border: '2px solid var(--ink)',
              boxShadow: '4px 4px 0 var(--ink)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Admin Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            paddingBottom: '1.25rem',
            borderBottom: '2px solid var(--line)',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
              <StatusBadge status="ADMINISTRATOR TERMINAL" variant="acid" pulse />
              <TechnicalLabel color="cyan">DATABASE MASTER CONTROL • ROLE: ADMIN</TechnicalLabel>
            </div>
            <h1 className="display-title" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', color: 'var(--white)' }}>
              CONTROL <span style={{ color: 'var(--acid)' }}>CENTER</span>
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button variant="outline" size="sm" onClick={() => onSelectTab('home')}>
              PUBLIC SITE
            </Button>
            <Button variant="cyan" size="sm" onClick={handleOpenCreatePS} icon={<Plus size={14} />}>
              NEW PROBLEM STATEMENT
            </Button>
          </div>
        </div>

        {/* Dashboard Main Grid: Sidebar + Content */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(220px, 260px) 1fr',
            gap: '2rem',
          }}
          className="admin-dashboard-layout"
        >
          {/* =========================================================================
              SIDEBAR NAVIGATION
              ========================================================================= */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: 'var(--ink)',
                border: '1px solid var(--line)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--muted)',
                marginBottom: '0.5rem',
              }}
            >
              // NAVIGATION CONTROL
            </div>

            {sidebarTabs.map((tab) => {
              const isActive = activeSidebarTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSidebarTab(tab.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.7rem 0.9rem',
                    background: isActive ? 'var(--acid)' : 'var(--paper)',
                    color: isActive ? 'var(--ink)' : 'var(--white)',
                    border: isActive ? '2px solid var(--ink)' : '1px solid var(--line)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: isActive ? '3px 3px 0 var(--ink)' : 'none',
                    transition: 'all 0.1s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {tab.icon}
                    <span>{tab.id}</span>
                  </div>
                  {tab.badge !== undefined ? (
                    <span
                      style={{
                        padding: '0.1rem 0.4rem',
                        fontSize: '0.65rem',
                        background: isActive ? 'var(--ink)' : 'var(--line)',
                        color: isActive ? 'var(--acid)' : 'var(--white)',
                        fontWeight: 800,
                      }}
                    >
                      {tab.badge}
                    </span>
                  ) : isActive && (
                    <ChevronRight size={14} color="var(--ink)" />
                  )}
                </button>
              );
            })}
          </aside>

          {/* =========================================================================
              MAIN ADMIN CONTENT AREA
              ========================================================================= */}
          <main style={{ minWidth: 0 }}>
            {/* Top Stat Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              {/* Stat 1: Total Submissions */}
              <NeoCard variant="featured" style={{ padding: '1.25rem' }}>
                <TechnicalLabel color="cyan" variant="tag">
                  SUBMISSIONS
                </TechnicalLabel>
                <div className="font-display" style={{ fontSize: '2.5rem', color: 'var(--white)', lineHeight: 0.9, marginTop: '0.4rem' }}>
                  {submissions.length}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
                  Database Records
                </div>
              </NeoCard>

              {/* Stat 2: Problem Statements */}
              <NeoCard variant="featured" style={{ padding: '1.25rem' }}>
                <TechnicalLabel color="acid" variant="tag">
                  PROBLEM STATEMENTS
                </TechnicalLabel>
                <div className="font-display" style={{ fontSize: '2.5rem', color: 'var(--acid)', lineHeight: 0.9, marginTop: '0.4rem' }}>
                  {problemStatements.filter(p => p.is_active).length}/{problemStatements.length}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
                  Active / Total
                </div>
              </NeoCard>

              {/* Stat 3: Competition Types */}
              <NeoCard variant="featured" style={{ padding: '1.25rem' }}>
                <TechnicalLabel color="cyan" variant="tag">
                  COMPETITIONS
                </TechnicalLabel>
                <div className="font-display" style={{ fontSize: '2.5rem', color: 'var(--purple)', lineHeight: 0.9, marginTop: '0.4rem' }}>
                  {competitions.length}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
                  HACKATHON • IDEATHON
                </div>
              </NeoCard>

              {/* Stat 4: Evaluated */}
              <NeoCard variant="featured" style={{ padding: '1.25rem', border: '2px solid var(--cyan)' }}>
                <TechnicalLabel color="cyan" variant="tag">
                  AUDIT EVENTS
                </TechnicalLabel>
                <div className="font-display" style={{ fontSize: '2.5rem', color: 'var(--cyan)', lineHeight: 0.9, marginTop: '0.4rem' }}>
                  {auditLogs.length}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
                  Security & CRUD logs
                </div>
              </NeoCard>
            </div>

            {/* =====================================================================
                TAB: PROBLEM STATEMENTS MANAGEMENT
                ===================================================================== */}
            {(activeSidebarTab === 'PROBLEM STATEMENTS' || activeSidebarTab === 'OVERVIEW') && (
              <NeoCard variant="default" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '1rem' }}>
                  <div>
                    <TechnicalLabel color="acid" variant="bracket">
                      DYNAMIC PS ENGINE // CRUD & STATUS CONTROL
                    </TechnicalLabel>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--white)', marginTop: '0.2rem' }}>
                      Problem Statement Catalog
                    </h3>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {/* Competition Filter */}
                    <select
                      value={selectedCompFilter}
                      onChange={(e) => setSelectedCompFilter(e.target.value)}
                      style={{
                        padding: '0.45rem 0.75rem',
                        background: 'var(--ink)',
                        border: '1px solid var(--line)',
                        color: 'var(--white)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        outline: 'none',
                      }}
                    >
                      <option value="ALL">ALL COMPETITIONS</option>
                      {competitions.map(c => (
                        <option key={c.id} value={c.code}>{c.code}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Filter PS..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      style={{
                        padding: '0.45rem 0.75rem',
                        background: 'var(--ink)',
                        border: '1px solid var(--line)',
                        color: 'var(--white)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        outline: 'none',
                      }}
                    />

                    <Button variant="primary" size="sm" onClick={handleOpenCreatePS} icon={<Plus size={14} />}>
                      ADD PS
                    </Button>
                  </div>
                </div>

                {/* PS Table */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--ink)', borderBottom: '2px solid var(--line)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
                        <th style={{ padding: '0.75rem 0.5rem', border: '1px solid var(--line)', width: '60px' }}>ORDER</th>
                        <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>PS CODE</th>
                        <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>COMPETITION</th>
                        <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>TITLE & CATEGORY</th>
                        <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>ORGANIZATION</th>
                        <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>STATUS</th>
                        <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)', textAlign: 'right' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProblemStatements.map((ps, idx) => {
                        const comp = competitions.find(c => c.id === ps.competition_type_id);
                        return (
                          <tr
                            key={ps.id}
                            style={{
                              borderBottom: '1px solid var(--line)',
                              background: ps.is_active ? 'transparent' : 'rgba(255,0,0,0.03)',
                            }}
                          >
                            {/* Order & Reorder arrows */}
                            <td style={{ padding: '0.6rem 0.5rem', border: '1px solid var(--line)', textAlign: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                                <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--muted)' }}>
                                  #{ps.display_order}
                                </span>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <button
                                    onClick={() => handleMoveOrder(idx, 'up')}
                                    disabled={idx === 0}
                                    style={{ background: 'none', border: 'none', color: idx === 0 ? 'var(--line)' : 'var(--cyan)', cursor: idx === 0 ? 'default' : 'pointer', padding: 0 }}
                                  >
                                    <ArrowUp size={12} />
                                  </button>
                                  <button
                                    onClick={() => handleMoveOrder(idx, 'down')}
                                    disabled={idx === filteredProblemStatements.length - 1}
                                    style={{ background: 'none', border: 'none', color: idx === filteredProblemStatements.length - 1 ? 'var(--line)' : 'var(--cyan)', cursor: idx === filteredProblemStatements.length - 1 ? 'default' : 'pointer', padding: 0 }}
                                  >
                                    <ArrowDown size={12} />
                                  </button>
                                </div>
                              </div>
                            </td>

                            <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--acid)', border: '1px solid var(--line)' }}>
                              {ps.code}
                            </td>

                            <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', border: '1px solid var(--line)' }}>
                              {comp ? comp.code : 'UNKNOWN'}
                            </td>

                            <td style={{ padding: '0.85rem 1rem', border: '1px solid var(--line)' }}>
                              <div style={{ fontWeight: 700, color: 'var(--white)' }}>{ps.title}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{ps.category || 'General'}</div>
                            </td>

                            <td style={{ padding: '0.85rem 1rem', color: 'var(--muted)', border: '1px solid var(--line)' }}>
                              {ps.organization || 'CYPHER DAO'}
                            </td>

                            <td style={{ padding: '0.85rem 1rem', border: '1px solid var(--line)' }}>
                              <StatusBadge
                                status={ps.is_active ? 'ACTIVE' : 'DEACTIVATED'}
                                variant={ps.is_active ? 'acid' : 'outline'}
                              />
                            </td>

                            <td style={{ padding: '0.85rem 1rem', textAlign: 'right', border: '1px solid var(--line)' }}>
                              <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                                <button
                                  onClick={() => handleOpenEditPS(ps)}
                                  title="Edit Problem Statement"
                                  style={{
                                    background: 'var(--ink)',
                                    border: '1px solid var(--line)',
                                    color: 'var(--white)',
                                    padding: '0.35rem 0.6rem',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.7rem',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <Edit2 size={12} />
                                </button>

                                <button
                                  onClick={() => handleTogglePSActive(ps)}
                                  title={ps.is_active ? 'Deactivate PS' : 'Reactivate PS'}
                                  style={{
                                    background: ps.is_active ? 'var(--ink)' : 'var(--acid)',
                                    border: '1px solid var(--line)',
                                    color: ps.is_active ? 'var(--acid)' : 'var(--ink)',
                                    padding: '0.35rem 0.6rem',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.7rem',
                                    cursor: 'pointer',
                                    fontWeight: 800,
                                  }}
                                >
                                  <Power size={12} />
                                </button>

                                <button
                                  onClick={() => handleDeletePS(ps)}
                                  title="Delete PS (Safe check)"
                                  style={{
                                    background: 'var(--ink)',
                                    border: '1px solid var(--danger)',
                                    color: 'var(--danger)',
                                    padding: '0.35rem 0.6rem',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.7rem',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </NeoCard>
            )}

            {/* =====================================================================
                TAB: SUBMISSIONS TABLE
                ===================================================================== */}
            {(activeSidebarTab === 'SUBMISSIONS' || activeSidebarTab === 'OVERVIEW') && (
              <NeoCard variant="default" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '1rem' }}>
                  <div>
                    <TechnicalLabel color="cyan" variant="bracket">
                      SUBMISSIONS LEDGER // {submissions.length} RECORDS
                    </TechnicalLabel>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--white)', marginTop: '0.2rem' }}>
                      Verified Participant Deliverables
                    </h3>
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--ink)', borderBottom: '2px solid var(--line)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
                        <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>SUB ID</th>
                        <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>TEAM & LEAD</th>
                        <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>TRACK</th>
                        <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>PS CODE</th>
                        <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>STATUS</th>
                        <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>SCORE</th>
                        <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>SUBMITTED AT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubmissions.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                            No submissions found in current filter.
                          </td>
                        </tr>
                      ) : (
                        filteredSubmissions.map((sub) => {
                          const ps = problemStatements.find(p => p.id === sub.problem_statement_id);
                          const comp = competitions.find(c => c.id === sub.competition_type_id);
                          return (
                            <tr key={sub.id} style={{ borderBottom: '1px solid var(--line)' }}>
                              <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--acid)', border: '1px solid var(--line)' }}>
                                {sub.submission_code}
                              </td>
                              <td style={{ padding: '0.85rem 1rem', border: '1px solid var(--line)' }}>
                                <div style={{ fontWeight: 700, color: 'var(--white)' }}>{sub.team_name}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{sub.team_lead_name} ({sub.team_lead_email})</div>
                              </td>
                              <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', border: '1px solid var(--line)' }}>
                                {comp ? comp.code : 'UNKNOWN'}
                              </td>
                              <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--white)', border: '1px solid var(--line)' }}>
                                {ps ? ps.code : 'UNKNOWN'}
                              </td>
                              <td style={{ padding: '0.85rem 1rem', border: '1px solid var(--line)' }}>
                                <StatusBadge status={sub.status} variant="auto" />
                              </td>
                              <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: sub.score ? 'var(--acid)' : 'var(--muted)', border: '1px solid var(--line)' }}>
                                {sub.score !== null ? `${sub.score}/100` : '—'}
                              </td>
                              <td style={{ padding: '0.85rem 1rem', fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)', border: '1px solid var(--line)' }}>
                                {new Date(sub.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </NeoCard>
            )}

            {/* =====================================================================
                TAB: AUDIT LOGS
                ===================================================================== */}
            {activeSidebarTab === 'AUDIT LOGS' && (
              <NeoCard variant="default" style={{ padding: '1.5rem' }}>
                <TechnicalLabel color="cyan" variant="bracket">
                  AUDIT TRAIL // SECURITY & MUTATION RECORD
                </TechnicalLabel>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--white)', marginTop: '0.2rem', marginBottom: '1.25rem' }}>
                  Immutable System Activity
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      style={{
                        background: 'var(--ink)',
                        border: '1px solid var(--line)',
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span
                            className="font-mono"
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              color: log.action.includes('DEACTIVATED') ? 'var(--danger)' : 'var(--acid)',
                            }}
                          >
                            [{log.action}]
                          </span>
                          <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--cyan)' }}>
                            ENTITY: {log.entity_type} ({log.entity_id})
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                          {JSON.stringify(log.metadata)}
                        </div>
                      </div>

                      <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </NeoCard>
            )}

            {/* =====================================================================
                TAB: COMPETITION TYPES MANAGEMENT
                ===================================================================== */}
            {activeSidebarTab === 'COMPETITIONS' && (
              <NeoCard variant="default" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <TechnicalLabel color="cyan" variant="bracket">
                      ROOT ENTITIES // COMPETITION REGISTRY
                    </TechnicalLabel>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--white)', marginTop: '0.2rem' }}>
                      Competition Tracks
                    </h3>
                  </div>
                  <Button variant="cyan" size="sm" onClick={() => setIsCompModalOpen(true)} icon={<Plus size={14} />}>
                    ADD COMPETITION TYPE
                  </Button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  {competitions.map((comp) => (
                    <NeoCard key={comp.id} variant="default" style={{ padding: '1.25rem', border: '1px solid var(--line)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span className="font-mono" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--acid)' }}>
                          {comp.code}
                        </span>
                        <StatusBadge status={comp.is_active ? 'ACTIVE' : 'INACTIVE'} variant={comp.is_active ? 'acid' : 'outline'} />
                      </div>
                      <h4 style={{ color: 'var(--white)', marginBottom: '0.5rem' }}>{comp.name}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1rem' }}>
                        {comp.description || 'Primary competition category.'}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: '0.75rem' }}>
                        <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                          ORDER: #{comp.display_order}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleCompActive(comp)}
                        >
                          {comp.is_active ? 'DEACTIVATE' : 'ACTIVATE'}
                        </Button>
                      </div>
                    </NeoCard>
                  ))}
                </div>
              </NeoCard>
            )}
          </main>
        </div>

        {/* =========================================================================
            MODAL: CREATE / EDIT PROBLEM STATEMENT
            ========================================================================= */}
        {isPSModalOpen && (
          <Modal
            isOpen={isPSModalOpen}
            onClose={() => setIsPSModalOpen(false)}
            title={editingPS ? `EDIT PROBLEM STATEMENT // ${editingPS.code}` : 'CREATE NEW PROBLEM STATEMENT'}
            subtitle="Changes persist directly to the database engine."
          >
            <form onSubmit={handleSavePS} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Competition Type & Code */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>
                    COMPETITION TRACK *
                  </label>
                  <select
                    value={psFormData.competition_type_id}
                    onChange={(e) => setPSFormData({ ...psFormData, competition_type_id: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      background: 'var(--ink)',
                      border: '2px solid var(--line)',
                      color: 'var(--white)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                    }}
                  >
                    {competitions.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} — {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>
                    PS CODE * (e.g. HACK-04, IDEA-02)
                  </label>
                  <input
                    type="text"
                    value={psFormData.code}
                    onChange={(e) => setPSFormData({ ...psFormData, code: e.target.value })}
                    placeholder="HACK-04"
                    required
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      background: 'var(--ink)',
                      border: '2px solid var(--line)',
                      color: 'var(--white)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                    }}
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>
                  PROBLEM STATEMENT TITLE *
                </label>
                <input
                  type="text"
                  value={psFormData.title}
                  onChange={(e) => setPSFormData({ ...psFormData, title: e.target.value })}
                  placeholder="Real-Time Zero-Knowledge zkRollup Verifier"
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    background: 'var(--ink)',
                    border: '2px solid var(--line)',
                    color: 'var(--white)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              {/* Category & Organization */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>
                    DOMAIN CATEGORY (e.g. AI/ML, CyberSecurity)
                  </label>
                  <input
                    type="text"
                    value={psFormData.category}
                    onChange={(e) => setPSFormData({ ...psFormData, category: e.target.value })}
                    placeholder="FinTech"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      background: 'var(--ink)',
                      border: '2px solid var(--line)',
                      color: 'var(--white)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                    }}
                  />
                </div>

                <div>
                  <label className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>
                    ORGANIZATION / SPONSOR
                  </label>
                  <input
                    type="text"
                    value={psFormData.organization}
                    onChange={(e) => setPSFormData({ ...psFormData, organization: e.target.value })}
                    placeholder="CYPHER DAO"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      background: 'var(--ink)',
                      border: '2px solid var(--line)',
                      color: 'var(--white)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                    }}
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>
                  SHORT SUMMARY (Max 2 sentences)
                </label>
                <input
                  type="text"
                  value={psFormData.short_description}
                  onChange={(e) => setPSFormData({ ...psFormData, short_description: e.target.value })}
                  placeholder="Architect a low-latency zkRollup settlement mechanism..."
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    background: 'var(--ink)',
                    border: '2px solid var(--line)',
                    color: 'var(--white)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>
                  DETAILED BRIEF & SCOPE *
                </label>
                <textarea
                  rows={4}
                  value={psFormData.description}
                  onChange={(e) => setPSFormData({ ...psFormData, description: e.target.value })}
                  required
                  placeholder="Describe the full technical requirements, constraints, and deliverables..."
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    background: 'var(--ink)',
                    border: '2px solid var(--line)',
                    color: 'var(--white)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Display Order & Active Checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--ink)', padding: '0.85rem', border: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <label className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--white)' }}>
                    DISPLAY ORDER:
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={psFormData.display_order}
                    onChange={(e) => setPSFormData({ ...psFormData, display_order: parseInt(e.target.value) || 1 })}
                    style={{
                      width: '70px',
                      padding: '0.35rem 0.5rem',
                      background: 'var(--paper)',
                      border: '1px solid var(--line)',
                      color: 'var(--acid)',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                    }}
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={psFormData.is_active}
                    onChange={(e) => setPSFormData({ ...psFormData, is_active: e.target.checked })}
                  />
                  <span className="font-mono" style={{ fontSize: '0.75rem', color: psFormData.is_active ? 'var(--acid)' : 'var(--muted)', fontWeight: 800 }}>
                    ACTIVE STATUS
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <Button variant="outline" size="sm" onClick={() => setIsPSModalOpen(false)}>
                  CANCEL
                </Button>
                <Button variant="primary" size="sm" type="submit" icon={<Save size={14} />}>
                  {editingPS ? 'UPDATE STATEMENT' : 'CREATE STATEMENT'}
                </Button>
              </div>
            </form>
          </Modal>
        )}

        {/* =========================================================================
            MODAL: CREATE COMPETITION TYPE
            ========================================================================= */}
        {isCompModalOpen && (
          <Modal
            isOpen={isCompModalOpen}
            onClose={() => setIsCompModalOpen(false)}
            title="CREATE COMPETITION TRACK"
            subtitle="Add a new competition tier (e.g. HACKATHON, IDEATHON)"
          >
            <form onSubmit={handleCreateCompetition} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>
                  COMPETITION CODE * (e.g. HACKATHON, IDEATHON)
                </label>
                <input
                  type="text"
                  value={compFormData.code}
                  onChange={(e) => setCompFormData({ ...compFormData, code: e.target.value })}
                  placeholder="HACKATHON"
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    background: 'var(--ink)',
                    border: '2px solid var(--line)',
                    color: 'var(--white)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>
                  DISPLAY NAME *
                </label>
                <input
                  type="text"
                  value={compFormData.name}
                  onChange={(e) => setCompFormData({ ...compFormData, name: e.target.value })}
                  placeholder="CYPHER 4.0 Hackathon Track"
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    background: 'var(--ink)',
                    border: '2px solid var(--line)',
                    color: 'var(--white)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>
                  DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  value={compFormData.description}
                  onChange={(e) => setCompFormData({ ...compFormData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    background: 'var(--ink)',
                    border: '2px solid var(--line)',
                    color: 'var(--white)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <Button variant="outline" size="sm" onClick={() => setIsCompModalOpen(false)}>
                  CANCEL
                </Button>
                <Button variant="primary" size="sm" type="submit" icon={<Save size={14} />}>
                  SAVE COMPETITION
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-dashboard-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
