import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import Stripe from 'stripe';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;

// ⚡ Endpoint para Geração de Conteúdo (Ferramentas)
app.post('/api/generate', async (req, res) => {
  const { prompt, model = 'llama-3.3-70b-versatile', maxTokens = 1024 } = req.body;
  const groqKey = process.env.GROQ_API_KEY;
  const googleKey = process.env.GEMINI_API_KEY;

  try {
    // 💎 Priorizar Gemini para ferramentas (melhor para contagem de palavras e profundidade em PT-BR)
    if (googleKey) {
      const ai = new GoogleGenAI(googleKey);
      const gemini = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const structuredPrompt = `VOCÊ É UM ESCRITOR DE ALTO NÍVEL. SIGA ESTAS REGRAS DE OURO:
1. NÃO SEJA ECONÔMICO: Se o usuário pediu um tamanho específico, elabore profundamente.
2. DETALHAMENTO: Para cada tópico ou passo, escreva pelo menos 2 a 3 frases explicativas.
3. ESTRUTURA: Use títulos, listas e parágrafos bem definidos.
4. IDIOMA: Responda SEMPRE em Português Brasileiro (PT-BR).

REQUISITO DO USUÁRIO: ${prompt}

Gere o conteúdo AGORA de forma completa e profunda:`;

      console.log('🤖 Gerando com Gemini...', { length: maxTokens });
      const result = await gemini.generateContent({
        contents: [{ role: 'user', parts: [{ text: structuredPrompt }] }],
        generationConfig: {
          temperature: 1.0, // Criatividade máxima para evitar respostas secas
          topP: 0.95,
          maxOutputTokens: maxTokens,
        }
      });
      const responseText = result.response.text();
      console.log('✅ Resposta gerada (tamanho):', responseText.split(' ').length);
      return res.json({ 
        text: responseText, 
        wordCount: responseText.split(' ').length 
      });
    }

    // ⚡ Fallback para Groq se Gemini não estiver disponível
    if (groqKey) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.9,
          max_completion_tokens: 2048
        })
      });
      const data = await response.json();
      if (data.choices?.[0]?.message?.content) {
         const content = data.choices[0].message.content;
         return res.json({ 
           text: content, 
           wordCount: content.split(' ').length 
         });
      }
    }

    res.status(500).json({ error: 'Nenhuma chave de API configurada no servidor.' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 💬 Endpoint para o ChatBot
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  const groqKey = process.env.GROQ_API_KEY;

  try {
    if (!groqKey) throw new Error('Groq Key is missing on server');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Você é o assistente oficial do site Anskriptor. Responda de forma amigável.' },
          ...messages
        ],
        temperature: 0.7,
        max_completion_tokens: 512
      })
    });
    const data = await response.json();
    const content = data.choices[0].message.content;
    res.json({ 
      text: content, 
      wordCount: content.split(' ').length 
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/checkout', async (req, res) => {
  const { planId, userId } = req.body;
  
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Chave do Stripe não configurada no servidor (.env).' });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY.trim());
    const origin = req.headers.origin || 'http://localhost:5173'; // Pega a URL dinâmica do navegador
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: planId === 'premium' ? 'Plano Premium - Anskriptor' : 'Plano Business - Anskriptor',
            },
            unit_amount: planId === 'premium' ? 4900 : 19900, // em centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // Pode ser 'subscription' se você configurar planos no Stripe
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/precos`,
      client_reference_id: userId,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Erro no Stripe:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`🔒 Proxy Server rodando na porta ${PORT}`));
