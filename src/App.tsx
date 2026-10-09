import React, { useState } from 'react';
import type { NavigationTab, ProblemStatement } from './types';
import { Starfield } from './components/background/Starfield';
import { CosmicGrid } from './components/background/CosmicGrid';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';
import { BootLoader } from './components/ui/BootLoader';

// Pages
import { HomePage } from './pages/HomePage';
import { ProblemStatementsPage } from './pages/ProblemStatementsPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ResultsPage } from './pages/ResultsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';

export function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [selectedProblem, setSelectedProblem] = useState<ProblemStatement | null>(null);

  // BootLoader state (run once per session)
  const [isBooting, setIsBooting] = useState<boolean>(() => {
    return !sessionStorage.getItem('cypher_booted');
  });

  const handleBootComplete = () => {
    setIsBooting(false);
    sessionStorage.setItem('cypher_booted', 'true');
  };

  // Navigation Handlers
  const handleSelectTab = (tab: NavigationTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInspectProblemFromHome = (ps: ProblemStatement) => {
    setSelectedProblem(ps);
    setActiveTab('problems');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Retro-Futuristic OS Startup BootLoader */}
      {isBooting && <BootLoader onComplete={handleBootComplete} durationMs={2000} />}

      {/* 2. Cosmic Deep Environment Backgrounds */}
      <Starfield particleCount={70} speed={0.25} />
      <CosmicGrid density="normal" showScanlines={true} />

      {/* 3. Sticky Cosmic Neo-Brutalist Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
      />

      {/* 4. Main View Area */}
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {activeTab === 'home' && (
          <HomePage
            onSelectTab={handleSelectTab}
            onSelectProblem={handleInspectProblemFromHome}
          />
        )}

        {activeTab === 'problems' && (
          <ProblemStatementsPage
            onSelectTab={handleSelectTab}
            selectedModalProblem={selectedProblem}
            onCloseModal={() => setSelectedProblem(null)}
          />
        )}

        {activeTab === 'resources' && (
          <ResourcesPage
            onSelectTab={handleSelectTab}
          />
        )}

        {activeTab === 'results' && (
          <ResultsPage
            onSelectTab={handleSelectTab}
            onSelectProblem={handleInspectProblemFromHome}
          />
        )}

        {activeTab === 'how-it-works' && (
          <HowItWorksPage
            onSelectTab={handleSelectTab}
          />
        )}
      </main>

      {/* 5. Cosmic Neo-Brutalist High-Contrast Footer */}
      <Footer
        onSelectTab={handleSelectTab}
      />
    </div>
  );
}

export default App;
