import React from 'react';

interface CosmicGridProps {
  density?: 'normal' | 'dense';
  showScanlines?: boolean;
}

export const CosmicGrid: React.FC<CosmicGridProps> = ({
  density = 'normal',
  showScanlines = true,
}) => {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* Background Cosmic Deep Gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 70% 50% at 50% -10%, rgba(123, 40, 189, 0.22), transparent 75%),
            radial-gradient(ellipse 55% 45% at 100% 50%, rgba(22, 213, 208, 0.12), transparent 60%),
            radial-gradient(ellipse 65% 55% at 0% 100%, rgba(234, 255, 0, 0.05), transparent 70%),
            var(--bg-dark)
          `,
        }}
      />

      {/* Technical Grid Pattern */}
      <div
        className={density === 'dense' ? 'cosmic-grid-dense' : 'cosmic-grid-pattern'}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.85,
          maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 95%)',
        }}
      />

      {/* Retro-Futuristic Terminal Scanline Accent */}
      {showScanlines && (
        <div className="scanline-overlay">
          <div className="scanline-bar" />
        </div>
      )}
    </div>
  );
};
