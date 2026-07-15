import React, { StrictMode, Suspense, lazy, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import App from './App.tsx';
import './index.css';
import { Navbar } from './components/ui/navbar';

const OptimizerTransfer = lazy(() => import('./app-main.tsx'));
const HelpCenter = lazy(() => import('./pages/help.tsx').then(m => ({ default: m.HelpCenter })));
const PrivacyPolicy = lazy(() => import('./pages/privacy.tsx').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/terms.tsx').then(m => ({ default: m.TermsOfService })));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // We handle scrolling inside PageTransition for better timing
  }, [pathname]);

  return null;
}

function PageTransition({ children }: { children: React.ReactNode }) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash, handle scrolling to the element
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Use a slight delay to allow content to render
        const timer = setTimeout(() => {
          if (id === 'hero') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            const offset = 0;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }, 300);
        return () => clearTimeout(timer);
      }
    } else {
      // If no hash, scroll to top on page change
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <ScrollToTop />
        <div className="fixed inset-0 pointer-events-none z-[-1] bg-theme-bg">
          <div className="aurora-bg"></div>
        </div>
        <Navbar />
        <Suspense fallback={null}>
          <RoutesWithTransition />
        </Suspense>
      </BrowserRouter>
    </StrictMode>,
  );
}

function RoutesWithTransition() {
  const location = useLocation();
  const RoutesComponent = Routes as any;
  
  return (
    <AnimatePresence mode="wait">
      <RoutesComponent location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><App /></PageTransition>} />
        <Route path="/optimizer-transfer" element={<PageTransition><OptimizerTransfer /></PageTransition>} />
        <Route path="/help" element={<PageTransition><HelpCenter /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><TermsOfService /></PageTransition>} />
        <Route path="*" element={<PageTransition><App /></PageTransition>} />
      </RoutesComponent>
    </AnimatePresence>
  );
}

