import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, MessageSquare, Minus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveContent } from '../utils/supabase';
import Logo from './Logo';

type Message = { role: 'user' | 'ai'; text: string };

export default function AIChatBot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<Message[]>([
    { role: 'ai', text: 'Olá! Sou o assistente do Anskriptor. Como posso ajudar você hoje?' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMsg = message.trim();
    setHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            ...history.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })),
            { role: 'user', content: userMsg }
          ]
        })
      });
      const data = await response.json();
      if (data.text) {
        setHistory(prev => [...prev, { role: 'ai', text: data.text }]);
        
        // Save chat log to Supabase if logged in
        if (user) {
          saveContent(user.id, 'Conversa no ChatBot', data.text, 'chat_log', { user_query: userMsg }).catch(console.error);
        }
      }
    } catch (e) {
      setHistory(prev => [...prev, { role: 'ai', text: 'Desculpe, tive um problema para responder agora. Tente novamente em instantes.' }]);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-[350px] md:w-[400px] h-[500px] bg-[#16161a] border border-[#26262a] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden mb-2"
            >
              <div className="bg-brand-orange p-5 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <Logo size="sm" showText={false} />
                  <div>
                    <h3 className="text-white font-bold text-sm leading-none">Anskriptor AI</h3>
                    <p className="text-white/60 text-[10px] mt-1">Sempre online para ajudar</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide bg-[#0e0e11]/30">
                {history.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-[1.5rem] text-sm leading-relaxed ${m.role === 'user' ? 'bg-brand-orange text-white rounded-tr-none' : 'bg-[#202026] text-gray-300 rounded-tl-none border border-[#36363a]'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-[#202026] p-4 rounded-[1.5rem] rounded-tl-none border border-[#36363a] flex gap-1">
                      <div className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-[#26262a] bg-[#0e0e11]/50">
                <div className="relative flex items-center">
                  <input
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Digite sua dúvida..."
                    className="w-full bg-[#202026] border border-[#36363a] py-3 pl-5 pr-12 rounded-2xl text-sm text-white focus:outline-none focus:border-brand-orange/50 transition-colors"
                  />
                  <button onClick={handleSend} className="absolute right-3 p-1.5 text-brand-orange hover:bg-brand-orange/10 rounded-xl transition-colors">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all duration-500 overflow-hidden relative ${isOpen ? 'bg-[#202026] border border-[#36363a]' : 'bg-brand-orange border-none shadow-brand-orange/30'}`}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }}>
                <Minus className="w-7 h-7 text-white" />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
                <MessageSquare className="w-7 h-7 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
          {!isOpen && <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />}
        </motion.button>
      </div>
    </>
  );
}
