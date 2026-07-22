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
    <header className="bg-white/90 border-b border-gray-200/80 sticky top-0 z-50 backdrop-blur-sm transition-colors duration-300 dark:bg-gray-900/90 dark:border-gray-800">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">AI MoodCraft</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-300 dark:hover:text-white">Dashboard</Link>
            <Link to="/journal" className="text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-300 dark:hover:text-white">Journal</Link>
            <Link to="/insights" className="text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-300 dark:hover:text-white">Insights</Link>
          </nav>

          <div className="flex items-center gap-2">
            {onToggleTheme && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleTheme}
                className="hidden md:inline-flex"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              type="button"
              onClick={handleNewEntry}
              className="border border-primary-600/20 bg-primary-600 !text-gray-950 shadow-sm hover:bg-primary-700 dark:border-primary-400/30 dark:bg-primary-500 dark:!text-white dark:hover:bg-primary-400"
            >
              New Entry
            </Button>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu size={20} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};