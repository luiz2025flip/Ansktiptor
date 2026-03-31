import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3001;

// ⚡ Endpoint para Geração de Conteúdo (Ferramentas)
app.post('/api/generate', async (req, res) => {
  const { prompt, model = 'llama-3.3-70b-versatile' } = req.body;
  const groqKey = process.env.GROQ_API_KEY;
  const googleKey = process.env.GEMINI_API_KEY;

  try {
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
          temperature: 0.7,
          max_completion_tokens: 1024
        })
      });
      const data = await response.json();
      if (data.choices?.[0]?.message?.content) {
         return res.json({ text: data.choices[0].message.content });
      }
    }

    if (googleKey) {
      const ai = new GoogleGenAI(googleKey);
      const gemini = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await gemini.generateContent(prompt);
      return res.json({ text: result.response.text() });
    }

    res.status(500).json({ error: 'Nenhuma chave de API configurada no servidor.' });
  } catch (e: any) {
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
    res.json({ text: data.choices[0].message.content });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`🔒 Proxy Server rodando na porta ${PORT}`));
