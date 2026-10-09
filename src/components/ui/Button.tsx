import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'cyan' | 'danger' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  rollText?: boolean;
  arrow?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rollText = false,
  arrow = false,
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

  const variantClass = `neo-btn-${variant}`;

  // Check if text ends with arrow or explicitly requested
  const textContent = typeof children === 'string' ? children : '';
  const hasArrowInText = textContent.includes('↗') || arrow;
  const cleanText = textContent ? textContent.replace('↗', '').trim() : '';

  return (
    <button
      className={`neo-btn ${variantClass} ${className}`}
      style={{
        ...sizeStyles[size],
        width: fullWidth ? '100%' : 'auto',
        ...style,
      }}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>
      )}

      {rollText && cleanText ? (
        <span className="btn-roll-wrapper">
          <span className="btn-roll-text">
            <span className="btn-roll-line">{cleanText}</span>
            <span className="btn-roll-line">{cleanText}</span>
          </span>
        </span>
      ) : (
        <span>{children}</span>
      )}

      {hasArrowInText && !textContent.includes('↗') && (
        <span className="btn-arrow-icon">↗</span>
      )}

      {hasArrowInText && textContent.includes('↗') && rollText && (
        <span className="btn-arrow-icon" style={{ marginLeft: '0.25rem' }}>↗</span>
      )}

      {icon && iconPosition === 'right' && (
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>
      )}
    </button>
  );
};
