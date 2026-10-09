import React from 'react';

export type ButtonVariant = 'acid' | 'cyan' | 'purple' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface BrutalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const BrutalButton: React.FC<BrutalButtonProps> = ({
  children,
  variant = 'acid',
  size = 'md',
  icon,
  iconPosition = 'right',
  fullWidth = false,
  className = '',
  style,
  ...props
}) => {
  const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
    sm: { padding: '0.45rem 0.9rem', fontSize: '0.78rem' },
    md: { padding: '0.75rem 1.4rem', fontSize: '0.9rem' },
    lg: { padding: '1rem 2rem', fontSize: '1.05rem', fontWeight: 800 },
  };

  const variantClass = `btn-${variant}`;

  return (
    <button
      className={`btn ${variantClass} ${className}`}
      style={{
        ...sizeStyles[size],
        width: fullWidth ? '100%' : 'auto',
        ...style,
      }}
      {...props}
    >
      {icon && iconPosition === 'left' && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span style={{ display: 'inline-flex' }}>{icon}</span>}
    </button>
  );
};
