import React, { useState } from 'react';
import { Shield, Eye, CheckCircle2, Clock, GitBranch, ExternalLink, ArrowRight, Filter } from 'lucide-react';
import { NeoCard } from '../components/ui/NeoCard';
import { TechnicalLabel } from '../components/ui/TechnicalLabel';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { JudgeTerminalModal } from '../components/modals/JudgeTerminalModal';
import type { JudgeAssignedProject, NavigationTab } from '../types';

interface JudgeDashboardPageProps {
  onSelectTab: (tab: NavigationTab) => void;
}

const MOCK_ASSIGNED_PROJECTS: JudgeAssignedProject[] = [
  {
    submissionId: 'CYP-1047',
    projectName: 'Aegis: Autonomous Zero-Day Kernel Interceptor',
    blindAlias: 'PROJECT-AEGIS-PRIME',
    psCode: 'PS-01',
    track: 'CyberSecurity',
    status: 'EVALUATED',
    score: 94.5,
    repoUrl: 'https://github.com/cypher-eval/aegis',
    demoUrl: 'https://aegis.dev',
  },
  {
    submissionId: 'CYP-2089',
    projectName: 'HydraZK: Sub-Second Recursive STARK Settlement',
    blindAlias: 'PROJECT-ZK-HYDRA',
    psCode: 'PS-02',
    track: 'FinTech',
    status: 'EVALUATED',
    score: 95.2,
    repoUrl: 'https://github.com/cypher-eval/hydra-zk',
    demoUrl: 'https://hydra.dev',
  },
  {
    submissionId: 'CYP-3104',
    projectName: 'BioSynapse: Hallucination-Free Medical Reasoning Graph',
    blindAlias: 'PROJECT-NEURO-SYNAPSE',
    psCode: 'PS-03',
    track: 'AI/ML',
    status: 'EVALUATED',
    score: 93.9,
    repoUrl: 'https://github.com/cypher-eval/biosynapse',
    demoUrl: 'https://biosynapse.ai',
  },
  {
    submissionId: 'CYP-4402',
    projectName: 'AeroVoxel: Decentralized Drone Mesh Mapping',
    blindAlias: 'PROJECT-SWARM-VOXEL',
    psCode: 'PS-05',
    track: 'Autonomous Systems',
    status: 'PENDING',
    repoUrl: 'https://github.com/cypher-eval/aerovoxel',
    demoUrl: 'https://aerovoxel.io',
  },
  {
    submissionId: 'CYP-5511',
    projectName: 'VeriTensor: Optimistic GPU Slashable Inference Protocol',
    blindAlias: 'PROJECT-TENSOR-CHAIN',
    psCode: 'PS-04',
    track: 'Web3/Crypto',
    status: 'PENDING',
    repoUrl: 'https://github.com/cypher-eval/veritensor',
    demoUrl: 'https://veritensor.org',
  },
  {
    submissionId: 'CYP-6628',
    projectName: 'GhostRuntime: 30ms Sandboxed MicroVM for Code Agents',
    blindAlias: 'PROJECT-FIRE-JAIL',
    psCode: 'PS-06',
    track: 'Open Innovation',
    status: 'PENDING',
    repoUrl: 'https://github.com/cypher-eval/ghostruntime',
    demoUrl: 'https://ghostruntime.dev',
  },
  {
    submissionId: 'CYP-7719',
    projectName: 'SpectreGuard: Automated Smart Contract Fuzzing Daemon',
    blindAlias: 'PROJECT-SPECTRE-FUZZ',
    psCode: 'PS-01',
    track: 'CyberSecurity',
    status: 'PENDING',
    repoUrl: 'https://github.com/cypher-eval/spectreguard',
    demoUrl: 'https://spectreguard.net',
  },
  {
    submissionId: 'CYP-8832',
    projectName: 'PulseZero: Low-Latency Confidential State Engine',
    blindAlias: 'PROJECT-PULSE-ZK',
    psCode: 'PS-02',
    track: 'FinTech',
    status: 'PENDING',
    repoUrl: 'https://github.com/cypher-eval/pulsezero',
    demoUrl: 'https://pulsezero.app',
  },
];

