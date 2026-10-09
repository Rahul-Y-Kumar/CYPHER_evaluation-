import React, { useState, useEffect } from 'react';
import { Terminal, Radio } from 'lucide-react';

interface BootLoaderProps {
  onComplete: () => void;
  durationMs?: number;
}

const BOOT_STEPS = [
  'CYPHER OS V4.0.8',
  'INITIALIZING SYSTEM...',
  'LOADING COSMIC GRID...',
  'CALIBRATING NETWORK...',
  'LOADING SUBMISSION ENGINE...',
  'LOADING EVALUATION ENGINE...',
  'SYSTEM READY ✦',
];

export const BootLoader: React.FC<BootLoaderProps> = ({
  onComplete,
  durationMs = 2000,
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    const intervalTime = 30;
    const totalSteps = durationMs / intervalTime;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      const currentProgress = Math.min(Math.round((stepCount / totalSteps) * 100), 100);
      setProgress(currentProgress);

      const stepIdx = Math.min(
        Math.floor((currentProgress / 100) * BOOT_STEPS.length),
        BOOT_STEPS.length - 1
      );
      setCurrentStepIndex(stepIdx);

      if (currentProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          onComplete();
        }, 250);
      }
    }, intervalTime);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        clearInterval(timer);
        onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [durationMs, onComplete]);

  // Segmented Bar Calculation (20 segments)
  const totalSegments = 24;
  const filledSegments = Math.round((progress / 100) * totalSegments);
  const segmentString = '|'.repeat(filledSegments) + '.'.repeat(totalSegments - filledSegments);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--ink)',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        fontFamily: 'var(--font-mono)',
        color: 'var(--white)',
        userSelect: 'none',
      }}
    >
      {/* Background Subtle Grid & Scanline */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(to right, rgba(245,244,237,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(245,244,237,0.05) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none',
        }}
      />

      <div
        className="neo-card"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'var(--paper)',
          border: '2px solid var(--acid)',
          boxShadow: '8px 8px 0 var(--ink)',
          padding: '2rem',
        }}
      >
        {/* Terminal Titlebar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid var(--line)',
            paddingBottom: '0.75rem',
            marginBottom: '1.5rem',
            fontSize: '0.75rem',
            color: 'var(--acid)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Terminal size={14} color="var(--acid)" />
            <span style={{ fontWeight: 800 }}>CYPHER OS // BOOTLOADER</span>
          </div>
          <span style={{ color: 'var(--cyan)' }}>[ESC TO SKIP]</span>
        </div>

        {/* Terminal Execution Stream */}
        <div
          style={{
            minHeight: '120px',
            backgroundColor: 'var(--ink)',
            border: '1px solid var(--line)',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            gap: '0.35rem',
            fontSize: '0.8rem',
          }}
        >
          {BOOT_STEPS.slice(0, currentStepIndex + 1).map((step, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                color: idx === currentStepIndex ? 'var(--acid)' : 'var(--muted)',
                fontWeight: idx === currentStepIndex ? 700 : 500,
              }}
            >
              <span style={{ color: 'var(--cyan)' }}>&gt;</span>
              <span>{step}</span>
              {idx === currentStepIndex && <span className="animate-pulse" style={{ color: 'var(--acid)' }}>_</span>}
            </div>
          ))}
        </div>

        {/* Segmented ASCII Progress Counter */}
        <div style={{ marginBottom: '0.6rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
          <span style={{ color: 'var(--muted)' }}>LOADING KERNEL MODULES:</span>
          <span style={{ color: 'var(--acid)', fontWeight: 800 }}>{progress}%</span>
        </div>

        {/* Physical Segmented Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '24px',
            backgroundColor: 'var(--ink)',
            border: '2px solid var(--line)',
            padding: '2px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: 'var(--acid)',
              transition: 'width 0.05s linear',
            }}
          />
        </div>

        <div
          style={{
            marginTop: '0.75rem',
            fontSize: '0.68rem',
            color: 'var(--cyan)',
            letterSpacing: '0.12em',
            textAlign: 'center',
          }}
        >
          [{segmentString}]
        </div>
      </div>
    </div>
  );
};
