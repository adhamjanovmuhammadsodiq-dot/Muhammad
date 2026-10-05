import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { I18nProvider, useI18n } from './lib/i18n.tsx';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { StudentDashboard } from './components/StudentDashboard.tsx';
import { TestTakingView } from './components/TestTakingView.tsx';
import { TestResultView } from './components/TestResultView.tsx';
import { MySubmissionsView } from './components/MySubmissionsView.tsx';
import { MistakesBankView } from './components/MistakesBankView.tsx';
import { TeacherDashboard } from './components/TeacherDashboard.tsx';
import { StatsRatingView } from './components/StatsRatingView.tsx';
import { ApiClient } from './lib/api.ts';
import { ActiveTestDetails, Submission } from './types.ts';

const MainContent: React.FC = () => {
  const { user } = useAuth();
  const { t } = useI18n();

  const [currentView, setCurrentView] = useState<'tests' | 'results' | 'mistakes' | 'stats' | 'teacher'>('tests');
  const [activeTestTaking, setActiveTestTaking] = useState<ActiveTestDetails | null>(null);
  const [activeSubmission, setActiveSubmission] = useState<Submission | null>(null);
  const [loadingTest, setLoadingTest] = useState(false);

  // Start test
  const handleStartTest = async (testId: string) => {
    try {
      setLoadingTest(true);
      const testData = await ApiClient.getTestToTake(testId);
      // Ensure duration is 5 minutes as requested ("5 minuta bolsin")
      testData.durationMinutes = 5;
      setActiveSubmission(null);
      setActiveTestTaking(testData);
    } catch (err: any) {
      alert(err.message || 'Testni boshlashda xatolik yuz berdi.');
    } finally {
      setLoadingTest(false);
    }
  };

  // Start Blitz Arena Challenge (5 minutes)
  const handleStartBlitz = async () => {
    try {
      setLoadingTest(true);
      const blitzData = await ApiClient.getBlitzChallenge();
      blitzData.durationMinutes = 5;
      setActiveSubmission(null);
      setActiveTestTaking(blitzData);
    } catch (err: any) {
      alert(err.message || 'Blitz challenge yuklashda xatolik yuz berdi.');
    } finally {
      setLoadingTest(false);
    }
  };

  // Finish test
  const handleFinishTest = (submission: Submission) => {
    setActiveTestTaking(null);
    setActiveSubmission(submission);
  };

  // Retake test
  const handleRetake = () => {
    if (activeSubmission) {
      handleStartTest(activeSubmission.testId);
    }
  };

  // Back to catalog
  const handleBackToCatalog = () => {
    setActiveTestTaking(null);
    setActiveSubmission(null);
    setCurrentView('tests');
  };

  // If student is currently taking an exam:
  if (activeTestTaking) {
    return (
      <div className="relative min-h-screen">
        <div className="cosmic-bg" />
        <div className="cosmic-stars" />
        <TestTakingView
          test={activeTestTaking}
          onFinish={handleFinishTest}
          onCancel={handleBackToCatalog}
        />
      </div>
    );
  }

  // If student is viewing the result of a submitted test:
  if (activeSubmission) {
    return (
      <div className="relative min-h-screen flex flex-col">
        <div className="cosmic-bg" />
        <div className="cosmic-stars" />
        <Header currentView={currentView} onNavigate={setCurrentView} />
        <main className="flex-1">
          <TestResultView
            submission={activeSubmission}
            onRetake={handleRetake}
            onBackToTests={handleBackToCatalog}
            onGoToMistakes={() => {
              setActiveSubmission(null);
              setCurrentView('mistakes');
            }}
          />
        </main>
        <Footer />
        <AuthModal />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col transition-colors">
      {/* Cosmic Space Background Layers */}
      <div className="cosmic-bg" />
      <div className="cosmic-stars" />

      <Header
        currentView={currentView}
        onNavigate={(view) => {
          setActiveSubmission(null);
          setActiveTestTaking(null);
          setCurrentView(view);
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {loadingTest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md">
            <div className="bg-slate-900 border border-indigo-500/30 p-6 rounded-2xl shadow-2xl flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-semibold text-white">
                Test yuklanmoqda...
              </span>
            </div>
          </div>
        )}

        {currentView === 'tests' && (
          <StudentDashboard
            onStartTest={handleStartTest}
            onStartBlitz={handleStartBlitz}
            onGoToMistakes={() => setCurrentView('mistakes')}
          />
        )}

        {currentView === 'results' && (
          <MySubmissionsView
            onSelectSubmission={(sub) => setActiveSubmission(sub)}
            onGoToTests={() => setCurrentView('tests')}
          />
        )}

        {currentView === 'mistakes' && (
          <MistakesBankView onGoToTests={() => setCurrentView('tests')} />
        )}

        {currentView === 'stats' && (
          <StatsRatingView />
        )}

        {currentView === 'teacher' && (
          <TeacherDashboard />
        )}
      </main>

      <Footer />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </I18nProvider>
  );
}
