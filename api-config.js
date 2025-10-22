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
당신은 한국어 어휘력 분석 전문가입니다. 다음 글을 분석해주세요:

주제: {topic}
작성한 글: {text}

위 글에서 사용된 고급 어휘 최소 5개를 찾아서 분석해주세요.

반드시 아래 JSON 형식으로만 응답하세요:

{
    "vocabulary_score": 85,
    "structure_score": 78,
    "logic_score": 92,
    "creativity_score": 80,
    "overall_score": 84,
    "percentile": 75,
    "vocabulary_list": [
        {"word": "양면성", "pos": "명사", "definition": "하나의 대상이 서로 다른 두 가지 특성을 동시에 지니는 성질"},
        {"word": "익명성", "pos": "명사", "definition": "이름이나 신원을 알 수 없는 상태"},
        {"word": "조장", "pos": "동사", "definition": "어떤 일이 일어나도록 부추기거나 도움을 주는 것"},
        {"word": "민주주의", "pos": "명사", "definition": "국민이 주권을 가지고 스스로를 통치하는 정치 체제"},
        {"word": "진정성", "pos": "명사", "definition": "추상적 개념. 철학적 및 윤리적 담론에서 자주 사용"}
    ]
}

어휘 분석 규칙:
1. {text}에서 실제로 사용된 어휘만 선택
2. 조사나 어미는 제거하고 기본형만 사용
3. 고급 어휘(대학생 이상 수준)만 선택
4. 각 어휘의 정확한 품사와 정의 제공
5. vocabulary_list 필드는 반드시 포함

중요: vocabulary_list 필드가 없으면 분석이 실패합니다.

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
