import React, { useState } from 'react';
import { Shield, Key, Mail, Lock, ArrowRight, Radio } from 'lucide-react';
import { NeoCard } from '../components/ui/NeoCard';
import { TechnicalLabel } from '../components/ui/TechnicalLabel';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import type { NavigationTab } from '../types';

interface JudgeLoginPageProps {
  onLoginSuccess: () => void;
  onSelectTab: (tab: NavigationTab) => void;
}

export const JudgeLoginPage: React.FC<JudgeLoginPageProps> = ({ onLoginSuccess, onSelectTab }) => {
  const [email, setEmail] = useState('judge.lead@cypher4.org');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberSession, setRememberSession] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.25rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '520px' }}>
        {/* Terminal Header Info */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <TechnicalLabel color="cyan" variant="bracket">
            SECURITY LEVEL: JURY CLEARANCE
          </TechnicalLabel>
          <h1 className="display-title" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--white)', marginTop: '0.4rem', marginBottom: '0.5rem' }}>
            JUDGE ACCESS <span style={{ color: 'var(--acid)' }}>TERMINAL</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
            Enter your assigned judge credentials to access blind evaluation dockets and project assessment rubrics.
          </p>
        </div>

        {/* Login Panel Card */}
        <NeoCard
          variant="featured"
          style={{
            border: '2px solid var(--purple)',
            boxShadow: '8px 8px 0 var(--ink)',
            padding: '2.25rem 2rem',
          }}
        >
          {/* Top Status */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '1rem',
              marginBottom: '1.5rem',
              borderBottom: '1px solid var(--line)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={16} color="var(--cyan)" />
              <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--white)', fontWeight: 700 }}>
                PROTOCOL: TRIPLE-BLIND
              </span>
            </div>
            <StatusBadge status="AUTH ONLINE" variant="purple" />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Email Field */}
            <div>
              <label className="font-mono" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.4rem' }}>
                <Mail size={13} color="var(--cyan)" />
                <span>EMAIL ADDRESS *</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="judge@domain.org"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'var(--ink)',
                  border: '2px solid var(--line)',
                  color: 'var(--white)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="font-mono" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.4rem' }}>
                <Lock size={13} color="var(--acid)" />
                <span>SECURITY KEY / PASSWORD *</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'var(--ink)',
                  border: '2px solid var(--line)',
                  color: 'var(--white)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Remember Session & Forgot Password */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--white)', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={(e) => setRememberSession(e.target.checked)}
                  style={{ accentColor: 'var(--acid)', width: '14px', height: '14px' }}
                />
                <span>REMEMBER SESSION</span>
              </label>

              <button
                type="button"
                onClick={() => alert('Judge password reset protocol dispatched to administrator.')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--cyan)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Notice */}
            <div style={{ background: 'var(--ink)', border: '1px solid var(--line)', padding: '0.75rem', fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: 'var(--acid)', fontWeight: 700 }}>✦ PHASE 1 PREVIEW: </span>
              Authentication is simulated for frontend evaluation. Submitting will launch the Judge Terminal Dashboard.
            </div>

            {/* Submit Button */}
            <Button
              variant="primary"
              size="lg"
              type="submit"
              rollText={true}
              arrow={true}
              fullWidth
            >
              ACCESS JUDGE PORTAL ↗
            </Button>
          </form>
        </NeoCard>
      </div>
    </div>
  );
};
