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
4. vocabulary_analysis: 어휘 수준별 비율 (반드시 합계가 100이 되어야 함)
   - high_level: 고급 어휘 비율 (숫자)
   - intermediate: 중급 어휘 비율 (숫자)
   - basic: 기초 어휘 비율 (숫자)
   - foreign: 외래어 비율 (숫자, 영어, 한자어 외래어 포함)
   - 중요: high_level + intermediate + basic + foreign = 100 이어야 함
   - 외래어 감지 방법: 글 속의 모든 단어를 검토하여 영어, 일본어, 프랑스어 등에서 유래한 외래어를 정확히 찾아내고, 전체 단어 대비 외래어의 비율을 계산하세요. 예를 들어 "디지털", "컴퓨터", "인터넷", "카페", "커피" 등이 외래어입니다. 외래어가 하나라도 있으면 0%가 아닙니다.
5. vocabulary_list: 글에서 사용된 고급 어휘 5개 (실제 글에 있는 어휘만)
   - 각 어휘는 {"word": "단어", "pos": "품사", "definition": "정의"} 형식으로 작성
   - pos는 명사, 동사, 형용사, 부사 중 하나
   - definition은 해당 단어의 의미
6. rewritten_text: 상위 3% 글쓰기 능력자라고 가정하고 동일한 주제로 300자 내외로 리라이팅한 글
   - 사용자가 작성한 글의 주제와 내용을 바탕으로 더욱 우수한 글쓰기로 개선
   - 고급 어휘와 정교한 문장 구조를 사용하여 전문적인 수준으로 작성
   - 논리적 흐름과 설득력을 강화한 버전으로 재작성

반드시 실제 글을 분석한 결과를 반환하고, 예시 값이 아닌 실제 분석 값으로 채워주세요. 모든 필드를 포함한 완전한 JSON 형식만 반환하고 다른 설명은 포함하지 마세요.`;

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
          { role: 'system', content: '당신은 한국어 어휘 분석 전문가입니다. 사용자의 텍스트에서 고급 어휘를 정확하게 추출하고, 외래어를 빠짐없이 감지해야 합니다. 외래어가 하나라도 있으면 반드시 0%가 아닌 값으로 계산하세요.' },
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


