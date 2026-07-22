import React from 'react';
import {  Globe, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto transition-colors duration-300 dark:bg-gray-900 dark:border-gray-800 relative z-20">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between py-6 gap-4">
          <p className="text-sm text-gray-600 flex items-center gap-1 dark:text-gray-300">
            Made by John Wilbert Gamis
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/WilWilbert123"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors dark:hover:text-gray-200"
              aria-label="Visit GitHub"
            >
              <Globe size={20} />
            </a>
            <a
              href="mailto:johnwilbertgamis2022@gmail.com"
              className="text-gray-400 hover:text-gray-600 transition-colors dark:hover:text-gray-200"
              aria-label="Send email"
            >
              <Send size={20} />
            </a>
            <span className="text-sm text-gray-400 dark:text-gray-500">© 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};