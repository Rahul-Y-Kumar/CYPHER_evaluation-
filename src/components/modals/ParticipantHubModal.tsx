import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { TechnicalLabel } from '../ui/TechnicalLabel';
import { StatusBadge } from '../ui/StatusBadge';

interface ParticipantHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToSubmit: () => void;
}

export const ParticipantHubModal: React.FC<ParticipantHubModalProps> = ({
  isOpen,
  onClose,
  onGoToSubmit,
}) => {
  const [submissionQuery, setSubmissionQuery] = useState('CYP-1047');
  const [hasSearched, setHasSearched] = useState(true);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="PARTICIPANT DASHBOARD // SUBMISSION TERMINAL"
      subtitle="CHECK STATUS • VERIFY REPO COMMIT SNAPSHOTS • ACCESS ROUND 02 RESULTS"
      maxWidth="780px"
    >
      <div>
        {/* Search Bar */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <input
            type="text"
            value={submissionQuery}
            onChange={(e) => setSubmissionQuery(e.target.value)}
            placeholder="Enter Submission ID (e.g. CYP-1047) or Lead Email..."
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              background: 'var(--ink)',
              border: '2px solid var(--line)',
              color: 'var(--white)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
          <Button variant="primary" size="md" onClick={() => setHasSearched(true)}>
            LOOKUP
          </Button>
        </div>

        {hasSearched && (
          <div>
            {/* Status Summary Banner */}
            <div
              style={{
                backgroundColor: 'var(--ink)',
                border: '2px solid var(--acid)',
                padding: '1.25rem',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <TechnicalLabel color="acid">
                  SUBMISSION RECORD: {submissionQuery || 'CYP-1047'}
                </TechnicalLabel>
                <StatusBadge status="ROUND 02 QUALIFIED" variant="acid" pulse />
              </div>

              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--white)', marginBottom: '0.35rem' }}>
                Aegis: Autonomous Zero-Day Kernel Interceptor
              </div>

              <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--cyan)' }}>
                BLIND ALIAS: PROJECT-AEGIS-PRIME • SQUAD: 4 MEMBERS • TRACK: CYBERSECURITY
              </div>
            </div>

            {/* Protocol Progression Timeline */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--ink)', border: '1px solid var(--line)', padding: '0.75rem' }}>
                <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>
                  STAGE 01: BLIND SCREENING
                </div>
                <div style={{ color: 'var(--cyan)', fontWeight: 700, fontSize: '0.85rem', marginTop: '0.2rem' }}>
                  ✓ CLEARED (94.2/100)
                </div>
              </div>

              <div style={{ background: 'var(--ink)', border: '1px solid var(--acid)', padding: '0.75rem' }}>
                <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--acid)' }}>
                  STAGE 02: AI SYNTHESIS
                </div>
                <div style={{ color: 'var(--acid)', fontWeight: 700, fontSize: '0.85rem', marginTop: '0.2rem' }}>
                  ● LIVE (RANK #01)
                </div>
              </div>

              <div style={{ background: 'var(--ink)', border: '1px solid var(--line)', padding: '0.75rem' }}>
                <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>
                  STAGE 03: LIVE DEFENSE
                </div>
                <div style={{ color: 'var(--muted)', fontWeight: 700, fontSize: '0.85rem', marginTop: '0.2rem' }}>
                  SCHEDULED (16:30 UTC)
                </div>
              </div>
            </div>

            {/* AI Synthesizer Teaser */}
            <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', padding: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <Sparkles size={14} color="var(--acid)" />
                <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--acid)', fontWeight: 700 }}>
                  AI TELEMETRY SUMMARY
                </span>
              </div>
              <p style={{ color: 'var(--white)', fontSize: '0.82rem', lineHeight: '1.5' }}>
                Automated test verification completed. All 4 benchmark suites passed with 0 test failures. Snapshot SHA-256 confirmed.
              </p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: '1.25rem' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              onGoToSubmit();
            }}
          >
            EDIT / NEW SUBMISSION
          </Button>
          <Button variant="primary" size="sm" onClick={onClose}>
            CLOSE DASHBOARD
          </Button>
        </div>
      </div>
    </Modal>
  );
};
