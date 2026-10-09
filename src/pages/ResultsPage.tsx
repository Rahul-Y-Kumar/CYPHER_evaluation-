import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Users, 
  Award,
  ChevronRight,
  FileText
} from 'lucide-react';
import { NeoCard } from '../components/ui/NeoCard';
import { TechnicalLabel } from '../components/ui/TechnicalLabel';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { CSVEvaluationService, type TeamEvaluationRecord } from '../services/csvEvaluationService';
import type { NavigationTab } from '../types';

interface ResultsPageProps {
  onSelectTab: (tab: NavigationTab) => void;
  onSelectProblem?: (ps: any) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ onSelectTab }) => {
  const [evaluations, setEvaluations] = useState<TeamEvaluationRecord[]>([]);
  const [selectedPassFilter, setSelectedPassFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTeamModal, setSelectedTeamModal] = useState<TeamEvaluationRecord | null>(null);

  useEffect(() => {
    try {
      localStorage.removeItem('cypher4_evaluations_v1');
      localStorage.removeItem('cypher4_mock_teams');
    } catch {}
    const data = CSVEvaluationService.getEvaluations();
    setEvaluations(data);
  }, []);

  // Filter evaluations
  const filteredTeams = evaluations.filter((t) => {
    const matchesPass = selectedPassFilter === 'ALL' || t.passType === selectedPassFilter;
    const matchesStatus =
      selectedStatusFilter === 'ALL' ||
      (selectedStatusFilter === 'SELECTED' && t.status === 'SELECTED') ||
      (selectedStatusFilter === 'ELIMINATED' && t.status === 'ELIMINATED');

    const matchesSearch =
      t.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.teamLeader.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.collegeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.problemStatementCode.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesPass && matchesStatus && matchesSearch;
  });

  // Metrics
  const totalTeams = evaluations.length;
  const selectedCount = evaluations.filter((t) => t.status === 'SELECTED').length;
  const eliminatedCount = evaluations.filter((t) => t.status === 'ELIMINATED').length;

  return (
    <div style={{ position: 'relative', zIndex: 1, paddingTop: '3rem', paddingBottom: '6rem' }}>
      <div className="container-custom">
        {/* Header Terminal Info */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <TechnicalLabel color="cyan" variant="bracket">
              04 // HACKATHON LEADERBOARD
            </TechnicalLabel>
            <StatusBadge status="RESULTS YET TO BE ANNOUNCED" variant="acid" pulse />
          </div>
          <h1 className="display-hero" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--white)', marginBottom: '0.75rem', marginTop: '0.35rem' }}>
            OFFICIAL <span style={{ color: 'var(--acid)' }}>LEADERBOARD</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: '680px', lineHeight: '1.6' }}>
            Live ranking and evaluation standings for all participating teams in CYPHER 4.0. Results yet to be announced — official scorecards will be published here following workstation reviews.
          </p>
        </div>

        {/* 3 Metric NeoCards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Stat 1: Total Evaluated */}
          <NeoCard variant="featured" style={{ padding: '1.25rem' }}>
            <TechnicalLabel color="cyan" variant="tag">
              TOTAL TEAMS
            </TechnicalLabel>
            <div className="font-display" style={{ fontSize: '2.8rem', color: totalTeams > 0 ? 'var(--white)' : 'var(--muted)', lineHeight: 0.9, marginTop: '0.4rem' }}>
              {totalTeams > 0 ? totalTeams : '--'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
              {totalTeams > 0 ? 'Atrians & Non-Atrians' : 'Awaiting Judge Scorecards'}
            </div>
          </NeoCard>

          {/* Stat 2: Selected Teams / Stage */}
          <NeoCard variant="featured" style={{ padding: '1.25rem', border: '2px solid var(--acid)' }}>
            <TechnicalLabel color="acid" variant="tag">
              {totalTeams > 0 ? 'SELECTED TEAMS' : 'CURRENT STAGE'}
            </TechnicalLabel>
            <div className="font-display" style={{ fontSize: totalTeams > 0 ? '2.8rem' : '2rem', color: 'var(--acid)', lineHeight: 0.9, marginTop: '0.4rem' }}>
              {totalTeams > 0 ? selectedCount : 'ROUND 01'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--acid)', marginTop: '0.4rem', fontWeight: 700 }}>
              {totalTeams > 0 ? 'Qualified for Next Stage' : 'Workstation Review Active'}
            </div>
          </NeoCard>

          {/* Stat 3: Other Status */}
          <NeoCard variant="featured" style={{ padding: '1.25rem' }}>
            <TechnicalLabel color="muted" variant="tag">
              {totalTeams > 0 ? 'NOT SELECTED' : 'STANDINGS STATUS'}
            </TechnicalLabel>
            <div className="font-display" style={{ fontSize: totalTeams > 0 ? '2.8rem' : '1.35rem', color: totalTeams > 0 ? 'var(--muted)' : 'var(--acid)', lineHeight: 1.1, marginTop: '0.4rem', fontWeight: 800 }}>
              {totalTeams > 0 ? eliminatedCount : 'YET TO BE ANNOUNCED'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
              {totalTeams > 0 ? 'Round 1 Completed' : 'Scores Compilation Pending'}
            </div>
          </NeoCard>
        </div>

        {/* If no evaluations yet: Sleek Neo-Brutalist Awaiting State */}
        {totalTeams === 0 ? (
          <NeoCard
            variant="default"
            style={{
              padding: '3.5rem 2rem',
              textAlign: 'center',
              backgroundColor: 'var(--ink)',
              border: '2px dashed var(--line)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 1.5rem',
                backgroundColor: 'var(--paper)',
                border: '2px solid var(--acid)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '4px 4px 0 var(--acid)',
              }}
            >
              <Trophy size={32} color="var(--acid)" />
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <StatusBadge status="RESULTS YET TO BE ANNOUNCED" variant="acid" pulse />
              <StatusBadge status="ROUND 01 EVALUATION LIVE" variant="outline" />
            </div>

            <h3
              style={{
                fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
                fontWeight: 900,
                color: 'var(--white)',
                marginBottom: '1rem',
                letterSpacing: '0.04em',
              }}
            >
              RESULTS YET TO BE ANNOUNCED
            </h3>

            <p
              style={{
                color: 'var(--muted)',
                fontSize: '0.95rem',
                maxWidth: '580px',
                margin: '0 auto 2rem',
                lineHeight: '1.65',
              }}
            >
              Judges are currently reviewing team code repositories and physical workstations across all 14 challenge tracks. Official team rankings, qualification records, and score breakdowns will be announced and published here once evaluations conclude.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 1.25rem',
                background: 'var(--paper)',
                border: '1px solid var(--line)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--cyan)',
              }}
            >
              <span style={{ color: 'var(--acid)' }}>●</span>
              <span>EVALUATION PROTOCOL ACTIVE // RESULTS YET TO BE ANNOUNCED</span>
            </div>
          </NeoCard>
        ) : (
          <>
            {/* Controls & Filter Bar */}
            <NeoCard
              variant="default"
              style={{
                padding: '1.25rem',
                backgroundColor: 'var(--ink)',
                marginBottom: '2rem',
              }}
            >
              {/* Search Input */}
              <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <Search
                  size={18}
                  color="var(--muted)"
                  style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="text"
                  placeholder="Search by team name, leader, college, registration ID, problem statement..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem 0.8rem 2.8rem',
                    background: 'var(--paper)',
                    border: '2px solid var(--line)',
                    color: 'var(--white)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Filter Row: Status, Pass Category */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Status Filter Buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
                  <TechnicalLabel color="muted" style={{ marginRight: '0.35rem' }}>
                    STATUS:
                  </TechnicalLabel>
                  {[
                    { id: 'ALL', label: `ALL (${evaluations.length})` },
                    { id: 'SELECTED', label: `SELECTED (${selectedCount})` },
                    { id: 'ELIMINATED', label: `NOT SELECTED (${eliminatedCount})` },
                  ].map((s) => {
                    const isSelected = selectedStatusFilter === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSelectedStatusFilter(s.id)}
                        style={{
                          background: isSelected ? 'var(--acid)' : 'var(--paper)',
                          color: isSelected ? 'var(--ink)' : 'var(--white)',
                          border: isSelected ? '2px solid var(--ink)' : '1px solid var(--line)',
                          padding: '0.4rem 0.75rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          boxShadow: isSelected ? '2px 2px 0 var(--ink)' : 'none',
                        }}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>

                {/* Pass Category Buttons (Atrians vs Non-Atrians) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
                  <TechnicalLabel color="muted" style={{ marginRight: '0.35rem' }}>
                    CATEGORY:
                  </TechnicalLabel>
                  {['ALL', 'ATRIANS', 'NON-ATRIANS'].map((pass) => {
                    const isSelected = selectedPassFilter === pass;
                    return (
                      <button
                        key={pass}
                        onClick={() => setSelectedPassFilter(pass)}
                        style={{
                          background: isSelected ? 'var(--cyan)' : 'var(--paper)',
                          color: isSelected ? 'var(--ink)' : 'var(--white)',
                          border: isSelected ? '2px solid var(--ink)' : '1px solid var(--line)',
                          padding: '0.4rem 0.75rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          boxShadow: isSelected ? '2px 2px 0 var(--ink)' : 'none',
                        }}
                      >
                        {pass}
                      </button>
                    );
                  })}
                </div>
              </div>
            </NeoCard>

            {/* Live Leaderboard Table */}
            <NeoCard variant="default" style={{ padding: '1.5rem', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <TechnicalLabel color="acid" variant="bracket">
                    STANDINGS // {filteredTeams.length} TEAMS LISTED
                  </TechnicalLabel>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--white)', marginTop: '0.2rem' }}>
                    Team Standings
                  </h3>
                </div>
              </div>

              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--ink)', borderBottom: '2px solid var(--line)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
                      <th style={{ padding: '0.75rem 0.75rem', border: '1px solid var(--line)', width: '60px', textAlign: 'center' }}>RANK</th>
                      <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>REG ID</th>
                      <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>TEAM & LEADER</th>
                      <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>COLLEGE</th>
                      <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>PROBLEM STATEMENT</th>
                      <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>STATUS</th>
                      <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)', textAlign: 'right' }}>DETAILS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeams.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                          No teams found matching current search or filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredTeams.map((team) => {
                        const isSelected = team.status === 'SELECTED';
                        return (
                          <tr
                            key={team.id}
                            style={{
                              borderBottom: '1px solid var(--line)',
                              background: isSelected ? 'rgba(234, 255, 0, 0.02)' : 'transparent',
                              transition: 'background-color 0.1s ease',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(245, 244, 237, 0.04)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isSelected ? 'rgba(234, 255, 0, 0.02)' : 'transparent')}
                          >
                            {/* Rank */}
                            <td style={{ padding: '0.85rem 0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: team.rank && team.rank <= 3 ? 'var(--acid)' : 'var(--white)', border: '1px solid var(--line)', textAlign: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                                {team.rank && team.rank <= 3 && <Award size={14} color="var(--acid)" />}
                                <span>#{team.rank}</span>
                              </div>
                            </td>

                            {/* Reg ID */}
                            <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cyan)', border: '1px solid var(--line)' }}>
                              {team.id}
                            </td>

                            {/* Team & Leader */}
                            <td style={{ padding: '0.85rem 1rem', border: '1px solid var(--line)' }}>
                              <div style={{ fontWeight: 800, color: 'var(--white)', fontSize: '0.92rem' }}>{team.teamName}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
                                Lead: {team.teamLeader} ({team.teamSize} Members)
                              </div>
                            </td>

                            {/* College */}
                            <td style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', color: 'var(--white)', border: '1px solid var(--line)' }}>
                              <div>{team.collegeName}</div>
                              <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>
                                [{team.passType}]
                              </span>
                            </td>

                            {/* PS */}
                            <td style={{ padding: '0.85rem 1rem', border: '1px solid var(--line)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span
                                  className="font-mono"
                                  style={{
                                    padding: '0.2rem 0.45rem',
                                    background: 'var(--ink)',
                                    color: 'var(--acid)',
                                    border: '1px solid var(--line)',
                                    fontWeight: 800,
                                    fontSize: '0.72rem',
                                  }}
                                >
                                  {team.problemStatementCode}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {team.problemStatementTitle}
                                </span>
                              </div>
                            </td>

                            {/* Status */}
                            <td style={{ padding: '0.85rem 1rem', border: '1px solid var(--line)' }}>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  padding: '0.3rem 0.65rem',
                                  background: isSelected ? 'var(--acid)' : 'var(--ink)',
                                  color: isSelected ? 'var(--ink)' : 'var(--muted)',
                                  border: isSelected ? '2px solid var(--ink)' : '1px solid var(--line)',
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '0.7rem',
                                  fontWeight: 800,
                                }}
                              >
                                {isSelected ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                {isSelected ? 'SELECTED' : 'NOT SELECTED'}
                              </span>
                            </td>

                            {/* Action */}
                            <td style={{ padding: '0.85rem 1rem', textAlign: 'right', border: '1px solid var(--line)' }}>
                              <button
                                onClick={() => setSelectedTeamModal(team)}
                                style={{
                                  background: 'var(--ink)',
                                  border: '1px solid var(--line)',
                                  color: 'var(--cyan)',
                                  padding: '0.35rem 0.65rem',
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                }}
                              >
                                DETAILS
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </NeoCard>
          </>
        )}

        {/* Simplified Team Details Modal */}
        {selectedTeamModal && (
          <Modal
            isOpen={!!selectedTeamModal}
            onClose={() => setSelectedTeamModal(null)}
            title={`${selectedTeamModal.teamName} // DETAILS`}
            subtitle={`REGISTRATION: ${selectedTeamModal.id} • ${selectedTeamModal.collegeName}`}
          >
            <div>
              {/* Status Header Box */}
              <div
                style={{
                  background: selectedTeamModal.status === 'SELECTED' ? 'rgba(234, 255, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  border: selectedTeamModal.status === 'SELECTED' ? '2px solid var(--acid)' : '2px solid var(--line)',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                    TEAM NAME
                  </div>
                  <div className="font-display" style={{ fontSize: '1.8rem', color: 'var(--white)', lineHeight: 1.2 }}>
                    {selectedTeamModal.teamName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.3rem' }}>
                    Leader: <strong style={{ color: 'var(--white)' }}>{selectedTeamModal.teamLeader}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <StatusBadge
                    status={selectedTeamModal.status === 'SELECTED' ? 'SELECTED' : 'NOT SELECTED'}
                    variant={selectedTeamModal.status === 'SELECTED' ? 'acid' : 'outline'}
                  />
                  <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
                    Rank: #{selectedTeamModal.rank}
                  </div>
                </div>
              </div>

              {/* Problem Statement Box */}
              <div style={{ background: 'var(--ink)', border: '1px solid var(--line)', padding: '1rem', marginBottom: '1.5rem' }}>
                <TechnicalLabel color="cyan" variant="bracket">
                  // SELECTED PROBLEM STATEMENT
                </TechnicalLabel>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <span
                    className="font-mono"
                    style={{
                      padding: '0.25rem 0.55rem',
                      background: 'var(--acid)',
                      color: 'var(--ink)',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                    }}
                  >
                    {selectedTeamModal.problemStatementCode}
                  </span>
                  <span style={{ fontWeight: 800, color: 'var(--white)', fontSize: '0.95rem' }}>
                    {selectedTeamModal.problemStatementTitle}
                  </span>
                </div>
              </div>

              {/* Team Members List */}
              <div style={{ marginBottom: '1.75rem' }}>
                <TechnicalLabel color="acid" variant="bracket">
                  // SQUAD MEMBERS ({selectedTeamModal.teamSize} MEMBERS)
                </TechnicalLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.65rem' }}>
                  {selectedTeamModal.members.map((member, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '0.4rem 0.75rem',
                        background: 'var(--paper)',
                        border: '1px solid var(--line)',
                        color: 'var(--white)',
                        fontSize: '0.8rem',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {idx === 0 ? `★ ${member} (Team Leader)` : member}
                    </span>
                  ))}
                </div>
              </div>

              {/* College Information */}
              <div style={{ background: 'var(--ink)', border: '1px solid var(--line)', padding: '0.85rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                  COLLEGE / INSTITUTE:
                </span>
                <span className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--white)', fontWeight: 700 }}>
                  {selectedTeamModal.collegeName} ({selectedTeamModal.passType})
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--line)', paddingTop: '1.25rem' }}>
                <Button variant="outline" size="md" onClick={() => setSelectedTeamModal(null)}>
                  CLOSE DETAILS
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};
