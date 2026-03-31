import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  created_at: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <div className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20 text-balance">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Blog Anskriptor</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">Tendências, dicas e guias sobre escrita e inteligência artificial.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <motion.div key={post.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="group cursor-pointer bg-[#16161a] border border-[#26262a] rounded-[2rem] p-8 hover:border-brand-orange/40 transition-all">
              <span className="text-[10px] uppercase font-bold text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">{post.category}</span>
              <h3 className="text-xl font-bold text-white mt-6 mb-4 group-hover:text-brand-orange transition-colors">{post.title}</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3">{post.excerpt}</p>
              <div className="text-[10px] text-gray-600 font-medium">{new Date(post.created_at).toLocaleDateString('pt-BR')}</div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
