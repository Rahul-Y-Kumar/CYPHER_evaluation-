import React, { useState } from 'react';
import type { NavigationTab } from '../../types';
import { Button } from '../ui/Button';
import { LiveTicker } from '../ui/LiveTicker';
import { Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: NavigationTab; label: string; num: string }[] = [
    { id: 'home', label: 'HOME', num: '01' },
    { id: 'problems', label: 'PROBLEM STATEMENTS', num: '02' },
    // { id: 'resources', label: 'RESOURCES & DATASETS', num: '03' }, // Hidden until datasets release
    { id: 'results', label: 'LEADERBOARD', num: '03' },
    { id: 'how-it-works', label: 'EVALUATION PROTOCOL', num: '04' },
  ];

  const handleNavClick = (id: NavigationTab) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(11, 16, 48, 0.95)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '2px solid var(--line)',
        boxShadow: '0 4px 20px rgba(5, 6, 11, 0.8)',
      }}
    >
      {/* Reusable LiveTicker Component at the very top */}
      <LiveTicker
        items={[
          '✦ CYPHER 4.0',
          '✦ BUILD',
          '✦ INNOVATE',
          '✦ COMPETE',
          '✦ SHIP',
          '✦ CREATE',
          '✦ CYPHER 4.0',
          '✦ 14 SPECIALIZED TRACKS',
          '✦ IN-PERSON EVALUATION PROTOCOL',
          '✦ ROTARACT CLUB OF ATRIA IT',
        ]}
        speedSeconds={26}
      />

      {/* Main Sticky Navigation Bar */}
      <div className="container-custom">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '4.5rem',
            gap: '1rem',
          }}
        >
          {/* Brand Identity - White Rotaract Logo */}
          <div
            onClick={() => handleNavClick('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <img
              src="/Rotaract_logo_white.png"
              alt="Rotaract Club of Atria IT"
              style={{
                height: '46px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  style={{
                    background: isActive ? 'var(--ink)' : 'transparent',
                    color: isActive ? 'var(--acid)' : 'var(--white)',
                    border: isActive ? '2px solid var(--acid)' : '2px solid transparent',
                    boxShadow: isActive ? '3px 3px 0 var(--ink)' : 'none',
                    padding: '0.55rem 0.95rem',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    borderRadius: '0px',
                    transition: 'all 0.12s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(245, 244, 237, 0.06)';
                      e.currentTarget.style.color = 'var(--cyan)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--white)';
                    }
                  }}
                >
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Side Primary CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* Live Leaderboard Button */}
            <Button
              variant="primary"
              size="sm"
              rollText={true}
              arrow={true}
              onClick={() => handleNavClick('results')}
            >
              LIVE LEADERBOARD ↗
            </Button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
              aria-label="Toggle mobile terminal navigation"
              style={{
                background: 'var(--ink)',
                border: '2px solid var(--white)',
                color: 'var(--white)',
                padding: '0.55rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '0px',
                boxShadow: '2px 2px 0 var(--ink)',
              }}
            >
              {mobileMenuOpen ? <X size={20} color="var(--acid)" /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MOBILE NAVIGATION PANEL (FULL-WIDTH SHARP NEO-BRUTALIST PANEL)
          ========================================================================= */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            backgroundColor: 'var(--ink)',
            borderTop: '2px solid var(--line)',
            borderBottom: '4px solid var(--acid)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.95)',
            zIndex: 999,
            padding: '1.25rem',
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          {/* Mobile Terminal Header */}
          <div
            style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: 'var(--paper)',
              border: '1px solid var(--line)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--cyan)',
            }}
          >
            <span>// MOBILE NAVIGATION MENU</span>
            <span style={{ color: 'var(--acid)' }}>● ONLINE</span>
          </div>

          {/* Navigation Items with Clear Separators */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.85rem 1rem',
                    background: isActive ? 'var(--paper)' : 'rgba(11, 16, 48, 0.4)',
                    border: isActive ? '2px solid var(--acid)' : '1px solid var(--line)',
                    borderLeft: isActive ? '6px solid var(--acid)' : '1px solid var(--line)',
                    color: isActive ? 'var(--acid)' : 'var(--white)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: '0px',
                    transition: 'all 0.1s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: isActive ? 'var(--acid)' : 'var(--cyan)', fontSize: '0.75rem' }}>
                      {link.num}
                    </span>
                    <span>{link.label}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ArrowRight size={14} color={isActive ? 'var(--acid)' : 'var(--muted)'} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Desktop Responsive styles helper via inline media styles */}
      <style>{`
        @media (min-width: 1024px) {
          .lg\\:flex { display: flex !important; }
          .lg\\:hidden { display: none !important; }
        }
        @media (min-width: 768px) {
          .md\\:inline { display: inline !important; }
          .md\\:inline-flex { display: inline-flex !important; }
        }
        @media (min-width: 640px) {
          .sm\\:inline { display: inline !important; }
          .sm\\:inline-flex { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
};
