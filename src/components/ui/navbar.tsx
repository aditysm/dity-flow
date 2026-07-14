import React, { useEffect } from "react";

export function Navbar() {
  const [isDark, setIsDark] = React.useState(false);

  useEffect(() => {
    const isDarkInitial = document.documentElement.classList.contains('dark');
    setIsDark(isDarkInitial);
  }, []);

  const handleToggle = () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    const newIsDark = html.classList.contains('dark');
    setIsDark(newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    
    if (typeof (window as any).__updateFavicon === 'function') {
      (window as any).__updateFavicon(newIsDark);
    }
    
    if (typeof (window as any).toggleTheme === 'function') {
      (window as any).toggleTheme();
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const path = window.location.pathname;
    const isSubPage = path.includes('/app') || path.includes('/help') || path.includes('/privacy') || path.includes('/terms');
    const isHome = !isSubPage;

    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="border-b border-theme-border bg-theme-bg/90 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300 w-full">
      <div className="max-w-7xl mx-auto px-6 h-[3.5rem] md:h-[4rem] flex items-center justify-between">
        <a href="/" onClick={handleLogoClick} className="text-xl md:text-2xl font-extrabold tracking-tighter flex items-center gap-2 text-theme-main hover:opacity-90 transition-opacity">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-lg overflow-hidden p-1.5 ${isDark ? 'bg-[#121214] border border-[#242426] shadow-black/40' : 'bg-[#00ba68] shadow-[#00ba68]/20'}`}>
            <img 
              src={isDark ? "/assets/logo-green.svg" : "/assets/logo-white.svg"} 
              alt="Dity Flow Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          Dity Flow
        </a>
        <div className="flex items-center gap-6">
          <button 
            onClick={handleToggle}
            className="text-theme-textDim hover:text-theme-main transition-colors focus:outline-none p-1.5 rounded-xl bg-theme-card border border-theme-border shadow-sm animate-fade-in cursor-pointer" 
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