export const JudgeDashboardPage: React.FC<JudgeDashboardPageProps> = ({ onSelectTab }) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'PENDING' | 'EVALUATED'>('ALL');
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<JudgeAssignedProject | null>(null);

  const filteredProjects = MOCK_ASSIGNED_PROJECTS.filter((p) => {
    if (selectedStatusFilter === 'ALL') return true;
    return p.status === selectedStatusFilter;
  });

  const handleOpenEvaluation = (project: JudgeAssignedProject) => {
    setActiveProject(project);
    setEvalModalOpen(true);
  };

  return (
    <div style={{ position: 'relative', zIndex: 1, paddingTop: '3rem', paddingBottom: '6rem' }}>
      <div className="container-custom">
        {/* Top Mission & Identity Strip */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
              <StatusBadge status="JUDGE MODE" variant="purple" pulse />
              <TechnicalLabel color="cyan">TERMINAL ID: JUDGE-CYP-8821</TechnicalLabel>
            </div>
            <h1 className="display-title" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', color: 'var(--white)' }}>
              JUDGE <span style={{ color: 'var(--acid)' }}>DASHBOARD</span>
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="outline" size="sm" onClick={() => onSelectTab('how-it-works')}>
              SCORING RUBRIC MATRIX
            </Button>
            <Button variant="danger" size="sm" onClick={() => onSelectTab('judge-login')}>
              EXIT SESSION
            </Button>
          </div>
        </div>

        {/* =========================================================================
            STATISTICS STRIP: ASSIGNED (12) | EVALUATED (07) | PENDING (05)
            ========================================================================= */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '3rem',
          }}
        >
          {/* Stat 1: Assigned */}
          <NeoCard variant="featured" style={{ padding: '1.5rem' }}>
            <TechnicalLabel color="cyan" variant="tag">
              ASSIGNED DOCKETS
            </TechnicalLabel>
            <div className="font-display" style={{ fontSize: '3.2rem', color: 'var(--white)', lineHeight: 0.9, marginTop: '0.5rem' }}>
              12
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
              Total anonymized allocations
            </div>
          </NeoCard>

          {/* Stat 2: Evaluated */}
          <NeoCard variant="featured" style={{ padding: '1.5rem' }}>
            <TechnicalLabel color="cyan" variant="tag">
              EVALUATED
            </TechnicalLabel>
            <div className="font-display" style={{ fontSize: '3.2rem', color: 'var(--cyan)', lineHeight: 0.9, marginTop: '0.5rem' }}>
              07
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
              Scorecards committed & hashed
            </div>
          </NeoCard>

          {/* Stat 3: Pending */}
          <NeoCard variant="featured" style={{ padding: '1.5rem', border: '2px solid var(--acid)' }}>
            <TechnicalLabel color="acid" variant="tag">
              PENDING EVALUATION
            </TechnicalLabel>
            <div className="font-display" style={{ fontSize: '3.2rem', color: 'var(--acid)', lineHeight: 0.9, marginTop: '0.5rem' }}>
              05
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
              Awaiting rubric scoring
            </div>
          </NeoCard>
        </div>

        {/* =========================================================================
            PROJECT CARDS GRID
            ========================================================================= */}
        <div>
          {/* Section Subheader & Filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem' }}>
            <TechnicalLabel color="cyan" variant="bracket">
              ASSIGNED PROJECT DOCKETS ({filteredProjects.length})
            </TechnicalLabel>

            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {(['ALL', 'PENDING', 'EVALUATED'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedStatusFilter(filter)}
                  style={{
                    background: selectedStatusFilter === filter ? 'var(--acid)' : 'var(--ink)',
                    color: selectedStatusFilter === filter ? 'var(--ink)' : 'var(--white)',
                    border: '1px solid var(--line)',
                    padding: '0.35rem 0.75rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Project Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {filteredProjects.map((project) => (
              <NeoCard
                key={project.submissionId}
                variant="default"
                hoverEffect={true}
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: project.status === 'PENDING' ? '2px solid var(--acid)' : '2px solid var(--line)',
                  minHeight: '260px',
                }}
              >
                <div>
                  {/* Top Bar with Submission ID and Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--acid)', fontWeight: 800 }}>
                        {project.submissionId}
                      </span>
                      <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--cyan)', padding: '0.15rem 0.4rem', background: 'var(--ink)' }}>
                        {project.psCode}
                      </span>
                    </div>

                    <StatusBadge
                      status={project.status}
                      variant={project.status === 'PENDING' ? 'acid' : 'cyan'}
                      pulse={project.status === 'PENDING'}
                    />
                  </div>

                  {/* Project Name / Blind Alias */}
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--white)', marginBottom: '0.35rem', lineHeight: 1.3 }}>
                    {project.projectName}
                  </h3>

                  <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '1.25rem' }}>
                    ALIAS: {project.blindAlias} • TRACK: {project.track}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {project.score ? (
                    <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--cyan)' }}>
                      SCORE: <strong style={{ color: 'var(--white)', fontSize: '0.9rem' }}>{project.score}/100</strong>
                    </span>
                  ) : (
                    <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
                      AWAITING ASSESSMENT
                    </span>
                  )}

                  <Button
                    variant={project.status === 'PENDING' ? 'primary' : 'outline'}
                    size="sm"
                    rollText={true}
                    arrow={true}
                    onClick={() => handleOpenEvaluation(project)}
                  >
                    VIEW PROJECT ↗
                  </Button>
                </div>
              </NeoCard>
            ))}
          </div>
        </div>

        {/* Interactive Evaluation Modal */}
        <JudgeTerminalModal
          isOpen={evalModalOpen}
          onClose={() => setEvalModalOpen(false)}
        />
      </div>
    </div>
  );
};
