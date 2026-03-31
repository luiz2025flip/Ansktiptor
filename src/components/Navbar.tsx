import { Globe, ChevronDown, User, LogOut } from 'lucide-react';
import { useAppRouter } from '../context/RouteContext';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const { navigateTo, activeRoute } = useAppRouter();
  const { user, profile, signOut, loading } = useAuth();

  return (
    <nav className="relative z-50 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto sticky top-0 bg-[#0e0e11]/80 backdrop-blur-md border-b border-white/5">
      <div className="cursor-pointer" onClick={() => navigateTo('home')}>
        <Logo />
      </div>
      
      <div className="hidden md:flex items-center gap-7 text-sm text-gray-400">
        <button onClick={() => navigateTo('home')} className={`hover:text-white transition-colors ${activeRoute === 'home' ? 'text-white' : ''}`}>Início</button>
        <button onClick={() => navigateTo('precos')} className={`hover:text-white transition-colors ${activeRoute === 'precos' ? 'text-white' : ''}`}>Preços</button>
        <button onClick={() => navigateTo('blog')} className={`hover:text-white transition-colors ${activeRoute === 'blog' ? 'text-white' : ''}`}>Blog</button>
        
        <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
          <Globe className="w-4 h-4" />
          <span>Português</span>
          <ChevronDown className="w-3 h-3" />
        </div>

        {!loading && (
          <div className="flex items-center gap-6 border-l border-gray-800 pl-6">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-white font-medium text-xs">
                    {profile?.full_name || user.email?.split('@')[0]}
                  </span>
                  <span className="text-brand-orange text-[10px] font-bold uppercase tracking-wider">
                    {profile?.credits || 0} Créditos
                  </span>
                </div>
                <button 
                  onClick={signOut}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4 group-hover:text-red-400 transition-colors" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigateTo('login')} 
                className="hover:text-white transition-colors"
              >
                Entrar
              </button>
            )}
            
            <button 
              onClick={() => navigateTo(user ? 'home' : 'precos')} 
              className="bg-brand-orange hover:bg-brand-orange-light text-white px-5 py-2 rounded-full font-semibold text-sm transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] active:scale-95"
            >
              {user ? 'Dashboard' : 'Experimente grátis'}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
