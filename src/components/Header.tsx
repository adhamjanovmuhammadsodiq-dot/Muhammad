import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useI18n, Language } from '../lib/i18n.tsx';
import { Sun, Moon, User as UserIcon, LogOut, ShieldCheck, Menu, X, BookOpen, Award, BarChart2, Globe, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentView: 'tests' | 'results' | 'mistakes' | 'stats' | 'teacher';
  onNavigate: (view: 'tests' | 'results' | 'mistakes' | 'stats' | 'teacher') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const { user, openAuthModal, logout, darkMode, toggleDarkMode, quickLoginAsTeacher } = useAuth();
  const { lang, setLang, t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const handleQuickUstoz = async () => {
    await quickLoginAsTeacher();
    onNavigate('teacher');
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'uz', label: "O'zbekcha", flag: "🇺🇿" },
    { code: 'uz_cyrl', label: "Ўзбекча", flag: "🇺🇿" },
    { code: 'ru', label: "Русский", flag: "🇷🇺" },
    { code: 'en', label: "English", flag: "🇬🇧" }
  ];

  const currentLangObj = languages.find(l => l.code === lang) || languages[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-xl border-b border-indigo-500/20 text-slate-100 transition-colors shadow-lg shadow-indigo-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Brand wordmark with cosmic glow */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('tests')}
            className="flex items-center gap-2.5 group text-left focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center font-extrabold text-base shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                {t.appName}
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
                  5 MIN
                </span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('tests')}
            className={`transition-colors hover:text-white py-1 relative cursor-pointer ${
              currentView === 'tests' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            {t.navTests}
            {currentView === 'tests' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
            )}
          </button>

          <button
            onClick={() => onNavigate('results')}
            className={`transition-colors hover:text-white py-1 relative cursor-pointer ${
              currentView === 'results' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            {t.navResults}
            {currentView === 'results' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
            )}
          </button>

          <button
            onClick={() => onNavigate('mistakes')}
            className={`transition-colors hover:text-white py-1 relative cursor-pointer ${
              currentView === 'mistakes' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            {t.navMistakes}
            {currentView === 'mistakes' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
            )}
          </button>

          <button
            onClick={() => onNavigate('stats')}
            className={`transition-colors hover:text-white py-1 relative cursor-pointer ${
              currentView === 'stats' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            {t.navRating}
            {currentView === 'stats' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
            )}
          </button>

          <button
            onClick={() => onNavigate('teacher')}
            className={`transition-colors hover:text-white py-1 relative cursor-pointer ${
              currentView === 'teacher' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            {t.navTeacher}
            {currentView === 'teacher' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
            )}
          </button>
        </nav>

        {/* Zone 3: Actions (Language switcher, Quick Ustoz, Auth) */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Multi-language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="h-9 px-2.5 rounded-xl border border-indigo-500/30 bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Tilni o'zgartirish / Change language"
            >
              <span>{currentLangObj.flag}</span>
              <span className="hidden sm:inline">{currentLangObj.label}</span>
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-slate-900/95 backdrop-blur-xl border border-indigo-500/30 rounded-2xl shadow-2xl py-1.5 z-50 animate-in fade-in">
                {languages.map(l => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center gap-2 hover:bg-indigo-600/20 transition-colors cursor-pointer ${
                      lang === l.code ? 'text-indigo-400 font-bold bg-indigo-500/10' : 'text-slate-300'
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User state / Auth action */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-200 truncate max-w-[130px]">
                  {user.firstName} {user.lastName}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  user.role === 'teacher' || user.role === 'admin'
                    ? 'text-indigo-400 bg-indigo-500/20 border border-indigo-500/30'
                    : 'text-slate-400'
                }`}>
                  {user.role === 'teacher' || user.role === 'admin' ? t.teacherAdmin : "O'quvchi"}
                </span>
              </div>

              {user.role !== 'teacher' && user.role !== 'admin' && (
                <button
                  onClick={handleQuickUstoz}
                  title="Ustoz / Admin kabinetiga o'tish"
                  className="hidden sm:flex h-9 px-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold items-center gap-1.5 hover:bg-amber-500/30 cursor-pointer transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t.becomeTeacher}</span>
                </button>
              )}

              <button
                onClick={logout}
                title={t.signOut}
                className="h-9 px-3 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">{t.signOut}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleQuickUstoz}
                title="Ustoz / Admin sifatida darhol kirish"
                className="h-9 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{t.teacherAdmin}</span>
              </button>

              <button
                onClick={() => openAuthModal('student')}
                className="h-9 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span>{t.signIn}</span>
              </button>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-xl border border-slate-800 flex items-center justify-center text-slate-300 hover:bg-slate-800 focus:outline-none"
            aria-label="Menyu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-indigo-500/20 bg-slate-950/95 backdrop-blur-2xl px-4 py-4 space-y-2 animate-in fade-in">
          <button
            onClick={() => {
              onNavigate('tests');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentView === 'tests'
                ? 'bg-indigo-600/20 text-indigo-400 font-bold border border-indigo-500/30'
                : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            {t.navTests}
          </button>

          <button
            onClick={() => {
              onNavigate('results');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentView === 'results'
                ? 'bg-indigo-600/20 text-indigo-400 font-bold border border-indigo-500/30'
                : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            {t.navResults}
          </button>

          <button
            onClick={() => {
              onNavigate('mistakes');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentView === 'mistakes'
                ? 'bg-indigo-600/20 text-indigo-400 font-bold border border-indigo-500/30'
                : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            {t.navMistakes}
          </button>

          <button
            onClick={() => {
              onNavigate('stats');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentView === 'stats'
                ? 'bg-indigo-600/20 text-indigo-400 font-bold border border-indigo-500/30'
                : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            {t.navRating}
          </button>

          <button
            onClick={() => {
              onNavigate('teacher');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentView === 'teacher'
                ? 'bg-indigo-600/20 text-indigo-400 font-bold border border-indigo-500/30'
                : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            {t.navTeacher}
          </button>

          {user?.role !== 'teacher' && user?.role !== 'admin' && (
            <button
              onClick={() => {
                handleQuickUstoz();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              {t.teacherAdmin} (1 bosishda)
            </button>
          )}

          {/* Mobile Language Picker */}
          <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
            {languages.map(l => (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code);
                  setMobileMenuOpen(false);
                }}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors ${
                  lang === l.code
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                    : 'border-slate-800 bg-slate-900 text-slate-400'
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
