import React from 'react';

export type NeoCardVariant = 'default' | 'featured' | 'acid' | 'purple' | 'cyan' | 'danger' | 'outlined';

export interface NeoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: NeoCardVariant;
  headerTitle?: string;
  headerTag?: string;
  headerIcon?: React.ReactNode;
  hoverEffect?: boolean;
  className?: string;
}

export const NeoCard: React.FC<NeoCardProps> = ({
  children,
  variant = 'default',
  headerTitle,
  headerTag,
  headerIcon,
  hoverEffect = false,
  className = '',
  style,
  ...props
}) => {
  const variantClass = `neo-card-${variant}`;
  const hoverClass = hoverEffect ? 'brutal-card-hover' : '';

  return (
    <div
      className={`neo-card ${variantClass} ${hoverClass} ${className}`}
      style={{
        ...style,
      }}
      {...props}
    >
      {/* Terminal Titlebar */}
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
                color: variant === 'acid' ? 'var(--acid)' : 'var(--cyan)',
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

      {/* Main Content Body */}
      <div style={{ padding: '1.25rem' }}>{children}</div>
    </div>
  );
};
