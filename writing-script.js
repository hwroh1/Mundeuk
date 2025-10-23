// Writing topics database
const writingTopics = [
    {
        title: "디지털 시대의 익명성",
        description: "인터넷과 소셜미디어가 발달하면서 익명으로 의견을 표현할 수 있는 기회가 늘어났습니다. 익명성의 장단점과 우리 사회에 미치는 영향에 대해 생각해보세요."
    },
    {
        title: "인공지능과 인간의 관계",
        description: "AI 기술이 발전하면서 인간의 일자리와 삶의 방식이 변화하고 있습니다. 인공지능과 인간이 어떻게 공존해야 할지에 대한 생각을 말해보세요."
    },
    {
        title: "환경보호의 중요성",
        description: "기후변화와 환경오염이 심각한 문제로 대두되고 있습니다. 개인과 사회가 환경보호를 위해 할 수 있는 일들에 대해 생각해보세요."
    },
    {
        title: "소셜미디어의 영향",
        description: "소셜미디어는 우리의 일상생활과 인간관계에 큰 변화를 가져왔습니다. 소셜미디어의 긍정적, 부정적 영향에 대해 생각해보세요."
    },
    {
        title: "교육의 미래",
        description: "온라인 교육과 AI 기술이 교육 분야에 혁신을 가져오고 있습니다. 미래의 교육이 어떻게 변화할지에 대한 생각을 말해보세요."
    },
    {
        title: "도시와 농촌의 균형",
        description: "도시 집중화 현상이 계속되면서 농촌 지역의 소멸이 우려되고 있습니다. 도시와 농촌의 균형적 발전 방안에 대해 생각해보세요."
    },
    {
        title: "다양성과 포용성",
        description: "현대 사회는 다양한 배경을 가진 사람들로 구성되어 있습니다. 다양성을 인정하고 포용하는 사회를 만들기 위한 방안에 대해 생각해보세요."
    },
    {
        title: "건강한 삶의 방식",
        description: "현대인의 건강 문제가 사회적 이슈로 떠오르고 있습니다. 건강한 삶을 위한 개인과 사회의 노력에 대해 생각해보세요."
    },
    {
        title: "창의성과 혁신",
        description: "창의적 사고와 혁신이 미래 사회의 핵심 역량이 되고 있습니다. 창의성을 기르고 혁신을 이끌어내는 방법에 대해 생각해보세요."
    },
    {
        title: "공동체 의식",
        description: "개인주의가 확산되면서 공동체 의식이 약화되고 있습니다. 건강한 공동체를 만들기 위한 개인의 역할에 대해 생각해보세요."
    }
];

// DOM elements
const currentTopicElement = document.getElementById('currentTopic');
const topicDescriptionElement = document.querySelector('.topic-description');
const writingTextarea = document.getElementById('writingTextarea');
const currentCountElement = document.getElementById('currentCount');
const progressFillElement = document.getElementById('progressFill');
const successModal = document.getElementById('successModal');

// Current topic index
let currentTopicIndex = 0;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
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
    currentTopicElement.textContent = topic.title;
    topicDescriptionElement.textContent = topic.description;
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
