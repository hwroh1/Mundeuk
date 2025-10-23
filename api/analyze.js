// Vercel Serverless Function: /api/analyze
// - Set OPENAI_API_KEY in Vercel Project Settings → Environment Variables

const ANALYSIS_PROMPT = (
  topic,
  text
) => `당신은 한국어 어휘 분석 전문가입니다. 주어진 글을 실제로 분석하여 다음 JSON 형식으로 결과를 반환해주세요:

주제: ${topic}
작성한 글: ${text}

위 글을 실제로 분석하여 다음 형식의 JSON을 반환해주세요:

1. vocabulary_score: 전체 어휘 표현력 점수 (0-100)
2. percentile: 상위 몇 퍼센트인지 (0-100)
3. scores: 각 영역별 점수 (0-100)
   - vocabulary_diversity: 어휘 다양성
   - vocabulary_difficulty: 어휘 난이도
   - sentence_structure: 문장 구성
   - logical_development: 논리적 전개
4. vocabulary_analysis: 어휘 수준별 비율 (합계 100)
   - high_level: 고급 어휘 비율
   - intermediate: 중급 어휘 비율
   - basic: 기초 어휘 비율
   - foregin: 외래어 비율
5. vocabulary_list: 글에서 사용된 고급 어휘 5개 (실제 글에 있는 어휘만)
   - 반드시 다음 형식으로 작성: [{"word": "단어", "pos": "품사", "definition": "정의"}, ...]
   - pos는 "명사", "동사", "형용사", "부사" 등 정확한 품사로 작성
   - definition은 해당 단어의 구체적인 의미를 한국어로 작성
   - 절대로 단순 문자열 배열 ["단어1", "단어2"] 형식으로 작성하지 마세요

예시 형식:
"vocabulary_list": [
  {"word": "익명성", "pos": "명사", "definition": "이름이나 신원을 알 수 없는 상태"},
  {"word": "억압", "pos": "명사", "definition": "힘으로 누르고 억제하는 것"},
  {"word": "무차별적", "pos": "형용사", "definition": "구별이나 선택 없이 모든 것을 대상으로 하는"},
  {"word": "유포", "pos": "동사", "definition": "소문이나 정보를 널리 퍼뜨리는 것"},
  {"word": "신뢰", "pos": "명사", "definition": "믿고 의지하는 마음"}
]

중요: vocabulary_list는 반드시 위 예시와 같은 객체 배열 형식으로 작성하세요. 단순 문자열 배열로 작성하면 안됩니다.`;

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


