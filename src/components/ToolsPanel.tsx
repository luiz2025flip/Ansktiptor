import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { TOOLS } from '../data/siteData';
import { generateWithAI } from '../utils/ai';
import { useAuth } from '../context/AuthContext';
import { saveContent, deductCredit } from '../utils/supabase';

export default function ToolsPanel() {
  const { user, profile, refreshProfile } = useAuth();
  const [activeTool, setActiveTool] = useState('ai-text');
  const [toolPrompt, setToolPrompt] = useState('');
  const [toolResult, setToolResult] = useState('');
  const [toolLoading, setToolLoading] = useState(false);
  const [style, setStyle] = useState('Casual');
  const [length, setLength] = useState('150 palavras');

  const currentTool = TOOLS.find(t => t.id === activeTool) ?? TOOLS[0];

  const handleToolGenerate = async () => {
    if (!toolPrompt.trim()) return;
    
    // Check if user is logged in
    if (!user) {
      setToolResult('Por favor, faça login para gerar conteúdo e salvar automaticamente suas criações.');
      return;
    }

    // Check credits
    if ((profile?.credits ?? 0) <= 0) {
      setToolResult('Você não tem créditos suficientes. Por favor, adquira mais créditos na página de preços.');
      return;
    }

    setToolLoading(true);
    setToolResult('');
    try {
      const result = await generateWithAI(toolPrompt, currentTool.id, style, length);
      setToolResult(result);
      
      // Save content and deduct credits in background
      if (user) {
        await saveContent(user.id, `Geração: ${currentTool.label}`, result, currentTool.id, { style, length });
        await deductCredit(user.id, 1);
        await refreshProfile();
      }
    } catch (e: any) {
      setToolResult(e.message || 'Erro ao gerar conteúdo.');
    }
    setToolLoading(false);
  };

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
      <div className="bg-[#16161a] border border-[#26262a] rounded-3xl overflow-hidden shadow-xl">
        <div className="flex min-h-[600px] flex-col lg:flex-row">
          {/* Left Tool List */}
          <div className="w-full lg:w-72 shrink-0 border-r border-[#26262a] overflow-y-auto max-h-[600px] p-3 scrollbar-hide">
            <div className="text-xs font-semibold text-gray-500 px-4 py-2 uppercase tracking-widest mb-2">Ferramentas</div>
            {TOOLS.map(tool => (
              <button key={tool.id} onClick={() => { setActiveTool(tool.id); setToolResult(''); setToolPrompt(''); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all mb-1 group ${activeTool === tool.id ? 'bg-brand-orange/10 text-white border border-brand-orange/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <tool.icon className={`w-5 h-5 shrink-0 ${activeTool === tool.id ? 'text-brand-orange' : 'text-gray-500 group-hover:text-brand-orange'}`} />
                <span className="text-sm font-medium leading-tight">{tool.label}</span>
              </button>
            ))}
          </div>

          {/* Right Tool Panel */}
          <div className="flex-1 p-8 overflow-y-auto max-h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div key={activeTool} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 border border-brand-orange/30 flex items-center justify-center">
                    <currentTool.icon className="w-5 h-5 text-brand-orange" />
                  </div>
                  <h2 className="text-xl font-bold text-white">{currentTool.label}</h2>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{currentTool.description}</p>

                {/* Tool Suggestions */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {currentTool.suggestions.map((s, i) => (
                    <button key={i} onClick={() => setToolPrompt(s)}
                      className="text-xs px-3 py-1.5 rounded-full bg-[#0e0e11] border border-[#36363a] text-gray-400 hover:text-white hover:border-brand-orange/40 transition-all">
                      {s}
                    </button>
                  ))}
                </div>

                {/* Tool Input */}
                <div className="relative bg-[#0e0e11] border border-[#36363a] rounded-2xl p-4 mb-4 focus-within:border-brand-orange/50 transition-colors">
                  <textarea
                    value={toolPrompt}
                    onChange={e => setToolPrompt(e.target.value)}
                    placeholder="Descreva o que deseja criar..."
                    rows={3}
                    className="w-full bg-transparent text-white placeholder-gray-500 resize-none outline-none text-sm leading-relaxed pr-12"
                  />
                  <button onClick={handleToolGenerate}
                    className="absolute right-4 bottom-4 w-9 h-9 bg-[#202026] border border-brand-orange/40 rounded-xl flex items-center justify-center hover:bg-brand-orange/20 transition-colors">
                    <ArrowRight className="w-4 h-4 text-brand-orange" />
                  </button>
                </div>

                {/* Tool Controls */}
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1.5">Estilo</label>
                    <select value={style} onChange={e => setStyle(e.target.value)}
                      className="w-full bg-[#0e0e11] border border-[#36363a] text-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-orange/40">
                      {['Casual', 'Formal', 'Profissional', 'Amigável', 'Persuasivo', 'Inspirador', 'Criativo'].map(o => <option key={o}>{o}</option>)}
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

                <button onClick={handleToolGenerate}
                  disabled={toolLoading}
                  className="w-full bg-brand-orange hover:bg-brand-orange-light text-white py-3 rounded-2xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {toolLoading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Gerando...</span></>
                  ) : (
                    <><Sparkles className="w-4 h-4" /><span>Gerar com IA</span></>
                  )}
                </button>

                <AnimatePresence>
                  {toolResult && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="bg-[#0e0e11] border border-brand-orange/20 rounded-2xl p-5 mt-4 text-left">
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap mb-4">{toolResult}</p>
                      <div className="flex justify-end">
                         <button onClick={() => navigator.clipboard.writeText(toolResult)} className="text-xs text-brand-orange hover:text-white transition-colors">Copiar Resultado</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
