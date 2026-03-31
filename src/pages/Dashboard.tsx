import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';
import { FileText, Calendar, Copy, Trash2, Clock, Share2, DownloadCloud } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface Content {
  id: string;
  title: string;
  body: string;
  type: string;
  created_at: string;
  is_deleted: boolean;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchContents = async () => {
      const { data, error } = await supabase
        .from('contents')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setContents(data);
      }
      setLoading(false);
    };

    fetchContents();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este conteúdo?')) return;
    
    // Soft Delete: Apenas marca como deletado no banco, mas não remove fisicamente.
    const { error } = await supabase
      .from('contents')
      .update({ is_deleted: true })
      .eq('id', id);

    if (!error) {
      setContents(prev => prev.filter(c => c.id !== id));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado para a área de transferência!');
  };

  const shareContent = async (title: string, text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Anskriptor AI',
          text: text,
        });
        return;
      } catch (err) {
        console.log('Share cancelado ou falhou');
      }
    }
    
    // Fallback: Abrir no WhatsApp Web/Mobile
    const url = `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${text}`)}`;
    window.open(url, '_blank');
  };

  const downloadTxt = (title: string, text: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${title || 'texto_gerado'}.txt`);
  };

  const downloadZip = async (title: string, text: string) => {
    const zip = new JSZip();
    zip.file(`${title || 'texto_gerado'}.txt`, text);
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${title || 'texto_gerado'}.zip`);
  };

  if (!user) {
    return (
      <div className="pt-32 pb-20 px-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Acesso Restrito</h2>
        <p className="text-gray-400">Por favor, faça login para ver seu histórico de gerações.</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-32 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Meus Textos</h1>
          <p className="text-gray-400">Histórico de tudo que você gerou com nossa IA.</p>
        </div>
        <div className="bg-[#16161a] border border-[#26262a] rounded-2xl px-6 py-3 flex items-center gap-4">
          <Clock className="w-4 h-4 text-brand-orange" />
          <span className="text-sm font-medium text-gray-300">Total de Gerações: <span className="text-white font-bold">{contents.length}</span></span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : contents.length === 0 ? (
        <div className="bg-[#16161a] border border-[#26262a] rounded-[2.5rem] p-20 text-center">
           <FileText className="w-12 h-12 text-gray-700 mx-auto mb-6" />
           <h3 className="text-xl font-bold text-white mb-2">Nenhum texto ainda</h3>
           <p className="text-gray-400 mb-8">Comece a criar usando nossas ferramentas na página inicial.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {contents.map((content, i) => (
            <motion.div 
              key={content.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#16161a] border border-[#26262a] rounded-3xl p-8 hover:border-brand-orange/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full mb-3 inline-block">
                    {content.type}
                  </span>
                  <h3 className="text-xl font-bold text-white">{content.title || 'Sem título'}</h3>
                </div>
                <div className="flex items-center gap-1 bg-[#202026] p-1.5 rounded-2xl border border-[#36363a]">
                  <button onClick={() => shareContent(content.title, content.body)} className="p-2 hover:bg-brand-orange hover:text-white rounded-xl text-brand-orange transition-colors" title="Compartilhar">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => downloadTxt(content.title, content.body)} className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors text-xs font-bold" title="Baixar TXT">
                    .TXT
                  </button>
                  <button onClick={() => downloadZip(content.title, content.body)} className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors text-xs font-bold" title="Baixar ZIP">
                    .ZIP
                  </button>
                  <div className="w-px h-6 bg-[#36363a] mx-1" />
                  <button onClick={() => copyToClipboard(content.body)} className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors" title="Copiar">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(content.id)} className="p-2 hover:bg-red-500/10 rounded-xl text-gray-500 hover:text-red-400 transition-colors" title="Excluir">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="bg-[#0e0e11] rounded-2xl p-6 mb-6 line-clamp-4 relative">
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{content.body}</p>
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0e0e11] to-transparent pointer-events-none" />
              </div>

              <div className="flex items-center gap-4 text-[10px] text-gray-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  {new Date(content.created_at).toLocaleString('pt-BR')}
                </div>
                <div className="w-1 h-1 bg-gray-800 rounded-full" />
                <div>ID: {content.id.split('-')[0].toUpperCase()}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
