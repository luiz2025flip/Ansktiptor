import React from 'react';
import {
  Mail, Search, FileText, PenTool, Share2, Quote, Type, Edit3,

  AlignLeft, BookOpen, ScrollText, BookUser, BookHeart, BookType,
  Music, TextQuote, ScanSearch, Volume2
} from 'lucide-react';

export type Tab = { id: string; label: string };
export type Tool = { id: string; label: string; icon: React.ElementType; description: string; suggestions: string[] };

export const TABS: Tab[] = [
  { id: 'gerar', label: 'Gerar Texto com IA' },
  { id: 'editar', label: 'Editar Texto com IA' },
  { id: 'redacao', label: 'Escrever Redação com IA' },
  { id: 'social', label: 'Gerar Texto para Redes Sociais' },
  { id: 'email', label: 'Gerar Texto para E-mail' },
  { id: 'citacao', label: 'Gerar Citação' },
  { id: 'estrutura', label: 'Gerar Texto de Estrutura' },
  { id: 'resumo', label: 'Gerar Texto de Resumo' },
  { id: 'reformular', label: 'Reformular Texto com IA' },
];

export const PROMPTS: Record<string, { placeholder: string; suggestions: string[] }> = {
  gerar: {
    placeholder: 'Descreva o texto que deseja gerar...',
    suggestions: [
      'Gerar um guia passo a passo sobre como dominar hábitos de produtividade.',
      'Desenvolver um post de blog explorando como a IA está transformando a educação.',
      'Gerar um artigo convincente sobre os benefícios da meditação.',
      'Escrever um artigo criativo sobre o futuro do trabalho remoto.',
    ],
  },
  editar: {
    placeholder: 'Cole o texto que deseja editar e descreva as alterações...',
    suggestions: [
      'Melhorar o tom formal deste e-mail para clientes.',
      'Corrigir a gramática e pontuação do texto abaixo.',
      'Deixar este parágrafo mais conciso e objetivo.',
      'Adaptar este texto para um público jovem.',
    ],
  },
  redacao: {
    placeholder: 'Descreva o tema da sua redação...',
    suggestions: [
      'Redação dissertativa sobre o impacto das redes sociais na saúde mental.',
      'Escreva uma redação argumentativa sobre energias renováveis.',
      'Redação sobre os desafios da educação no Brasil contemporâneo.',
      'Texto sobre preservação ambiental e desenvolvimento sustentável.',
    ],
  },
  social: {
    placeholder: 'Descreva o post para redes sociais...',
    suggestions: [
      'Post motivacional para LinkedIn sobre liderança e inovação.',
      'Caption para Instagram de lançamento de produto tecnológico.',
      'Tweet impactante sobre empreendedorismo digital.',
      'Post para Facebook promovendo evento corporativo.',
    ],
  },
  email: {
    placeholder: 'Descreva o e-mail que precisa escrever...',
    suggestions: [
      'E-mail de follow-up após reunião de vendas com cliente.',
      'E-mail de apresentação profissional para novo contato.',
      'Newsletter mensal para clientes com novidades do produto.',
      'E-mail de agradecimento após entrevista de emprego.',
    ],
  },
  citacao: {
    placeholder: 'Sobre qual tema deseja uma citação inspiradora?',
    suggestions: [
      'Citação motivacional sobre superação de desafios.',
      'Frase filosófica sobre o significado da vida.',
      'Citação sobre liderança e trabalho em equipe.',
      'Frase inspiradora sobre criatividade e inovação.',
    ],
  },
  estrutura: {
    placeholder: 'Descreva a estrutura que precisa criar...',
    suggestions: [
      'Estrutura de apresentação de pitch para investidores.',
      'Esquema de artigo científico sobre inteligência artificial.',
      'Roteiro de vídeo explicativo para YouTube.',
      'Outline de e-book sobre marketing digital.',
    ],
  },
  resumo: {
    placeholder: 'Cole o texto que deseja resumir...',
    suggestions: [
      'Resumir este artigo acadêmico em 5 pontos principais.',
      'Condensar este relatório em um parágrafo executivo.',
      'Extrair os pontos-chave deste documento longo.',
      'Criar um resumo executivo deste conteúdo.',
    ],
  },
  reformular: {
    placeholder: 'Cole o texto que deseja reformular...',
    suggestions: [
      'Reformular este parágrafo com tom mais profissional.',
      'Reescrever esta frase de forma mais clara e direta.',
      'Parafrasear este conteúdo evitando plágio.',
      'Transformar este texto técnico em linguagem simples.',
    ],
  },
};

