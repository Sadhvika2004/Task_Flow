import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('taskflow-theme');
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      // Use system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      body.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
      body.classList.add(theme);
    }
    
    // Save to localStorage
    localStorage.setItem('taskflow-theme', theme);
  }, [theme]);

  // Initialize theme on mount
  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    const savedTheme = localStorage.getItem('taskflow-theme');
    
    if (savedTheme) {
      root.classList.remove('light', 'dark');
      body.classList.remove('light', 'dark');
      if (savedTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
        body.classList.add(systemTheme);
      } else {
        root.classList.add(savedTheme);
        body.classList.add(savedTheme);
      }
    }
  }, []);

  // Listen for system theme changes when theme is set to 'system'
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const root = window.document.documentElement;
        const body = window.document.body;
        root.classList.remove('light', 'dark');
        body.classList.remove('light', 'dark');
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
        body.classList.add(systemTheme);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
