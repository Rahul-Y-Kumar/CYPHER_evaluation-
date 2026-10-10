import React, { useState, useEffect } from 'react';
import { 
  Search, 
  FileText, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  Award, 
  Database,
  ArrowRight,
  Building2,
  Download
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { NeoCard } from '../components/ui/NeoCard';
import { TechnicalLabel } from '../components/ui/TechnicalLabel';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';
import { PROBLEM_STATEMENTS } from '../data/mockData';
import type { ProblemStatement, NavigationTab } from '../types';

interface ProblemStatementsPageProps {
  onSelectTab: (tab: NavigationTab) => void;
  selectedModalProblem?: ProblemStatement | null;
  onCloseModal?: () => void;
}

export const ProblemStatementsPage: React.FC<ProblemStatementsPageProps> = ({
  onSelectTab,
  selectedModalProblem,
  onCloseModal,
}) => {
  const [problemStatements] = useState<ProblemStatement[]>(PROBLEM_STATEMENTS);
  const [selectedCompany, setSelectedCompany] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalPS, setActiveModalPS] = useState<ProblemStatement | null>(null);

  // If a modal was triggered externally
  useEffect(() => {
    if (selectedModalProblem) {
      const match = problemStatements.find(p => p.code === selectedModalProblem.code);
      if (match) {
        setActiveModalPS(match);
      }
    }
  }, [selectedModalProblem, problemStatements]);

  // Companies List
  const companies = [
    { id: 'ALL', label: 'ALL PROVIDERS', count: problemStatements.length },
    { id: "KD's Garage", label: "KD'S GARAGE", count: problemStatements.filter(p => p.sponsor === "KD's Garage").length },
    { id: 'My Startup Wave', label: 'MY STARTUP WAVE', count: problemStatements.filter(p => p.sponsor === 'My Startup Wave').length },
  ];

  const filteredProblems = problemStatements.filter((ps) => {
    const matchesCompany = selectedCompany === 'ALL' || ps.sponsor.toLowerCase() === selectedCompany.toLowerCase();
    const matchesSearch =
      ps.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ps.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ps.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ps.track.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ps.sponsor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ps.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCompany && matchesSearch;
  });

  const handleOpenModal = (ps: ProblemStatement) => {
    setActiveModalPS(ps);
  };

  const handleClose = () => {
    setActiveModalPS(null);
    if (onCloseModal) onCloseModal();
  };

  const handleDownloadPdf = () => {
    const pdfUrl = '/Cypher%204.0%20(Problem%20Statements).pdf';
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'Cypher 4.0 (Problem Statements).pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ position: 'relative', zIndex: 1, paddingTop: '3rem', paddingBottom: '6rem' }}>
      <div className="container-custom">
        {/* Page Title & Mission Meta */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <TechnicalLabel color="cyan" variant="bracket">
              02 // HACKATHON CHALLENGE TRACKS
            </TechnicalLabel>
            <StatusBadge status="14 SPECIALIZED TRACKS" variant="acid" />
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '1.5rem',
              marginTop: '0.35rem',
            }}
          >
            <div>
              <h1 className="display-hero" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--white)', marginBottom: '0.75rem' }}>
                PROBLEM <span style={{ color: 'var(--acid)' }}>STATEMENTS</span>
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: '680px', lineHeight: '1.6' }}>
                Explore all 14 official engineering challenges for CYPHER 4.0 provided by <strong>KD's Garage</strong> (11 Tracks) and <strong>My Startup Wave</strong> (3 Tracks). Select a challenge box to inspect the full problem brief, deliverables, and requirements.
              </p>
            </div>

            {/* Download Official Problem Statements PDF Button */}
            <Button
              variant="primary"
              size="md"
              rollText={true}
              arrow={true}
              icon={<Download size={16} />}
              onClick={handleDownloadPdf}
              style={{ alignSelf: 'center' }}
            >
              DOWNLOAD PROBLEM STATEMENTS .PDF ↗
            </Button>
          </div>
        </div>

        {/* Filters and Search Bar Container */}
        <NeoCard
          variant="default"
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--ink)',
            marginBottom: '2.5rem',
          }}
        >
          {/* Company Filters (Primary) */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <Building2 size={15} color="var(--acid)" />
              <TechnicalLabel color="acid" variant="bracket">
                FILTER BY CHALLENGE PROVIDER:
              </TechnicalLabel>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
              {companies.map((comp) => {
                const isSelected = selectedCompany === comp.id;
                return (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedCompany(comp.id)}
                    style={{
                      background: isSelected ? 'var(--acid)' : 'var(--paper)',
                      color: isSelected ? 'var(--ink)' : 'var(--white)',
                      border: isSelected ? '2px solid var(--ink)' : '1px solid var(--line)',
                      padding: '0.6rem 1.1rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      boxShadow: isSelected ? '3px 3px 0 var(--white)' : 'none',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    <span>{comp.label}</span>
                    <span
                      style={{
                        padding: '0.15rem 0.4rem',
                        fontSize: '0.68rem',
                        background: isSelected ? 'var(--ink)' : 'rgba(255,255,255,0.08)',
                        color: isSelected ? 'var(--acid)' : 'var(--muted)',
                        fontWeight: 700,
                      }}
                    >
                      {comp.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search
              size={18}
              color="var(--muted)"
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search problems by code (PS-01 to PS-14), company, domain, title, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 1rem 0.8rem 2.8rem',
                background: 'var(--paper)',
                border: '2px solid var(--line)',
                color: 'var(--white)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>
        </NeoCard>

        {/* Problem Statements Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {filteredProblems.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', background: 'var(--paper)', border: '2px dashed var(--line)' }}>
              <span className="font-mono" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                No active problem statements found matching the selected filters.
              </span>
            </div>
          ) : (
            filteredProblems.map((ps) => (
              <NeoCard
                key={ps.id}
                variant="default"
                hoverEffect={true}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.75rem',
                }}
              >
                <div>
                  {/* Top Bar with PS Code & Company Badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <StatusBadge status={ps.code} variant="acid" />
                      <StatusBadge status={ps.track} variant="outline" />
                    </div>

                    {/* Company Badge */}
                    <span
                      className="font-mono"
                      style={{
                        fontSize: '0.72rem',
                        padding: '0.25rem 0.55rem',
                        background: ps.sponsor === "KD's Garage" ? 'rgba(234, 255, 0, 0.12)' : 'rgba(22, 213, 208, 0.12)',
                        color: ps.sponsor === "KD's Garage" ? 'var(--acid)' : 'var(--cyan)',
                        border: ps.sponsor === "KD's Garage" ? '1px solid var(--acid)' : '1px solid var(--cyan)',
                        fontWeight: 800,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {ps.sponsor}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: 800,
                      lineHeight: '1.3',
                      marginBottom: '0.85rem',
                      color: 'var(--white)',
                    }}
                  >
                    {ps.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--muted)',
                      lineHeight: '1.6',
                      marginBottom: '1.25rem',
                    }}
                  >
                    {ps.shortDesc}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                    {ps.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono"
                        style={{
                          fontSize: '0.68rem',
                          padding: '0.2rem 0.5rem',
                          background: 'var(--ink)',
                          border: '1px solid var(--line)',
                          color: 'var(--white)',
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div
                  style={{
                    borderTop: '1px solid var(--line)',
                    paddingTop: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                  }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenModal(ps)}
                    icon={<FileText size={14} />}
                  >
                    FULL BRIEF
                  </Button>

                  {ps.sponsor === "KD's Garage" ? (
                    <Button
                      variant="primary"
                      size="sm"
                      rollText={true}
                      arrow={true}
                      onClick={() => onSelectTab('resources')}
                    >
                      VIEW DATASETS ↗
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      rollText={true}
                      arrow={true}
                      onClick={() => handleOpenModal(ps)}
                    >
                      INSPECT SPEC ↗
                    </Button>
                  )}
                </div>
              </NeoCard>
            ))
          )}
        </div>

        {/* Problem Statement Detail Modal */}
        {activeModalPS && (
          <Modal
            isOpen={!!activeModalPS}
            onClose={handleClose}
            title={`${activeModalPS.code} // ${activeModalPS.title}`}
            subtitle={`PROVIDER: ${activeModalPS.sponsor} • TRACK: ${activeModalPS.track}`}
          >
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <TechnicalLabel color="cyan" variant="bracket">
                  // MISSION OVERVIEW & PROBLEM SCOPE
                </TechnicalLabel>
                <p style={{ color: 'var(--white)', fontSize: '0.92rem', lineHeight: '1.65', marginTop: '0.5rem' }}>
                  {activeModalPS.description}
                </p>
              </div>

              {/* Technical Information */}
              <div style={{ marginBottom: '1.5rem', backgroundColor: 'var(--ink)', border: '1px solid var(--line)', padding: '1rem 1.25rem' }}>
                <TechnicalLabel color="acid" variant="bracket">
                  // TECHNICAL SPECIFICATIONS
                </TechnicalLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginTop: '0.75rem' }}>
                  <div style={{ background: 'var(--paper)', padding: '0.5rem 0.75rem', border: '1px solid var(--line)' }}>
                    <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>STATEMENT CODE</div>
                    <div className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--acid)', fontWeight: 800 }}>{activeModalPS.code}</div>
                  </div>
                  <div style={{ background: 'var(--paper)', padding: '0.5rem 0.75rem', border: '1px solid var(--line)' }}>
                    <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>CHALLENGE PROVIDER</div>
                    <div className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--acid)', fontWeight: 800 }}>
                      {activeModalPS.sponsor}
                    </div>
                  </div>
                  <div style={{ background: 'var(--paper)', padding: '0.5rem 0.75rem', border: '1px solid var(--line)' }}>
                    <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>DOMAIN / TRACK</div>
                    <div className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--cyan)', fontWeight: 800 }}>{activeModalPS.track}</div>
                  </div>
                </div>
              </div>

              {/* Key Deliverables */}
              {activeModalPS.deliverables && activeModalPS.deliverables.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <TechnicalLabel color="purple" variant="bracket">
                    // KEY DELIVERABLES
                  </TechnicalLabel>
                  <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {activeModalPS.deliverables.map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--white)' }}>
                        <span style={{ color: 'var(--acid)', fontFamily: 'var(--font-mono)' }}>✦</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Constraints */}
              {activeModalPS.constraints && activeModalPS.constraints.length > 0 && (
                <div style={{ marginBottom: '1.5rem', background: 'var(--ink)', padding: '1rem', border: '1px solid var(--line)' }}>
                  <TechnicalLabel color="acid" variant="bracket">
                    // ARCHITECTURAL CONSTRAINTS
                  </TechnicalLabel>
                  <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {activeModalPS.constraints.map((c, idx) => (
                      <li key={idx} style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
                        ▪ {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--line)', paddingTop: '1.25rem' }}>
                <Button variant="outline" size="md" onClick={handleClose}>
                  CLOSE BRIEF
                </Button>
                {activeModalPS.sponsor === "KD's Garage" && (
                  <Button
                    variant="primary"
                    size="md"
                    rollText={true}
                    arrow={true}
                    onClick={() => {
                      handleClose();
                      onSelectTab('resources');
                    }}
                  >
                    DOWNLOAD DATASET ↗
                  </Button>
                )}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ProblemStatementsPage;
