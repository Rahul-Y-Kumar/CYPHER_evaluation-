import React from 'react';

export type BadgeVariant = 'acid' | 'cyan' | 'purple' | 'dark' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  pulse?: boolean;
  className?: string;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  pulse = false,
  className = '',
  icon,
  style,
}) => {
  const variantClass = `brutal-badge brutal-badge-${variant}`;

  return (
    <span
      className={`${variantClass} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        ...style,
      }}
    >
      {pulse && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: variant === 'acid' ? 'var(--ink)' : 'var(--acid)',
            animation: 'pulseGlow 1.5s infinite ease-in-out',
          }}
        />
      )}
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
