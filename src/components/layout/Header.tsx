import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Sun, Moon, Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDark = false, onToggleTheme }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNewEntry = () => {
    setIsMenuOpen(false);
    navigate('/journal?new=1');
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 px-3 py-3 backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-950/85 sm:px-0">
      <div className="container-custom">
        <div className="relative flex items-center justify-between rounded-full border border-white/60 bg-white/70 px-3 py-2 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.24)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-black/10 bg-white p-2 shadow-lg shadow-black/10 dark:border-white/10 dark:bg-neutral-950">
              <Brain className="h-5 w-5 text-neutral-950 dark:text-white" />
            </div>
            <span className="text-base font-semibold tracking-tight text-neutral-950 dark:text-white">AI MoodCraft</span>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/" className="text-sm font-medium text-neutral-700 transition-colors hover:text-black dark:text-neutral-300 dark:hover:text-white">Dashboard</Link>
            <Link to="/journal" className="text-sm font-medium text-neutral-700 transition-colors hover:text-black dark:text-neutral-300 dark:hover:text-white">Journal</Link>
            <Link to="/insights" className="text-sm font-medium text-neutral-700 transition-colors hover:text-black dark:text-neutral-300 dark:hover:text-white">Insights</Link>
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
            <Button
              variant="ghost"
              size="sm"
              type="button"
              className="md:hidden"
              onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              <Menu size={18} />
            </Button>
          </div>

          {isMenuOpen && (
            <nav
              id="mobile-navigation"
              aria-label="Mobile navigation"
              className="absolute left-0 right-0 top-[calc(100%+0.5rem)] flex flex-col gap-1 rounded-2xl border border-white/70 bg-white/95 p-2 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/95 md:hidden"
            >
              <Link to="/" onClick={closeMenu} className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-violet-50 hover:text-violet-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white">
                Dashboard
              </Link>
              <Link to="/journal" onClick={closeMenu} className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-violet-50 hover:text-violet-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white">
                Journal
              </Link>
              <Link to="/insights" onClick={closeMenu} className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-violet-50 hover:text-violet-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white">
                Insights
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};
