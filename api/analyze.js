// Vercel Serverless Function: /api/analyze
// - Set OPENAI_API_KEY in Vercel Project Settings → Environment Variables

const ANALYSIS_PROMPT = (
  topic,
  text
) => `다음은 사용자가 작성한 글입니다. 이 글을 분석하여 다음 항목들을 평가해주세요:\n\n주제: ${topic}\n작성한 글: ${text}\n\n다음 형식으로 JSON 응답을 해주세요:\n{\n    "vocabulary_score": 85,\n    "structure_score": 78,\n    "logic_score": 92,\n    "creativity_score": 80,\n    "overall_score": 84,\n    "strengths": ["구체적인 예시 사용", "논리적 전개", "적절한 어휘 선택"],\n    "improvements": ["문장 연결성 강화", "더 다양한 표현 사용"],\n    "detailed_analysis": "이 글은 주제에 대한 명확한 이해를 보여주며...",\n    "percentile": 75,\n    "rewritten_text": "개선된 버전의 글을 300자 내외로 작성해주세요. 원글의 핵심 내용은 유지하면서 더 나은 표현과 구조로 개선해주세요."\n}\n\n평가 기준:\n- vocabulary_score: 어휘의 다양성과 적절성 (0-100)\n- structure_score: 문장 구조와 구성 (0-100)\n- logic_score: 논리적 전개와 일관성 (0-100)\n- creativity_score: 창의성과 독창성 (0-100)\n- overall_score: 전체적인 점수 (0-100)\n- strengths: 글의 강점 (배열)\n- improvements: 개선점 (배열)\n- detailed_analysis: 상세한 분석 내용\n- percentile: 상위 몇 % 수준인지\n- rewritten_text: 원글을 개선한 버전 (300자 내외, 원글의 핵심 내용 유지하면서 더 나은 표현과 구조로 개선)\n`;

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return send(res, 200, { ok: true });
  }

  if (req.method !== 'POST') {
    return send(res, 405, { error: 'Method not allowed' });
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
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: '당신은 한국어 글쓰기 전문가입니다. 사용자의 글을 정확하고 상세하게 분석해주세요.' },
          { role: 'user', content: ANALYSIS_PROMPT(topic, text) },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const raw = await response.text();
      return send(res, response.status, { error: `OpenAI error ${response.status}`, raw });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    try {
      const parsed = JSON.parse(content);
      return send(res, 200, parsed);
    } catch (e) {
      return send(res, 200, { error: 'Failed to parse model output as JSON', raw: content });
    }
  } catch (err) {
    return send(res, 500, { error: 'Unexpected server error', details: String(err && err.message || err) });
  }
};