export const TOOLS: Tool[] = [
  { id: 'ai-text', label: 'Escritor de Texto com IA', icon: AlignLeft, description: 'Um escritor de texto com IA gera automaticamente parágrafos estruturados. Crie blocos de texto coerentes para artigos, textos de marketing, e-mails e relatórios com velocidade e qualidade.', suggestions: ['Parágrafo de Introdução', 'Parágrafo de Resumo', 'Parágrafo de Argumentação', 'Parágrafo Descritivo', 'Parágrafo Narrativo', 'Parágrafo Persuasivo', 'Parágrafo de Conclusão'] },
  { id: 'email-tool', label: 'Escritor de Texto para E-mail com IA', icon: Mail, description: 'Gere e-mails profissionais de alta qualidade. Nossa IA adapta automaticamente o tom, a gramática e a estrutura para diferentes contextos de comunicação empresarial.', suggestions: ['E-mail de Apresentação', 'E-mail de Follow-up', 'E-mail de Agradecimento', 'Newsletter', 'Proposta Comercial'] },
  { id: 'academic', label: 'Escritor de Texto Acadêmico com IA', icon: FileText, description: 'Apoio completo para produção acadêmica. Gere resumos, revisões de literatura e estruturas de artigos científicos com precisão e rigor metodológico.', suggestions: ['Revisão de Literatura', 'Abstract Científico', 'Metodologia de Pesquisa', 'Conclusão Acadêmica', 'Citações APA/ABNT'] },
  { id: 'book', label: 'Escritor de Texto com IA para Livros', icon: BookOpen, description: 'Crie capítulos, enredos e diálogos para seu livro com ajuda da IA. Desenvolva personagens complexos e narrativas envolventes de forma estruturada.', suggestions: ['Primeiro Capítulo', 'Desenvolvimento de Personagem', 'Diálogo Entre Personagens', 'Cena de Clímax', 'Epílogo'] },
  { id: 'letter', label: 'Escritor de Texto de Cartas com IA', icon: ScrollText, description: 'Crie cartas formais e informais para qualquer ocasião. Da carta de recomendação a comunicados corporativos, sempre com o tom certo.', suggestions: ['Carta de Recomendação', 'Carta de Apresentação', 'Carta de Agradecimento', 'Carta Formal', 'Carta de Demissão'] },
  { id: 'resume', label: 'Escritor de Texto para Currículo com IA', icon: BookUser, description: 'Crie currículos profissionais que destacam suas competências e experiências. Nossa IA otimiza o texto para passar por sistemas de triagem automática (ATS).', suggestions: ['Objetivo Profissional', 'Resumo de Experiência', 'Competências Técnicas', 'Realizações Profissionais', 'Carta de Apresentação'] },
  { id: 'detector', label: 'Detector de IA', icon: ScanSearch, description: 'Verifique se um texto foi gerado por inteligência artificial. Nossa ferramenta analisa padrões linguísticos para identificar conteúdo produzido por IA com alta precisão.', suggestions: ['Analisar Artigo', 'Verificar Ensaio', 'Checar Post de Blog', 'Avaliar Redação', 'Detectar em E-mail'] },
  { id: 'poem', label: 'Escritor de Poemas com IA', icon: BookHeart, description: 'Crie poemas únicos em diversos estilos e métricas. De sonetos clássicos a versos livres modernos, nossa IA captura emoções com beleza literária.', suggestions: ['Soneto Romântico', 'Haiku sobre Natureza', 'Poema Livre', 'Ode Celebrativa', 'Poema de Amizade'] },
  { id: 'story', label: 'Escritor de Texto com IA para Histórias', icon: BookType, description: 'Crie histórias envolventes com personagens ricos, tramas dinâmicas e desfechos surpreendentes. Da ficção científica ao realismo mágico.', suggestions: ['Conto de Mistério', 'Ficção Científica', 'Romance Histórico', 'Aventura Épica', 'Drama Contemporâneo'] },
  { id: 'quote', label: 'Gerador de Citações com IA', icon: Quote, description: 'Gere citações e frases de impacto sobre qualquer tema. Perfeitas para apresentações, posts nas redes sociais ou discursos.', suggestions: ['Citação sobre Liderança', 'Frase Motivacional', 'Citação Filosófica', 'Aforismo sobre Sucesso', 'Frase Inspiradora'] },
  { id: 'lyrics', label: 'Escritor de Texto para Letras de Músicas com IA', icon: Music, description: 'Componha letras criativas para qualquer gênero musical. De samba a rock, nossa IA entende ritmo, rima e emoção para criar músicas autênticas.', suggestions: ['Letra de Samba', 'Refrão de Pop', 'Verso de Rap', 'Balada Romântico', 'Hino Motivacional'] },
  { id: 'blog', label: 'Escritor de Texto para Blogs com IA', icon: TextQuote, description: 'Crie artigos de blog otimizados para SEO que engajam leitores e rankeiam nos buscadores. De 500 a 5000 palavras, sempre com qualidade.', suggestions: ['Post Tutorial', 'Artigo de Opinião', 'Lista com Dicas', 'Comparativo de Produtos', 'Guia Completo'] },
  { id: 'speech', label: 'Escritor de Texto para Discursos com IA', icon: Volume2, description: 'Redija discursos impactantes para qualquer ocasião. Formaturas, casamentos, eventos corporativos ou apresentações públicas com eloquência.', suggestions: ['Discurso de Formatura', 'Discurso de Casamento', 'Apresentação Corporativa', 'Discurso Político', 'Palestra Motivacional'] },
];

