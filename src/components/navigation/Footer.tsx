import React from 'react';
import { 
  ArrowUpRight, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Calendar, 
  ShieldCheck,
  Radio
} from 'lucide-react';
import type { NavigationTab } from '../../types';

interface FooterProps {
  onSelectTab: (tab: NavigationTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer
      style={{
        backgroundColor: '#F5F4ED',
        color: '#05060B',
        borderTop: '3px solid #05060B',
        marginTop: '6rem',
        position: 'relative',
        zIndex: 10,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.2)',
      }}
    >
      {/* Top High-Contrast Ticker Banner */}
      <div
        style={{
          background: '#05060B',
          color: '#EAFF00',
          padding: '0.55rem 1rem',
          fontFamily: "'Martian Mono', monospace",
          fontWeight: 800,
          fontSize: '10px',
          letterSpacing: '0.14em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid #05060B',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Radio size={12} color="#EAFF00" />
          <span>CYPHER 4.0 // ROTARACT CLUB OF ATRIA INSTITUTE OF TECHNOLOGY</span>
        </div>
        <div style={{ display: 'flex', gap: '1.25rem', fontFamily: "'Martian Mono', monospace", fontSize: '10px', color: '#FFFFFF' }}>
          <span className="hidden sm:inline">18-HOUR TECHNICAL SPRINT</span>
          <span style={{ color: '#EAFF00' }}>● BENGALURU, INDIA</span>
        </div>
      </div>

      <div className="container-custom" style={{ padding: '50px 1rem' }}>
        {/* Responsive 3-Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
          }}
          className="footer-grid-layout"
        >
          {/* =========================================================================
              COLUMN 1: BRAND, EVENT SCHEDULE & VENUE MAP (2fr equivalent emphasis)
              ========================================================================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Brand Logo without bounding box */}
            <div>
              <img
                src="/Rotaract Logo_black.png"
                alt="Rotaract Club of Atria IT"
                style={{
                  height: '70px',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>

            {/* Organization Bio */}
            <p
              style={{
                color: 'rgba(5, 6, 11, 0.82)',
                fontSize: '13px',
                lineHeight: '1.6',
                maxWidth: '480px',
                fontWeight: 500,
              }}
            >
              18-hour technical sprints, radical engineering innovation, and collaborative community building. CYPHER 4.0 empowers developers, researchers, and creators to architect solutions for real-world complexity.
            </p>

            {/* Event Dates Pill */}
            <div
              style={{
                backgroundColor: '#EDECE3',
                border: '1px solid rgba(5, 6, 11, 0.15)',
                borderLeft: '4px solid #7B28BD',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                maxWidth: '480px',
              }}
            >
              <Calendar size={18} color="#7B28BD" />
              <div>
                <div
                  style={{
                    fontFamily: "'Martian Mono', monospace",
                    fontSize: '10px',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    color: '#7B28BD',
                    textTransform: 'uppercase',
                  }}
                >
                  EVENT DATES
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#05060B' }}>
                  October 9–10, 2026
                </div>
              </div>
            </div>

            {/* Interactive Venue & Location Map Card */}
            <div
              style={{
                backgroundColor: '#EDECE3',
                border: '1px solid rgba(5, 6, 11, 0.15)',
                borderLeft: '4px solid #7B28BD',
                padding: '1rem',
                maxWidth: '480px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={15} color="#7B28BD" />
                  <span
                    style={{
                      fontFamily: "'Martian Mono', monospace",
                      fontSize: '10px',
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      color: '#05060B',
                      textTransform: 'uppercase',
                    }}
                  >
                    VENUE & LOCATION
                  </span>
                </div>

                <a
                  href="https://maps.google.com/?q=Atria+Institute+of+Technology+Hebbal+Bengaluru"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "'Martian Mono', monospace",
                    fontSize: '10px',
                    fontWeight: 800,
                    color: '#7B28BD',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                  }}
                >
                  <span>Open in Maps</span>
                  <ArrowUpRight size={11} />
                </a>
              </div>

              <div
                style={{
                  fontSize: '12px',
                  color: 'rgba(5, 6, 11, 0.85)',
                  lineHeight: '1.45',
                  marginBottom: '0.75rem',
                  fontWeight: 600,
                }}
              >
                Atria Institute of Technology, ASKB Campus, 1st Main Rd, AG’s Layout, Hebbal, Bengaluru, Karnataka 560024
              </div>

              {/* Embedded Google Maps Iframe */}
              <div
                style={{
                  width: '100%',
                  height: '150px',
                  border: '1px solid rgba(5, 6, 11, 0.2)',
                  overflow: 'hidden',
                  background: '#ddd',
                }}
              >
                <iframe
                  title="Atria Institute of Technology Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.051917954934!2d77.58988647575239!3d13.032338513551528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17a7e80fb32d%3A0x2db4811a221f7663!2sAtria%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1715000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* =========================================================================
              COLUMN 2: NAVIGATION & LEGAL POLICIES
              ========================================================================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Section 1: Main Navigation */}
            <div>
              <div
                style={{
                  fontFamily: "'Martian Mono', monospace",
                  fontSize: '10px',
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  color: '#7B28BD',
                  textTransform: 'uppercase',
                  marginBottom: '0.85rem',
                  borderBottom: '2px solid #05060B',
                  paddingBottom: '0.35rem',
                }}
              >
                // NAVIGATION
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {[
                  { label: 'About', target: 'home' },
                  { label: 'Problem Statements', target: 'problems' },
                  { label: 'Live Leaderboard', target: 'results' },
                  { label: 'Evaluation Protocol', target: 'how-it-works' },
                  { label: 'Experience & Schedule', target: 'home' },
                  { label: 'FAQs', target: 'home' },
                ].map((item, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => onSelectTab(item.target as NavigationTab)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#05060B',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        transition: 'color 0.15s ease, transform 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#7B28BD';
                        e.currentTarget.style.transform = 'translateX(3px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#05060B';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight size={11} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 2: Legal & Policies */}
            <div>
              <div
                style={{
                  fontFamily: "'Martian Mono', monospace",
                  fontSize: '10px',
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  color: '#7B28BD',
                  textTransform: 'uppercase',
                  marginBottom: '0.85rem',
                  borderBottom: '2px solid #05060B',
                  paddingBottom: '0.35rem',
                }}
              >
                // LEGAL & POLICIES
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['Privacy Policy', 'Terms & Conditions', 'Refund Policy', 'Shipping & Delivery'].map((pol, idx) => (
                  <li key={idx}>
                    <a
                      href="#legal"
                      style={{
                        color: 'rgba(5, 6, 11, 0.85)',
                        textDecoration: 'none',
                        fontSize: '12px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        display: 'inline-block',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#7B28BD')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(5, 6, 11, 0.85)')}
                    >
                      {pol}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* =========================================================================
              COLUMN 3: CONTACT DETAILS, SOCIALS & EVENT BADGE
              ========================================================================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Contact Us */}
            <div>
              <div
                style={{
                  fontFamily: "'Martian Mono', monospace",
                  fontSize: '10px',
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  color: '#7B28BD',
                  textTransform: 'uppercase',
                  marginBottom: '0.85rem',
                  borderBottom: '2px solid #05060B',
                  paddingBottom: '0.35rem',
                }}
              >
                // CONTACT US
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <a
                  href="mailto:rotaractatriait3191@gmail.com"
                  style={{
                    color: '#05060B',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    wordBreak: 'break-all',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#7B28BD')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#05060B')}
                >
                  <Mail size={14} color="#7B28BD" style={{ flexShrink: 0 }} />
                  <span>rotaractatriait3191@gmail.com</span>
                </a>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <a
                    href="tel:+918296869390"
                    style={{
                      color: '#05060B',
                      textDecoration: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#7B28BD')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#05060B')}
                  >
                    <Phone size={14} color="#7B28BD" style={{ flexShrink: 0 }} />
                    <span>+91 8296869390</span>
                  </a>

                  <a
                    href="tel:+917349238222"
                    style={{
                      color: '#05060B',
                      textDecoration: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      paddingLeft: '1.4rem',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#7B28BD')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#05060B')}
                  >
                    <span>+91 7349238222</span>
                  </a>
                </div>

                <a
                  href="https://atria.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#05060B',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#7B28BD')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#05060B')}
                >
                  <Globe size={14} color="#7B28BD" style={{ flexShrink: 0 }} />
                  <span>atria.edu / rotaract</span>
                  <ArrowUpRight size={12} />
                </a>
              </div>
            </div>

            {/* Connect With Us */}
            <div>
              <div
                style={{
                  fontFamily: "'Martian Mono', monospace",
                  fontSize: '10px',
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  color: '#7B28BD',
                  textTransform: 'uppercase',
                  marginBottom: '0.85rem',
                  borderBottom: '2px solid #05060B',
                  paddingBottom: '0.35rem',
                }}
              >
                // CONNECT WITH US
              </div>

              {/* Social Media Buttons (36px x 36px, #05060B background with hover transform) */}
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                {[
                  {
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                      </svg>
                    ),
                    href: 'https://instagram.com/rotaract_atria',
                    label: 'Instagram'
                  },
                  {
                    icon: (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    ),
                    href: 'https://twitter.com/rotaract_atria',
                    label: 'Twitter'
                  },
                  {
                    icon: (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z"/>
                      </svg>
                    ),
                    href: 'https://linkedin.com/company/rotaract-atria',
                    label: 'LinkedIn'
                  },
                ].map((s, idx) => (
                  <a
                    key={idx}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    style={{
                      width: '36px',
                      height: '36px',
                      backgroundColor: '#05060B',
                      color: '#FFFFFF',
                      border: '2px solid #05060B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      boxShadow: '2px 2px 0 rgba(5, 6, 11, 0.4)',
                      transition: 'all 0.15s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#EAFF00';
                      e.currentTarget.style.color = '#05060B';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '2px 4px 0 #05060B';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#05060B';
                      e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '2px 2px 0 rgba(5, 6, 11, 0.4)';
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Event Emblem / Badge */}
            <div style={{ marginTop: '0.5rem' }}>
              <div
                style={{
                  width: '125px',
                  backgroundColor: '#05060B',
                  border: '2px solid #05060B',
                  boxShadow: '4px 4px 0 #7B28BD',
                  padding: '0.65rem 0.5rem',
                  textAlign: 'center',
                  color: '#FFFFFF',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Martian Mono', monospace",
                    fontSize: '9px',
                    fontWeight: 900,
                    color: '#EAFF00',
                    letterSpacing: '0.12em',
                  }}
                >
                  CYPHER 4.0
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '18px',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    lineHeight: 1.1,
                    marginTop: '2px',
                  }}
                >
                  OFFICIAL
                </div>
                <div
                  style={{
                    fontSize: '8px',
                    fontFamily: "'Martian Mono', monospace",
                    color: 'var(--cyan)',
                    letterSpacing: '0.1em',
                    marginTop: '3px',
                    borderTop: '1px solid #333',
                    paddingTop: '2px',
                  }}
                >
                  HACKATHON
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            OFFICIAL TECHNICAL PARTNERS STRIP
            ========================================================================= */}
        <div
          style={{
            borderTop: '2px solid #05060B',
            marginTop: '45px',
            paddingTop: '25px',
            paddingBottom: '5px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Martian Mono', monospace",
                  fontSize: '10px',
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  color: '#7B28BD',
                  textTransform: 'uppercase',
                  marginBottom: '0.25rem',
                }}
              >
                // OFFICIAL TECHNICAL PARTNERS & SPONSORS
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(5, 6, 11, 0.75)' }}>
                Powering engineering tracks, industry briefs & innovation pathways for CYPHER 4.0
              </div>
            </div>

            {/* Partner Logo Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              {/* KD's Garage */}
              <a
                href="https://www.kdsgarage.in"
                target="_blank"
                rel="noopener noreferrer"
                title="KD's Garage - Official Technical Partner"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  backgroundColor: '#05060B',
                  border: '2px solid #05060B',
                  padding: '0.4rem 0.85rem',
                  textDecoration: 'none',
                  boxShadow: '3px 3px 0 rgba(5,6,11,0.25)',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '3px 5px 0 #7B28BD';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '3px 3px 0 rgba(5,6,11,0.25)';
                }}
              >
                <img
                  src="/KD.png"
                  alt="KD's Garage"
                  style={{
                    height: '32px',
                    width: 'auto',
                    maxWidth: '80px',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Martian Mono', monospace",
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <span>KD'S GARAGE</span>
                  <ArrowUpRight size={12} color="#EAFF00" />
                </span>
              </a>

              {/* My Startup Wave */}
              <a
                href="https://www.mystartupwave.com"
                target="_blank"
                rel="noopener noreferrer"
                title="My Startup Wave - Official Innovation Partner"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #05060B',
                  padding: '0.4rem 0.85rem',
                  textDecoration: 'none',
                  boxShadow: '3px 3px 0 rgba(5,6,11,0.25)',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '3px 5px 0 #7B28BD';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '3px 3px 0 rgba(5,6,11,0.25)';
                }}
              >
                <img
                  src="/msw.png"
                  alt="My Startup Wave"
                  style={{
                    height: '28px',
                    width: 'auto',
                    maxWidth: '85px',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Martian Mono', monospace",
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#05060B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <span>MY STARTUP WAVE</span>
                  <ArrowUpRight size={12} color="#7B28BD" />
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM STRIP / COPYRIGHT
            ========================================================================= */}
        <div
          style={{
            borderTop: '2px solid #05060B',
            marginTop: '25px',
            paddingTop: '22px',
            paddingBottom: '10px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: 'rgba(5, 6, 11, 0.85)',
            fontFamily: "'Martian Mono', monospace",
            gap: '1rem',
          }}
        >
          <div>
            <strong>© 2026 CYPHER 4.0</strong> / Rotaract Club of Atria Institute of Technology
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '11px', fontWeight: 700 }}>
            <a href="#privacy" style={{ color: '#05060B', textDecoration: 'none' }}>Privacy Policy</a>
            <span>/</span>
            <a href="#terms" style={{ color: '#05060B', textDecoration: 'none' }}>Terms & Conditions</a>
            <span>/</span>
            <a href="#refund" style={{ color: '#05060B', textDecoration: 'none' }}>Refund Policy</a>
            <span>/</span>
            <a href="#shipping" style={{ color: '#05060B', textDecoration: 'none' }}>Shipping Policy</a>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .footer-grid-layout {
            grid-template-columns: 2fr 1fr 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
