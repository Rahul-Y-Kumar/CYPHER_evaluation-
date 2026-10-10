import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  X, 
  Download, 
  Database, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  FileSpreadsheet, 
  FolderArchive 
} from 'lucide-react';
import { Button } from './Button';
import { StatusBadge } from './StatusBadge';
import { TechnicalLabel } from './TechnicalLabel';
import type { NavigationTab } from '../../types';

interface DatasetAnnouncementProps {
  onNavigateToDatasets: () => void;
}

export const DatasetAnnouncement: React.FC<DatasetAnnouncementProps> = ({
  onNavigateToDatasets,
}) => {
  const [showPopup, setShowPopup] = useState<boolean>(() => {
    // Show popup once per session unless re-triggered
    return !sessionStorage.getItem('cypher_dataset_announcement_seen');
  });

  const [showBanner, setShowBanner] = useState<boolean>(true);

  const handleClosePopup = () => {
    setShowPopup(false);
    sessionStorage.setItem('cypher_dataset_announcement_seen', 'true');
  };

  const handleGoToDatasets = () => {
    setShowPopup(false);
    sessionStorage.setItem('cypher_dataset_announcement_seen', 'true');
    onNavigateToDatasets();
  };

  return (
    <>
      {/* 1. TOP STICKY ANNOUNCEMENT BANNER */}
      {showBanner && (
        <div
          style={{
            background: 'linear-gradient(90deg, #0B1030 0%, #161B40 50%, #0B1030 100%)',
            borderBottom: '2px solid var(--acid)',
            padding: '0.65rem 1rem',
            position: 'relative',
            zIndex: 990,
            boxShadow: '0 4px 15px rgba(234, 255, 0, 0.15)',
          }}
        >
          <div className="container-custom">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              {/* Left Info with pulsing live indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'var(--acid)',
                    color: 'var(--ink)',
                    padding: '0.2rem 0.55rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                  }}
                >
                  <Megaphone size={13} />
                  <span>ANNOUNCEMENT</span>
                </div>

                <div
                  className="font-mono"
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--white)',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span>Official KD's Garage Datasets for <strong>PS-01 to PS-11</strong> are now live and ready for download!</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={handleGoToDatasets}
                  style={{
                    background: 'var(--acid)',
                    color: 'var(--ink)',
                    border: '2px solid var(--ink)',
                    padding: '0.35rem 0.85rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '2px 2px 0 var(--white)',
                    transition: 'all 0.1s ease',
                  }}
                >
                  <Download size={13} />
                  <span>DOWNLOAD DATASETS ↗</span>
                </button>

                <button
                  onClick={() => setShowBanner(false)}
                  aria-label="Dismiss banner"
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--line)',
                    color: 'var(--muted)',
                    cursor: 'pointer',
                    padding: '0.35rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--white)';
                    e.currentTarget.style.borderColor = 'var(--acid)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--muted)';
                    e.currentTarget.style.borderColor = 'var(--line)';
                  }}
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ANNOUNCEMENT POPUP MODAL */}
      {showPopup && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            backgroundColor: 'rgba(5, 6, 11, 0.85)',
            backdropFilter: 'blur(12px)',
            animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={handleClosePopup}
        >
          <div
            className="brutal-card"
            style={{
              width: '100%',
              maxWidth: '680px',
              backgroundColor: 'var(--paper)',
              border: '3px solid var(--acid)',
              boxShadow: '12px 12px 0 #05060B, 0 0 50px rgba(234, 255, 0, 0.25)',
              position: 'relative',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Accent Strip */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1.25rem',
                background: 'var(--ink)',
                borderBottom: '2px solid var(--line-strong)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <span style={{ width: '10px', height: '10px', backgroundColor: '#FF3366', borderRadius: '50%' }} />
                  <span style={{ width: '10px', height: '10px', backgroundColor: '#EAFF00', borderRadius: '50%' }} />
                  <span style={{ width: '10px', height: '10px', backgroundColor: '#16D5D0', borderRadius: '50%' }} />
                </div>
                <span
                  className="font-mono"
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    color: 'var(--acid)',
                    letterSpacing: '0.12em',
                  }}
                >
                  // SYSTEM BROADCAST: DATASET RELEASE
                </span>
              </div>

              <button
                onClick={handleClosePopup}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--line)',
                  color: 'var(--white)',
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--acid)';
                  e.currentTarget.style.color = 'var(--ink)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--white)';
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                <StatusBadge status="OFFICIAL RELEASE" variant="acid" />
                <StatusBadge status="PS-01 TO PS-11" variant="outline" />
              </div>

              <h2
                className="display-hero"
                style={{
                  fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
                  color: 'var(--white)',
                  lineHeight: '1.2',
                  marginBottom: '1rem',
                }}
              >
                DATASETS HAVE BEEN <span style={{ color: 'var(--acid)' }}>RELEASED!</span>
              </h2>

              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                The official dataset packages for all <strong>KD's Garage problem statements (PS-01 through PS-11)</strong> are now officially published on the platform. You can download the complete dataset folders or inspect individual CSV data files.
              </p>

              {/* Feature Highlights Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '0.85rem',
                  marginBottom: '1.75rem',
                }}
              >
                <div
                  style={{
                    background: 'var(--ink)',
                    border: '1px solid var(--line)',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                  }}
                >
                  <FolderArchive size={18} color="var(--acid)" style={{ marginTop: '0.15rem' }} />
                  <div>
                    <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--white)', fontWeight: 700 }}>
                      1-Click ZIP Downloads
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
                      Download whole problem statement folders with all required CSV files.
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: 'var(--ink)',
                    border: '1px solid var(--line)',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                  }}
                >
                  <FileSpreadsheet size={18} color="var(--cyan)" style={{ marginTop: '0.15rem' }} />
                  <div>
                    <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--white)', fontWeight: 700 }}>
                      Individual File Preview
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
                      View all attached files per problem statement and download specific CSVs.
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.85rem',
                  justifyContent: 'flex-end',
                  borderTop: '1px solid var(--line)',
                  paddingTop: '1.5rem',
                }}
              >
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleClosePopup}
                >
                  ACKNOWLEDGE & CLOSE
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  rollText={true}
                  arrow={true}
                  icon={<Download size={16} />}
                  onClick={handleGoToDatasets}
                >
                  GO TO DATASETS & DOWNLOAD ↗
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
