import React from 'react';

export type StatusType = 
  | 'PENDING'
  | 'SUBMITTED'
  | 'UNDER REVIEW'
  | 'EVALUATED'
  | 'SELECTED'
  | 'ELIMINATED'
  | 'RESULTS PENDING'
  | 'QUALIFIED'
  | 'LIVE NOW'
  | 'COMPLETED';

export interface StatusBadgeProps {
  status?: StatusType | string;
  variant?: 'acid' | 'cyan' | 'purple' | 'danger' | 'dark' | 'outline' | 'auto';
  pulse?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status = 'SUBMITTED',
  variant = 'auto',
  pulse = false,
  className = '',
  style,
}) => {
  // Auto-resolve color styling based on status semantics if variant is 'auto'
  let resolvedVariant = variant;
  if (variant === 'auto') {
    const s = String(status).toUpperCase();
    if (s.includes('SELECTED') || s.includes('QUALIFIED') || s.includes('LIVE') || s.includes('TOP')) {
      resolvedVariant = 'acid';
    } else if (s.includes('EVALUATED') || s.includes('SUBMITTED') || s.includes('COMPLETED')) {
      resolvedVariant = 'cyan';
    } else if (s.includes('UNDER REVIEW') || s.includes('REVIEW')) {
      resolvedVariant = 'purple';
    } else if (s.includes('ELIMINATED')) {
      resolvedVariant = 'danger';
    } else if (s.includes('PENDING') || s.includes('RESULTS PENDING')) {
      resolvedVariant = 'dark';
    } else {
      resolvedVariant = 'cyan';
    }
  }

  const variantStyles: Record<string, { bg: string; color: string; border: string; dot: string }> = {
    acid: {
      bg: 'var(--acid)',
      color: 'var(--ink)',
      border: '2px solid var(--ink)',
      dot: 'var(--ink)',
    },
    cyan: {
      bg: 'var(--cyan)',
      color: 'var(--ink)',
      border: '2px solid var(--ink)',
      dot: 'var(--ink)',
    },
    purple: {
      bg: 'var(--purple)',
      color: 'var(--white)',
      border: '2px solid var(--ink)',
      dot: 'var(--white)',
    },
    danger: {
      bg: 'var(--danger)',
      color: 'var(--white)',
      border: '2px solid var(--ink)',
      dot: 'var(--white)',
    },
    dark: {
      bg: 'var(--ink)',
      color: 'var(--white)',
      border: '2px solid var(--line)',
      dot: 'var(--acid)',
    },
    outline: {
      bg: 'transparent',
      color: 'var(--white)',
      border: '2px solid var(--line)',
      dot: 'var(--cyan)',
    },
  };

  const currentStyle = variantStyles[resolvedVariant] || variantStyles.cyan;

  return (
    <span
      className={`status-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.28rem 0.65rem',
        borderRadius: '0px', // Strictly sharp rectangle
        fontFamily: 'var(--font-mono)',
        fontSize: '0.68rem',
        fontWeight: 800,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        backgroundColor: currentStyle.bg,
        color: currentStyle.color,
        border: currentStyle.border,
        boxShadow: '2px 2px 0 var(--ink)',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {pulse && (
        <span
          style={{
            width: '5px',
            height: '5px',
            backgroundColor: currentStyle.dot,
            animation: 'pulseGlow 1.2s infinite ease-in-out',
            flexShrink: 0,
          }}
        />
      )}
      <span>{status}</span>
    </span>
  );
};
