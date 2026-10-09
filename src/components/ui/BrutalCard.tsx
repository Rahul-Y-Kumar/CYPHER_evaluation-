import React from 'react';

interface BrutalCardProps {
  children: React.ReactNode;
  variant?: 'paper' | 'ink' | 'acid' | 'cyan';
  hoverEffect?: boolean;
  headerTitle?: string;
  headerTag?: string;
  headerIcon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const BrutalCard: React.FC<BrutalCardProps> = ({
  children,
  variant = 'paper',
  hoverEffect = false,
  headerTitle,
  headerTag,
  headerIcon,
  className = '',
  style,
  onClick,
}) => {
  const bgClass =
    variant === 'ink'
      ? 'brutal-card-ink'
      : variant === 'acid'
      ? 'brutal-card-acid'
      : 'brutal-card';

  const hoverClass = hoverEffect ? 'brutal-card-hover' : '';

  return (
    <div
      className={`${bgClass} ${hoverClass} ${className}`}
      style={{
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      onClick={onClick}
    >
      {/* Optional Terminal Titlebar */}
      {(headerTitle || headerTag) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.6rem 1rem',
            background: 'var(--ink)',
            borderBottom: '2px solid var(--line)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            letterSpacing: '0.12em',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--white)' }}>
            {headerIcon}
            <span style={{ fontWeight: 700, textTransform: 'uppercase' }}>{headerTitle}</span>
          </div>
          {headerTag && (
            <span
              style={{
                color: 'var(--cyan)',
                fontSize: '0.68rem',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              {headerTag}
            </span>
          )}
        </div>
      )}

      {/* Content Container */}
      <div style={{ padding: '1.25rem' }}>{children}</div>
    </div>
  );
};
