import React, { useEffect } from 'react';
import { X, Terminal } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '780px',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'rgba(5, 6, 11, 0.82)',
        backdropFilter: 'blur(10px)',
      }}
      onClick={onClose}
    >
      <div
        className="brutal-card"
        style={{
          width: '100%',
          maxWidth,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--paper)',
          border: '2px solid var(--white)',
          boxShadow: '10px 10px 0 #05060B, 0 0 40px rgba(22, 213, 208, 0.15)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.8rem 1.25rem',
            background: 'var(--ink)',
            borderBottom: '2px solid var(--line-strong)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <span style={{ width: '10px', height: '10px', backgroundColor: '#FF3366', borderRadius: '50%' }} />
              <span style={{ width: '10px', height: '10px', backgroundColor: '#EAFF00', borderRadius: '50%' }} />
              <span style={{ width: '10px', height: '10px', backgroundColor: '#16D5D0', borderRadius: '50%' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={14} color="var(--cyan)" />
              <span
                className="font-mono"
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--white)',
                  letterSpacing: '0.14em',
                }}
              >
                {title}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'transparent',
              border: '1px solid var(--line)',
              color: 'var(--white)',
              cursor: 'pointer',
              padding: '0.25rem 0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.1s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--acid)';
              e.currentTarget.style.color = 'var(--ink)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--white)';
            }}
          >
            <X size={16} />
          </button>
        </div>

        {subtitle && (
          <div
            style={{
              padding: '0.5rem 1.25rem',
              background: 'rgba(22, 213, 208, 0.08)',
              borderBottom: '1px solid var(--line)',
              fontSize: '0.8rem',
              color: 'var(--cyan)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {subtitle}
          </div>
        )}

        {/* Scrollable Content */}
        <div
          style={{
            padding: '1.5rem',
            overflowY: 'auto',
            flex: 1,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
