import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { UserPreferencesProvider, useUserPreferences } from './context/UserPreferencesContext';
import PageLayout from './components/layout/PageLayout';
import Dashboard from './pages/Dashboard';
import AIInterrogator from './pages/AIInterrogator';
import DCFModel from './pages/DCFModel';
import PortfolioRisk from './pages/PortfolioRisk';
import Settings from './pages/Settings';
import FinancialCalculators from './pages/FinancialCalculators';
import IndustryAnalysis from './pages/IndustryAnalysis';
import OnboardingModal from './components/onboarding/OnboardingModal';

// Inner component that can use the UserPreferences context
function AppContent() {
  const { isOnboarded } = useUserPreferences();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Show onboarding modal if user hasn't completed onboarding
    if (!isOnboarded) {
      setShowOnboarding(true);
    }
  }, [isOnboarded]);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };

  return (
    <>
      <PageLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/interrogator" element={<AIInterrogator />} />
          <Route path="/dcf-model" element={<DCFModel />} />
          <Route path="/portfolio-risk" element={<PortfolioRisk />} />
          <Route path="/calculators" element={<FinancialCalculators />} />
          <Route path="/industry" element={<IndustryAnalysis />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </PageLayout>

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleCloseOnboarding}
      />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SubscriptionProvider>
          <UserPreferencesProvider>
            <AppContent />
          </UserPreferencesProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

