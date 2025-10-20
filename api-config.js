// API 설정 파일
const API_CONFIG = {
    // 프론트엔드는 백엔드 프록시로만 요청합니다 (API 키는 서버에서 보관)
    OPENAI_API_KEY: window.API_KEY || 'your-api-key-here',
    
    // 프록시 엔드포인트 (Vercel 서버리스 함수)
    OPENAI_API_URL: '/api/analyze',
    
    // 사용할 모델 (서버에서 사용)
    MODEL: 'gpt-3.5-turbo',
    
    // 최대 토큰 수
    MAX_TOKENS: 1000,
    
    // 온도 설정 (0.7이 적당한 창의성)
    TEMPERATURE: 0.7
};

// 글 분석을 위한 프롬프트 템플릿
const ANALYSIS_PROMPT = `
다음은 사용자가 작성한 글입니다. 이 글을 분석하여 다음 항목들을 평가해주세요:

주제: {topic}
작성한 글: {text}

다음 형식으로 JSON 응답을 해주세요:
{
    "vocabulary_score": 85,
    "structure_score": 78,
    "logic_score": 92,
    "creativity_score": 80,
    "overall_score": 84,
    "strengths": ["구체적인 예시 사용", "논리적 전개", "적절한 어휘 선택"],
    "improvements": ["문장 연결성 강화", "더 다양한 표현 사용"],
    "detailed_analysis": "이 글은 주제에 대한 명확한 이해를 보여주며...",
    "percentile": 75,
    "rewritten_text": "개선된 버전의 글을 300자 내외로 작성해주세요. 원글의 핵심 내용은 유지하면서 더 나은 표현과 구조로 개선해주세요."
}

평가 기준:
- vocabulary_score: 어휘의 다양성과 적절성 (0-100)
- structure_score: 문장 구조와 구성 (0-100)  
- logic_score: 논리적 전개와 일관성 (0-100)
- creativity_score: 창의성과 독창성 (0-100)
- overall_score: 전체적인 점수 (0-100)
- strengths: 글의 강점 (배열)
- improvements: 개선점 (배열)
- detailed_analysis: 상세한 분석 내용
- percentile: 상위 몇 % 수준인지
- rewritten_text: 원글을 개선한 버전 (300자 내외, 원글의 핵심 내용 유지하면서 더 나은 표현과 구조로 개선)

리라이팅 가이드라인:
1. 원글의 핵심 메시지와 주장은 그대로 유지
2. 문장 구조를 더 명확하고 논리적으로 개선
3. 어휘를 더 정확하고 풍부하게 사용
4. 문장 간 연결성을 강화
5. 전체적인 흐름을 더 매끄럽게 개선
6. 300자 내외로 작성
`;

// API 호출 함수
async function analyzeText(text, topic) {
    try {
        // 프록시 엔드포인트로 요청 (서버가 OpenAI와 통신)
        const response = await fetch(API_CONFIG.OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text, topic })
        });

        if (!response.ok) {
            throw new Error(`API 요청 실패: ${response.status}`);
        }

        const data = await response.json();
        // 서버가 이미 JSON 형태로 가공해 반환
        return data;
        
    } catch (error) {
        console.error('API 호출 오류:', error);
        return {
            error: '분석 중 오류가 발생했습니다.',
            details: error.message
        };
    }
}

// 사용 예시
async function testAnalysis() {
    const sampleText = "디지털 시대의 익명성은 양면성을 지닌다. 한편으로는 자유로운 의견 표현을 가능하게 하여 민주주의의 발전에 기여하지만, 다른 한편으로는 책임감 없는 발언과 가짜뉴스의 확산을 조장할 수 있다.";
    const sampleTopic = "디지털 시대의 익명성";
    
    console.log('분석 시작...');
    const result = await analyzeText(sampleText, sampleTopic);
    console.log('분석 결과:', result);
    
    return result;
}

// 전역으로 사용할 수 있도록 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { analyzeText, testAnalysis, API_CONFIG };
} else {
    window.analyzeText = analyzeText;
    window.testAnalysis = testAnalysis;
    window.API_CONFIG = API_CONFIG;
}
