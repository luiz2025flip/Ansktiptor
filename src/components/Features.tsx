import { motion } from 'motion/react';
import { FEATURES } from '../data/siteData';

export default function Features() {
  return (
    <section id="ferramentas" className="relative z-10 max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
        Escritor de Texto com IA para<br />
        <span className="text-brand-orange">Negócios, Marketing e Arte</span>
      </h2>
      <p className="text-gray-400 text-center mb-14 max-w-2xl mx-auto">
        20+ ferramentas especializadas para cada tipo de conteúdo que você precisa criar.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {FEATURES.map((f, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.07 }}
            className={`p-8 rounded-3xl cursor-pointer relative overflow-hidden bg-[#16161a] border transition-all duration-300 hover:-translate-y-1 group ${f.highlight ? 'border-[#3a1f0a] shadow-[0_10px_40px_rgba(249,115,22,0.08)]' : 'border-[#26262a] hover:border-[#36363a]'}`}>
            {f.highlight && <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-brand-orange/12 to-transparent pointer-events-none" />}
            {f.highlight && <div className="absolute top-5 right-5 w-1.5 h-1.5 rounded-full bg-brand-orange shadow-[0_0_8px_rgba(249,115,22,0.8)]" />}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-7 transition-transform group-hover:scale-105 ${f.highlight ? 'bg-brand-orange text-white shadow-[0_0_20px_rgba(249,115,22,0.5)]' : 'bg-[#202026] border border-[#36362a] text-brand-orange'}`}>
              <f.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">{f.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
