import React, { useState } from 'react';
import { Shield, CheckCircle2, GitBranch, ExternalLink } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { TechnicalLabel } from '../ui/TechnicalLabel';
import { StatusBadge } from '../ui/StatusBadge';

interface JudgeTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JudgeTerminalModal: React.FC<JudgeTerminalModalProps> = ({ isOpen, onClose }) => {
  const [techScore, setTechScore] = useState<number>(28);
  const [innovScore, setInnovScore] = useState<number>(24);
  const [execScore, setExecScore] = useState<number>(23);
  const [docScore, setDocScore] = useState<number>(18);
  const [notes, setNotes] = useState<string>('Impressive eBPF memory ring-buffer handling. Benchmarks verify sub-10ms remediation.');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const totalScore = (techScore + innovScore + execScore + docScore).toFixed(1);

  const handleSubmitEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="JUDGE EVALUATION TERMINAL // BLIND DOCKET"
      subtitle="SESSION: JUDGE-CYP-8821 • PROTOCOL: TRIPLE-BLIND (ZERO IDENTITY DISCLOSURE)"
      maxWidth="840px"
    >
      {isSubmitted ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <CheckCircle2 size={48} color="var(--acid)" style={{ margin: '0 auto 1rem' }} />
          <h3 className="display-title" style={{ fontSize: '1.8rem', color: 'var(--white)' }}>
            EVALUATION DISPATCHED
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: '0.5rem' }}>
            Scorecard cryptographically committed to evaluation matrix. Next blind allocation loading...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmitEvaluation}>
          {/* Top Blind Project Docket Header */}
          <div
            style={{
              backgroundColor: 'var(--ink)',
              border: '2px solid var(--purple)',
              padding: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <TechnicalLabel color="cyan">ALLOCATED BLIND PROJECT:</TechnicalLabel>
              <StatusBadge status="BLIND EVALUATION ACTIVE" variant="purple" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span className="font-display" style={{ fontSize: '1.6rem', color: 'var(--white)' }}>
                PROJECT-AEGIS-PRIME
              </span>
              <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--acid)', padding: '0.15rem 0.45rem', background: 'var(--paper)' }}>
                PS-01: CYBERSECURITY
              </span>
            </div>

            <p style={{ color: 'var(--muted)', fontSize: '0.82rem', lineHeight: '1.5' }}>
              Autonomous multi-agent threat neutralization engine utilizing Linux eBPF probes for zero-day memory anomaly remediation.
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--line)' }}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--cyan)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}
              >
                <GitBranch size={13} />
                <span>INSPECT BLIND REPO REVISION (SHA-256)</span>
              </a>
              <span style={{ color: 'var(--line)' }}>|</span>
              <a
                href="https://demo.dev"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--acid)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}
              >
                <ExternalLink size={13} />
                <span>OPEN LIVE STAGING DEMO</span>
              </a>
            </div>
          </div>

          {/* Scoring Sliders Matrix */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <TechnicalLabel color="white" variant="bracket">
                // SCORING RUBRIC CONTROLS
              </TechnicalLabel>
              <div className="font-mono" style={{ fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--muted)' }}>COMPOSITE SCORE: </span>
                <span className="font-display" style={{ fontSize: '1.6rem', color: 'var(--acid)', marginLeft: '0.35rem' }}>
                  {totalScore} / 100
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Technical Architecture */}
              <div style={{ background: 'var(--ink)', padding: '1rem', border: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--white)' }}>
                    1. Technical Architecture & Systems Engineering (Max 30)
                  </span>
                  <span className="font-mono" style={{ color: 'var(--acid)', fontWeight: 800 }}>
                    {techScore} / 30
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="0.5"
                  value={techScore}
                  onChange={(e) => setTechScore(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--acid)' }}
                />
              </div>

              {/* Innovation */}
              <div style={{ background: 'var(--ink)', padding: '1rem', border: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--white)' }}>
                    2. Innovation & Problem Solving Rigor (Max 25)
                  </span>
                  <span className="font-mono" style={{ color: 'var(--cyan)', fontWeight: 800 }}>
                    {innovScore} / 25
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="0.5"
                  value={innovScore}
                  onChange={(e) => setInnovScore(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--cyan)' }}
                />
              </div>

              {/* Execution */}
              <div style={{ background: 'var(--ink)', padding: '1rem', border: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--white)' }}>
                    3. Prototype Execution & Live Stability (Max 25)
                  </span>
                  <span className="font-mono" style={{ color: 'var(--purple)', fontWeight: 800 }}>
                    {execScore} / 25
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="0.5"
                  value={execScore}
                  onChange={(e) => setExecScore(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--purple)' }}
                />
              </div>

              {/* Documentation */}
              <div style={{ background: 'var(--ink)', padding: '1rem', border: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--white)' }}>
                    4. Documentation & Reproducibility (Max 20)
                  </span>
                  <span className="font-mono" style={{ color: 'var(--white)', fontWeight: 800 }}>
                    {docScore} / 20
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="0.5"
                  value={docScore}
                  onChange={(e) => setDocScore(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--white)' }}
                />
              </div>
            </div>
          </div>

          {/* Qualitative Notes */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="font-mono" style={{ display: 'block', fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.4rem' }}>
              JUDGE SYNTHESIS REMARKS & CRITICAL FEEDBACK:
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'var(--ink)',
                border: '1px solid var(--line)',
                color: 'var(--white)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--line)', paddingTop: '1.25rem' }}>
            <Button variant="outline" size="md" type="button" onClick={onClose}>
              CANCEL
            </Button>
            <Button variant="primary" size="md" type="submit" rollText={true} arrow={true}>
              COMMIT BLIND ASSESSMENT ↗
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
