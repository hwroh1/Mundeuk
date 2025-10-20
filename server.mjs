import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors()); // 임시 개발용
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  try {
    const { text, topic } = req.body || {};
    if (!text || !topic) return res.status(400).json({ error: 'text and topic are required' });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing OPENAI_API_KEY on server' });

    const prompt = `
다음은 사용자가 작성한 글입니다. 이 글을 분석하여 다음 항목들을 평가해주세요:

주제: ${topic}
작성한 글: ${text}

다음 형식으로 JSON 응답을 해주세요:
{
  "vocabulary_score": 85,
  "structure_score": 78,
  "logic_score": 92,
  "creativity_score": 80,
  "overall_score": 84,
  "strengths": ["구체적인 예시 사용", "논리적 전개", "적절한 어휘 선택"],
  "improvements": ["문장 연결성 강화", "더 다양한 표현 사용"],
  "detailed_analysis": "…",
  "percentile": 75,
  "rewritten_text": "개선된 버전의 글…"
}
`;

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: '당신은 한국어 글쓰기 전문가입니다.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    const raw = await r.json();
    const content = raw?.choices?.[0]?.message?.content ?? '';
    try {
      const json = JSON.parse(content);
      res.json(json);
    } catch {
      res.json({ error: 'Failed to parse model output as JSON', raw: content });
    }
  } catch (e) {
    res.status(500).json({ error: 'Server error', details: String(e?.message || e) });
  }
});

const PORT = 8787;
app.listen(PORT, () => console.log(`Local proxy running on http://localhost:${PORT}`));
