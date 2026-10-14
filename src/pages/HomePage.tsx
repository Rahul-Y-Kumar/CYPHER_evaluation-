import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  ArrowRight, 
  Layers, 
  ChevronDown,
  Sparkles,
  Radio,
  Crosshair,
  Maximize2,
  ExternalLink,
  Building2,
  Download,
  Trophy
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { NeoCard } from '../components/ui/NeoCard';
import { TechnicalLabel } from '../components/ui/TechnicalLabel';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PROBLEM_STATEMENTS, HACKATHON_ROUNDS, FAQS, MOCK_RECENT_SUBMISSIONS } from '../data/mockData';
import type { NavigationTab, ProblemStatement } from '../types';

interface HomePageProps {
  onSelectTab: (tab: NavigationTab) => void;
  onSelectProblem: (problem: ProblemStatement) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectTab,
  onSelectProblem,
}) => {
  // Countdown Timer State - Today 10:00 AM
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date();
    const target = new Date();
    target.setHours(10, 0, 0, 0);
    const diff = Math.max(0, target.getTime() - now.getTime());
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  });

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleDownloadPdf = () => {
    const pdfUrl = '/Cypher%204.0%20(Problem%20Statements).pdf';
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'Cypher 4.0 (Problem Statements).pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(10, 0, 0, 0);
      const diff = Math.max(0, target.getTime() - now.getTime());
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* =========================================================================
          HERO SECTION (COSMIC NEO-BRUTALIST TERMINAL)
          ========================================================================= */}
      <section
        style={{
          paddingTop: '3.5rem',
          paddingBottom: '5.5rem',
          borderBottom: '2px solid var(--line)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle Orbit Rings & Geometric Background Geometry (No Stock Photos) */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%',
            right: '5%',
            transform: 'translateY(-50%)',
            width: '560px',
            height: '560px',
            pointerEvents: 'none',
            opacity: 0.2,
            zIndex: 0,
          }}
        >
          {/* Orbit Concentric Rings */}
          <svg width="100%" height="100%" viewBox="0 0 500 500" fill="none">
            <circle cx="250" cy="250" r="240" stroke="var(--line)" strokeWidth="1" strokeDasharray="4 8" />
            <circle cx="250" cy="250" r="180" stroke="var(--cyan)" strokeWidth="1" strokeOpacity="0.4" />
            <circle cx="250" cy="250" r="120" stroke="var(--acid)" strokeWidth="1" strokeDasharray="6 6" />
            <line x1="250" y1="0" x2="250" y2="500" stroke="var(--line)" strokeWidth="1" strokeOpacity="0.3" />
            <line x1="0" y1="250" x2="500" y2="250" stroke="var(--line)" strokeWidth="1" strokeOpacity="0.3" />
            <rect x="240" y="240" width="20" height="20" stroke="var(--acid)" strokeWidth="1" fill="none" />
          </svg>
        </div>

        <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>
          {/* Top Mission Meta Badges */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '0.65rem',
              marginBottom: '1.75rem',
            }}
          >
            <TechnicalLabel color="cyan" variant="bracket">
              01 / CYPHER SYSTEM
            </TechnicalLabel>
            <StatusBadge status="SYSTEM READY" variant="acid" pulse />
            
            <span
              className="font-mono"
              style={{
                fontSize: '0.72rem',
                color: 'var(--cyan)',
                marginLeft: 'auto',
                fontWeight: 700,
              }}
            >
              [LATENCY: 12MS • SHA-256 MASKING ACTIVE]
            </span>
          </div>

          {/* Hero Content Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Display Typography & CTAs */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                  padding: '0.25rem 0.6rem',
                  backgroundColor: 'var(--ink)',
                  border: '1px solid var(--line)',
                }}
              >
                <Radio size={12} color="var(--acid)" className="animate-pulse" />
                <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--acid)', letterSpacing: '0.14em', fontWeight: 800 }}>
                  LIVE HACKATHON EVALUATION MATRIX
                </span>
              </div>

              {/* Main Heading: CYPHER 4.0 */}
              <h1
                className="display-hero"
                style={{
                  marginBottom: '1.25rem',
                  color: 'var(--white)',
                  textShadow: '3px 3px 0 var(--ink)',
                  whiteSpace: 'nowrap',
                }}
              >
                CYPHER <span style={{ color: 'var(--acid)', textShadow: '4px 4px 0 var(--ink)' }}>4.0</span>
              </h1>

              {/* Supporting Text */}
              <p
                style={{
                  fontSize: '1.15rem',
                  color: 'var(--white)',
                  opacity: 0.92,
                  maxWidth: '540px',
                  lineHeight: '1.65',
                  marginBottom: '1.5rem',
                  fontWeight: 500,
                }}
              >
                A high-energy hackathon platform built for builders, innovators and problem solvers.
              </p>

              {/* Official Winners & Round 2 Announcement Callout */}
              <div
                style={{
                  background: 'rgba(234, 255, 0, 0.08)',
                  border: '1px solid var(--acid)',
                  padding: '0.85rem 1.15rem',
                  marginBottom: '2rem',
                  maxWidth: '540px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  boxShadow: '3px 3px 0 var(--ink)',
                  transition: 'all 0.15s ease',
                }}
                onClick={() => onSelectTab('results')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(-2px, -2px)';
                  e.currentTarget.style.boxShadow = '5px 5px 0 var(--acid)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(0, 0)';
                  e.currentTarget.style.boxShadow = '3px 3px 0 var(--ink)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Trophy size={20} color="var(--acid)" />
                  <div>
                    <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--acid)', fontWeight: 800 }}>
                      KD'S GARAGE WINNERS ANNOUNCED
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--white)', fontWeight: 600 }}>
                      Round 2 Qualifiers & Problem Statement Winners are live
                    </div>
                  </div>
                </div>
                <span className="font-mono" style={{ color: 'var(--acid)', fontSize: '0.78rem', fontWeight: 800, whiteSpace: 'nowrap' }}>
                  VIEW LEADERBOARD ↗
                </span>
              </div>

              {/* CTA Buttons with Text Roll & Arrow Rotation Interactions */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  alignItems: 'center',
                }}
              >
                <Button
                  variant="primary"
                  size="lg"
                  rollText={true}
                  arrow={true}
                  onClick={() => onSelectTab('problems')}
                >
                  EXPLORE CHALLENGES ↗
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => onSelectTab('results')}
                  icon={<Layers size={18} />}
                >
                  LIVE LEADERBOARD ↗
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => onSelectTab('resources')}
                >
                  DATASETS & RESOURCES
                </Button>
              </div>

              {/* Floating Technical Markers / Meta Badges */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '1.5rem',
                  marginTop: '2.75rem',
                  paddingTop: '1.5rem',
                  borderTop: '2px solid var(--line)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Crosshair size={14} color="var(--acid)" />
                  <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                    ENGINE: <strong style={{ color: 'var(--white)' }}>IN-PERSON WORKSTATION REVIEW</strong>
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Maximize2 size={14} color="var(--cyan)" />
                  <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                    MENTORSHIP: <strong style={{ color: 'var(--cyan)' }}>ACTIVE FLOOR GUIDANCE</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Physical Terminal Panel HUD */}
            <div>
              <NeoCard
                variant="default"
                headerTitle="TERMINAL TELEMETRY // CYPHER-LIVE"
                headerTag="ORBITAL NODE"
                headerIcon={<Terminal size={15} color="var(--acid)" />}
                style={{
                  border: '2px solid var(--acid)',
                  boxShadow: '8px 8px 0 var(--ink), 0 0 30px rgba(234, 255, 0, 0.08)',
                }}
              >
                {/* Countdown Timer Block */}
                <div
                  style={{
                    background: 'var(--ink)',
                    border: '2px solid var(--line)',
                    padding: '1.25rem',
                    marginBottom: '1.25rem',
                    textAlign: 'center',
                  }}
                >
                  <div
                    className="font-mono"
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--muted)',
                      letterSpacing: '0.16em',
                      marginBottom: '0.4rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    1ST ROUND EVALUATION COUNTDOWN:
                  </div>

                  <div
                    className="font-display"
                    style={{
                      fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
                      color: 'var(--acid)',
                      letterSpacing: '0.04em',
                      lineHeight: 1,
                    }}
                  >
                    {String(timeLeft.hours).padStart(2, '0')}:
                    {String(timeLeft.minutes).padStart(2, '0')}:
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>

                  <div
                    className="font-mono"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '2.2rem',
                      fontSize: '0.65rem',
                      color: 'var(--cyan)',
                      marginTop: '0.35rem',
                    }}
                  >
                    <span>HOURS</span>
                    <span>MINUTES</span>
                    <span>SECONDS</span>
                  </div>
                </div>

                {/* Telemetry Metric Split */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div
                    style={{
                      padding: '0.75rem',
                      background: 'var(--ink)',
                      border: '1px solid var(--line)',
                    }}
                  >
                    <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>
                      EVALUATION TARGET
                    </div>
                    <div className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--cyan)', fontWeight: 800 }}>
                      NEXT DAY 10:00 AM
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '0.75rem',
                      background: 'var(--ink)',
                      border: '1px solid var(--line)',
                    }}
                  >
                    <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>
                      EVALUATION STAGE
                    </div>
                    <div className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--acid)', fontWeight: 800 }}>
                      ROUND 01 LIVE
                    </div>
                  </div>
                </div>

                {/* Live Activity Stream */}
                <div
                  style={{
                    background: 'var(--ink)',
                    border: '1px solid var(--line)',
                    padding: '0.85rem',
                  }}
                >
                  <div
                    className="font-mono"
                    style={{
                      fontSize: '0.68rem',
                      color: 'var(--muted)',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>EVALUATION TELEMETRY</span>
                    <span style={{ color: 'var(--cyan)' }}>● ACTIVE</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {[
                      { id: 'WORKSTATIONS', label: '14 TRACKS', status: 'EVALUATION LIVE' },
                      { id: 'JUDGING PANEL', label: 'EXPERTS & MENTORS', status: 'ON FLOOR' },
                      { id: 'LEADERBOARD', label: 'ROUND 01 STANDINGS', status: 'ROUND 01 LIVE' },
                    ].map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-mono)',
                          padding: '0.25rem 0',
                          borderBottom: '1px dashed rgba(245, 244, 237, 0.1)',
                        }}
                      >
                        <span style={{ color: 'var(--white)', fontWeight: 700 }}>{item.id}</span>
                        <span style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>{item.label}</span>
                        <StatusBadge status={item.status} variant="cyan" />
                      </div>
                    ))}
                  </div>
                </div>
              </NeoCard>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          METRICS & TELEMETRY STRIP (BRUTALIST NUMBERS)
          ========================================================================= */}
      <section
        style={{
          paddingTop: '3.5rem',
          paddingBottom: '3.5rem',
          backgroundColor: 'var(--ink)',
          borderBottom: '2px solid var(--line)',
        }}
      >
        <div className="container-custom">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {/* Stat 1 */}
            <NeoCard variant="featured" style={{ padding: '1.5rem' }}>
              <TechnicalLabel color="cyan" variant="tag">
                ENGINEERING TRACKS
              </TechnicalLabel>
              <div className="font-display" style={{ fontSize: '3rem', color: 'var(--acid)', lineHeight: 0.9, marginTop: '0.5rem' }}>
                07
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
                Specialized challenges & real datasets
              </div>
            </NeoCard>

            {/* Stat 2 */}
            <NeoCard variant="featured" style={{ padding: '1.5rem' }}>
              <TechnicalLabel color="cyan" variant="tag">
                REGISTERED SQUADS
              </TechnicalLabel>
              <div className="font-display" style={{ fontSize: '3rem', color: 'var(--white)', lineHeight: 0.9, marginTop: '0.5rem' }}>
                380+
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
                Universities & independent engineers
              </div>
            </NeoCard>

            {/* Stat 3 */}
            <NeoCard variant="featured" style={{ padding: '1.5rem' }}>
              <TechnicalLabel color="cyan" variant="tag">
                EVALUATION FORMAT
              </TechnicalLabel>
              <div className="font-display" style={{ fontSize: '3rem', color: 'var(--cyan)', lineHeight: 0.9, marginTop: '0.5rem' }}>
                IN-PERSON
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
                Workstation review & live code checking
              </div>
            </NeoCard>

            {/* Stat 4 */}
            <NeoCard variant="featured" style={{ padding: '1.5rem' }}>
              <TechnicalLabel color="cyan" variant="tag">
                EXPERTS & JUDGES
              </TechnicalLabel>
              <div className="font-display" style={{ fontSize: '3rem', color: 'var(--purple)', lineHeight: 0.9, marginTop: '0.5rem' }}>
                24+
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
                Domain mentors & senior industry judges
              </div>
            </NeoCard>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PROBLEM STATEMENTS SHOWCASE
          ========================================================================= */}
      <section
        style={{
          paddingTop: '5rem',
          paddingBottom: '5rem',
          borderBottom: '2px solid var(--line)',
        }}
      >
        <div className="container-custom">
          {/* Section Header */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2.5rem',
              gap: '1rem',
            }}
          >
            <div>
              <TechnicalLabel color="cyan" variant="bracket">
                02 // CHALLENGE REPERTORY
              </TechnicalLabel>
              <h2 className="display-title" style={{ color: 'var(--white)', marginTop: '0.35rem' }}>
                PROBLEM <span style={{ color: 'var(--acid)' }}>STATEMENTS</span>
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Button
                variant="primary"
                size="sm"
                rollText={true}
                arrow={true}
                icon={<Download size={14} />}
                onClick={handleDownloadPdf}
              >
                DOWNLOAD PROBLEM STATEMENTS .PDF ↗
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectTab('problems')}
                icon={<ArrowRight size={14} />}
              >
                VIEW ALL 14 CHALLENGES
              </Button>
            </div>
          </div>

          {/* Problem Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {PROBLEM_STATEMENTS.slice(0, 3).map((ps) => (
              <NeoCard
                key={ps.id}
                variant="default"
                hoverEffect={true}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.5rem',
                }}
              >
                <div>
                  {/* Top Bar with PS code and track */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem',
                    }}
                  >
                    <StatusBadge status={ps.code} variant="acid" />
                    <span
                      className="font-mono"
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--cyan)',
                        fontWeight: 700,
                      }}
                    >
                      {ps.track}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      lineHeight: '1.3',
                      marginBottom: '0.85rem',
                      color: 'var(--white)',
                    }}
                  >
                    {ps.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--muted)',
                      lineHeight: '1.6',
                      marginBottom: '1.25rem',
                    }}
                  >
                    {ps.shortDesc}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                    {ps.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '0.65rem',
                          fontFamily: 'var(--font-mono)',
                          padding: '0.2rem 0.5rem',
                          background: 'var(--ink)',
                          border: '1px solid var(--line)',
                          color: 'var(--white)',
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer of Card */}
                <div
                  style={{
                    borderTop: '1px solid var(--line)',
                    paddingTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      className="font-mono"
                      style={{
                        padding: '0.2rem 0.5rem',
                        background: 'var(--paper)',
                        border: '1px solid var(--line)',
                        color: 'var(--acid)',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                      }}
                    >
                      {ps.track}
                    </span>
                  </div>

                  <Button
                    variant="cyan"
                    size="sm"
                    onClick={() => onSelectProblem(ps)}
                  >
                    VIEW BRIEF
                  </Button>
                </div>
              </NeoCard>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          TECHNICAL PARTNER & SPONSORSHIP SECTION
          ========================================================================= */}
      <section
        id="sponsors"
        style={{
          paddingTop: '5rem',
          paddingBottom: '5.5rem',
          backgroundColor: 'var(--paper)',
          borderBottom: '2px solid var(--line)',
          position: 'relative',
        }}
      >
        <div className="container-custom">
          <div style={{ textAlign: 'center', maxWidth: '740px', margin: '0 auto 3.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Building2 size={16} color="var(--acid)" />
              <TechnicalLabel color="acid" variant="bracket">
                03 // OFFICIAL TECHNICAL PARTNERS & SPONSORS
              </TechnicalLabel>
            </div>
            <h2 className="display-title" style={{ color: 'var(--white)', marginTop: '0.35rem', marginBottom: '0.75rem' }}>
              TECHNICAL <span style={{ color: 'var(--acid)' }}>PARTNERS</span>
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: '1.6' }}>
              CYPHER 4.0 engineering tracks, industry problem briefs, and judging support are powered by our official technical innovation and startup incubation partners.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
              maxWidth: '960px',
              margin: '0 auto',
            }}
          >
            {/* PARTNER 1: KD's Garage */}
            <a
              href="https://www.kdsgarage.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', display: 'block', height: '100%' }}
            >
              <NeoCard
                variant="default"
                hoverEffect
                style={{
                  padding: '2rem',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--ink)',
                  borderColor: 'var(--line)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div>
                  {/* Top Badge & Link Pill */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <StatusBadge status="TECHNICAL PARTNER" variant="acid" />
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        color: 'var(--acid)',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                      }}
                    >
                      <span>kdsgarage.in</span>
                      <ExternalLink size={13} />
                    </span>
                  </div>

                  {/* Logo Container */}
                  <div
                    style={{
                      backgroundColor: '#000000',
                      border: '2px solid var(--line)',
                      padding: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem',
                      height: '120px',
                    }}
                  >
                    <img
                      src="/KD.png"
                      alt="KD's Garage Logo"
                      style={{
                        maxHeight: '90px',
                        maxWidth: '100%',
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                  </div>

                  {/* Title & Description */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.6rem',
                      color: 'var(--white)',
                      marginBottom: '0.65rem',
                      letterSpacing: '0.04em',
                    }}
                  >
                    KD'S GARAGE
                  </h3>

                  <p
                    style={{
                      color: 'var(--muted)',
                      fontSize: '0.9rem',
                      lineHeight: '1.6',
                      marginBottom: '1.5rem',
                    }}
                  >
                    Official Technical Challenge & Innovation Partner. Pioneer in rapid automotive engineering, embedded hardware systems, and applied intelligent diagnostics.
                  </p>
                </div>

                {/* Footer Action */}
                <div
                  style={{
                    borderTop: '1px solid var(--line)',
                    paddingTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--cyan)', fontWeight: 700 }}>
                    TRACKS: PS-01 TO PS-11 (11 CHALLENGES)
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--acid)',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    VISIT WEBSITE ↗
                  </span>
                </div>
              </NeoCard>
            </a>

            {/* PARTNER 2: My Startup Wave */}
            <a
              href="https://www.mystartupwave.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', display: 'block', height: '100%' }}
            >
              <NeoCard
                variant="default"
                hoverEffect
                style={{
                  padding: '2rem',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--ink)',
                  borderColor: 'var(--line)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div>
                  {/* Top Badge & Link Pill */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <StatusBadge status="TECHNICAL PARTNER" variant="cyan" />
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        color: 'var(--cyan)',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                      }}
                    >
                      <span>mystartupwave.com</span>
                      <ExternalLink size={13} />
                    </span>
                  </div>

                  {/* Logo Container */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '2px solid var(--line)',
                      padding: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem',
                      height: '120px',
                    }}
                  >
                    <img
                      src="/msw.png"
                      alt="My Startup Wave Logo"
                      style={{
                        maxHeight: '80px',
                        maxWidth: '90%',
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                  </div>

                  {/* Title & Description */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.6rem',
                      color: 'var(--white)',
                      marginBottom: '0.65rem',
                      letterSpacing: '0.04em',
                    }}
                  >
                    MY STARTUP WAVE
                  </h3>

                  <p
                    style={{
                      color: 'var(--muted)',
                      fontSize: '0.9rem',
                      lineHeight: '1.6',
                      marginBottom: '1.5rem',
                    }}
                  >
                    Official Innovation & Venture Track Partner. High-velocity startup platform catalyzing student entrepreneurs, AI builders, and frontier tech founders into viable ventures.
                  </p>
                </div>

                {/* Footer Action */}
                <div
                  style={{
                    borderTop: '1px solid var(--line)',
                    paddingTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--cyan)', fontWeight: 700 }}>
                    TRACKS: PS-12 TO PS-14 (3 CHALLENGES)
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--acid)',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    VISIT WEBSITE ↗
                  </span>
                </div>
              </NeoCard>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          HOW IT WORKS / PROTOCOL PIPELINE
          ========================================================================= */}
      <section
        style={{
          paddingTop: '5rem',
          paddingBottom: '5rem',
          backgroundColor: 'var(--paper)',
          borderBottom: '2px solid var(--line)',
        }}
      >
        <div className="container-custom">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem' }}>
            <TechnicalLabel color="cyan" variant="bracket">
              04 // EVALUATION ARCHITECTURE
            </TechnicalLabel>
            <h2 className="display-title" style={{ color: 'var(--white)', marginTop: '0.35rem' }}>
              THREE-STAGE <span style={{ color: 'var(--acid)' }}>PROTOCOL</span>
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.92rem', marginTop: '0.5rem' }}>
              How CYPHER 4.0 ensures 100% merit-based, in-person workstation evaluation through real-time judging and mentor feedback.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {HACKATHON_ROUNDS.map((round) => (
              <NeoCard
                key={round.number}
                variant={round.status === 'LIVE NOW' ? 'featured' : 'default'}
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span
                      className="font-display"
                      style={{ fontSize: '2.5rem', color: round.status === 'LIVE NOW' ? 'var(--acid)' : 'var(--muted)' }}
                    >
                      {round.number}
                    </span>
                    <StatusBadge status={round.status} variant={round.status === 'LIVE NOW' ? 'acid' : 'outline'} />
                  </div>

                  <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--cyan)', marginBottom: '0.5rem' }}>
                    {round.timeline}
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--white)', marginBottom: '0.85rem' }}>
                    {round.title}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                    {round.description}
                  </p>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem' }}>
                    {round.criteria.map((crit, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--white)' }}>
                        <span style={{ color: 'var(--cyan)' }}>✦</span>
                        <span>{crit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  style={{
                    borderTop: '1px solid var(--line)',
                    paddingTop: '1rem',
                    marginTop: '1.5rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--acid)',
                    fontWeight: 700,
                  }}
                >
                  FILTER: {round.eliminationRate}
                </div>
              </NeoCard>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          FAQ ACCORDION SECTION
          ========================================================================= */}
      <section
        style={{
          paddingTop: '5rem',
          paddingBottom: '5rem',
          borderBottom: '2px solid var(--line)',
        }}
      >
        <div className="container-custom" style={{ maxWidth: '880px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <TechnicalLabel color="cyan" variant="bracket">
              05 // FREQUENTLY ASKED QUERIES
            </TechnicalLabel>
            <h2 className="display-title" style={{ color: 'var(--white)', marginTop: '0.35rem' }}>
              SYSTEM <span style={{ color: 'var(--acid)' }}>DIAGNOSTICS & FAQS</span>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="neo-card"
                  style={{
                    backgroundColor: isOpen ? 'var(--paper)' : 'rgba(5, 6, 11, 0.65)',
                    borderColor: isOpen ? 'var(--acid)' : 'var(--line)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      background: 'transparent',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: 'var(--white)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 700,
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className="font-mono" style={{ color: isOpen ? 'var(--acid)' : 'var(--cyan)', fontSize: '0.85rem' }}>
                        [{String(index + 1).padStart(2, '0')}]
                      </span>
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown
                      size={18}
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        color: isOpen ? 'var(--acid)' : 'var(--muted)',
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        padding: '0 1.5rem 1.5rem',
                        color: 'var(--muted)',
                        fontSize: '0.88rem',
                        lineHeight: '1.65',
                        borderTop: '1px solid var(--line)',
                        paddingTop: '1rem',
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          BOTTOM LAUNCH CTA TERMINAL
          ========================================================================= */}
      <section
        style={{
          paddingTop: '5rem',
          paddingBottom: '5rem',
          position: 'relative',
        }}
      >
        <div className="container-custom">
          <NeoCard
            variant="acid"
            style={{
              padding: '3rem 2rem',
              textAlign: 'center',
            }}
          >
            <TechnicalLabel color="muted" variant="bullet" style={{ color: 'var(--ink)' }}>
              OFFICIAL EVALUATION PORTAL
            </TechnicalLabel>

            <h2 className="display-hero" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.8rem)', color: 'var(--ink)', marginBottom: '1.25rem', marginTop: '0.5rem' }}>
              READY TO BUILD & COMPETE?
            </h2>

            <p style={{ color: 'var(--ink)', opacity: 0.85, maxWidth: '640px', margin: '0 auto 2.5rem', fontSize: '1.05rem', lineHeight: '1.6', fontWeight: 600 }}>
              Lock in your problem statement, download official datasets, collaborate with on-floor mentors, and prepare for in-person workstation evaluation rounds.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Button
                variant="secondary"
                size="lg"
                rollText={true}
                arrow={true}
                onClick={() => onSelectTab('results')}
              >
                VIEW LIVE LEADERBOARD ↗
              </Button>

              <Button
                variant="primary"
                size="lg"
                rollText={true}
                arrow={true}
                onClick={() => onSelectTab('problems')}
              >
                EXPLORE PROBLEM STATEMENTS ↗
              </Button>
            </div>
          </NeoCard>
        </div>
      </section>
    </div>
  );
};
