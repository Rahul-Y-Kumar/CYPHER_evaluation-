import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { TechnicalLabel } from '../ui/TechnicalLabel';
import { PROBLEM_STATEMENTS } from '../../data/mockData';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [teamName, setTeamName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [track, setTrack] = useState('CyberSecurity');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="SQUAD REGISTRATION // CYPHER 4.0"
      subtitle="JOIN 380+ TEAMS COMPETING FOR $50,000+ IN BOUNTIES"
      maxWidth="620px"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <label className="font-mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.35rem' }}>
              SQUAD / TEAM NAME *
            </label>
            <input
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. CyberVoid Vanguard"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'var(--ink)',
                border: '2px solid var(--line)',
                color: 'var(--white)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label className="font-mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.35rem' }}>
              TEAM LEAD EMAIL *
            </label>
            <input
              type="email"
              required
              value={leadEmail}
              onChange={(e) => setLeadEmail(e.target.value)}
              placeholder="lead@university.edu"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'var(--ink)',
                border: '2px solid var(--line)',
                color: 'var(--white)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label className="font-mono" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.35rem' }}>
              PRIMARY TRACK PREFERENCE
            </label>
            <select
              value={track}
              onChange={(e) => setTrack(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'var(--ink)',
                border: '2px solid var(--line)',
                color: 'var(--white)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            >
              {PROBLEM_STATEMENTS.map((ps) => (
                <option key={ps.id} value={ps.track}>
                  {ps.track} ({ps.code} - {ps.bounty})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ background: 'var(--ink)', border: '1px solid var(--line)', padding: '0.85rem', marginBottom: '1.5rem', fontSize: '0.78rem', color: 'var(--muted)' }}>
          <TechnicalLabel color="cyan" variant="tag">PROTOCOL NOTE:</TechnicalLabel>
          <span style={{ marginLeft: '0.4rem' }}>
            Registration immediately assigns your squad a cryptographic key for submitting code artifacts into the blind evaluation pipeline.
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--line)', paddingTop: '1.25rem' }}>
          <Button variant="outline" size="md" type="button" onClick={onClose}>
            CANCEL
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            rollText={true}
            arrow={true}
          >
            ENTER SUBMISSION TERMINAL ↗
          </Button>
        </div>
      </form>
    </Modal>
  );
};
