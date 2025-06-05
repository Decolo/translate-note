import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import './App.css';
import { App as MainApp } from '../components/app';

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    // Apply dark class to body for portals
    if (mediaQuery.matches) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    // Listen for theme changes
    const handleThemeChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
      if (e.matches) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  return (
    <div className="sidepanel-app min-h-screen bg-background text-foreground text-sm">
      <MainApp />
    </div>
  );
}

export default App; 