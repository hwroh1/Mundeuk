// API 설정 파일
const API_CONFIG = {
    // 프론트엔드는 백엔드 프록시로만 요청합니다 (API 키는 서버에서 보관)
    OPENAI_API_KEY: window.API_KEY || 'your-api-key-here',
    
    // 프록시 엔드포인트 (Vercel 서버리스 함수)
    OPENAI_API_URL: 'https://mundeuk-five.vercel.app/api/analyze',
    
    // 사용할 모델 (서버에서 사용)
    MODEL: 'gpt-3.5-turbo',
    
    // 최대 토큰 수
    MAX_TOKENS: 1000,
    
    // 온도 설정 (0.7이 적당한 창의성)
    TEMPERATURE: 0.7
};

// 글 분석을 위한 프롬프트 템플릿
const ANALYSIS_PROMPT = `
다음 글을 분석하여 JSON으로 응답해주세요:

주제: {topic}
작성한 글: {text}

위 글에서 고급 어휘 5개를 찾아서 분석해주세요.

응답 형식:

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
    "rewritten_text": "상위 3% 수준의 글쓰기 능력을 가진 화자로서 동일한 주제로 300자 내외의 새로운 글을 작성해주세요.",
    "structure_analysis": ["문장 구조가 체계적입니다", "논리적 전개가 우수합니다", "고급 어휘 사용이 적절합니다"],
    "advanced_vocabulary": [
        {"word": "양면성", "pos": "명사", "definition": "하나의 대상이 서로 다른 두 가지 특성을 동시에 지니는 성질"},
        {"word": "익명성", "pos": "명사", "definition": "이름이나 신원을 알 수 없는 상태"},
        {"word": "조장", "pos": "동사", "definition": "어떤 일이 일어나도록 부추기거나 도움을 주는 것"},
        {"word": "민주주의", "pos": "명사", "definition": "국민이 주권을 가지고 스스로를 통치하는 정치 체제"},
        {"word": "진정성", "pos": "명사", "definition": "추상적 개념. 철학적 및 윤리적 담론에서 자주 사용"}
    ]
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
- rewritten_text: 상위 3% 수준의 글쓰기 능력을 가진 화자로서 동일한 주제로 300자 내외의 새로운 글 작성 (원글과는 다른 관점이나 접근법 사용, 더욱 정교하고 세련된 표현)
- structure_analysis: 문장 구조와 논리적 전개에 대한 상세한 분석을 3-4개의 항목으로 나누어 배열로 제공
- advanced_vocabulary: 글에서 사용된 고급 어휘 5개를 추출하여 배열로 제공 (각 어휘는 word, pos, definition 포함)

어휘 분석:
- 제공된 글에서 고급 어휘 5개를 찾아주세요
- 각 어휘는 word, pos, definition을 포함해야 합니다
- advanced_vocabulary 필드는 반드시 포함해주세요

상위 3% 수준 글쓰기 가이드라인:
1. 동일한 주제에 대해 완전히 새로운 관점이나 접근법으로 작성
2. 상위 3% 수준의 정교하고 세련된 어휘와 표현 사용
3. 복잡하고 정교한 문장 구조와 논리적 전개
4. 깊이 있는 사고와 통찰력이 드러나는 내용
5. 문학적이거나 학술적인 수준의 표현력
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
            const errorText = await response.text();
            console.error('API 응답 오류:', response.status, errorText);
            throw new Error(`API 요청 실패: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('API 응답 데이터:', data);
        console.log('API 응답 데이터 타입:', typeof data);
        console.log('API 응답 데이터 키들:', Object.keys(data));
        console.log('advanced_vocabulary 존재 여부:', 'advanced_vocabulary' in data);
        console.log('advanced_vocabulary 값:', data.advanced_vocabulary);
        
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
