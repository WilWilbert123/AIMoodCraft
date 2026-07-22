import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Sun, Moon, Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDark = false, onToggleTheme }) => {
  const navigate = useNavigate();

  const handleNewEntry = () => {
    navigate('/journal?new=1');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 px-3 py-3 backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-950/85 sm:px-0">
      <div className="container-custom">
        <div className="flex items-center justify-between rounded-full border border-white/60 bg-white/70 px-3 py-2 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.24)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 p-2 shadow-lg shadow-violet-500/20">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">AI MoodCraft</span>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Dashboard</Link>
            <Link to="/journal" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Journal</Link>
            <Link to="/insights" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Insights</Link>
          </nav>

          <div className="flex items-center gap-2">
            {onToggleTheme && (
              <Button variant="ghost" size="sm" onClick={onToggleTheme} className="hidden md:inline-flex">
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
            )}
            <Button variant="primary" size="sm" type="button" onClick={handleNewEntry}>
              New Entry
            </Button>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu size={18} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};