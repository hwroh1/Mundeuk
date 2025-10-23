// Vercel Serverless Function: /api/analyze
// - Set OPENAI_API_KEY in Vercel Project Settings → Environment Variables

const ANALYSIS_PROMPT = (
  topic,
  text
) => `당신은 한국어 어휘 분석 전문가입니다. 다음 JSON 형식으로 분석 결과를 반환해주세요:

주제: ${topic}
작성한 글: ${text}

다음 형식의 JSON을 반환해주세요:
{
  "vocabulary_score": 85,
  "percentile": 78,
  "scores": {
    "vocabulary_diversity": 82,
    "vocabulary_difficulty": 88,
    "sentence_structure": 79,
    "logical_development": 84
  },
  "vocabulary_analysis": {
    "high_level": 15,
    "intermediate": 25,
    "basic": 60
  },
  "vocabulary_list": [
    {"word": "양면성", "pos": "명사", "definition": "하나의 대상이 서로 다른 두 가지 특성을 동시에 지니는 성질"},
    {"word": "익명성", "pos": "명사", "definition": "이름이나 신원을 알 수 없는 상태"},
    {"word": "조장", "pos": "동사", "definition": "어떤 일이 일어나도록 부추기거나 도움을 주는 것"},
    {"word": "민주주의", "pos": "명사", "definition": "국민이 주권을 가지고 스스로를 통치하는 정치 체제"},
    {"word": "진정성", "pos": "명사", "definition": "추상적 개념. 철학적 및 윤리적 담론에서 자주 사용"}
  ]
}

위 글을 분석하여 위 형식의 JSON만 반환해주세요. 다른 설명이나 텍스트는 포함하지 마세요.`;

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return send(res, 200, { ok: true });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return send(res, 405, { error: 'Only POST is allowed' });
  }

  try {
    const { text, topic } = req.body || {};
    if (!text || !topic) {
      return send(res, 400, { error: 'text and topic are required' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return send(res, 500, { error: 'Server misconfigured: OPENAI_API_KEY missing' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: '당신은 한국어 어휘 분석 전문가입니다. 사용자의 텍스트에서 고급 어휘를 정확하게 추출해주세요.' },
          { role: 'user', content: ANALYSIS_PROMPT(topic, text) },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const raw = await response.text();
      return send(res, response.status, { error: `OpenAI error ${response.status}`, raw });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // JSON 응답 처리
    try {
      const parsed = JSON.parse(content);
      return send(res, 200, parsed);
    } catch (e) {
      return send(res, 200, { error: 'Failed to parse model output as JSON', raw: content });
    }
  } catch (err) {
    return send(res, 500, { error: 'Unexpected server error', details: String((err && err.message) || err) });
  }
}


