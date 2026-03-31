import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { TABS, PROMPTS, STATS } from '../data/siteData';
import { generateWithAI } from '../utils/ai';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { useAppRouter } from '../context/RouteContext';
import { saveContent, deductCredit } from '../utils/supabase';

export default function Hero() {
  const [activeTab, setActiveTab] = useState('gerar');
  const [heroPrompt, setHeroPrompt] = useState('');
  const [heroResult, setHeroResult] = useState('');
  const [heroLoading, setHeroLoading] = useState(false);
  const [style, setStyle] = useState('Casual');
  const [length, setLength] = useState('150 palavras');
  const tabsRef = useRef<HTMLDivElement>(null);

  const { user, profile, refreshProfile } = useAuth();
  const { navigateTo } = useAppRouter();

  const handleHeroGenerate = async () => {
    if (!heroPrompt.trim()) return;
    
    if (!user) {
      setHeroResult('Por favor, faça login para gerar e salvar seu conteúdo.');
      return;
    }

    if ((profile?.credits ?? 0) <= 0) {
      navigateTo('precos');
      return;
    }

    setHeroLoading(true);
    setHeroResult('');
    try {
      const { text, wordCount } = await generateWithAI(heroPrompt, activeTab, style, length);
      setHeroResult(text);
      setHeroLoading(false);
      
      // Cálculo de exaustão (Token-based): 1% da barra a cada 50 palavras
      const creditsToDeduct = Math.max(1, Math.ceil(wordCount / 50));
      
      Promise.all([
        saveContent(user.id, `Hero: ${heroPrompt.slice(0, 30)}...`, text, activeTab, { style, length }),
        deductCredit(user.id, creditsToDeduct)
      ]).then(() => {
        refreshProfile();
      }).catch(err => {
        console.error('Falha ao salvar no banco:', err);
      });

    } catch (e: any) {
      setHeroResult(e.message || 'Erro ao gerar conteúdo.');
      setHeroLoading(false);
    }
  };

  const scrollTabs = (dir: 'left' | 'right') => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-12 text-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <div className="inline-flex items-center gap-2 px-1.5 py-1.5 rounded-full border border-brand-orange/20 bg-brand-orange/5 text-sm font-medium mb-10 overflow-hidden transform hover:scale-105 transition-transform duration-500">
           <Logo size="sm" showText={false} />
           <span className="text-brand-orange px-3 pr-4 font-bold tracking-tight">Escritor de Texto com IA Gratuito</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
          Ferramentas de Escrita<br />
          <span className="text-brand-orange drop-shadow-[0_0_30px_rgba(249,115,22,0.4)]">Potencializadas por IA</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-16">
          Escreva 5x mais rápido com 20+ ferramentas de conteúdo. Gere artigos, corrija gramática, adapte o tom e crie peças de marketing impecáveis em segundos.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-3xl mx-auto">
        {STATS.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
            className="bg-[#16161a] border border-[#26262a] rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-brand-orange">{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-[#16161a] border border-[#26262a] rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex items-center border-b border-[#26262a] px-2 pt-2 gap-1">
          <button onClick={() => scrollTabs('left')} className="p-2 text-gray-500 hover:text-white shrink-0 text-sm">&lt;</button>
          <div ref={tabsRef} className="flex gap-1 overflow-x-auto scrollbar-hide flex-1">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setHeroResult(''); }}
                style={{ minWidth: 'fit-content', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                className={`px-4 py-2.5 text-sm rounded-t-xl transition-all font-medium shrink-0 ${activeTab === tab.id ? 'bg-brand-orange/10 text-brand-orange border-b-2 border-brand-orange' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                {tab.label}
              </button>
            ))}
          </div>
          <button onClick={() => scrollTabs('right')} className="p-2 text-gray-500 hover:text-white shrink-0 text-sm">&gt;</button>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {PROMPTS[activeTab]?.suggestions.map((s, i) => (
              <button key={i} onClick={() => setHeroPrompt(s)}
                className="text-xs px-3 py-1.5 rounded-full bg-[#202026] border border-[#36363a] text-gray-400 hover:text-white hover:border-brand-orange/40 transition-all">
                {s.slice(0, 50)}{s.length > 50 ? '…' : ''}
              </button>
            ))}
          </div>

          <div className="relative bg-[#0e0e11] border border-[#36363a] rounded-2xl p-4 mb-4 focus-within:border-brand-orange/50 transition-colors">
            <textarea
              value={heroPrompt}
              onChange={e => setHeroPrompt(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleHeroGenerate(); }}
              placeholder={PROMPTS[activeTab]?.placeholder}
              rows={3}
              className="w-full bg-transparent text-white placeholder-gray-500 resize-none outline-none text-sm leading-relaxed pr-12"
            />
            <button onClick={handleHeroGenerate}
              className="absolute right-4 bottom-4 w-9 h-9 bg-[#202026] border border-brand-orange/40 rounded-xl flex items-center justify-center hover:bg-brand-orange/20 transition-colors">
              <ArrowRight className="w-4 h-4 text-brand-orange" />
            </button>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1.5">Estilo</label>
              <select value={style} onChange={e => setStyle(e.target.value)}
                className="w-full bg-[#0e0e11] border border-[#36363a] text-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-orange/40">
                {['Casual', 'Formal', 'Profissional', 'Amigável', 'Persuasivo', 'Inspirador', 'Humorístico', 'Assertivo', 'Empático', 'Criativo'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1.5">Comprimento</label>
              <select value={length} onChange={e => setLength(e.target.value)}
                className="w-full bg-[#0e0e11] border border-[#36363a] text-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-orange/40">
                {['50 palavras', '100 palavras', '150 palavras', '300 palavras', '500 palavras', '750 palavras', '1000 palavras'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <AnimatePresence>
            {(heroLoading || heroResult) && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="bg-[#0e0e11] border border-brand-orange/20 rounded-2xl p-4 mt-2">
                {heroLoading ? (
                  <div className="flex items-center gap-3 text-brand-orange">
                    <div className="w-4 h-4 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Gerando conteúdo...</span>
                  </div>
                ) : (
                  <div className="text-left">
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{heroResult}</p>
                    <div className="mt-4 flex gap-2 justify-end">
                       <button onClick={() => navigator.clipboard.writeText(heroResult)} className="text-xs text-brand-orange hover:text-white transition-colors">Copiar</button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
