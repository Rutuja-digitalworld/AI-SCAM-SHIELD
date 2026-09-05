import { Shield, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/theme';

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-[#0a0e1a]/70 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-lg opacity-30 rounded-full" />
            <Shield className="relative w-7 h-7 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight leading-none">
              AI Scam Shield
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 leading-tight mt-0.5">
              Before You Pay, Ask AI
            </p>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
    </header>
  );
}
