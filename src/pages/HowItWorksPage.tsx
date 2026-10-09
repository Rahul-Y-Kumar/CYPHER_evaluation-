import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Scale, 
  Layers, 
  ArrowRight,
  MessageSquare,
  Laptop,
  Trophy
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { NeoCard } from '../components/ui/NeoCard';
import { TechnicalLabel } from '../components/ui/TechnicalLabel';
import { StatusBadge } from '../components/ui/StatusBadge';
import { HACKATHON_ROUNDS } from '../data/mockData';
import type { NavigationTab } from '../types';

interface HowItWorksPageProps {
  onSelectTab: (tab: NavigationTab) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onSelectTab }) => {
  const [selectedProtocolTab, setSelectedProtocolTab] = useState<'rounds' | 'mentorship' | 'rubric'>('rounds');

  return (
    <div style={{ position: 'relative', zIndex: 1, paddingTop: '3rem', paddingBottom: '6rem' }}>
      <div className="container-custom">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <TechnicalLabel color="cyan" variant="bracket">
            05 // EVALUATION ARCHITECTURE & PROTOCOL
          </TechnicalLabel>
          <h1 className="display-hero" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--white)', marginBottom: '0.75rem', marginTop: '0.35rem' }}>
            HOW CYPHER 4.0 <span style={{ color: 'var(--acid)' }}>EVALUATES</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: '700px', lineHeight: '1.6' }}>
            An in-person evaluation and mentorship framework designed to review real working code, assist builder squads, and publish live standings transparently.
          </p>
        </div>

        {/* Tab Navigator */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '2.5rem',
            backgroundColor: 'var(--ink)',
            padding: '0.5rem',
            border: '2px solid var(--line)',
            width: 'fit-content',
          }}
        >
          {[
            { id: 'rounds', label: '01 / STAGES PIPELINE', icon: <Layers size={14} /> },
            { id: 'mentorship', label: '02 / IN-PERSON & MENTORSHIP', icon: <Users size={14} /> },
            { id: 'rubric', label: '03 / EVALUATION DIMENSIONS', icon: <Scale size={14} /> },
          ].map((tab) => {
            const isActive = selectedProtocolTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedProtocolTab(tab.id as any)}
                style={{
                  background: isActive ? 'var(--acid)' : 'transparent',
                  color: isActive ? 'var(--ink)' : 'var(--white)',
                  border: isActive ? '2px solid var(--ink)' : '1px solid transparent',
                  padding: '0.6rem 1rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: isActive ? '2px 2px 0 var(--ink)' : 'none',
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* VIEW 1: PIPELINE */}
        {selectedProtocolTab === 'rounds' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {HACKATHON_ROUNDS.map((round) => (
              <NeoCard
                key={round.number}
                variant={round.status === 'LIVE NOW' ? 'featured' : 'default'}
                style={{
                  padding: '2rem',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="font-display" style={{ fontSize: '3rem', color: 'var(--acid)', lineHeight: 0.9 }}>
                      {round.number}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--white)' }}>
                        {round.title}
                      </h3>
                      <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--cyan)' }}>
                        TIMELINE: {round.timeline}
                      </span>
                    </div>
                  </div>

                  <StatusBadge
                    status={round.status}
                    variant={round.status === 'LIVE NOW' ? 'acid' : 'outline'}
                    pulse={round.status === 'LIVE NOW'}
                  />
                </div>

                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  {round.description}
                </p>

                <div style={{ borderTop: '1px solid var(--line)', paddingTop: '1.25rem' }}>
                  <TechnicalLabel color="white" variant="tag" style={{ marginBottom: '0.75rem' }}>
                    EVALUATION FOCUS
                  </TechnicalLabel>
                  <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.82rem', color: 'var(--white)' }}>
                    {round.criteria.map((c, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle2 size={16} color="var(--acid)" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </NeoCard>
            ))}
          </div>
        )}

        {/* VIEW 2: IN-PERSON JUDGING & MENTORSHIP */}
        {selectedProtocolTab === 'mentorship' && (
          <NeoCard variant="default" style={{ padding: '2.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <TechnicalLabel color="cyan" variant="bracket">
                IN-PERSON WORKSTATION EVALUATION & MENTORSHIP
              </TechnicalLabel>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--white)', marginTop: '0.35rem' }}>
                How Mentors & Judges Interact With Your Team
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
                No file uploads or submission forms on the website. Everything is evaluated live and in-person by domain experts visiting your team table.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ background: 'var(--ink)', border: '1px solid var(--line)', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <MessageSquare size={16} color="var(--acid)" />
                  <TechnicalLabel color="acid" variant="tag">
                    STAGE 01: ACTIVE MENTORING
                  </TechnicalLabel>
                </div>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--white)', marginBottom: '0.5rem' }}>
                  Mentorship Rounds & Inputs
                </h4>
                <p style={{ color: 'var(--muted)', fontSize: '0.82rem', lineHeight: '1.55' }}>
                  Dedicated domain mentors visit team tables throughout the sprint. Mentors provide architectural feedback, troubleshoot blocking bugs, and guide teams on problem statement deliverables.
                </p>
              </div>

              <div style={{ background: 'var(--ink)', border: '1px solid var(--line)', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Laptop size={16} color="var(--cyan)" />
                  <TechnicalLabel color="cyan" variant="tag">
                    STAGE 02: IN-PERSON JUDGING
                  </TechnicalLabel>
                </div>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--white)', marginBottom: '0.5rem' }}>
                  Workstation Code Inspection
                </h4>
                <p style={{ color: 'var(--muted)', fontSize: '0.82rem', lineHeight: '1.55' }}>
                  Judges approach teams directly at their tables to review live code repositories, verify dataset integration, test edge cases, and evaluate working prototypes on local machines.
                </p>
              </div>

              <div style={{ background: 'var(--ink)', border: '1px solid var(--line)', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Trophy size={16} color="var(--purple)" />
                  <TechnicalLabel color="purple" variant="tag">
                    STAGE 03: LIVE LEADERBOARD
                  </TechnicalLabel>
                </div>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--white)', marginBottom: '0.5rem' }}>
                  Platform Standings & Results
                </h4>
                <p style={{ color: 'var(--muted)', fontSize: '0.82rem', lineHeight: '1.55' }}>
                  After evaluation rounds conclude, compiled standings and qualified team lists are published live on this website's Leaderboard section.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant="primary" size="md" onClick={() => onSelectTab('results')} icon={<ArrowRight size={16} />}>
                VIEW LIVE LEADERBOARD
              </Button>
            </div>
          </NeoCard>
        )}

        {/* VIEW 3: EVALUATION DIMENSIONS */}
        {selectedProtocolTab === 'rubric' && (
          <NeoCard variant="default" style={{ padding: '2.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--white)', marginBottom: '0.5rem' }}>
                Evaluation Assessment Dimensions
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                All projects are evaluated in-person across four key engineering dimensions.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ background: 'var(--ink)', border: '2px solid var(--acid)', padding: '1.5rem', boxShadow: '4px 4px 0 #05060B' }}>
                <h4 className="font-mono" style={{ fontSize: '1.1rem', color: 'var(--acid)', marginBottom: '0.5rem' }}>
                  TECHNICAL ARCHITECTURE
                </h4>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  Code modularity, performance efficiency, system architecture, database optimization, and fault tolerance.
                </p>
              </div>

              <div style={{ background: 'var(--ink)', border: '2px solid var(--cyan)', padding: '1.5rem', boxShadow: '4px 4px 0 #05060B' }}>
                <h4 className="font-mono" style={{ fontSize: '1.1rem', color: 'var(--cyan)', marginBottom: '0.5rem' }}>
                  INNOVATION & NOVELTY
                </h4>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  Originality of solution, creative application of new paradigms, and solving complex domain challenges.
                </p>
              </div>

              <div style={{ background: 'var(--ink)', border: '2px solid var(--purple)', padding: '1.5rem', boxShadow: '4px 4px 0 #05060B' }}>
                <h4 className="font-mono" style={{ fontSize: '1.1rem', color: 'var(--purple)', marginBottom: '0.5rem' }}>
                  EXECUTION & DEMO
                </h4>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  Completeness of working implementation, stability of live demo, and addressing constraint deliverables.
                </p>
              </div>

              <div style={{ background: 'var(--ink)', border: '2px solid var(--white)', padding: '1.5rem', boxShadow: '4px 4px 0 #05060B' }}>
                <h4 className="font-mono" style={{ fontSize: '1.1rem', color: 'var(--white)', marginBottom: '0.5rem' }}>
                  DOCUMENTATION & PRESENTATION
                </h4>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  Clarity of presentation, architecture diagrams, testing reproducibility, and Q&A articulation.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="primary"
                size="md"
                rollText={true}
                arrow={true}
                onClick={() => onSelectTab('problems')}
              >
                EXPLORE PROBLEM STATEMENTS ↗
              </Button>
            </div>
          </NeoCard>
        )}
      </div>
    </div>
  );
};

export default HowItWorksPage;
