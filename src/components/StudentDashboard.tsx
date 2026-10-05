import React, { useState, useEffect } from 'react';
import { TestSummary } from '../types.ts';
import { ApiClient } from '../lib/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useI18n } from '../lib/i18n.tsx';
import { BookOpen, Clock, Award, Search, ArrowRight, Zap, Lightbulb, Target, Sparkles, Star } from 'lucide-react';

interface StudentDashboardProps {
  onStartTest: (testId: string) => void;
  onStartBlitz: () => void;
  onGoToMistakes: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onStartTest,
  onStartBlitz,
  onGoToMistakes
}) => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [tests, setTests] = useState<TestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadTests() {
      try {
        setLoading(true);
        const data = await ApiClient.getActiveTests();
        // Enforce 5-minute standard ("5 minuta bolsin")
        const standardized = data.map(item => ({ ...item, durationMinutes: 5 }));
        setTests(standardized);
      } catch (err: any) {
        setError(err.message || 'Testlarni yuklashda xatolik yuz berdi.');
      } finally {
        setLoading(false);
      }
    }
    loadTests();
  }, []);

  const subjects = ['all', 'Matematika', 'Fizika', 'Ona tili', 'IT va Dasturlash'];
  const categories = ['all', 'DTM', 'Olimpiada', 'Sertifikat'];

  const filteredTests = tests.filter(tItem => {
    const matchesSubject = selectedSubject === 'all' || tItem.subject.toLowerCase().includes(selectedSubject.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || (tItem.category && tItem.category.toLowerCase() === selectedCategory.toLowerCase());
    const matchesSearch = tItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tItem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tItem.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner Section with Cosmic Nebula Aesthetic */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-indigo-500/30 text-white shadow-2xl shadow-indigo-950/40">
        <div className="absolute inset-0 z-0 opacity-45 mix-blend-screen">
          <img
            src="/src/assets/images/cosmic_space_bg_1791174545874.jpg"
            alt="Cosmic Space Bilim Arena"
            className="w-full h-full object-cover scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.heroBadge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t.heroTitle}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            {t.heroDesc}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('tests-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98] text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <span>{t.viewTests}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onStartBlitz}
              className="h-11 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-[0.98] text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>{t.blitzButton}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Quick Launch Cards (Cosmic Glassmorphism) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={onStartBlitz}
          className="p-5 rounded-2xl bg-slate-900/75 backdrop-blur-md border border-amber-500/30 hover:border-amber-400/60 hover:shadow-lg hover:shadow-amber-500/10 transition-all cursor-pointer group flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-md">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                {t.blitzButton}
              </h3>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">5 MIN</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {t.blitzDesc}
            </p>
          </div>
        </div>

        <div
          onClick={onGoToMistakes}
          className="p-5 rounded-2xl bg-slate-900/75 backdrop-blur-md border border-rose-500/30 hover:border-rose-400/60 hover:shadow-lg hover:shadow-rose-500/10 transition-all cursor-pointer group flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
              {t.mistakesButton}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {t.mistakesDesc}
            </p>
          </div>
        </div>

        <div
          onClick={() => {
            const el = document.getElementById('tests-grid');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="p-5 rounded-2xl bg-slate-900/75 backdrop-blur-md border border-indigo-500/30 hover:border-indigo-400/60 hover:shadow-lg hover:shadow-indigo-500/10 transition-all cursor-pointer group flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
              {t.officialBadge}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {t.officialDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Controls */}
      <section id="tests-grid" className="space-y-4 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>{t.testsTitle}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
                5 {t.minutes}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.testsSubtitle}
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-indigo-500/30 bg-slate-900/80 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
            />
          </div>
        </div>

        {/* Categories and Subjects Filter Bar */}
        <div className="space-y-2.5">
          {/* Subject Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {subjects.map(subj => {
              const isSelected = selectedSubject === subj;
              const label = subj === 'all' ? t.allSubjects : subj;
              return (
                <button
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 font-bold border border-indigo-400/40'
                      : 'bg-slate-900/70 border border-slate-800 text-slate-300 hover:bg-slate-800 backdrop-blur-md'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider">
              Format:
            </span>
            {categories.map(cat => {
              const isSelected = selectedCategory === cat;
              const label = cat === 'all' ? t.allFormats : cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-400/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tests Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 rounded-3xl bg-slate-900/60 border border-indigo-500/20 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 rounded-3xl bg-rose-950/40 border border-rose-900/50 text-center">
          <p className="text-sm text-rose-300">{error}</p>
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/70 backdrop-blur-md border border-slate-800 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-indigo-400 mx-auto" />
          <h3 className="text-base font-semibold text-slate-200">
            Hech qanday test topilmadi
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Qidiruv so'zini o'zgartirib ko'ring yoki boshqa fanni tanlang.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => {
            const isMath = test.subject.toLowerCase().includes('matematika') || test.subject.toLowerCase().includes('fizika');
            const isIT = test.subject.toLowerCase().includes('it') || test.subject.toLowerCase().includes('informatika');

            const diff = test.difficulty || 'O\'rta';
            const diffColor =
              diff === 'Oson'
                ? 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40'
                : diff === 'Qiyin'
                ? 'text-rose-300 bg-rose-950/60 border-rose-500/40'
                : 'text-amber-300 bg-amber-950/60 border-amber-500/40';

            return (
              <div
                key={test.id}
                className="group bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-indigo-500/20 overflow-hidden hover:border-indigo-400/50 hover:shadow-xl hover:shadow-indigo-950/40 transition-all flex flex-col"
              >
                {/* Visual Header */}
                <div className="h-36 relative overflow-hidden bg-slate-950">
                  <img
                    src={
                      isMath
                        ? '/src/assets/images/subject_stem_math_1791171049470.jpg'
                        : isIT
                        ? '/src/assets/images/subject_it_code_1791171061691.jpg'
                        : '/src/assets/images/hero_test_education_1791171035247.jpg'
                    }
                    alt={test.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold bg-slate-950/70 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg">
                      {test.subject}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${diffColor}`}>
                      {diff}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-2 group-hover:text-indigo-400 transition-colors">
                      {test.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {test.description}
                    </p>
                  </div>

                  {/* Metadata Specs with 5-minute standard */}
                  <div className="pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{test.questionsCount} {t.questionsCount}</span>
                      </div>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <div className="flex items-center gap-1.5 font-bold text-amber-300">
                        <Clock className="w-3.5 h-3.5" />
                        <span>5 {t.minutes}</span>
                      </div>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{test.passingScore}% {t.passingScore}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onStartTest(test.id)}
                      className="w-full mt-4 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                    >
                      <span>{t.startTest}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
