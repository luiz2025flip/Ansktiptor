export async function generateWithAI(prompt: string, category: string, style: string = 'Casual', length: string = '150 palavras'): Promise<{ text: string, wordCount: number }> {
  const systemMap: Record<string, string> = {
    gerar: 'Você é um especialista em criação de conteúdo em português brasileiro.',
    editar: 'Você é um editor profissional de textos em português brasileiro.',
    redacao: 'Você é um especialista em redação acadêmica e dissertativa em português.',
    social: 'Você é especialista em marketing digital e conteúdo para redes sociais.',
    email: 'Você é especialista em comunicação corporativa e e-mail marketing.',
    citacao: 'Você é especialista em criação de citações inspiradoras e frases de impacto.',
    estrutura: 'Você é especialista em criação de estruturas e esquemas de conteúdo.',
    resumo: 'Você é especialista em sumarização e síntese de textos em português.',
    reformular: 'Você é especialista em paráfrase e reformulação de textos em português.',
  };

  const instruction = systemMap[category] || systemMap.gerar;
  
  // Modelos de Linguagem são Ruins em contar palavras. Vamos transcrever para ESTRUTURA!
  let exactRule = `O texto DEVE ter aproximadamente o tamanho de ${length}.`;
  
  if (length.includes("50")) {
    exactRule = "ESTRUTURA OBRIGATÓRIA: Escreva EXATAMENTE 1 ÚNICO parágrafo com cerca de 3 ou 4 frases longas.";
  } else if (length.includes("100")) {
    exactRule = "ESTRUTURA OBRIGATÓRIA: Escreva EXATAMENTE 2 parágrafos. Não mais, não menos.";
  } else if (length.includes("150")) {
    exactRule = "ESTRUTURA OBRIGATÓRIA: Escreva EXATAMENTE 3 parágrafos curtos.";
  } else if (length.includes("300")) {
    exactRule = "ESTRUTURA OBRIGATÓRIA: Escreva de 4 a 5 parágrafos bem desenvolvidos.";
  } else if (length.includes("500")) {
    exactRule = "ESTRUTURA OBRIGATÓRIA: Escreva um artigo robusto com cerca de 6 a 8 parágrafos densos.";
  } else if (length.includes("750")) {
    exactRule = "ESTRUTURA OBRIGATÓRIA: Escreva um artigo longo com subtítulos marcados e cerca de 10 a 12 parágrafos.";
  } else if (length.includes("1000")) {
    exactRule = "ESTRUTURA OBRIGATÓRIA: Escreva um guia completo e exaustivo, dividido em vários tópicos e subtópicos, totalizando pelo menos 15 parágrafos ou mais.";
  }

  const fullPrompt = `DIRETRIZES TÉCNICAS:
1. PAPEL: ${instruction}
2. TIPO/ESTILO: [${category.toUpperCase()}] no estilo "${style}".
3. TEMA: ${prompt}
4. TAMANHO SOLICITADO PELA FERRAMENTA: ${exactRule}
5. IDIOMA: Português Brasileiro (PT-BR).

GERAR CONTEÚDO AGORA SEGUINDO A ESTRUTURA ACIMA:`;
  // Mapear comprimento com mais "folga" (~2 tokens por palavra para segurança)
  const tokenMap: Record<string, number> = {
    '50 palavras': 150,
    '100 palavras': 250,
    '150 palavras': 400,
    '300 palavras': 700,
    '500 palavras': 1000,
    '750 palavras': 1500,
    '1000 palavras': 2000,
  };
  const maxTokens = tokenMap[length] ?? 600;

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: fullPrompt, maxTokens })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    
    return { 
      text: data.text || '', 
      wordCount: data.wordCount || (data.text?.split(' ').length || 0)
    };
  } catch (error) {
    console.error('Error in AI Generation:', error);
    throw error;
  }
}
