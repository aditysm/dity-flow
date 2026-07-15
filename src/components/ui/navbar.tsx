import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronDown, 
  Menu, 
  X, 
  ArrowRightLeft, 
  Receipt, 
  Banknote, 
  Users, 
  ShoppingBag, 
  Globe,
  Sun,
  Moon,
  ChevronRight,
  Home,
  Sparkles,
  MessageSquare,
  HelpCircle,
  Heart
} from "lucide-react";

const features = [
  {
    title: 'Optimizer Transfer',
    icon: ArrowRightLeft,
    href: '/optimizer-transfer',
    description: 'Bandingkan rute transfer antar bank dan e-wallet.',
    active: true,
  },
  {
    title: 'Optimizer Tagihan',
    icon: Receipt,
    href: '#features',
    description: 'Biaya admin termurah untuk PLN, PDAM, dll.',
    active: false,
  },
  {
    title: 'Optimizer Tarik Tunai',
    icon: Banknote,
    href: '#features',
    description: 'Tarik tunai dengan biaya paling minimal.',
    active: false,
  },
  {
    title: 'Split-Bill Router',
    icon: Users,
    href: '#features',
    description: 'Patungan bebas admin antar rekening.',
    active: false,
  },
  {
    title: 'E-Commerce Route',
    icon: ShoppingBag,
    href: '#features',
    description: 'Optimalkan jalur pembayaran belanja online.',
    active: false,
  },
  {
    title: 'Global Flow',
    icon: Globe,
    href: '#features',
    description: 'Rute pengiriman uang luar negeri terbaik.',
    active: false,
  },
];

