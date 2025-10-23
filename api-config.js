// API 설정 파일
const API_CONFIG = {
    // 프론트엔드는 백엔드 프록시로만 요청합니다 (API 키는 서버에서 보관)
    OPENAI_API_KEY: window.API_KEY || 'your-api-key-here',
    
    // 프록시 엔드포인트 (Vercel 서버리스 함수)
    OPENAI_API_URL: 'https://mundeuk-five.vercel.app/api/analyze',
    
    // 사용할 모델 (서버에서 사용)
    MODEL: 'gpt-4',
    
    // 최대 토큰 수
    MAX_TOKENS: 2000,
    
    // 온도 설정 (0.7이 적당한 창의성)
    TEMPERATURE: 0.7
};

// 서버에서 프롬프트를 처리하므로 프론트엔드에서는 프롬프트를 보내지 않습니다

// API 호출 함수
async function analyzeText(text, topic) {
    try {
        // 프록시 엔드포인트로 요청 (서버가 OpenAI와 통신)
        const response = await fetch(API_CONFIG.OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        body: JSON.stringify({ 
            text, 
            topic
        })
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
        console.log('vocabulary_list 존재 여부:', 'vocabulary_list' in data);
        console.log('vocabulary_list 값:', data.vocabulary_list);
        console.log('vocabulary_score 존재 여부:', 'vocabulary_score' in data);
        console.log('vocabulary_score 값:', data.vocabulary_score);
        
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
