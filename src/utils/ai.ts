export async function generateWithAI(prompt: string, category: string, style: string, length: string): Promise<string> {
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
  const fullPrompt = `${instruction}\n\nEstilo: ${style}\nComprimento: ${length}\n\nTarefa: ${prompt}\n\nGere o conteúdo solicitado em português brasileiro com qualidade profissional.`;

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: fullPrompt })
    });
    const data = await response.json();
    return data.text || 'Nenhum resultado gerado.';
  } catch (e: any) {
    throw new Error(e.message || 'Erro ao conectar ao servidor de IA.');
  }
}
