import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, AlertCircle, LogIn } from 'lucide-react';
import { TOOLS } from '../data/siteData';
import { generateWithAI } from '../utils/ai';
import { useAuth } from '../context/AuthContext';
import { useAppRouter } from '../context/RouteContext';
import { saveContent, deductCredit } from '../utils/supabase';

export default function ToolsPanel() {
  const { user, profile, refreshProfile } = useAuth();
  const { navigateTo } = useAppRouter();
  const [activeTool, setActiveTool] = useState('ai-text');
  const [toolPrompt, setToolPrompt] = useState('');
  const [selectedType, setSelectedType] = useState(''); // TIPO de texto (ex: Parágrafo de Introdução)
  const [toolResult, setToolResult] = useState('');
  const [toolLoading, setToolLoading] = useState(false);
  const [style, setStyle] = useState('Casual');
  const [length, setLength] = useState('150 palavras');
  const [loginRequired, setLoginRequired] = useState(false);

  const currentTool = TOOLS.find(t => t.id === activeTool) ?? TOOLS[0];

  // Reset type when tool changes
  const handleToolChange = (id: string) => {
    setActiveTool(id);
    setToolResult('');
    setToolPrompt('');
    setSelectedType('');
  };

  const handleToolGenerate = async () => {
    if (!toolPrompt.trim()) return;
    
    if (!user) {
      setLoginRequired(true);
      return;
    }

    if ((profile?.credits ?? 0) <= 0) {
      navigateTo('precos');
      return;
    }

    setToolLoading(true);
    setToolResult('');
    try {
      // Combinar TIPO selecionado + TEMA do usuário de forma inteligente
      const finalPrompt = selectedType
        ? `Crie um(a) "${selectedType}" sobre o seguinte tema: ${toolPrompt}`
        : toolPrompt;

      const { text, wordCount } = await generateWithAI(finalPrompt, currentTool.id, style, length);
      setToolResult(text);
      setToolLoading(false); // Libera o usuário da tela de carregamento na hora!
      
      if (user) {
        // Cálculo de exaustão (Token-based): 1% da barra a cada 50 palavras
        const creditsToDeduct = Math.max(1, Math.ceil(wordCount / 50));

        Promise.all([
          saveContent(user.id, `${selectedType || currentTool.label}: ${toolPrompt.slice(0, 40)}`, text, currentTool.id, { style, length, type: selectedType }),
          deductCredit(user.id, creditsToDeduct)
        ]).then(() => {
          refreshProfile();
        }).catch(err => {
          console.error('Falha no banco:', err);
        });
      }
    } catch (e: any) {
      setToolResult(e.message || 'Erro ao gerar conteúdo.');
      setToolLoading(false);
    }
  };

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
      <div className="bg-[#16161a] border border-[#26262a] rounded-3xl overflow-hidden shadow-xl">
        <div className="flex min-h-[600px] flex-col lg:flex-row">
          {/* Left Tool List */}
          <div className="w-full lg:w-72 shrink-0 border-r border-[#26262a] overflow-y-auto max-h-[600px] p-3 scrollbar-hide">
            <div className="text-xs font-semibold text-gray-500 px-4 py-2 uppercase tracking-widest mb-2">Ferramentas</div>
            {TOOLS.map(tool => (
              <button key={tool.id} onClick={() => handleToolChange(tool.id)}
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

                {/* Tool Type Selector — Clique para definir o TIPO/FORMATO do texto */}
                {currentTool.suggestions.length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs text-gray-500 mb-2">Tipo de texto <span className="text-brand-orange">(opcional)</span>:</p>
                    <div className="flex flex-wrap gap-2">
                      {currentTool.suggestions.map((s, i) => (
                        <button key={i}
                          onClick={() => setSelectedType(selectedType === s ? '' : s)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                            selectedType === s
                              ? 'bg-brand-orange/20 border-brand-orange text-brand-orange'
                              : 'bg-[#0e0e11] border-[#36363a] text-gray-400 hover:text-white hover:border-brand-orange/40'
                          }`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tool Input */}
                <div className="relative bg-[#0e0e11] border border-[#36363a] rounded-2xl p-4 mb-4 focus-within:border-brand-orange/50 transition-colors">
                  <textarea
                    value={toolPrompt}
                    onChange={e => setToolPrompt(e.target.value)}
                    placeholder={selectedType ? `Escreva o TEMA para o "${selectedType}"... (ex: sustentabilidade, liderança)` : 'Descreva o tema ou assunto que deseja criar...'}
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
                  {loginRequired && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-brand-orange/10 border border-brand-orange/40 rounded-2xl p-6 mb-6 flex flex-col items-center text-center">
                       <LogIn className="w-8 h-8 text-brand-orange mb-3" />
                       <h3 className="text-white font-bold mb-1">Login Necessário</h3>
                       <p className="text-gray-400 text-sm mb-4">Faça login para começar a gerar conteúdos e salvar seu histórico.</p>
                       <button 
                        onClick={() => navigateTo('login')}
                        className="bg-brand-orange text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-brand-orange-light transition-colors"
                       >
                         Entrar Agora
                       </button>
                    </motion.div>
                  )}

                  {toolResult && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="bg-[#0e0e11] border border-brand-orange/20 rounded-2xl p-5 mt-4 text-left">
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap mb-4">{toolResult}</p>
                      <div className="flex justify-end text-balance">
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
