// Writing topics database
const writingTopics = [
    {
        title: "진정성의 의미",
        description: "현대 사회에서 진정성이란 무엇인지, 그리고 우리가 생각하는 모습에서 벗어나 진정한 자신을 받아들이는 것의 의미에 대해 생각해보세요.",
        quote: "진정성은 우리가 되어야 한다고 생각하는 사람에서 벗어나<br>진정한 우리 자신을 받아들이는 일상적인 실천이다.",
        author: "— 브레네 브라운"
    },
    {
        title: "작은 친절의 힘",
        description: "작은 친절한 행동들이 우리 지역사회에 어떤 의미 있는 변화를 만들어낼 수 있는지에 대해 생각해보세요.",
        quote: "친절은 귀머거리도 들을 수 있고<br>맹인도 볼 수 있는 언어다.",
        author: "— 마크 트웨인"
    },
    {
        title: "창의성과 혁신",
        description: "창의성이 오늘날의 글로벌 도전들을 해결하는 데 어떤 역할을 하는지에 대해 생각해보세요.",
        quote: "혁신은 리더와 추종자를<br>구분하는 기준이다.",
        author: "— 스티브 잡스"
    },
    {
        title: "독서의 영향",
        description: "독서가 당신의 세계에 대한 이해를 어떻게 형성했는지에 대해 생각해보세요.",
        quote: "당신이 읽을수록 더 많은 것을 알게 될 것이고,<br>더 많이 배울수록 더 많은 곳에 갈 수 있을 것이다.",
        author: "— 닥터 수스"
    },
    {
        title: "관점의 변화",
        description: "당신의 관점을 바꾸는 것이 이해의 돌파구로 이어진 경험에 대해 설명해보세요.",
        quote: "우리는 문제를 만드는 데 사용한 것과 같은 사고방식으로<br>문제를 해결할 수는 없다.",
        author: "— 알베르트 아인슈타인"
    },
    {
        title: "공동체의 힘",
        description: "강한 공동체를 만드는 요소는 무엇이며, 개인이 집단의 웰빙에 어떻게 기여할 수 있는지에 대해 생각해보세요.",
        quote: "혼자서는 할 수 있는 것이 적지만,<br>함께하면 할 수 있는 것이 많다.",
        author: "— 헬렌 켈러"
    },
    {
        title: "꿈과 목표",
        description: "당신을 동기부여하는 꿈이나 목표를 설명하고, 그것이 왜 당신에게 중요한지 말해보세요.",
        quote: "미래는 자신의 꿈의 아름다움을<br>믿는 사람들의 것이다.",
        author: "— 엘리너 루스벨트"
    },
    {
        title: "시간의 가치",
        description: "당신은 시간을 어떻게 우선순위를 정하며, 어떤 활동들을 가장 가치 있다고 생각하는지에 대해 생각해보세요.",
        quote: "시간은 사람이 쓸 수 있는<br>가장 소중한 것이다.",
        author: "— 테오프라스토스"
    },
    {
        title: "기술과 소통",
        description: "기술이 우리가 다른 사람들과 소통하고 연결되는 방식을 어떻게 변화시켰는지에 대해 생각해보세요.",
        quote: "기술은 유용한 하인이지만<br>위험한 주인이다.",
        author: "— 크리스티안 루스 랑게"
    },
    {
        title: "환경 보호",
        description: "환경을 보호하고 보존하는 데 개인이 해야 할 역할은 무엇인지에 대해 생각해보세요.",
        quote: "땅은 우리에게 속한 것이 아니라,<br>우리가 땅에 속한 것이다.",
        author: "— 치프 시애틀"
    },
    {
        title: "교육의 힘",
        description: "교육이 당신의 세계관을 어떻게 형성했으며, 무엇을 성취하고 싶은지에 대해 생각해보세요.",
        quote: "교육은 세상을 바꾸는 데 사용할 수 있는<br>가장 강력한 무기다.",
        author: "— 넬슨 만델라"
    },
    {
        title: "디지털 시대의 익명성",
        description: "인터넷과 소셜미디어가 발달하면서 익명으로 의견을 표현할 수 있는 기회가 늘어났습니다. 익명성의 장단점과 우리 사회에 미치는 영향에 대해 생각해보세요.",
        quote: "디지털 시대의 익명성은 자유를 주지만,<br>동시에 책임감을 요구한다.",
        author: "— 현대 디지털 철학"
    }
];

// DOM elements - will be initialized after DOM is loaded
let currentTopicElement;
let topicDescriptionElement;
let inspirationalQuoteElement;
let quoteAuthorElement;
let writingTextarea;
let currentCountElement;
let progressFillElement;
let successModal;

