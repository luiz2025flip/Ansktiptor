import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type RouteContextType = {
  activeRoute: string;
  navigateTo: (route: string) => void;
};

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export function RouteProvider({ children }: { children: ReactNode }) {
  const [activeRoute, setActiveRoute] = useState('home');

  const navigateTo = (route: string) => {
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Aggressive route sync for path-like behavior
    if (route === 'home') window.history.pushState({}, '', '/');
    else window.history.pushState({}, '', `/${route}`);
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace('/', '') || 'home';
      setActiveRoute(path);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <RouteContext.Provider value={{ activeRoute, navigateTo }}>
      {children}
    </RouteContext.Provider>
  );
}

export function useAppRouter() {
  const context = useContext(RouteContext);
  if (!context) throw new Error('useAppRouter must be used within a RouteProvider');
  return context;
}
