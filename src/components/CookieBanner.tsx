import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export default function CookieBanner() {
  const [show, setShow] = useState(true);

  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-[100] bg-[#16161a]/95 backdrop-blur-xl border-t border-[#36363a] px-6 py-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left">
              Usamos cookies para garantir a melhor experiência em nossa plataforma. Ao continuar, você concorda com nossos termos.
            </p>
            <div className="flex gap-3 shrink-0">
              <button onClick={() => setShow(false)} className="text-gray-400 hover:text-white px-4 py-2 text-sm transition-colors">Recusar</button>
              <button onClick={() => setShow(false)} className="bg-brand-orange text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-brand-orange-light transition-colors shadow-lg shadow-brand-orange/20">
                Aceitar todos
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
