import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Users, 
  FileText,
  Building,
  RefreshCw,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { NeoCard } from '../components/ui/NeoCard';
import { TechnicalLabel } from '../components/ui/TechnicalLabel';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { CSVEvaluationService, type TeamLeaderboardRecord } from '../services/csvEvaluationService';
import type { NavigationTab } from '../types';

interface ResultsPageProps {
  onSelectTab: (tab: NavigationTab) => void;
  onSelectProblem?: (ps: any) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ onSelectTab }) => {
  const [teams, setTeams] = useState<TeamLeaderboardRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'ALL' | 'ATRIANS' | 'NON-ATRIANS'>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'SELECTED' | 'ELIMINATED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTeamModal, setSelectedTeamModal] = useState<TeamLeaderboardRecord | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    const records = await CSVEvaluationService.fetchOfficialDatasets();
    setTeams(records);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter teams based on Category (Atrians / Non-Atrians), Status, and Search Query
  const filteredTeams = teams.filter((t) => {
    const matchesCategory =
      selectedCategoryFilter === 'ALL' || t.category === selectedCategoryFilter;

    const matchesStatus =
      selectedStatusFilter === 'ALL' || t.status === selectedStatusFilter;

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      t.teamName.toLowerCase().includes(query) ||
      t.teamLeader.toLowerCase().includes(query) ||
      t.collegeName.toLowerCase().includes(query) ||
      t.problemStatementCode.toLowerCase().includes(query) ||
      t.problemStatementTitle.toLowerCase().includes(query) ||
      t.members.some((m) => m.toLowerCase().includes(query));

    return matchesCategory && matchesStatus && matchesSearch;
  });

  // Calculate high-level summary metrics
  const totalEvaluated = teams.length;
  const selectedCount = teams.filter((t) => t.status === 'SELECTED').length;
  const eliminatedCount = teams.filter((t) => t.status === 'ELIMINATED').length;

  const atriansCount = teams.filter((t) => t.category === 'ATRIANS').length;
  const nonAtriansCount = teams.filter((t) => t.category === 'NON-ATRIANS').length;

  return (
    <div style={{ position: 'relative', zIndex: 1, paddingTop: '3rem', paddingBottom: '6rem' }}>
      <div className="container-custom">
        {/* Header Terminal Info */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <TechnicalLabel color="cyan" variant="bracket">
              04 // HACKATHON LEADERBOARD
            </TechnicalLabel>
            <StatusBadge status="ROUND 01 EVALUATION RESULTS" variant="acid" />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', marginTop: '0.35rem' }}>
            <div>
              <h1 className="display-hero" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--white)', marginBottom: '0.75rem' }}>
                ROUND 01 <span style={{ color: 'var(--acid)' }}>LEADERBOARD</span>
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: '680px', lineHeight: '1.6' }}>
                Official Round 1 Evaluation standings for CYPHER 4.0. Displays verified team results segregated by qualification outcome for both Atrian and Non-Atrian tracks.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              icon={<RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />}
              style={{ alignSelf: 'center' }}
            >
              SYNC DATA
            </Button>
          </div>
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
              EVALUATED TEAMS
            </TechnicalLabel>
            <div className="font-display" style={{ fontSize: '2.8rem', color: 'var(--white)', lineHeight: 0.9, marginTop: '0.4rem' }}>
              {totalEvaluated}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
              {atriansCount} Atrians • {nonAtriansCount} Non-Atrians
            </div>
          </NeoCard>

          {/* Stat 2: Selected Teams */}
          <NeoCard variant="featured" style={{ padding: '1.25rem', border: '2px solid var(--acid)' }}>
            <TechnicalLabel color="acid" variant="tag">
              SELECTED TEAMS
            </TechnicalLabel>
            <div className="font-display" style={{ fontSize: '2.8rem', color: 'var(--acid)', lineHeight: 0.9, marginTop: '0.4rem' }}>
              {selectedCount}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--acid)', marginTop: '0.4rem', fontWeight: 700 }}>
              Qualified for Round 2
            </div>
          </NeoCard>

          {/* Stat 3: Eliminated Teams */}
          <NeoCard variant="featured" style={{ padding: '1.25rem' }}>
            <TechnicalLabel color="muted" variant="tag">
              ELIMINATED TEAMS
            </TechnicalLabel>
            <div className="font-display" style={{ fontSize: '2.8rem', color: 'var(--muted)', lineHeight: 0.9, marginTop: '0.4rem' }}>
              {eliminatedCount}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
              Round 1 Concluded
            </div>
          </NeoCard>
        </div>

        {/* Controls & Filter Bar */}
        <NeoCard
          variant="default"
          style={{
            padding: '1.25rem',
            backgroundColor: 'var(--ink)',
            marginBottom: '2rem',
          }}
        >
          {/* Search Input for Fast Access */}
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <Search
              size={18}
              color="var(--muted)"
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search by team name, team lead name, member names, problem statement, college..."
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

          {/* Filter Row: Category (Atrians / Non-Atrians) and Status (Selected / Eliminated) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Category Filter Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', alignItems: 'center' }}>
              <TechnicalLabel color="cyan" style={{ marginRight: '0.35rem' }}>
                CATEGORY:
              </TechnicalLabel>
              {[
                { id: 'ALL', label: `ALL (${teams.length})` },
                { id: 'ATRIANS', label: `ATRIANS (${atriansCount})` },
                { id: 'NON-ATRIANS', label: `NON-ATRIANS (${nonAtriansCount})` },
              ].map((c) => {
                const isSelected = selectedCategoryFilter === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategoryFilter(c.id as any)}
                    style={{
                      background: isSelected ? 'var(--cyan)' : 'var(--paper)',
                      color: isSelected ? 'var(--ink)' : 'var(--white)',
                      border: isSelected ? '2px solid var(--ink)' : '1px solid var(--line)',
                      padding: '0.45rem 0.8rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: isSelected ? '2px 2px 0 var(--ink)' : 'none',
                      transition: 'all 0.1s ease',
                    }}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>

            {/* Status Filter Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', alignItems: 'center' }}>
              <TechnicalLabel color="acid" style={{ marginRight: '0.35rem' }}>
                STATUS:
              </TechnicalLabel>
              {[
                { id: 'ALL', label: `ALL (${teams.length})` },
                { id: 'SELECTED', label: `SELECTED (${selectedCount})` },
                { id: 'ELIMINATED', label: `ELIMINATED (${eliminatedCount})` },
              ].map((s) => {
                const isSelected = selectedStatusFilter === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStatusFilter(s.id as any)}
                    style={{
                      background: isSelected ? 'var(--acid)' : 'var(--paper)',
                      color: isSelected ? 'var(--ink)' : 'var(--white)',
                      border: isSelected ? '2px solid var(--ink)' : '1px solid var(--line)',
                      padding: '0.45rem 0.8rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: isSelected ? '2px 2px 0 var(--ink)' : 'none',
                      transition: 'all 0.1s ease',
                    }}
                  >
                    {s.label}
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
                ROUND 01 STANDINGS // {filteredTeams.length} TEAMS LISTED
              </TechnicalLabel>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--white)', marginTop: '0.2rem' }}>
                Team Evaluation Standings
              </h3>
            </div>
          </div>

          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: 'var(--ink)', borderBottom: '2px solid var(--line)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
                  <th style={{ padding: '0.75rem 0.75rem', border: '1px solid var(--line)', width: '70px', textAlign: 'center' }}>SL NO</th>
                  <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>TEAM NAME</th>
                  <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>PROBLEM STATEMENT</th>
                  <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>TEAM LEAD</th>
                  <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>CATEGORY</th>
                  <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>STATUS</th>
                  <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)', textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                      No teams found matching the selected search query or category filter.
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
                        {/* Serial Number (SL NO) */}
                        <td style={{ padding: '0.85rem 0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--white)', border: '1px solid var(--line)', textAlign: 'center' }}>
                          <span style={{ color: isSelected ? 'var(--acid)' : 'var(--muted)' }}>
                            #{String(team.slNo).padStart(2, '0')}
                          </span>
                        </td>

                        {/* Team Name */}
                        <td style={{ padding: '0.85rem 1rem', border: '1px solid var(--line)' }}>
                          <div style={{ fontWeight: 800, color: 'var(--white)', fontSize: '0.95rem' }}>
                            {team.teamName}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.15rem' }}>
                            {team.collegeName}
                          </div>
                        </td>

                        {/* Problem Statement */}
                        <td style={{ padding: '0.85rem 1rem', border: '1px solid var(--line)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
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
                            <span style={{ fontSize: '0.78rem', color: 'var(--white)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {team.problemStatementTitle}
                            </span>
                          </div>
                        </td>

                        {/* Team Lead */}
                        <td style={{ padding: '0.85rem 1rem', border: '1px solid var(--line)', color: 'var(--white)' }}>
                          <div style={{ fontWeight: 600 }}>{team.teamLeader}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                            {team.members.length} Squad Members
                          </div>
                        </td>

                        {/* Category (Atrians / Non-Atrians) */}
                        <td style={{ padding: '0.85rem 1rem', border: '1px solid var(--line)' }}>
                          <span
                            className="font-mono"
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.5rem',
                              background: team.category === 'ATRIANS' ? 'rgba(22, 213, 208, 0.1)' : 'rgba(255, 255, 255, 0.06)',
                              color: team.category === 'ATRIANS' ? 'var(--cyan)' : 'var(--white)',
                              border: team.category === 'ATRIANS' ? '1px solid var(--cyan)' : '1px solid var(--line)',
                            }}
                          >
                            {team.category}
                          </span>
                        </td>

                        {/* Status (SELECTED / ELIMINATED) */}
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
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              letterSpacing: '0.04em',
                            }}
                          >
                            {isSelected ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                            {isSelected ? 'SELECTED' : 'ELIMINATED'}
                          </span>
                        </td>

                        {/* Action: VIEW MORE */}
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right', border: '1px solid var(--line)' }}>
                          <button
                            onClick={() => setSelectedTeamModal(team)}
                            style={{
                              background: 'var(--paper)',
                              border: '1px solid var(--line)',
                              color: 'var(--white)',
                              padding: '0.4rem 0.75rem',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              transition: 'all 0.1s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = 'var(--acid)';
                              e.currentTarget.style.color = 'var(--acid)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = 'var(--line)';
                              e.currentTarget.style.color = 'var(--white)';
                            }}
                          >
                            <Eye size={12} />
                            <span>VIEW MORE</span>
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

        {/* View More Team Details Modal */}
        {selectedTeamModal && (
          <Modal
            isOpen={!!selectedTeamModal}
            onClose={() => setSelectedTeamModal(null)}
            title={`${selectedTeamModal.teamName} // SQUAD PROFILE`}
            subtitle={`SL NO: #${String(selectedTeamModal.slNo).padStart(2, '0')} • CATEGORY: ${selectedTeamModal.category}`}
          >
            <div>
              {/* Status Header Box */}
              <div
                style={{
                  background: selectedTeamModal.status === 'SELECTED' ? 'rgba(234, 255, 0, 0.08)' : 'rgba(255, 255, 255, 0.04)',
                  border: selectedTeamModal.status === 'SELECTED' ? '2px solid var(--acid)' : '2px solid var(--line)',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                    TEAM NAME
                  </div>
                  <div className="font-display" style={{ fontSize: '2rem', color: 'var(--white)', lineHeight: 1.2 }}>
                    {selectedTeamModal.teamName}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.35rem' }}>
                    Team Leader: <strong style={{ color: 'var(--acid)' }}>{selectedTeamModal.teamLeader}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <StatusBadge
                    status={selectedTeamModal.status === 'SELECTED' ? 'SELECTED' : 'ELIMINATED'}
                    variant={selectedTeamModal.status === 'SELECTED' ? 'acid' : 'outline'}
                  />
                  <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--white)', marginTop: '0.5rem', fontWeight: 800 }}>
                    SL NO #{String(selectedTeamModal.slNo).padStart(2, '0')}
                  </div>
                </div>
              </div>

              {/* Problem Statement Box */}
              <div style={{ background: 'var(--ink)', border: '1px solid var(--line)', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                <TechnicalLabel color="cyan" variant="bracket">
                  // ASSIGNED PROBLEM STATEMENT
                </TechnicalLabel>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.6rem' }}>
                  <span
                    className="font-mono"
                    style={{
                      padding: '0.25rem 0.6rem',
                      background: 'var(--acid)',
                      color: 'var(--ink)',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                    }}
                  >
                    {selectedTeamModal.problemStatementCode}
                  </span>
                  <span style={{ fontWeight: 800, color: 'var(--white)', fontSize: '1rem' }}>
                    {selectedTeamModal.problemStatementTitle}
                  </span>
                </div>
              </div>

              {/* Members of the Team */}
              <div style={{ marginBottom: '1.75rem' }}>
                <TechnicalLabel color="acid" variant="bracket">
                  // MEMBERS OF THE TEAM ({selectedTeamModal.members.length} MEMBERS)
                </TechnicalLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.75rem' }}>
                  {selectedTeamModal.members.map((member, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '0.5rem 0.85rem',
                        background: 'var(--paper)',
                        border: '1px solid var(--line)',
                        color: 'var(--white)',
                        fontSize: '0.82rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                      }}
                    >
                      {member.toLowerCase() === selectedTeamModal.teamLeader.toLowerCase()
                        ? `★ ${member} (Team Lead)`
                        : `✦ ${member}`}
                    </span>
                  ))}
                </div>
              </div>

              {/* College Information */}
              <div style={{ background: 'var(--ink)', border: '1px solid var(--line)', padding: '0.85rem 1.25rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                  COLLEGE / INSTITUTION:
                </span>
                <span className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--white)', fontWeight: 700 }}>
                  {selectedTeamModal.collegeName} [{selectedTeamModal.category}]
                </span>
              </div>

              {/* Close Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--line)', paddingTop: '1.25rem' }}>
                <Button variant="primary" size="md" onClick={() => setSelectedTeamModal(null)}>
                  CLOSE PROFILE
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
