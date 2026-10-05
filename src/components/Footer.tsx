import React from 'react';
import { useI18n } from '../lib/i18n.tsx';
import { Send, ShieldCheck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useI18n();

  return (
    <footer className="border-t border-indigo-500/20 bg-slate-950/80 backdrop-blur-xl py-8 px-4 sm:px-6 transition-colors print:hidden text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-extrabold text-[10px] shadow-sm">
            <Sparkles className="w-3 h-3" />
          </div>
          <span className="font-bold text-white">{t.appName}</span>
          <span className="text-slate-400">· {t.tagline}</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Xavfsiz server-side tekshiruv (5 min)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-indigo-400" />
            <span>Telegram bot bilan himoyalangan</span>
          </span>
        </div>

        <div>
          <span>© {new Date().getFullYear()} {t.appName}. Barcha huquqlar himoyalangan.</span>
        </div>
      </div>
    </footer>
  );
};