// Current topic index
let currentTopicIndex = 0;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DOM elements
    currentTopicElement = document.getElementById('currentTopic');
    topicDescriptionElement = document.querySelector('.topic-description');
    inspirationalQuoteElement = document.getElementById('inspirationalQuote');
    quoteAuthorElement = document.getElementById('quoteAuthor');
    writingTextarea = document.getElementById('writingTextarea');
    currentCountElement = document.getElementById('currentCount');
    progressFillElement = document.getElementById('progressFill');
    successModal = document.getElementById('successModal');
    
    console.log('DOM elements initialized:', {
        currentTopic: !!currentTopicElement,
        topicDescription: !!topicDescriptionElement,
        inspirationalQuote: !!inspirationalQuoteElement,
        quoteAuthor: !!quoteAuthorElement,
        writingTextarea: !!writingTextarea
    });
    
    // Load random topic on page load
    generateNewTopic();
    setupEventListeners();
    // Don't load saved writing - start fresh each time
    // loadSavedWriting();
});

// Set up event listeners
function setupEventListeners() {
    // Textarea input event
    writingTextarea.addEventListener('input', updateWordCount);
    
    // Auto-save functionality
    writingTextarea.addEventListener('input', debounce(autoSave, 1000));
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Update word count and progress
function updateWordCount() {
    const text = writingTextarea.value;
    const count = text.length;
    
    // Update counter
    currentCountElement.textContent = count;
    
    // Update progress bar
    const progress = Math.min((count / 300) * 100, 100);
    progressFillElement.style.width = progress + '%';
    
    // Change color based on progress
    if (count >= 300) {
        progressFillElement.style.background = 'linear-gradient(90deg, #32FF8A, #00D4AA)';
        currentCountElement.style.color = '#32FF8A';
    } else if (count >= 150) {
        progressFillElement.style.background = 'linear-gradient(90deg, #FFD700, #FFA500)';
        currentCountElement.style.color = '#FFD700';
    } else {
        progressFillElement.style.background = 'linear-gradient(90deg, #FF6B6B, #FF8E8E)';
        currentCountElement.style.color = '#FF6B6B';
    }
}

// Generate new topic
function generateNewTopic() {
    // Get random topic different from current
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * writingTopics.length);
    } while (newIndex === currentTopicIndex && writingTopics.length > 1);
    
    currentTopicIndex = newIndex;
    loadTopic(currentTopicIndex);
    
    // Clear textarea
    writingTextarea.value = '';
    updateWordCount();
    
    // Show animation
    animateTopicChange();
}

// Load topic
function loadTopic(index) {
    const topic = writingTopics[index];
    console.log('Loading topic:', topic.title);
    console.log('Quote element found:', !!inspirationalQuoteElement);
    console.log('Author element found:', !!quoteAuthorElement);
    
    currentTopicElement.textContent = topic.title;
    topicDescriptionElement.textContent = topic.description;
    
    // Update inspirational quote and author
    if (inspirationalQuoteElement && topic.quote) {
        console.log('Setting quote:', topic.quote);
        inspirationalQuoteElement.innerHTML = topic.quote;
    } else {
        console.log('Quote element not found or no quote data');
    }
    
    if (quoteAuthorElement && topic.author) {
        console.log('Setting author:', topic.author);
        quoteAuthorElement.textContent = topic.author;
    } else {
        console.log('Author element not found or no author data');
    }
}

// Animate topic change
function animateTopicChange() {
    const topicCard = document.querySelector('.topic-card');
    topicCard.style.transform = 'scale(0.95)';
    topicCard.style.opacity = '0.7';
    
    setTimeout(() => {
        topicCard.style.transform = 'scale(1)';
        topicCard.style.opacity = '1';
    }, 200);
}

// Auto-save functionality
function autoSave() {
    const text = writingTextarea.value;
    const topic = writingTopics[currentTopicIndex].title;
    
    if (text.trim()) {
        localStorage.setItem('writing_autosave', JSON.stringify({
            text: text,
            topic: topic,
            timestamp: new Date().toISOString()
        }));
    }
}

// Load saved writing
function loadSavedWriting() {
    const saved = localStorage.getItem('writing_autosave');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            const savedDate = new Date(data.timestamp);
            const now = new Date();
            const diffHours = (now - savedDate) / (1000 * 60 * 60);
            
            // Only load if saved within last 24 hours
            if (diffHours < 24) {
                writingTextarea.value = data.text;
                updateWordCount();
                
                // Show restore notification
                showNotification('이전에 작성하던 내용을 불러왔습니다.', 'info');
            }
        } catch (e) {
            console.error('Error loading saved writing:', e);
        }
    }
}

