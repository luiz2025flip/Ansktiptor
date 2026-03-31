import Hero from '../components/Hero';
import Features from '../components/Features';
import ToolsPanel from '../components/ToolsPanel';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppRouter } from '../context/RouteContext';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { navigateTo } = useAppRouter();
  const { user } = useAuth();

  const handleStartWriting = () => {
    if (user) {
      navigateTo('dashboard');
    } else {
      navigateTo('login');
    }
  };

  const scrollToTools = () => {
    const el = document.getElementById('tools-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Hero />
      
      {/* ── CTA SECTION ───────────────────────────────────── */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-brand-orange/10 to-brand-orange-dark/5 border border-brand-orange/20 rounded-[2.5rem] p-10 text-center shadow-2xl">
          <div className="w-12 h-12 bg-brand-orange rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-orange/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sua Solução Completa de Escritor de Texto com IA
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Escreva qualquer coisa instantaneamente com ferramentas que se adaptam à sua entrada. De e-mails a histórias e citações, cada resultado é contextualizado, estruturado e pronto para usar.
          </p>
          <button 
            onClick={handleStartWriting}
            className="inline-flex items-center gap-3 bg-brand-orange hover:bg-brand-orange-light text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-brand-orange/20 active:scale-95"
          >
            <Sparkles className="w-5 h-5" />
            {user ? 'Acessar Meu Dashboard' : 'Iniciar Meu Teste Gratuito'}
          </button>
        </div>
      </section>

      <Features onCardClick={scrollToTools} />
      
      <div id="tools-section">
        <ToolsPanel />
      </div>

      {/* ── FOOTER CTA ────────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Escreva de Forma Mais Inteligente com o <span className="text-brand-orange">Anskriptor</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Junte-se a 500.000+ usuários que já escrevem mais rápido e melhor com nossa plataforma de IA.
          </p>
          <button 
            onClick={handleStartWriting}
            className="inline-flex items-center gap-3 bg-brand-orange hover:bg-brand-orange-light text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-brand-orange/20 active:scale-95 uppercase tracking-wider"
          >
            {user ? 'Ir para o Dashboard' : 'Experimente Grátis'}
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>
    </>
  );
}