export function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileFeaturesOpen, setIsMobileFeaturesOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    const isDarkInitial = document.documentElement.classList.contains('dark');
    setIsDark(isDarkInitial);

    // Handle outside clicks for dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFeaturesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
  };

  const isAtHome = location.pathname === "/";
  const navLinks = isAtHome 
    ? [
        { label: "Beranda", href: "/#hero", icon: Home },
        { label: "Fitur", type: "dropdown", icon: Sparkles },
        { label: "Testimoni", href: "/#testimonials", icon: MessageSquare },
        { label: "Tentang Kami", href: "/#faq", icon: HelpCircle },
        { label: "Bantu Kami", href: "/#contribute", icon: Heart },
      ]
    : [
        { label: "Beranda", href: "/#hero", icon: Home },
        { label: "Fitur", type: "dropdown", icon: Sparkles },
      ];

  const handleLinkClick = (href: string, e?: React.MouseEvent) => {
    setIsMobileMenuOpen(false);
    setIsFeaturesOpen(false);

    if (e && (href.startsWith('/#') || href.startsWith('#'))) {
      const hash = href.includes('#') ? href.substring(href.indexOf('#')) : '';
      if (hash && location.pathname === '/') {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          e.preventDefault();
          // Update URL hash smoothly using react-router navigation so active states sync
          navigate(href, { replace: true });
          
          if (id === 'hero') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - 80; // Subtract navbar height so section content is never covered
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }
      }
    }
  };

  return (
    <nav className="border-b border-theme-border bg-theme-bg/90 backdrop-blur-md sticky top-0 z-[50000] transition-colors duration-300 w-full">
      <div className="max-w-7xl mx-auto px-6 h-[3.5rem] md:h-[4.5rem] flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          onClick={(e) => {
            handleLinkClick('/', e);
            if (location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="text-xl md:text-2xl font-extrabold tracking-tighter flex items-center gap-2 text-theme-main hover:opacity-90 transition-opacity shrink-0"
        >
          <div 
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-lg overflow-hidden p-1.5 ${isDark ? 'bg-[#121214] border border-[#242426] shadow-black/40' : 'bg-[#00ba68] shadow-[#00ba68]/20'}`}
          >
            <img 
              src={isDark ? "/assets/logo-green.svg" : "/assets/logo-white.svg"} 
              alt="Dity Flow" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="inline-block">Dity Flow</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => {
            const isHome = link.href === '/#hero';
            const linkHash = link.href?.includes('#') ? link.href.substring(link.href.indexOf('#')) : null;
            const isActive = isHome 
              ? (location.pathname === '/' && (location.hash === '' || location.hash === '#hero' || location.hash === '#')) 
              : (linkHash && location.hash === linkHash && location.pathname === '/');
            
            const isFeatureActive = link.type === "dropdown" && features.some(f => location.pathname === f.href);
            
            return link.type === "dropdown" ? (
              <div 
                key={link.label}
                className="relative"
                ref={dropdownRef}
              >
                <button 
                  onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                  className={`flex items-center gap-1.5 text-sm transition-colors py-4 relative group ${isFeaturesOpen || isFeatureActive ? 'text-theme-accent font-bold' : 'text-theme-textDim hover:text-theme-accent font-medium'}`}
                >
                  {link.label}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isFeaturesOpen ? 'rotate-180' : ''}`} />
                  {/* Active Indicator Line */}
                  {(isFeaturesOpen || isFeatureActive) && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-theme-accent rounded-full"
                    />
                  )}
                </button>
                <AnimatePresence>
                  {isFeaturesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-1/2 -translate-x-1/2 w-[480px] bg-theme-card border border-theme-border rounded-2xl shadow-2xl p-4 grid grid-cols-2 gap-2 z-[1001]"
                    >
                      {features.map((feature) => (
                        <FeatureLink key={feature.title} feature={feature} onClick={() => setIsFeaturesOpen(false)} />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link 
                key={link.label} 
                to={link.href!}
                onClick={(e) => handleLinkClick(link.href!, e)}
                className={`text-sm transition-colors py-4 relative group ${isActive ? 'text-theme-accent font-bold' : 'text-theme-textDim hover:text-theme-accent font-medium'}`}
              >
                {link.label}
                {isActive && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-theme-accent rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handleToggle}
            className="text-theme-textDim hover:text-theme-accent transition-colors focus:outline-none p-2 rounded-xl bg-theme-card border border-theme-border shadow-sm cursor-pointer" 
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile Menu Trigger Button */}
          <button 
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden text-theme-textDim hover:text-theme-accent transition-colors p-2 rounded-xl bg-theme-card border border-theme-border shadow-sm cursor-pointer outline-none"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Custom Animated Drawer using Framer Motion (Portaled to document.body for flawless z-index stacking context) */}
          {mounted && typeof document !== "undefined" && createPortal(
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  key="mobile-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="fixed inset-0 bg-black/50 z-[100000]"
                />
              )}

              {isMobileMenuOpen && (
                <motion.div
                  key="mobile-drawer"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
                  className="fixed right-0 top-0 bottom-0 h-full w-full max-w-[280px] z-[100001] bg-theme-bg border-l border-theme-border shadow-2xl flex flex-col overflow-hidden outline-none"
                >
                  {/* Ambient Background Accents */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-theme-accent/5 blur-[60px] -z-10 rounded-full" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-theme-accent/5 blur-[60px] -z-10 rounded-full" />

                  {/* Header */}
                  <div className="px-6 py-6 border-b border-theme-border/50 flex flex-row items-center justify-between bg-transparent shrink-0">
                    <Link 
                      to="/"
                      onClick={(e) => {
                        handleLinkClick('/', e);
                        if (location.pathname === '/') {
                          e.preventDefault();
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className="flex items-center gap-2 hover:opacity-90 transition-opacity"
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-lg overflow-hidden p-1.5 ${isDark ? 'bg-[#121214] border border-[#242426]' : 'bg-[#00ba68]'}`}>
                        <img 
                          src={isDark ? "/assets/logo-green.svg" : "/assets/logo-white.svg"} 
                          alt="Dity Flow" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold tracking-tighter text-theme-main text-lg leading-none">Dity Flow</span>
                      </div>
                    </Link>
                    <button 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-1.5 rounded-lg text-theme-textDim hover:text-theme-accent hover:bg-theme-card transition-all outline-none"
                      aria-label="Close menu"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-none outline-none">
                    <nav className="flex flex-col gap-1">
                      {navLinks.map((link, idx) => {
                        const isHome = link.href === '/#hero';
                        const linkHash = link.href?.includes('#') ? link.href.substring(link.href.indexOf('#')) : null;
                        const isActive = isHome 
                          ? (location.pathname === '/' && (location.hash === '' || location.hash === '#hero' || location.hash === '#')) 
                          : (linkHash && location.hash === linkHash && location.pathname === '/');
                      
                        const isFeatureActive = link.type === "dropdown" && features.some(f => location.pathname === f.href);

                        return (
                          <motion.div
                            key={link.label}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * idx }}
                          >
                            {link.type === "dropdown" ? (
                              <div className={`flex flex-col ${isMobileFeaturesOpen ? 'mb-2' : 'mb-1'}`}>
                                <button 
                                  onClick={() => setIsMobileFeaturesOpen(!isMobileFeaturesOpen)}
                                  className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl transition-all ${
                                    isFeatureActive || isMobileFeaturesOpen 
                                      ? 'text-theme-accent bg-theme-accent/5 font-bold' 
                                      : 'text-theme-main hover:bg-theme-card'
                                  }`}
                                >
                                  <span className="flex items-center gap-3">
                                    {link.icon && <link.icon className={`w-5 h-5 ${isFeatureActive || isMobileFeaturesOpen ? 'text-theme-accent' : 'text-theme-textDim'}`} />}
                                    <span className={`text-lg tracking-tight ${isFeatureActive || isMobileFeaturesOpen ? 'font-black' : 'font-bold'}`}>
                                      {link.label}
                                    </span>
                                    {isFeatureActive && !isMobileFeaturesOpen && (
                                      <div className="w-1.5 h-1.5 rounded-full bg-theme-accent" />
                                    )}
                                  </span>
                                  <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${isMobileFeaturesOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                  {isMobileFeaturesOpen && (
                                    <motion.div 
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="pl-4 flex flex-col gap-1 mt-1 overflow-hidden"
                                    >
                                      {features.map((feat) => {
                                        const isFeatActive = location.pathname === feat.href;
                                        return (
                                          <Link
                                            key={feat.title}
                                            to={feat.active ? feat.href : "#"}
                                            onClick={(e) => {
                                              if (feat.active) {
                                                handleLinkClick(feat.href, e);
                                              }
                                            }}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                                              !feat.active 
                                                ? 'opacity-40 cursor-default text-theme-textDim' 
                                                : isFeatActive 
                                                  ? 'text-theme-accent font-bold bg-theme-accent/5' 
                                                  : 'text-theme-main hover:bg-theme-card'
                                            }`}
                                          >
                                            <feat.icon className="w-4 h-4 shrink-0" />
                                            <span>{feat.title}</span>
                                          </Link>
                                        );
                                      })}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ) : (
                              <Link
                                to={link.href || "/"}
                                onClick={(e) => {
                                  handleLinkClick(link.href || "/", e);
                                }}
                                className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl transition-all ${
                                  isActive 
                                    ? 'text-theme-accent bg-theme-accent/5 font-bold' 
                                    : 'text-theme-main hover:bg-theme-card'
                                  }`}
                              >
                                <span className="flex items-center gap-3">
                                  {link.icon && <link.icon className={`w-5 h-5 ${isActive ? 'text-theme-accent' : 'text-theme-textDim'}`} />}
                                  <span className={`text-lg tracking-tight ${isActive ? 'font-black' : 'font-bold'}`}>
                                    {link.label}
                                  </span>
                                </span>
                                {isActive && (
                                  <motion.div 
                                    layoutId="mobile-nav-indicator"
                                    className="w-1.5 h-1.5 bg-theme-accent rounded-full"
                                  />
                                )}
                              </Link>
                            )}
                          </motion.div>
                        );
                      })}
                    </nav>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-6 border-t border-theme-border/30 flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-theme-textDim opacity-50 tracking-wider">© 2026 DITY FLOW</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )}
        </div>
      </div>
    </nav>
  );
}

function FeatureLink({ feature, onClick }: { feature: any, onClick: () => void, key?: any }) {
  const isExternal = feature.href.startsWith('http');
  const Component = feature.active ? (isExternal ? 'a' : Link) : 'div';
  const props = feature.active 
    ? (isExternal ? { href: feature.href, target: "_blank", rel: "noopener noreferrer" } : { to: feature.href })
    : {};

  return (
    <Component
      {...props}
      onClick={onClick}
      className={`flex items-start gap-4 p-3 rounded-xl transition-all ${
        feature.active 
          ? 'hover:bg-theme-accent/[0.05] group' 
          : 'opacity-40 cursor-default'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
        feature.active ? 'bg-theme-accent/10 group-hover:bg-theme-accent/20' : 'bg-theme-border'
      }`}>
        <feature.icon className={`w-5 h-5 ${feature.active ? 'text-theme-accent' : 'text-theme-textDim'}`} />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-theme-main">{feature.title}</span>
        </div>
        <p className="text-xs text-theme-textDim font-medium line-clamp-2 mt-1 leading-relaxed">
          {feature.description}
        </p>
      </div>
    </Component>
  );
}
