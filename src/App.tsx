import { RouteProvider, useAppRouter } from './context/RouteContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Blog from './pages/Blog';
import AIChatBot from './components/AIChatBot';

function AppContent() {
  const { activeRoute } = useAppRouter();

  return (
    <div className="min-h-screen bg-[#0e0e11] text-gray-200 font-sans relative">
      <Navbar />
      
      <main>
        {activeRoute === 'home' && <Home />}
        {activeRoute === 'precos' && <Pricing />}
        {activeRoute === 'login' && <Login />}
        {activeRoute === 'blog' && <Blog />}
      </main>

      <Footer />
      <CookieBanner />
      <AIChatBot />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RouteProvider>
        <AppContent />
      </RouteProvider>
    </AuthProvider>
  );
}
