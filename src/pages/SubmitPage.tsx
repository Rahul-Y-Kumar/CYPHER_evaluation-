import React, { useState, useEffect } from 'react';
import { 
  UploadCloud, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Globe, 
  Video, 
  FileText, 
  Copy, 
  CheckCheck, 
  GitBranch,
  Cpu,
  Layers,
  Award,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '../components/ui/Button';
import { NeoCard } from '../components/ui/NeoCard';
import { TechnicalLabel } from '../components/ui/TechnicalLabel';
import { StatusBadge } from '../components/ui/StatusBadge';
import { CompetitionService } from '../services/competitionService';
import { ProblemStatementService } from '../services/problemStatementService';
import { SubmissionService } from '../services/submissionService';
import type { CompetitionTypeRecord, ProblemStatementRecord, SubmissionRecord } from '../backend/types';
import type { NavigationTab } from '../types';

interface SubmitPageProps {
  initialCompetitionCode?: string;
  initialProblemCode?: string;
  onSelectTab: (tab: NavigationTab) => void;
}

export const SubmitPage: React.FC<SubmitPageProps> = ({ 
  initialCompetitionCode = 'HACKATHON',
  initialProblemCode, 
  onSelectTab 
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [copiedId, setCopiedId] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Dynamic database data
  const [competitionTypes, setCompetitionTypes] = useState<CompetitionTypeRecord[]>([]);
  const [selectedCompCode, setSelectedCompCode] = useState<string>(initialCompetitionCode);
  const [availablePSList, setAvailablePSList] = useState<ProblemStatementRecord[]>([]);

  // Load Active Competition Types on mount
  useEffect(() => {
    const comps = CompetitionService.getActiveCompetitions();
    setCompetitionTypes(comps);
    if (comps.length > 0 && !comps.some(c => c.code === selectedCompCode)) {
      setSelectedCompCode(comps[0].code);
    }
  }, []);

  // Load Active Problem Statements for selected competition dynamically
  useEffect(() => {
    if (!selectedCompCode) return;
    const psList = ProblemStatementService.getByCompetition(selectedCompCode, true);
    setAvailablePSList(psList);

    // Update selected competition type ID and problem statement ID
    const currentComp = competitionTypes.find(c => c.code === selectedCompCode);
    const compId = currentComp ? currentComp.id : (psList[0]?.competition_type_id || '');

    if (psList.length > 0) {
      const matchInitial = psList.find(p => p.code === initialProblemCode);
      const chosen = matchInitial ? matchInitial.id : psList[0].id;
      setFormData(prev => ({
        ...prev,
        competition_type_id: compId,
        problem_statement_id: chosen,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        competition_type_id: compId,
        problem_statement_id: '',
      }));
    }
  }, [selectedCompCode, competitionTypes, initialProblemCode]);

  // Form State
  const [formData, setFormData] = useState({
    teamName: '',
    teamLead: '',
    email: '',
    organization: '',
    membersCount: 4,
    competition_type_id: '',
    problem_statement_id: '',
    projectTitle: '',
    tagline: '',
    description: '',
    techStackInput: 'Rust, eBPF, React, WebSockets',
    githubUrl: '',
    deployUrl: '',
    demoVideoUrl: '',
    fileName: '',
    fileSize: '',
  });

  const [simulatedFile, setSimulatedFile] = useState<{ name: string; size: string } | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<SubmissionRecord | null>(null);

  // Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Simulated File Drop / Selection
  const handleSimulateFileUpload = (fileName: string, fileSize: string) => {
    setSimulatedFile({ name: fileName, size: fileSize });
    setFormData((prev) => ({ ...prev, fileName, fileSize }));
  };

  // Final Submit Handler with Complete Backend Validation
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    try {
      const created = SubmissionService.createSubmission({
        competition_type_id: formData.competition_type_id,
        problem_statement_id: formData.problem_statement_id,
        team_name: formData.teamName || 'Squad Nebula',
        team_lead_name: formData.teamLead || 'Alex Chen',
        team_lead_email: formData.email || 'lead@nebula.io',
        members_count: formData.membersCount,
        project_title: formData.projectTitle || 'Autonomous Kernel Threat Interceptor',
        tagline: formData.tagline || 'Deterministic sub-10ms eBPF remediation for cloud clusters',
        description: formData.description || 'Full architecture utilizing eBPF probes for zero-day memory anomaly isolation.',
        tech_stack: formData.techStackInput.split(',').map((s) => s.trim()),
        github_url: formData.githubUrl || 'https://github.com/cypher-squad/aegis-interceptor',
        deploy_url: formData.deployUrl || 'https://aegis-demo.cypher.dev',
        demo_video_url: formData.demoVideoUrl || 'https://youtu.be/cypher4demo',
        file_name: simulatedFile?.name || formData.fileName || 'CYPHER_AEGIS_ARCHITECTURE.pdf',
        file_size: simulatedFile?.size || formData.fileSize || '14.2 MB',
        ai_summary: {
          summary: 'High-leverage systems project combining low-level kernel telemetry with decentralized threat consensus.',
          technicalComplexityScore: 94,
          keyHighlights: [
            'Direct ring-buffer integration without userspace round-trips',
            'Automated SHA-256 Merkle audit trail for every intercepted event',
          ],
          riskAnalysis: 'Low risk. Public repo verified, dependencies free of known CVEs.',
        },
      });

      setSubmittedRecord(created);
      setCurrentStep(5); // Step 5: Final Confirmation

      // Confetti celebration
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#EAFF00', '#16D5D0', '#7B28BD', '#F5F4ED'],
        });
      } catch {
        // Safe fallback
      }
    } catch (err: any) {
      setSubmissionError(err.message || 'Failed to submit project. Please verify competition and problem statement.');
    }
  };

  const handleCopySubmissionId = () => {
    if (!submittedRecord) return;
    navigator.clipboard.writeText(submittedRecord.submission_code);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const selectedPS = availablePSList.find((p) => p.id === formData.problem_statement_id) || availablePSList[0];
  const selectedComp = competitionTypes.find((c) => c.code === selectedCompCode) || competitionTypes[0];

  return (
    <div style={{ position: 'relative', zIndex: 1, paddingTop: '3rem', paddingBottom: '6rem' }}>
      <div className="container-custom" style={{ maxWidth: '960px' }}>
        {/* Header Terminal Info */}
        <div style={{ marginBottom: '2.5rem' }}>
          <TechnicalLabel color="cyan" variant="bracket">
            02 // PARTICIPANT SUBMISSION PROTOCOL
          </TechnicalLabel>
          <h1 className="display-hero" style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)', color: 'var(--white)', marginBottom: '0.75rem', marginTop: '0.35rem' }}>
            SUBMIT YOUR <span style={{ color: 'var(--acid)' }}>BUILD</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
            4-Step Submission Flow: Select Competition → Select Problem Statement → Enter Details → Submit.
          </p>
        </div>

        {/* 4-Step Indicator Bar */}
        {currentStep <= 4 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.5rem',
              marginBottom: '2.5rem',
              backgroundColor: 'var(--ink)',
              padding: '0.65rem',
              border: '2px solid var(--line)',
            }}
          >
            {[
              { step: 1, label: 'SELECT COMPETITION' },
              { step: 2, label: 'PROBLEM STATEMENT' },
              { step: 3, label: 'PROJECT DETAILS' },
              { step: 4, label: 'REVIEW & SUBMIT' },
            ].map((item) => {
              const isDone = currentStep > item.step;
              const isCurrent = currentStep === item.step;
              return (
                <div
                  key={item.step}
                  style={{
                    padding: '0.65rem 0.4rem',
                    textAlign: 'center',
                    background: isCurrent ? 'var(--acid)' : isDone ? 'var(--paper)' : 'transparent',
                    color: isCurrent ? 'var(--ink)' : isDone ? 'var(--cyan)' : 'var(--muted)',
                    border: isCurrent ? '2px solid var(--ink)' : isDone ? '1px solid var(--cyan)' : '1px solid transparent',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.2rem',
                  }}
                >
                  <span>{isDone ? `✓ STEP 0${item.step}` : `STEP 0${item.step}`}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* =========================================================================
            STEP 1: SELECT COMPETITION (HACKATHON / IDEATHON)
            ========================================================================= */}
        {currentStep === 1 && (
          <NeoCard variant="default" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--line)', paddingBottom: '1rem' }}>
              <div>
                <TechnicalLabel color="cyan">STEP 01 OF 04</TechnicalLabel>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--white)', marginTop: '0.2rem' }}>
                  Select Competition Category
                </h3>
              </div>
              <StatusBadge status="ACTIVE TRACKS" variant="acid" />
            </div>

            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Choose which track your squad is competing in. The competition type determines available problem statements and the Round 1 Leaderboard.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              {competitionTypes.map((comp) => {
                const isSelected = selectedCompCode === comp.code;
                return (
                  <div
                    key={comp.id}
                    onClick={() => {
                      setSelectedCompCode(comp.code);
                      setFormData(prev => ({ ...prev, competition_type_id: comp.id }));
                    }}
                    style={{
                      padding: '1.5rem',
                      background: isSelected ? 'var(--ink)' : 'var(--paper)',
                      border: isSelected ? '3px solid var(--acid)' : '2px solid var(--line)',
                      boxShadow: isSelected ? '6px 6px 0 var(--acid)' : '2px 2px 0 var(--ink)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Award size={22} color={isSelected ? 'var(--acid)' : 'var(--cyan)'} />
                        <span className="font-display" style={{ fontSize: '1.5rem', color: isSelected ? 'var(--acid)' : 'var(--white)' }}>
                          {comp.code}
                        </span>
                      </div>
                      <StatusBadge status={isSelected ? 'SELECTED' : 'ACTIVE'} variant={isSelected ? 'acid' : 'outline'} />
                    </div>

                    <h4 style={{ color: 'var(--white)', marginBottom: '0.5rem', fontSize: '1rem' }}>{comp.name}</h4>
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                      {comp.description || (comp.code === 'HACKATHON' ? 'End-to-end software implementations, functional prototypes, and code repositories.' : 'Design briefs, systems architecture, pitch decks, and technical research proposals.')}
                    </p>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--line)', paddingTop: '1.5rem' }}>
              <Button
                variant="primary"
                size="md"
                onClick={() => setCurrentStep(2)}
                icon={<ArrowRight size={16} />}
              >
                PROCEED TO PROBLEM STATEMENT
              </Button>
            </div>
          </NeoCard>
        )}

        {/* =========================================================================
            STEP 2: SELECT PROBLEM STATEMENT (FILTERED BY SELECTED COMPETITION)
            ========================================================================= */}
        {currentStep === 2 && (
          <NeoCard variant="default" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--line)', paddingBottom: '1rem' }}>
              <div>
                <TechnicalLabel color="cyan">STEP 02 OF 04</TechnicalLabel>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--white)', marginTop: '0.2rem' }}>
                  Select {selectedCompCode} Problem Statement
                </h3>
              </div>
              <StatusBadge status={`${availablePSList.length} ACTIVE PS`} variant="acid" />
            </div>

            <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', background: 'var(--ink)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                CURRENT TRACK: <strong style={{ color: 'var(--acid)' }}>{selectedCompCode}</strong>
              </span>
              <button
                onClick={() => setCurrentStep(1)}
                style={{ background: 'none', border: 'none', color: 'var(--cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                CHANGE COMPETITION
              </button>
            </div>

            {availablePSList.length === 0 ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', background: 'var(--ink)', border: '1px dashed var(--line)', marginBottom: '1.5rem' }}>
                <p className="font-mono" style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                  No active problem statements currently available for {selectedCompCode}.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.85rem', marginBottom: '2rem' }}>
                {availablePSList.map((ps) => {
                  const isSelected = formData.problem_statement_id === ps.id;
                  return (
                    <div
                      key={ps.id}
                      onClick={() => setFormData((prev) => ({
                        ...prev,
                        competition_type_id: ps.competition_type_id,
                        problem_statement_id: ps.id,
                      }))}
                      style={{
                        padding: '1.25rem',
                        background: isSelected ? 'var(--ink)' : 'var(--paper)',
                        border: isSelected ? '2px solid var(--acid)' : '2px solid var(--line)',
                        boxShadow: isSelected ? '4px 4px 0 var(--acid)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.12s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span
                            className="font-mono"
                            style={{
                              padding: '0.2rem 0.55rem',
                              background: isSelected ? 'var(--acid)' : 'var(--ink)',
                              color: isSelected ? 'var(--ink)' : 'var(--acid)',
                              fontWeight: 800,
                              fontSize: '0.8rem',
                              border: '1px solid var(--line)',
                            }}
                          >
                            {ps.code}
                          </span>
                          <span style={{ fontWeight: 800, color: 'var(--white)', fontSize: '1.05rem' }}>
                            {ps.title}
                          </span>
                        </div>
                        {ps.category && (
                          <span className="font-mono" style={{ color: 'var(--cyan)', fontSize: '0.72rem' }}>
                            [{ps.category}]
                          </span>
                        )}
                      </div>

                      <p style={{ color: 'var(--muted)', fontSize: '0.82rem', lineHeight: '1.5' }}>
                        {ps.short_description || ps.description.slice(0, 160) + '...'}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: '1.5rem' }}>
              <Button variant="outline" size="md" onClick={() => setCurrentStep(1)} icon={<ArrowLeft size={16} />} iconPosition="left">
                BACK
              </Button>
              <Button 
                variant="primary" 
                size="md" 
                onClick={() => setCurrentStep(3)} 
                icon={<ArrowRight size={16} />}
                disabled={!formData.problem_statement_id}
              >
                PROCEED TO PROJECT DETAILS
              </Button>
            </div>
          </NeoCard>
        )}

        {/* =========================================================================
            STEP 3: ENTER PROJECT DETAILS
            ========================================================================= */}
        {currentStep === 3 && (
          <NeoCard variant="default" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--line)', paddingBottom: '1rem' }}>
              <div>
                <TechnicalLabel color="cyan">STEP 03 OF 04</TechnicalLabel>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--white)', marginTop: '0.2rem' }}>
                  Project Credentials & Repository
                </h3>
              </div>
              <StatusBadge status="SPECIFICATION" variant="acid" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
              {/* Squad info */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <label className="font-mono" style={{ display: 'block', fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                    SQUAD / TEAM NAME *
                  </label>
                  <input
                    type="text"
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleInputChange}
                    placeholder="e.g. Squad Nebula"
                    style={{ width: '100%', padding: '0.7rem 0.85rem', background: 'var(--ink)', border: '2px solid var(--line)', color: 'var(--white)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label className="font-mono" style={{ display: 'block', fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                    TEAM LEAD FULL NAME *
                  </label>
                  <input
                    type="text"
                    name="teamLead"
                    value={formData.teamLead}
                    onChange={handleInputChange}
                    placeholder="e.g. Alex Chen"
                    style={{ width: '100%', padding: '0.7rem 0.85rem', background: 'var(--ink)', border: '2px solid var(--line)', color: 'var(--white)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label className="font-mono" style={{ display: 'block', fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                    TEAM LEAD EMAIL *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. alex@cypher.dev"
                    style={{ width: '100%', padding: '0.7rem 0.85rem', background: 'var(--ink)', border: '2px solid var(--line)', color: 'var(--white)', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Project title & elevator tagline */}
              <div>
                <label className="font-mono" style={{ display: 'block', fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                  PROJECT TITLE *
                </label>
                <input
                  type="text"
                  name="projectTitle"
                  value={formData.projectTitle}
                  onChange={handleInputChange}
                  placeholder="e.g. Aegis: Autonomous Zero-Day Kernel Interceptor"
                  style={{ width: '100%', padding: '0.7rem 0.85rem', background: 'var(--ink)', border: '2px solid var(--line)', color: 'var(--white)', outline: 'none' }}
                />
              </div>

              <div>
                <label className="font-mono" style={{ display: 'block', fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                  ELEVATOR TAGLINE (ONE SENTENCE)
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleInputChange}
                  placeholder="e.g. Deterministic sub-10ms eBPF remediation for cloud clusters."
                  style={{ width: '100%', padding: '0.7rem 0.85rem', background: 'var(--ink)', border: '2px solid var(--line)', color: 'var(--white)', outline: 'none' }}
                />
              </div>

              {/* Tech stack & URLs */}
              <div>
                <label className="font-mono" style={{ display: 'block', fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                  TECH STACK (COMMA SEPARATED)
                </label>
                <input
                  type="text"
                  name="techStackInput"
                  value={formData.techStackInput}
                  onChange={handleInputChange}
                  placeholder="Rust, eBPF, Tokio, React, WebSockets"
                  style={{ width: '100%', padding: '0.7rem 0.85rem', background: 'var(--ink)', border: '2px solid var(--line)', color: 'var(--white)', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <label className="font-mono" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                    <GitBranch size={13} color="var(--cyan)" />
                    <span>GITHUB / REPO URL *</span>
                  </label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    placeholder="https://github.com/cypher-squad/aegis"
                    style={{ width: '100%', padding: '0.7rem 0.85rem', background: 'var(--ink)', border: '2px solid var(--line)', color: 'var(--white)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label className="font-mono" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                    <Globe size={13} color="var(--acid)" />
                    <span>LIVE DEMO URL</span>
                  </label>
                  <input
                    type="url"
                    name="deployUrl"
                    value={formData.deployUrl}
                    onChange={handleInputChange}
                    placeholder="https://aegis-demo.cypher.dev"
                    style={{ width: '100%', padding: '0.7rem 0.85rem', background: 'var(--ink)', border: '2px solid var(--line)', color: 'var(--white)', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-mono" style={{ display: 'block', fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                  DETAILED ARCHITECTURE & METHODOLOGY *
                </label>
                <textarea
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Explain system architecture, technical constraints addressed, and testing instructions..."
                  style={{ width: '100%', padding: '0.7rem 0.85rem', background: 'var(--ink)', border: '2px solid var(--line)', color: 'var(--white)', outline: 'none', lineHeight: '1.5' }}
                />
              </div>

              {/* Pitch Deck / Assets Upload */}
              <div>
                <label className="font-mono" style={{ display: 'block', fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                  PITCH DECK / ARCHITECTURE FILE (.PDF, .ZIP)
                </label>
                <div
                  onClick={() => handleSimulateFileUpload('CYPHER4_PROJECT_PITCH.pdf', '12.4 MB')}
                  style={{
                    border: '2px dashed var(--cyan)',
                    padding: '1.5rem',
                    textAlign: 'center',
                    background: 'var(--ink)',
                    cursor: 'pointer',
                  }}
                >
                  <UploadCloud size={32} color="var(--acid)" style={{ margin: '0 auto 0.5rem' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--white)' }}>
                    {simulatedFile ? `${simulatedFile.name} (${simulatedFile.size})` : 'Click to attach project documentation archive'}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: '1.5rem' }}>
              <Button variant="outline" size="md" onClick={() => setCurrentStep(2)} icon={<ArrowLeft size={16} />} iconPosition="left">
                BACK
              </Button>
              <Button variant="primary" size="md" onClick={() => setCurrentStep(4)} icon={<ArrowRight size={16} />}>
                PROCEED TO REVIEW & SUBMIT
              </Button>
            </div>
          </NeoCard>
        )}

        {/* =========================================================================
            STEP 4: REVIEW & SUBMIT
            ========================================================================= */}
        {currentStep === 4 && (
          <NeoCard variant="featured" style={{ padding: '2rem', border: '2px solid var(--acid)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--line)', paddingBottom: '1rem' }}>
              <div>
                <TechnicalLabel color="cyan">STEP 04 OF 04</TechnicalLabel>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--white)', marginTop: '0.2rem' }}>
                  Review & Final Submission
                </h3>
              </div>
              <StatusBadge status="READY TO DISPATCH" variant="acid" pulse />
            </div>

            {submissionError && (
              <div style={{ backgroundColor: 'rgba(255, 51, 102, 0.15)', border: '2px solid var(--danger)', padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--white)' }}>
                <AlertCircle size={18} color="var(--danger)" />
                <span className="font-mono" style={{ fontSize: '0.82rem' }}>{submissionError}</span>
              </div>
            )}

            {/* Verification Summary Docket */}
            <div style={{ background: 'var(--ink)', border: '2px solid var(--line)', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--cyan)', marginBottom: '1rem' }}>
                // SUBMISSION AUDIT MANIFEST
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>COMPETITION TRACK</div>
                  <div className="font-mono" style={{ fontSize: '1.1rem', color: 'var(--acid)', fontWeight: 800 }}>{selectedCompCode}</div>
                </div>

                <div>
                  <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>PROBLEM STATEMENT</div>
                  <div className="font-mono" style={{ fontSize: '1.1rem', color: 'var(--cyan)', fontWeight: 800 }}>
                    {selectedPS ? `${selectedPS.code}` : 'NOT SELECTED'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--white)' }}>{selectedPS ? selectedPS.title : ''}</div>
                </div>

                <div>
                  <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>SQUAD</div>
                  <div style={{ fontSize: '1rem', color: 'var(--white)', fontWeight: 700 }}>
                    {formData.teamName || 'Squad Nebula'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Lead: {formData.teamLead || 'Alex Chen'}</div>
                </div>

                <div>
                  <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>PROJECT TITLE</div>
                  <div style={{ fontSize: '1rem', color: 'var(--white)', fontWeight: 700 }}>
                    {formData.projectTitle || 'Autonomous Kernel Threat Interceptor'}
                  </div>
                </div>
              </div>
            </div>

            {/* Immutability Notice */}
            <div style={{ background: 'rgba(234, 255, 0, 0.05)', border: '1px dashed var(--acid)', padding: '0.85rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.78rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
              ⚡ <strong>IMMUTABILITY ENFORCEMENT:</strong> Once dispatched, competition track and problem statement are locked and cannot be edited by participants.
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: '1.5rem' }}>
              <Button variant="outline" size="md" onClick={() => setCurrentStep(3)} icon={<ArrowLeft size={16} />} iconPosition="left">
                BACK
              </Button>
              <Button
                variant="primary"
                size="lg"
                rollText={true}
                arrow={true}
                onClick={handleFinalSubmit}
              >
                CONFIRM & DISPATCH SUBMISSION ↗
              </Button>
            </div>
          </NeoCard>
        )}

        {/* =========================================================================
            FINAL CONFIRMATION DOCKET (STEP 5)
            ========================================================================= */}
        {currentStep === 5 && submittedRecord && (
          <NeoCard
            variant="acid"
            style={{
              padding: '2.5rem 2rem',
              textAlign: 'center',
            }}
          >
            <div style={{ width: '60px', height: '60px', backgroundColor: 'var(--ink)', margin: '0 auto 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--ink)' }}>
              <CheckCheck size={36} color="var(--acid)" />
            </div>

            <TechnicalLabel color="muted" variant="bullet" style={{ color: 'var(--ink)' }}>
              SUBMISSION RECORD PERSISTED IN DATABASE
            </TechnicalLabel>

            <h2 className="display-title" style={{ color: 'var(--ink)', marginTop: '0.35rem', marginBottom: '1.25rem' }}>
              PROJECT REGISTERED SUCCESSFULLY
            </h2>

            {/* Submission ID Box */}
            <div
              style={{
                maxWidth: '520px',
                margin: '0 auto 2rem',
                backgroundColor: 'var(--ink)',
                border: '3px solid var(--ink)',
                boxShadow: '6px 6px 0 var(--ink)',
                padding: '1.75rem',
              }}
            >
              <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                SUBMISSION IDENTIFIER
              </div>
              <div
                className="font-display"
                style={{
                  fontSize: 'clamp(2.8rem, 6.5vw, 4rem)',
                  color: 'var(--acid)',
                  letterSpacing: '0.06em',
                }}
              >
                {submittedRecord.submission_code}
              </div>

              {/* Confirmation Details Matrix */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.25rem', textAlign: 'left', borderTop: '1px solid var(--line)', paddingTop: '1rem' }}>
                <div>
                  <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>TEAM</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--white)', fontWeight: 700 }}>{submittedRecord.team_name}</div>
                </div>

                <div>
                  <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>PROJECT</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--white)', fontWeight: 700 }}>{submittedRecord.project_title}</div>
                </div>

                <div>
                  <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>COMPETITION</div>
                  <div className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--acid)', fontWeight: 800 }}>
                    {selectedComp?.name || selectedCompCode}
                  </div>
                </div>

                <div>
                  <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>STATUS</div>
                  <StatusBadge status={submittedRecord.status} variant="acid" />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>PROBLEM STATEMENT</div>
                  <div className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--cyan)', fontWeight: 800 }}>
                    {selectedPS ? `${selectedPS.code} — ${selectedPS.title}` : 'ASSIGNED'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.25rem' }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopySubmissionId}
                  icon={copiedId ? <Check size={14} /> : <Copy size={14} />}
                >
                  {copiedId ? 'COPIED TO CLIPBOARD' : 'COPY SUBMISSION ID'}
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Button
                variant="secondary"
                size="md"
                onClick={() => onSelectTab('results')}
                icon={<ArrowRight size={16} />}
              >
                VIEW {selectedCompCode} LEADERBOARD
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() => onSelectTab('home')}
              >
                RETURN HOME
              </Button>
            </div>
          </NeoCard>
        )}
      </div>
    </div>
  );
};