// Save writing
function saveWriting() {
    const text = writingTextarea.value;
    const topic = writingTopics[currentTopicIndex].title;
    
    if (!text.trim()) {
        showNotification('저장할 내용이 없습니다.', 'warning');
        return;
    }
    
    // Save to localStorage
    const writingData = {
        text: text,
        topic: topic,
        timestamp: new Date().toISOString(),
        wordCount: text.length
    };
    
    // Get existing writings
    let writings = JSON.parse(localStorage.getItem('saved_writings') || '[]');
    
    // Add new writing
    writings.unshift(writingData);
    
    // Keep only last 10 writings
    if (writings.length > 10) {
        writings = writings.slice(0, 10);
    }
    
    localStorage.setItem('saved_writings', JSON.stringify(writings));
    localStorage.removeItem('writing_autosave'); // Clear auto-save
    
    showNotification('글이 저장되었습니다!', 'success');
    updateHistoryList();
}

// Submit writing
function submitWriting() {
    const text = writingTextarea.value;
    const topic = writingTopics[currentTopicIndex].title;
    
    if (!text.trim()) {
        showNotification('제출할 내용이 없습니다.', 'warning');
        return;
    }
    
    if (text.length < 50) {
        showNotification('최소 50자 이상 작성해주세요.', 'warning');
        return;
    }
    
    // Save to submitted writings
    const writingData = {
        text: text,
        topic: topic,
        timestamp: new Date().toISOString(),
        wordCount: text.length,
        submitted: true
    };
    
    let submittedWritings = JSON.parse(localStorage.getItem('submitted_writings') || '[]');
    submittedWritings.unshift(writingData);
    
    // Keep only last 20 submitted writings
    if (submittedWritings.length > 20) {
        submittedWritings = submittedWritings.slice(0, 20);
    }
    
    localStorage.setItem('submitted_writings', JSON.stringify(submittedWritings));
    localStorage.removeItem('writing_autosave'); // Clear auto-save
    
    // Clear textarea
    writingTextarea.value = '';
    updateWordCount();
    
    // Show success modal
    showSuccessModal();
}

// Show success modal
function showSuccessModal() {
    successModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    successModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Go to analysis page
function goToAnalysis() {
    const text = writingTextarea.value;
    
    // Get current topic from the page element
    const currentTopicElement = document.getElementById('currentTopic');
    const topic = currentTopicElement ? currentTopicElement.textContent : writingTopics[currentTopicIndex].title;
    
    console.log('goToAnalysis called');
    console.log('Text:', text);
    console.log('Topic:', topic);
    
    if (text.trim()) {
        // Save to localStorage as backup method
        localStorage.setItem('analysis_text', text);
        localStorage.setItem('analysis_topic', topic);
        console.log('Saved to localStorage:', { text, topic });
        
        // Try URL parameters method
        const encodedText = encodeURIComponent(text);
        const encodedTopic = encodeURIComponent(topic);
        
        console.log('Encoded text:', encodedText);
        console.log('Encoded topic:', encodedTopic);
        
        const url = `analysis.html?text=${encodedText}&topic=${encodedTopic}`;
        console.log('Navigating to:', url);
        
        // Navigate to analysis page with the written text
        window.location.href = url;
    } else {
        console.log('No text found, navigating to analysis page without parameters');
        window.location.href = 'analysis.html';
    }
}

// Update history list
function updateHistoryList() {
    const historyList = document.getElementById('historyList');
    const submittedWritings = JSON.parse(localStorage.getItem('submitted_writings') || '[]');
    
    if (submittedWritings.length === 0) {
        historyList.innerHTML = '<div class="no-history">아직 제출한 글이 없습니다.</div>';
        return;
    }
    
    historyList.innerHTML = submittedWritings.slice(0, 5).map(writing => `
        <div class="history-item">
            <div class="history-topic">${writing.topic}</div>
            <div class="history-date">${formatDate(writing.timestamp)}</div>
            <div class="history-count">${writing.wordCount}자</div>
        </div>
    `).join('');
}

// Format date
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#32FF8A' : type === 'warning' ? '#FFD700' : '#007AFF'};
        color: ${type === 'warning' ? '#1a1a1a' : 'white'};
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1001;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveWriting();
    }
    
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        submitWriting();
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        closeModal();
    }
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize history list on page load
document.addEventListener('DOMContentLoaded', function() {
    updateHistoryList();
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === successModal) {
        closeModal();
    }
});
