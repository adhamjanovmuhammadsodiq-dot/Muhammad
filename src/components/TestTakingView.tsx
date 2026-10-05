import React, { useState, useEffect, useRef } from 'react';
import { ActiveTestDetails, QuestionOption } from '../types.ts';
import { ApiClient } from '../lib/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useI18n } from '../lib/i18n.tsx';
import { Clock, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, Flag, HelpCircle, Send, ArrowLeft, Maximize, Minimize, Calculator, FileEdit, Type, ShieldAlert } from 'lucide-react';

interface TestTakingViewProps {
  test: ActiveTestDetails;
  onFinish: (submission: any) => void;
  onCancel: () => void;
}

export const TestTakingView: React.FC<TestTakingViewProps> = ({ test, onFinish, onCancel }) => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [guestName, setGuestName] = useState('O\'quvchi');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>(() => {
    try {
      const saved = localStorage.getItem(`test_progress_${test.id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  // Always 5 minutes (300 seconds) standard test duration
  const [secondsRemaining, setSecondsRemaining] = useState(() => (test.durationMinutes || 5) * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [startTime] = useState(Date.now());
  const autoSubmittedRef = useRef(false);

  // Exam tools
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('normal');
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [scratchpadText, setScratchpadText] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabWarnings, setTabWarnings] = useState(0);

  // Tab visibility proctoring warning
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabWarnings(prev => prev + 1);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Auto-save progress locally
  useEffect(() => {
    localStorage.setItem(`test_progress_${test.id}`, JSON.stringify(answers));
  }, [answers, test.id]);

  // Exam countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!autoSubmittedRef.current) {
            autoSubmittedRef.current = true;
            handleSubmitTest();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentQuestion = test.questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = test.questions.length;
  const unansweredCount = totalQuestions - answeredCount;

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: key
    }));
  };

  const toggleFlag = (qId: string) => {
    setFlagged(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSubmitTest = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setShowConfirmModal(false);

    try {
      const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);
      const submission = await ApiClient.submitTest(test.id, {
        answers,
        timeSpentSeconds,
        guestName: user ? undefined : guestName.trim() || 'O\'quvchi',
      });

      // Clear local progress
      localStorage.removeItem(`test_progress_${test.id}`);
      onFinish(submission);
    } catch (err: any) {
      alert(err.message || 'Testni yuborishda xatolik yuz berdi.');
      setIsSubmitting(false);
    }
  };

  const handleCalcBtn = (val: string) => {
    if (val === 'C') {
      setCalcDisplay('0');
    } else if (val === '=') {
      try {
        // Safe evaluation of simple arithmetic
        const sanitized = calcDisplay.replace(/[^0-9+\-*/.]/g, '');
        // eslint-disable-next-line no-eval
        const res = Function(`'use strict'; return (${sanitized})`)();
        setCalcDisplay(String(res));
      } catch {
        setCalcDisplay('Xatolik');
      }
    } else {
      setCalcDisplay(prev => (prev === '0' || prev === 'Xatolik') ? val : prev + val);
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLowTime = secondsRemaining <= 180; // 3 minutes warning

  const questionTextSize =
    fontSize === 'huge'
      ? 'text-lg sm:text-2xl leading-relaxed'
      : fontSize === 'large'
      ? 'text-base sm:text-xl leading-relaxed'
      : 'text-sm sm:text-lg leading-relaxed';

  return (
    <div className="min-h-screen bg-transparent flex flex-col pb-16">
      {/* Tab Warning Toast */}
      {tabWarnings > 0 && (
        <div className="bg-amber-500/90 backdrop-blur-md text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 shadow-lg">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>
            Diqqat: Siz imtihon oynasidan {tabWarnings} marta boshqa sahifaga o'tdingiz. Tizimda barcha harakatlar qayd etilmoqda.
          </span>
        </div>
      )}

      {/* Sticky Top Exam Bar */}
      <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-xl border-b border-indigo-500/20 py-3 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => {
                if (confirm('Testdan chiqmoqchimisiz? Natijalar saqlanmasligi mumkin.')) {
                  onCancel();
                }
              }}
              title="Orqaga qaytish"
              className="w-9 h-9 rounded-xl border border-indigo-500/30 bg-slate-900/80 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 shrink-0 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-indigo-400 block truncate">
                {test.subject} · {test.grade} · 5 MIN
              </span>
              <h1 className="text-sm sm:text-base font-bold text-white truncate">
                {test.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Font size toggle */}
            <button
              onClick={() => {
                setFontSize(prev => prev === 'normal' ? 'large' : prev === 'large' ? 'huge' : 'normal');
              }}
              title="Shrift hajmini o'zgartirish"
              className="w-8 h-8 rounded-lg border border-indigo-500/30 bg-slate-900/80 text-slate-300 flex items-center justify-center text-xs font-bold hover:bg-slate-800 cursor-pointer"
            >
              <Type className="w-3.5 h-3.5" />
            </button>

            {/* Calculator toggle */}
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              title={t.calculator}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                showCalculator
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                  : 'border-indigo-500/30 bg-slate-900/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
            </button>

            {/* Scratchpad toggle */}
            <button
              onClick={() => setShowScratchpad(!showScratchpad)}
              title={t.scratchpad}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                showScratchpad
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                  : 'border-indigo-500/30 bg-slate-900/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5" />
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              title="To'liq ekran"
              className="hidden sm:flex w-8 h-8 rounded-lg border border-indigo-500/30 bg-slate-900/80 text-slate-300 items-center justify-center hover:bg-slate-800 cursor-pointer"
            >
              {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
            </button>

            {/* Live Countdown (5 minutes) */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-bold border transition-colors ${
              isLowTime
                ? 'bg-rose-950/60 border-rose-500/50 text-rose-400 animate-pulse'
                : 'bg-slate-900/80 border-indigo-500/30 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.15)]'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>

            {/* Complete Test CTA */}
            <button
              onClick={() => setShowConfirmModal(true)}
              className="h-9 px-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.finishTest}</span>
              <span className="sm:hidden">{t.finishTest}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Examination Stage */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Question Area (3 columns on desktop) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-indigo-500/25 p-5 sm:p-7 shadow-xl shadow-indigo-950/30">
            {/* Question Header & Meta */}
            <div className="flex items-center justify-between pb-4 border-b border-indigo-500/20 mb-5">
              <span className="text-xs font-semibold text-slate-400">
                Savol {currentIndex + 1} / {totalQuestions}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFlag(currentQuestion.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    flagged[currentQuestion.id]
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{flagged[currentQuestion.id] ? t.reviewFlag : t.reviewFlag}</span>
                </button>
              </div>
            </div>

            {/* Question Text */}
            <h2 className={`${questionTextSize} font-medium text-white mb-6 select-none`}>
              {currentQuestion.text}
            </h2>

            {/* Options List */}
            <div className="space-y-3">
              {currentQuestion.options.map((option: QuestionOption) => {
                const isSelected = answers[currentQuestion.id] === option.key;
                return (
                  <button
                    key={option.key}
                    onClick={() => handleSelectOption(option.key)}
                    className={`w-full min-h-[52px] p-4 rounded-2xl text-left border flex items-center gap-3.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-400 bg-indigo-600/30 text-white ring-2 ring-indigo-500/30 shadow-md shadow-indigo-600/20'
                        : 'border-indigo-500/20 bg-slate-800/60 hover:border-indigo-400/40 text-slate-200'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-indigo-500 text-white shadow-sm'
                          : 'bg-slate-800 border border-slate-700 text-slate-300'
                      }`}
                    >
                      {option.key}
                    </div>
                    <span className="text-sm font-normal leading-snug flex-1">
                      {option.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="h-11 px-4 rounded-xl border border-indigo-500/20 text-slate-300 bg-slate-900/80 hover:bg-slate-800 text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.prev}</span>
            </button>

            <span className="text-xs text-slate-400 font-mono">
              {currentIndex + 1} / {totalQuestions}
            </span>

            {currentIndex < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                className="h-11 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <span>{t.next}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold flex items-center gap-2 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <span>{t.submit}</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Palette & Tools Drawer */}
        <div className="space-y-4">
          {/* Question Grid */}
          <div className="bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-indigo-500/25 p-5 shadow-xl shadow-indigo-950/20">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {t.questionMap}
            </h3>

            <div className="grid grid-cols-5 gap-2">
              {test.questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = Boolean(answers[q.id]);
                const isFlagged = Boolean(flagged[q.id]);

                let bgClass = 'bg-slate-800/80 text-slate-400 border-slate-700';
                if (isCurrent) {
                  bgClass = 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white ring-2 ring-indigo-400 shadow-md shadow-indigo-500/30';
                } else if (isAnswered) {
                  bgClass = 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40';
                } else if (isFlagged) {
                  bgClass = 'bg-amber-950/60 text-amber-300 border-amber-500/40';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-xl font-mono text-xs font-bold border flex items-center justify-center transition-all cursor-pointer ${bgClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-5 pt-4 border-t border-slate-800 space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span>{t.answered}: <b>{answeredCount} ta</b></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                <span>{t.unanswered}: <b>{unansweredCount} ta</b></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>{t.reviewFlag}: <b>{Object.values(flagged).filter(Boolean).length} ta</b></span>
              </div>
            </div>
          </div>

          {/* Interactive Calculator */}
          {showCalculator && (
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-indigo-500/30 p-4 shadow-2xl animate-in fade-in space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-indigo-400" />
                  {t.calculator}
                </span>
                <button
                  onClick={() => setShowCalculator(false)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-right text-base font-bold text-white border border-indigo-500/20 truncate">
                {calcDisplay}
              </div>

              <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
                {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '=', '+'].map(btn => (
                  <button
                    key={btn}
                    onClick={() => handleCalcBtn(btn)}
                    className="h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer border border-slate-700/50"
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Scratchpad */}
          {showScratchpad && (
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-indigo-500/30 p-4 shadow-2xl animate-in fade-in space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <FileEdit className="w-4 h-4 text-indigo-400" />
                  {t.scratchpad}
                </span>
                <button
                  onClick={() => setShowScratchpad(false)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <textarea
                rows={4}
                placeholder="Formulalar va hisob-kitoblar uchun qoralama..."
                value={scratchpadText}
                onChange={(e) => setScratchpadText(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-indigo-500/20 bg-slate-950 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 rounded-3xl p-6 shadow-2xl border border-indigo-500/30 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {t.modalFinishTitle}
                </h3>
                <p className="text-xs text-slate-400">
                  {t.modalFinishDesc}
                </p>
              </div>
            </div>

            {!user && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.yourName}
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Sardor"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-500/30 bg-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-indigo-500/20 space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Jami savollar:</span>
                <span className="font-semibold text-white">{totalQuestions} ta</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Belgilangan javoblar:</span>
                <span className="font-semibold">{answeredCount} ta</span>
              </div>
              {unansweredCount > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>Belgilanmagan savollar:</span>
                  <span className="font-semibold">{unansweredCount} ta</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-medium cursor-pointer"
              >
                {t.continueSolving}
              </button>
              <button
                type="button"
                onClick={handleSubmitTest}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 cursor-pointer"
              >
                {isSubmitting ? 'Hisoblanmoqda...' : t.confirmFinish}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
