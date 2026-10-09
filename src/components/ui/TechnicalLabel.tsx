import React from 'react';

export interface TechnicalLabelProps {
  children: React.ReactNode;
  color?: 'cyan' | 'acid' | 'purple' | 'white' | 'muted';
  variant?: 'default' | 'bracket' | 'tag' | 'bullet';
  className?: string;
  style?: React.CSSProperties;
}

export const TechnicalLabel: React.FC<TechnicalLabelProps> = ({
  children,
  color = 'cyan',
  variant = 'default',
  className = '',
  style,
}) => {
  const colorMap = {
    cyan: 'var(--cyan)',
    acid: 'var(--acid)',
    purple: 'var(--purple)',
    white: 'var(--white)',
    muted: 'var(--muted)',
  };

  const selectedColor = colorMap[color];

  return (
    <span
      className={`tech-label ${className}`}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.74rem',
        fontWeight: 700,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: selectedColor,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        ...style,
      }}
    >
      {variant === 'bullet' && <span style={{ color: selectedColor }}>✦</span>}
      {variant === 'bracket' && <span style={{ opacity: 0.6 }}>[</span>}
      {variant === 'tag' && (
        <span
          style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            backgroundColor: selectedColor,
          }}
        />
      )}
      <span>{children}</span>
      {variant === 'bracket' && <span style={{ opacity: 0.6 }}>]</span>}
    </span>
  );
};
