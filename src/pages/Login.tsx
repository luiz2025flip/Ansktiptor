import Logo from '../components/Logo';
import { supabase } from '../utils/supabase';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppRouter } from '../context/RouteContext';
import { motion } from 'motion/react';
import { Mail, Github, LogIn } from 'lucide-react';

export default function Login() {
  const { user } = useAuth();
  const { navigateTo } = useAppRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (user) {
      navigateTo('dashboard');
    }
  }, [user, navigateTo]);

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) {
        if (error.message.includes('provider is not enabled')) {
          setMessage({ type: 'error', text: `O provedor ${provider} não está habilitado no Supabase. Por favor, use o login por E-mail.` });
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Verifique seu e-mail para o link de acesso!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-[#16161a] border border-[#26262a] rounded-[3rem] p-12 text-center shadow-2xl">
        <div className="flex justify-center mb-8">
          <Logo size="lg" showText={false} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Bem-vindo ao Anskriptor</h1>
        <p className="text-gray-400 text-sm mb-12 font-medium">Entre ou crie sua conta para começar a escrever com IA.</p>
        
        {message && (
          <div className={`mb-8 p-4 rounded-2xl text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-4 mb-10">
          <button 
            onClick={() => handleOAuthLogin('google')}
            className="w-full flex items-center justify-center gap-4 bg-white text-black py-4 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all active:scale-95"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Continuar com Google
          </button>
          <button 
            onClick={() => handleOAuthLogin('github')}
            className="w-full flex items-center justify-center gap-4 bg-[#24292F] text-white py-4 rounded-2xl font-bold text-sm hover:bg-[#2c323a] transition-all active:scale-95 border border-white/5"
          >
            <Github className="w-5 h-5" />
            Continuar com GitHub
          </button>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center px-4"><div className="w-full border-t border-[#36363a]" /></div>
          <div className="relative"><span className="bg-[#16161a] px-4 text-xs text-gray-500 uppercase tracking-widest font-bold">Ou email</span></div>
        </div>

        <form onSubmit={handleEmailLogin}>
          <div className="mb-8 text-left">
            <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest ml-4 px-2 text-balance">Endereço de E-mail</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@exemplo.com" 
                required
                className="w-full bg-[#0e0e11] border border-[#36363a] rounded-2xl py-4 pl-14 pr-6 text-sm text-white focus:outline-none focus:border-brand-orange/50 transition-colors" 
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand-orange hover:bg-brand-orange-light disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-3xl font-bold text-sm transition-all shadow-lg shadow-brand-orange/20 mb-6 active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? 'Enviando...' : (
              <>
                <LogIn className="w-4 h-4" />
                Continuar com Email
              </>
            )}
          </button>
        </form>

        <div className="bg-brand-orange/5 border border-brand-orange/10 rounded-[2rem] p-6 mb-8 text-left">
          <h4 className="text-brand-orange text-xs font-bold uppercase tracking-widest mb-2">💡 Dica de Acesso</h4>
          <p className="text-gray-400 text-[10px] leading-relaxed mb-4">
            O login social (Google/GitHub) requer ativação manual no seu painel do Supabase. O método de <b>E-mail Magic Link</b> já está 100% ativo e é a forma mais rápida de acessar suas ferramentas agora!
          </p>
          <button 
            onClick={() => window.open('https://supabase.com/dashboard/project/', '_blank')}
            className="text-[10px] text-brand-orange font-bold hover:underline"
          >
            Como configurar Provedores no Supabase?
          </button>
        </div>

        <p className="text-gray-500 text-[10px] leading-relaxed max-w-[80%] mx-auto font-medium">
          Ao continuar, você concorda com nossos <a href="#" className="underline hover:text-white transition-colors">Termos de Serviço</a> e <a href="#" className="underline hover:text-white transition-colors">Políticas de Privacidade</a>.
        </p>
      </motion.div>
    </div>
  );
}
