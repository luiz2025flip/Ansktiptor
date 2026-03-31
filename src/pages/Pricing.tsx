import { useState } from 'react';
import { CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppRouter } from '../context/RouteContext';
import { useAuth } from '../context/AuthContext';

const plans = [
  { id: 'free', name: 'Gratis', price: 'R$ 0', period: '/mês', features: ['5.000 palavras/mês', '10+ ferramentas de IA', 'Suporte básico', 'Acesso à comunidade'], button: 'Começar agora', highlight: false },
  { id: 'premium', name: 'Premium', price: 'R$ 49', period: '/mês', features: ['Palavras ilimitadas', 'Todas as 20+ ferramentas', 'Suporte prioritário', 'Detector de IA incluso', 'Exportação em PDF'], button: 'Experimentar Premium', highlight: true },
  { id: 'business', name: 'Business', price: 'R$ 199', period: '/mês', features: ['Até 5 usuários', 'API de integração', 'Treinamento de tom de marca', 'Gerente de conta dedicado'], button: 'Falar com vendas', highlight: false },
];

export default function Pricing() {
  const { navigateTo } = useAppRouter();
  const { user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handlePlanClick = async (planId: string) => {
    if (!user) {
      navigateTo('login');
      return;
    }
    
    if (planId === 'free') {
      navigateTo('dashboard');
      return;
    }

    setLoadingPlan(planId);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, userId: user.id }),
      });
      
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Redireciona para o Stripe
      } else {
        alert(data.error || 'Erro ao iniciar o checkout.');
      }
    } catch (e: any) {
      alert('Erro de conexão ao servidor de pagamento.');
    }
    setLoadingPlan(null);
  };

  return (
    <div className="pt-24 pb-32 px-6">
      <div className="max-w-7xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Planos que crescem com você</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Escolha o plano ideal para suas necessidades de escrita. De projetos pessoais a grandes escalas empresariais.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`p-10 rounded-[2.5rem] border relative overflow-hidden flex flex-col ${plan.highlight ? 'bg-[#1a1410] border-brand-orange/40 shadow-[0_20px_50px_rgba(249,115,22,0.1)]' : 'bg-[#16161a] border-[#26262a]'}`}>
            {plan.highlight && (
              <div className="absolute top-6 right-8 bg-brand-orange text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Popular</div>
            )}
            <h3 className="text-xl font-bold text-white mb-4">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-bold text-white">{plan.price}</span>
              <span className="text-gray-500">{plan.period}</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-3 text-sm text-gray-400">
                  <CheckCircle2 className={`w-4 h-4 ${plan.highlight ? 'text-brand-orange' : 'text-gray-600'}`} />
                  {f}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handlePlanClick(plan.id)}
              disabled={loadingPlan === plan.id}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all ${plan.highlight ? 'bg-brand-orange text-white hover:bg-brand-orange-light shadow-lg shadow-brand-orange/20' : 'bg-[#202026] text-white border border-[#36363a] hover:bg-white/5 disabled:opacity-50'}`}
            >
              {loadingPlan === plan.id ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Carregando Checkout...</>
              ) : user ? (plan.id === 'free' ? 'Já Ativado' : 'Contratar Agora') : plan.button}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