export const FEATURES = [
  { icon: Mail, title: 'Gerador de E-mails', description: 'Crie e-mails profissionais rapidamente com nossa IA que ajusta tom, gramática e estrutura automaticamente.', highlight: false },
  { icon: Search, title: 'SEO Copywriting', description: 'Escreva conteúdo altamente otimizado para SEO que converte mais leads e atrai tráfego orgânico.', highlight: true },
  { icon: FileText, title: 'Resumos de Textos', description: 'Analise documentos e textos longos, obtendo resumos precisos com os pontos principais em instantes.', highlight: false },
  { icon: PenTool, title: 'Redator de Blog', description: 'Gere postagens inteiras para seu blog. De parágrafos introdutórios até desfechos memoráveis e cativantes.', highlight: false },
  { icon: Share2, title: 'Redes Sociais', description: 'Gere textos para redes sociais com gramática impecável, tom controlado e alto poder de engajamento.', highlight: false },
  { icon: Quote, title: 'Gerador de Citações', description: 'Crie citações e frases de impacto perspicazes para incorporar em suas peças e apresentações.', highlight: false },
  { icon: Type, title: 'Gerador de Títulos', description: 'Obtenha títulos persuasivos que capturem a atenção do leitor e garantam altas taxas de cliques.', highlight: false },
  { icon: Edit3, title: 'Correção com IA', description: 'Nossa inteligência artificial analisa e corrige a gramática, dando sugestões contextuais inteligentes.', highlight: false },
];

export const STATS = [
  { value: '5x', label: 'Mais rápido que escrita manual' },
  { value: '20+', label: 'Ferramentas de conteúdo' },
  { value: '40+', label: 'Idiomas suportados' },
  { value: '500k+', label: 'Usuários ativos' },
];
