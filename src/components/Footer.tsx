import Logo from './Logo';
import { useAppRouter } from '../context/RouteContext';

export default function Footer() {
  const { navigateTo } = useAppRouter();
  
  const scrollToTools = () => {
    const el = document.getElementById('tools-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else navigateTo('home');
  };

  return (
    <footer className="relative z-10 border-t border-[#26262a] px-6 py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="mb-6">
            <button onClick={() => navigateTo('home')} className="hover:opacity-80 transition-opacity">
              <Logo />
            </button>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            A plataforma completa de escrita com IA para profissionais, estudantes e criadores de conteúdo.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Ferramentas</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            {['Gerador de Texto com IA', 'Gerador de E-mails', 'Escritor Acadêmico', 'Escritor de Blog', 'Gerador de Citações', 'Escritor de Histórias'].map(t => (
              <li key={t}><button onClick={scrollToTools} className="hover:text-white transition-colors">{t}</button></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Mais Ferramentas</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            {['Escritor de Poemas', 'Letras de Músicas', 'Escritor de Discursos', 'Detector de IA', 'Reformulador de Texto', 'Escritor de Currículo'].map(t => (
              <li key={t}><button onClick={scrollToTools} className="hover:text-white transition-colors">{t}</button></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Links</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Suporte</button></li>
            <li><button onClick={() => navigateTo('blog')} className="hover:text-white transition-colors">Blog</button></li>
            <li><button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Política de Privacidade</button></li>
            <li><button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Termos de Uso</button></li>
            <li><button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Contato</button></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-10 pt-8 border-t border-[#26262a] flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <span>© 2025 Anskriptor. Todos os direitos reservados.</span>
        <div className="flex items-center gap-3">
          <span>Disponível em</span>
          <button className="px-3 py-1.5 bg-[#202026] border border-[#36363a] rounded-xl text-xs hover:border-brand-orange/40 hover:text-white transition-all">App Store</button>
          <button className="px-3 py-1.5 bg-[#202026] border border-[#36363a] rounded-xl text-xs hover:border-brand-orange/40 hover:text-white transition-all">Google Play</button>
        </div>
      </div>
    </footer>
  );
}
