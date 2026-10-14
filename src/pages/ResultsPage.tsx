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
  SlidersHorizontal,
  Crown,
  Medal,
  Award,
  Sparkles,
  ArrowRight
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
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'WINNERS' | 'QUALIFIED' | 'CONCLUDED'>('ALL');
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

  // Filter teams based on Category (Atrians / Non-Atrians), Status/Winners, and Search Query
  const filteredTeams = teams.filter((t) => {
    const matchesCategory =
      selectedCategoryFilter === 'ALL' || t.category === selectedCategoryFilter;

    let matchesStatus = true;
    if (selectedStatusFilter === 'WINNERS') {
      matchesStatus = t.isWinner === true;
    } else if (selectedStatusFilter === 'QUALIFIED') {
      matchesStatus = t.isEligibleForRound2 === true;
    } else if (selectedStatusFilter === 'CONCLUDED') {
      matchesStatus = t.isEligibleForRound2 === false;
    }

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

  // Calculate metrics
  const totalEvaluated = teams.length;
  const qualifiedCount = teams.filter((t) => t.isEligibleForRound2).length;
  const concludedCount = teams.filter((t) => !t.isEligibleForRound2).length;
  const winnersList = CSVEvaluationService.getWinners(teams);
  const winnersCount = winnersList.length;

  const atriansCount = teams.filter((t) => t.category === 'ATRIANS').length;
  const nonAtriansCount = teams.filter((t) => t.category === 'NON-ATRIANS').length;

  const handleFilterToWinners = () => {
    setSelectedStatusFilter('WINNERS');
    setSelectedCategoryFilter('ALL');
    const tableEl = document.getElementById('leaderboard-table-anchor');
    if (tableEl) {
      tableEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ position: 'relative', zIndex: 1, paddingTop: '3rem', paddingBottom: '6rem' }}>
      <div className="container-custom">
        {/* Header Terminal Info */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <TechnicalLabel color="cyan" variant="bracket">
              04 // HACKATHON LEADERBOARD
            </TechnicalLabel>
            <StatusBadge status="ROUND 01 EVALUATION RESULTS" variant="acid" />
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.2rem 0.6rem',
                background: 'rgba(234, 255, 0, 0.12)',
                border: '1px solid var(--acid)',
                color: 'var(--acid)',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
              }}
            >
              <Sparkles size={12} />
              WINNERS ANNOUNCED
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', marginTop: '0.35rem' }}>
            <div>
              <h1 className="display-hero" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--white)', marginBottom: '0.75rem' }}>
                ROUND 01 <span style={{ color: 'var(--acid)' }}>LEADERBOARD</span>
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: '720px', lineHeight: '1.6' }}>
                Official Round 1 Evaluation standings for CYPHER 4.0. Displays verified standings for Atrian and Non-Atrian squads, Round 2 evaluation eligibility, and official winners for KD's Garage problem statements.
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

        {/* ======================================================== */}
        {/* WINNERS ANNOUNCEMENT SECTION: KD'S GARAGE PROBLEM STATEMENTS */}
        {/* ======================================================== */}
        <div style={{ marginBottom: '3rem' }}>
          <NeoCard
            variant="default"
            style={{
              padding: '1.75rem',
              backgroundColor: 'rgba(10, 14, 38, 0.95)',
              border: '2px solid var(--acid)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(234, 255, 0, 0.08)',
            }}
          >
            {/* Header / Banner Badge */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--line)', paddingBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <Trophy size={20} color="var(--acid)" />
                  <TechnicalLabel color="acid" variant="bracket">
                    OFFICIAL ANNOUNCEMENT // KD'S GARAGE PROBLEM STATEMENTS
                  </TechnicalLabel>
                </div>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--white)', letterSpacing: '-0.02em', margin: 0 }}>
                  KD'S GARAGE PROBLEM STATEMENTS — <span style={{ color: 'var(--acid)' }}>OFFICIAL WINNERS</span>
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '0.35rem 0 0 0' }}>
                  Congratulations to the top-performing squads evaluated across the specialized KD's Garage problem statement tracks.
                </p>
              </div>

              <button
                onClick={handleFilterToWinners}
                style={{
                  background: 'var(--acid)',
                  color: 'var(--ink)',
                  border: '2px solid var(--ink)',
                  padding: '0.55rem 1rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '3px 3px 0 var(--ink)',
                  transition: 'transform 0.1s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translate(-2px, -2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translate(0, 0)')}
              >
                <Trophy size={14} />
                <span>FILTER LEADERBOARD TO WINNERS</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Winners Podium Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {winnersList.map((winner) => {
                const rank = winner.winnerRank || 1;
                const isChampion = rank === 1;
                const isRunnerUp1 = rank === 2;
                
                const rankTheme = isChampion
                  ? {
                      borderColor: 'var(--acid)',
                      badgeBg: 'var(--acid)',
                      badgeColor: 'var(--ink)',
                      titleColor: 'var(--acid)',
                      rankLabel: '1ST PLACE // CHAMPION',
                      icon: <Crown size={22} color="var(--acid)" />,
                    }
                  : isRunnerUp1
                  ? {
                      borderColor: 'var(--cyan)',
                      badgeBg: 'var(--cyan)',
                      badgeColor: 'var(--ink)',
                      titleColor: 'var(--cyan)',
                      rankLabel: '2ND PLACE // 1ST RUNNER UP',
                      icon: <Medal size={22} color="var(--cyan)" />,
                    }
                  : {
                      borderColor: '#f59e0b',
                      badgeBg: '#f59e0b',
                      badgeColor: 'var(--ink)',
                      titleColor: '#f59e0b',
                      rankLabel: '3RD PLACE // 2ND RUNNER UP',
                      icon: <Award size={22} color="#f59e0b)" />,
                    };

                return (
                  <div
                    key={winner.id}
                    style={{
                      background: 'var(--paper)',
                      border: `2px solid ${rankTheme.borderColor}`,
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      boxShadow: isChampion ? '4px 4px 0 var(--acid)' : '4px 4px 0 var(--ink)',
                    }}
                  >
                    <div>
                      {/* Top Rank Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span
                          className="font-mono"
                          style={{
                            background: rankTheme.badgeBg,
                            color: rankTheme.badgeColor,
                            padding: '0.25rem 0.65rem',
                            fontSize: '0.72rem',
                            fontWeight: 900,
                            letterSpacing: '0.05em',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          {rankTheme.rankLabel}
                        </span>
                        {rankTheme.icon}
                      </div>

                      {/* Team Name */}
                      <h3
                        style={{
                          fontSize: '1.6rem',
                          fontWeight: 900,
                          color: 'var(--white)',
                          margin: '0 0 0.35rem 0',
                          lineHeight: 1.15,
                        }}
                      >
                        {winner.teamName}
                      </h3>

                      {/* Category & College */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
                        <span
                          className="font-mono"
                          style={{
                            fontSize: '0.68rem',
                            padding: '0.15rem 0.45rem',
                            background: winner.category === 'ATRIANS' ? 'rgba(22, 213, 208, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                            color: winner.category === 'ATRIANS' ? 'var(--cyan)' : 'var(--white)',
                            border: `1px solid ${winner.category === 'ATRIANS' ? 'var(--cyan)' : 'var(--line)'}`,
                            fontWeight: 800,
                          }}
                        >
                          {winner.category}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                          {winner.collegeName}
                        </span>
                      </div>

                      {/* Problem Statement Card */}
                      <div
                        style={{
                          background: 'var(--ink)',
                          border: '1px solid var(--line)',
                          padding: '0.65rem 0.85rem',
                          marginBottom: '1rem',
                        }}
                      >
                        <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '0.2rem' }}>
                          PROBLEM STATEMENT
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span
                            className="font-mono"
                            style={{
                              padding: '0.15rem 0.35rem',
                              background: 'var(--paper)',
                              color: 'var(--acid)',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                            }}
                          >
                            {winner.problemStatementCode}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--white)', fontWeight: 600 }}>
                            {winner.problemStatementTitle}
                          </span>
                        </div>
                      </div>

                      {/* Squad Members */}
                      <div style={{ marginBottom: '1.25rem' }}>
                        <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                          SQUAD:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {winner.members.map((m, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: '0.72rem',
                                color: m.toLowerCase() === winner.teamLeader.toLowerCase() ? 'var(--acid)' : 'var(--white)',
                                background: 'var(--ink)',
                                border: '1px solid var(--line)',
                                padding: '0.2rem 0.45rem',
                                fontFamily: 'var(--font-mono)',
                                fontWeight: m.toLowerCase() === winner.teamLeader.toLowerCase() ? 700 : 500,
                              }}
                            >
                              {m.toLowerCase() === winner.teamLeader.toLowerCase() ? `★ ${m} (Lead)` : m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Status & View Details Action */}
                    <div style={{ borderTop: '1px solid var(--line)', paddingTop: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--acid)',
                          fontWeight: 800,
                        }}
                      >
                        <CheckCircle2 size={13} />
                        QUALIFIED FOR ROUND 2
                      </span>

                      <button
                        onClick={() => setSelectedTeamModal(winner)}
                        style={{
                          background: 'transparent',
                          border: '1px solid var(--line)',
                          color: 'var(--white)',
                          padding: '0.35rem 0.65rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = rankTheme.borderColor;
                          e.currentTarget.style.color = rankTheme.borderColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--line)';
                          e.currentTarget.style.color = 'var(--white)';
                        }}
                      >
                        <Eye size={12} />
                        <span>PROFILE</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </NeoCard>
        </div>

        {/* 4 Metric NeoCards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Stat 1: Total Evaluated */}
          <NeoCard variant="featured" style={{ padding: '1.25rem' }}>
            <TechnicalLabel color="cyan" variant="tag">
              TOTAL EVALUATED
            </TechnicalLabel>
            <div className="font-display" style={{ fontSize: '2.8rem', color: 'var(--white)', lineHeight: 0.9, marginTop: '0.4rem' }}>
              {totalEvaluated}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
              {atriansCount} Atrians • {nonAtriansCount} Non-Atrians
            </div>
          </NeoCard>

          {/* Stat 2: Round 2 Qualified */}
          <NeoCard variant="featured" style={{ padding: '1.25rem', border: '2px solid var(--acid)' }}>
            <TechnicalLabel color="acid" variant="tag">
              ROUND 2 QUALIFIED
            </TechnicalLabel>
            <div className="font-display" style={{ fontSize: '2.8rem', color: 'var(--acid)', lineHeight: 0.9, marginTop: '0.4rem' }}>
              {qualifiedCount}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--acid)', marginTop: '0.4rem', fontWeight: 800 }}>
              Eligible for Round 2 Evaluation
            </div>
          </NeoCard>

          {/* Stat 3: Round 1 Concluded */}
          <NeoCard variant="featured" style={{ padding: '1.25rem' }}>
            <TechnicalLabel color="muted" variant="tag">
              ROUND 1 CONCLUDED
            </TechnicalLabel>
            <div className="font-display" style={{ fontSize: '2.8rem', color: 'var(--muted)', lineHeight: 0.9, marginTop: '0.4rem' }}>
              {concludedCount}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
              Evaluation Completed
            </div>
          </NeoCard>

          {/* Stat 4: KD's Garage Winners */}
          <NeoCard
            variant="featured"
            style={{
              padding: '1.25rem',
              border: '2px solid var(--cyan)',
              cursor: 'pointer',
            }}
            onClick={handleFilterToWinners}
          >
            <TechnicalLabel color="cyan" variant="tag">
              KD'S GARAGE WINNERS
            </TechnicalLabel>
            <div className="font-display" style={{ fontSize: '2.8rem', color: 'var(--cyan)', lineHeight: 0.9, marginTop: '0.4rem' }}>
              {winnersCount}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--cyan)', marginTop: '0.4rem', fontWeight: 800, textDecoration: 'underline' }}>
              Click to View Winners ↗
            </div>
          </NeoCard>
        </div>

        {/* Controls & Filter Bar */}
        <div id="leaderboard-table-anchor" />
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

          {/* Filter Row: Category (Atrians / Non-Atrians) and Status (Winners / Qualified / Concluded) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Category Filter Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', alignItems: 'center' }}>
              <TechnicalLabel color="cyan" style={{ marginRight: '0.35rem' }}>
                TRACK / CATEGORY:
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

            {/* Status & Winners Filter Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', alignItems: 'center' }}>
              <TechnicalLabel color="acid" style={{ marginRight: '0.35rem' }}>
                STATUS & OUTCOME:
              </TechnicalLabel>
              {[
                { id: 'ALL', label: `ALL (${teams.length})`, isWinnerBtn: false },
                { id: 'WINNERS', label: `🏆 WINNERS (${winnersCount})`, isWinnerBtn: true },
                { id: 'QUALIFIED', label: `ROUND 2 QUALIFIED (${qualifiedCount})`, isWinnerBtn: false },
                { id: 'CONCLUDED', label: `ROUND 1 CONCLUDED (${concludedCount})`, isWinnerBtn: false },
              ].map((s) => {
                const isSelected = selectedStatusFilter === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStatusFilter(s.id as any)}
                    style={{
                      background: isSelected
                        ? s.isWinnerBtn
                          ? 'var(--acid)'
                          : 'var(--acid)'
                        : s.isWinnerBtn
                        ? 'rgba(234, 255, 0, 0.15)'
                        : 'var(--paper)',
                      color: isSelected
                        ? 'var(--ink)'
                        : s.isWinnerBtn
                        ? 'var(--acid)'
                        : 'var(--white)',
                      border: isSelected
                        ? '2px solid var(--ink)'
                        : s.isWinnerBtn
                        ? '1px solid var(--acid)'
                        : '1px solid var(--line)',
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <TechnicalLabel color="acid" variant="bracket">
                ROUND 01 STANDINGS // {filteredTeams.length} TEAMS LISTED
              </TechnicalLabel>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--white)', marginTop: '0.2rem' }}>
                Team Standings & Evaluation Outcomes
              </h3>
            </div>

            {selectedStatusFilter === 'WINNERS' && (
              <span
                style={{
                  background: 'var(--acid)',
                  color: 'var(--ink)',
                  padding: '0.3rem 0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Trophy size={13} />
                DISPLAYING KD'S GARAGE WINNERS
              </span>
            )}
          </div>

          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: 'var(--ink)', borderBottom: '2px solid var(--line)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
                  <th style={{ padding: '0.75rem 0.75rem', border: '1px solid var(--line)', width: '70px', textAlign: 'center' }}>SL NO</th>
                  <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>TEAM NAME & COLLEGE</th>
                  <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>PROBLEM STATEMENT</th>
                  <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>SQUAD LEAD</th>
                  <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>CATEGORY</th>
                  <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)' }}>ROUND 2 STATUS & AWARDS</th>
                  <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--line)', textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                      No squads found matching the active search query or filter selection.
                    </td>
                  </tr>
                ) : (
                  filteredTeams.map((team) => {
                    const isQualified = team.isEligibleForRound2;
                    const isWinner = team.isWinner;
                    const winnerRank = team.winnerRank;

                    return (
                      <tr
                        key={team.id}
                        style={{
                          borderBottom: '1px solid var(--line)',
                          background: isWinner
                            ? 'rgba(234, 255, 0, 0.05)'
                            : isQualified
                            ? 'rgba(22, 213, 208, 0.03)'
                            : 'transparent',
                          transition: 'background-color 0.1s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(245, 244, 237, 0.05)')}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = isWinner
                            ? 'rgba(234, 255, 0, 0.05)'
                            : isQualified
                            ? 'rgba(22, 213, 208, 0.03)'
                            : 'transparent')
                        }
                      >
                        {/* Serial Number (SL NO) */}
                        <td style={{ padding: '0.85rem 0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--white)', border: '1px solid var(--line)', textAlign: 'center' }}>
                          <span style={{ color: isWinner ? 'var(--acid)' : isQualified ? 'var(--cyan)' : 'var(--muted)' }}>
                            #{String(team.slNo).padStart(2, '0')}
                          </span>
                        </td>

                        {/* Team Name & College */}
                        <td style={{ padding: '0.85rem 1rem', border: '1px solid var(--line)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 800, color: 'var(--white)', fontSize: '0.95rem' }}>
                              {team.teamName}
                            </span>
                            {isWinner && (
                              <span
                                style={{
                                  fontSize: '0.65rem',
                                  padding: '0.15rem 0.45rem',
                                  background: winnerRank === 1 ? 'var(--acid)' : winnerRank === 2 ? 'var(--cyan)' : '#f59e0b',
                                  color: 'var(--ink)',
                                  fontFamily: 'var(--font-mono)',
                                  fontWeight: 900,
                                }}
                              >
                                {winnerRank === 1 ? '🥇 WINNER' : winnerRank === 2 ? '🥈 2ND' : '🥉 3RD'}
                              </span>
                            )}
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
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {team.problemStatementCode}
                            </span>
                            <span style={{ fontSize: '0.78rem', color: 'var(--white)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {team.problemStatementTitle}
                            </span>
                          </div>
                        </td>

                        {/* Team Lead & Members */}
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

                        {/* Round 2 Status & Awards */}
                        <td style={{ padding: '0.85rem 1rem', border: '1px solid var(--line)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-start' }}>
                            {/* Qualification Badge */}
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.3rem 0.65rem',
                                background: isQualified ? 'rgba(234, 255, 0, 0.12)' : 'var(--ink)',
                                color: isQualified ? 'var(--acid)' : 'var(--muted)',
                                border: isQualified ? '1px solid var(--acid)' : '1px solid var(--line)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                letterSpacing: '0.04em',
                              }}
                            >
                              {isQualified ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                              {isQualified ? 'QUALIFIED FOR ROUND 2' : 'ROUND 1 CONCLUDED'}
                            </span>

                            {/* Winner Title if applicable */}
                            {isWinner && (
                              <span
                                className="font-mono"
                                style={{
                                  fontSize: '0.68rem',
                                  color: winnerRank === 1 ? 'var(--acid)' : winnerRank === 2 ? 'var(--cyan)' : '#f59e0b',
                                  fontWeight: 800,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                }}
                              >
                                🏆 {team.winnerTitle}
                              </span>
                            )}
                          </div>
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
                            <span>VIEW PROFILE</span>
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

        {/* View Squad Profile Modal */}
        {selectedTeamModal && (
          <Modal
            isOpen={!!selectedTeamModal}
            onClose={() => setSelectedTeamModal(null)}
            title={`${selectedTeamModal.teamName} // SQUAD PROFILE`}
            subtitle={`SL NO: #${String(selectedTeamModal.slNo).padStart(2, '0')} • TRACK: ${selectedTeamModal.category}`}
          >
            <div>
              {/* Winner Banner inside Modal if squad is a winner */}
              {selectedTeamModal.isWinner && (
                <div
                  style={{
                    background: 'rgba(234, 255, 0, 0.12)',
                    border: '2px solid var(--acid)',
                    padding: '1rem 1.25rem',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <Trophy size={24} color="var(--acid)" />
                  <div>
                    <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--acid)', fontWeight: 900 }}>
                      OFFICIAL KD'S GARAGE WINNER
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--white)' }}>
                      {selectedTeamModal.winnerTitle}
                    </div>
                  </div>
                </div>
              )}

              {/* Status Header Box */}
              <div
                style={{
                  background: selectedTeamModal.isEligibleForRound2 ? 'rgba(234, 255, 0, 0.08)' : 'rgba(255, 255, 255, 0.04)',
                  border: selectedTeamModal.isEligibleForRound2 ? '2px solid var(--acid)' : '2px solid var(--line)',
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
                    SQUAD NAME
                  </div>
                  <div className="font-display" style={{ fontSize: '2rem', color: 'var(--white)', lineHeight: 1.2 }}>
                    {selectedTeamModal.teamName}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.35rem' }}>
                    Team Leader: <strong style={{ color: 'var(--acid)' }}>{selectedTeamModal.teamLeader}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.35rem 0.75rem',
                      background: selectedTeamModal.isEligibleForRound2 ? 'var(--acid)' : 'var(--ink)',
                      color: selectedTeamModal.isEligibleForRound2 ? 'var(--ink)' : 'var(--muted)',
                      border: selectedTeamModal.isEligibleForRound2 ? '2px solid var(--ink)' : '1px solid var(--line)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      fontWeight: 900,
                    }}
                  >
                    {selectedTeamModal.isEligibleForRound2 ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    {selectedTeamModal.isEligibleForRound2 ? 'QUALIFIED FOR ROUND 2' : 'ROUND 1 CONCLUDED'}
                  </span>
                  <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--white)', marginTop: '0.5rem', fontWeight: 800 }}>
                    STANDING #{String(selectedTeamModal.slNo).padStart(2, '0')}
                  </div>
                </div>
              </div>

              {/* Round 2 Status Evaluation Note */}
              <div
                style={{
                  background: 'var(--ink)',
                  border: '1px solid var(--line)',
                  padding: '0.85rem 1.25rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>
                  ROUND 2 EVALUATION STATUS
                </div>
                <div style={{ fontSize: '0.85rem', color: selectedTeamModal.isEligibleForRound2 ? 'var(--acid)' : 'var(--muted)', fontWeight: 600 }}>
                  {selectedTeamModal.isEligibleForRound2
                    ? '✓ This squad has satisfied the Round 2 qualification benchmark and is eligible for the Round 2 evaluation.'
                    : '— This squad has completed Round 1 evaluation.'}
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
                  // SQUAD ROSTER ({selectedTeamModal.members.length} MEMBERS)
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
