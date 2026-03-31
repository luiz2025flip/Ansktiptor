import { motion } from 'motion/react';

const posts = [
  { title: 'Como a IA está mudando a escrita digital', excerpt: 'Descubra como ferramentas de inteligência artificial podem aumentar sua produtividade.', category: 'Inovação', date: '30 Mar 2025' },
  { title: 'SEO em 2025: Guia definitivo para redatores', excerpt: 'As melhores técnicas de otimização para conteúdo gerado por IA.', category: 'Marketing', date: '28 Mar 2025' },
  { title: 'Superando o bloqueio de escritor com prompts', excerpt: 'Aprenda a usar o Anskriptor para nunca mais ficar sem ideias.', category: 'Criatividade', date: '25 Mar 2025' },
];

export default function Blog() {
  return (
    <div className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Blog Anskriptor</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">Tendências, dicas e guias sobre escrita e inteligência artificial.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            className="group cursor-pointer bg-[#16161a] border border-[#26262a] rounded-[2rem] p-8 hover:border-brand-orange/40 transition-all">
            <span className="text-[10px] uppercase font-bold text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">{post.category}</span>
            <h3 className="text-xl font-bold text-white mt-6 mb-4 group-hover:text-brand-orange transition-colors">{post.title}</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">{post.excerpt}</p>
            <div className="text-[10px] text-gray-600 font-medium">{post.date}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
