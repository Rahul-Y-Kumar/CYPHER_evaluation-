import React from 'react';

interface LiveTickerProps {
  items?: string[];
  speedSeconds?: number;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  className?: string;
}

const DEFAULT_TICKER_ITEMS = [
  '✦ CYPHER 4.0',
  '✦ BUILD',
  '✦ INNOVATE',
  '✦ COMPETE',
  '✦ SHIP',
  '✦ CREATE',
  '✦ CYPHER 4.0',
  '✦ 7 TRACKS ACTIVE',
  '✦ IN-PERSON EVALUATION PROTOCOL',
  '✦ ROTARACT CLUB OF ATRIA IT',
];

export const LiveTicker: React.FC<LiveTickerProps> = ({
  items = DEFAULT_TICKER_ITEMS,
  speedSeconds = 24,
  backgroundColor = 'var(--acid)',
  textColor = 'var(--ink)',
  className = '',
}) => {
  // Duplicate items to ensure seamless infinite loop
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div
      aria-label="Live System Announcements Ticker"
      className={className}
      style={{
        width: '100%',
        overflow: 'hidden',
        backgroundColor,
        color: textColor,
        borderBottom: '2px solid var(--ink)',
        padding: '0.45rem 0',
        position: 'relative',
        zIndex: 50,
        userSelect: 'none',
      }}
    >
      <div
        className="live-ticker-track"
        style={{
          animationDuration: `${speedSeconds}s`,
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0 1.25rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: '0.76rem',
              letterSpacing: '0.14em',
              whiteSpace: 'nowrap',
            }}
          >
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
