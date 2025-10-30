// Book stacking functionality
class BookStack {
    constructor() {
        this.floatingBook = document.getElementById('floatingBook');
        this.stackedBooks = document.getElementById('stackedBooks');
        this.bookCount = 0;
        
        this.colors = ['#07B0F2', '#32FF8A', '#FFEA00', '#FFF9F5'];
        this.patterns = [
            'book-pattern-checkered',
            'book-pattern-houndstooth', 
            'book-pattern-line',
            'book-pattern-wavy',
            'book-pattern-dots',
            'book-pattern-lines'
        ];
        this.shapes = [
            'book-rectangle',
            'book-trapezoid',
            'book-parallelogram',
            'book-irregular-trapezoid',
            'book-irregular-quadrilateral',
        ];
        
        this.init();
    }
    
    init() {
        this.floatingBook.addEventListener('click', (e) => {
            // Add book to stack first
            this.addBook();
            
            // Show speech bubble after a short delay
            setTimeout(() => {
                this.showSpeechBubble();
            }, 300);
        });
        
        // Add some initial books for visual appeal
        this.addInitialBooks();
        
        // Set initial spine color
        this.updateFloatingBookSpineRandom();
        
        // Set initial bookmark colors and tilts
        this.updateBookmarksRandom();
        
        // Set initial pattern color
        this.updateFloatingBookPatternRandom();
    }
    
    addInitialBooks() {
        // Add 3 initial books to match the image
        for (let i = 0; i < 5; i++) {
            this.addBook(false);
        }
    }
    
    addBook(animate = true) {
        const book = document.createElement('div');
        book.className = 'stacked-book';
        
        // Use the pre-selected color from the spine
        const bookColor = this.nextBookColor || this.colors[Math.floor(Math.random() * this.colors.length)];
        const randomPattern = this.patterns[Math.floor(Math.random() * this.patterns.length)];
        const randomShape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
        const randomWidth = Math.random() * 700 + 300 ; // 200-300px
        const randomHeight = Math.random() * 50 + 30; // 30-50px
        
        // Apply random properties
        book.style.backgroundColor = bookColor;
        book.style.width = `${randomWidth}px`;
        book.style.height = `${randomHeight}px`;
        book.classList.add(randomShape);
        
        // Generate new color for the next book and update spine
        this.updateFloatingBookSpineRandom();
        
        // Add pattern overlay with random color
        const patternOverlay = document.createElement('div');
        patternOverlay.className = randomPattern;
        patternOverlay.style.position = 'absolute';
        patternOverlay.style.top = '10px';
        patternOverlay.style.left = '10px';
        patternOverlay.style.width = 'calc(100% - 20px)';
        patternOverlay.style.height = 'calc(100% - 20px)';
        patternOverlay.style.opacity = '0.5';
        patternOverlay.style.pointerEvents = 'none';
        
        // Apply random color to pattern
        const randomPatternColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        patternOverlay.style.backgroundColor = randomPatternColor;
        
        book.appendChild(patternOverlay);
        
        // Add some random decorative elements
        if (Math.random() > 0.5) {
            const decoration = document.createElement('div');
            decoration.style.position = 'absolute';
            decoration.style.right = '10px';
            decoration.style.top = '50%';
            decoration.style.transform = 'translateY(-50%)';
            decoration.style.width = '20px';
            decoration.style.height = '20px';
            decoration.style.backgroundColor = this.colors[Math.floor(Math.random() * this.colors.length)];
            decoration.style.borderRadius = '2px';
            book.appendChild(decoration);
        }
        

        
        // Add to stack from top to bottom
        this.stackedBooks.insertBefore(book, this.stackedBooks.firstChild);
        this.bookCount++;
        
        // Add bigcircle.png with 1 in 30 probability as separate element
        if (Math.random() < 1/30) {
            const bigCircle = document.createElement('div');
            bigCircle.className = 'stacked-book big-circle';
            bigCircle.style.width = '350px';
            bigCircle.style.height = '350px';
            bigCircle.style.display = 'flex';
            bigCircle.style.alignItems = 'center';
            bigCircle.style.justifyContent = 'center';
            bigCircle.style.marginBottom = '5px';
            
            const bigCircleImg = document.createElement('img');
            bigCircleImg.src = 'bigcircle.png';
            bigCircleImg.style.width = '100%';
            bigCircleImg.style.height = '100%';
            bigCircleImg.style.objectFit = 'contain';
            
            bigCircle.appendChild(bigCircleImg);
            this.stackedBooks.insertBefore(bigCircle, this.stackedBooks.firstChild);
            this.bookCount++;
        }
        
        // Animate if requested
        if (animate) {
            book.style.animation = 'none';
            book.offsetHeight; // Trigger reflow
            book.style.animation = 'stackBook 0.5s ease-out';
        }
        
        // Add click effect to floating book and change rotation
        const newRotation = (Math.random() - 0.5) * 20; // Random rotation between -10 and +10 degrees
        this.floatingBook.style.setProperty('transform', `rotate(${newRotation}deg) scale(0.95)`, 'important');
        setTimeout(() => {
            this.floatingBook.style.setProperty('transform', `rotate(${newRotation}deg) scale(1)`, 'important');
        }, 150);
        
        // Update bookmark colors and tilts
        this.updateBookmarksRandom();
        
        // Update floating book pattern color
        this.updateFloatingBookPatternRandom();
        
        // Limit the number of books to prevent performance issues
        if (this.bookCount > 20) {
            const lastBook = this.stackedBooks.lastChild;
            if (lastBook) {
                lastBook.style.animation = 'stackBook 0.3s ease-in reverse';
                setTimeout(() => {
                    if (lastBook.parentNode) {
                        lastBook.parentNode.removeChild(lastBook);
                    }
                }, 300);
            }
        }
    }
    

    
    updateFloatingBookSpine(color) {
        const bookSpine = this.floatingBook.querySelector('.book-spine');
        if (bookSpine) {
            bookSpine.style.backgroundColor = color;
            bookSpine.style.transition = 'background-color 0.3s ease';
        }
    }
    
    updateFloatingBookSpineRandom() {
        const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.updateFloatingBookSpine(randomColor);
        // Store the color for the next book
        this.nextBookColor = randomColor;
    }
    
    updateBookmarksRandom() {
        const bookmarks = this.floatingBook.querySelectorAll('.bookmark');
        bookmarks.forEach(bookmark => {
            // Random color
            const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
            bookmark.style.backgroundColor = randomColor;
            
            // Random tilt
            const randomTilt = (Math.random() - 0.5) * 30; // Random tilt between -15 and +15 degrees
            bookmark.style.transform = `rotate(${randomTilt}deg)`;
        });
    }
    
    updateFloatingBookPatternRandom() {
        const pattern = this.floatingBook.querySelector('.book-pattern');
        if (pattern) {
            // Exclude white color (#FFF9F5) from floating book pattern
            const nonWhiteColors = this.colors.filter(color => color !== '#FFF9F5');
            const randomColor = nonWhiteColors[Math.floor(Math.random() * nonWhiteColors.length)];
            pattern.style.backgroundColor = randomColor;
        }
    }
    
    showSpeechBubble() {
        // Remove existing speech bubble if any
        const existingBubble = document.getElementById('speechBubble');
        if (existingBubble) {
            existingBubble.remove();
        }
        
        // Clear any existing timeouts to prevent conflicts
        if (this.speechBubbleTimeout) {
            clearTimeout(this.speechBubbleTimeout);
        }
        
        // Create speech bubble
        const speechBubble = document.createElement('div');
        speechBubble.id = 'speechBubble';
        speechBubble.className = 'speech-bubble';
        
        speechBubble.innerHTML = `
            <div class="speech-content">
                <div class="speech-message">학습을 시작하시겠습니까?</div>
                <div class="speech-buttons">
                    <button class="speech-btn writing-btn" onclick="goToWritingPage()">
                        <span class="btn-icon">✍️</span>
                        <span class="btn-text">글쓰기</span>
                    </button>
                    <button class="speech-btn reading-btn" onclick="goToReading()">
                        <span class="btn-icon">📖</span>
                        <span class="btn-text">읽기</span>
                    </button>
                    <button class="speech-btn vocabulary-btn" onclick="goToVocabulary()">
                        <span class="btn-icon">📚</span>
                        <span class="btn-text">어휘</span>
                    </button>
                    <button class="speech-btn grammar-btn" onclick="goToGrammar()">
                        <span class="btn-icon">📝</span>
                        <span class="btn-text">문법</span>
                    </button>
                </div>
                <button class="close-bubble" onclick="closeSpeechBubble()">×</button>
            </div>
        `;
        
        // Position the speech bubble to the right and below the floating book
        const rect = this.floatingBook.getBoundingClientRect();
        speechBubble.style.left = (rect.right + 30) + 'px';
        speechBubble.style.top = (rect.bottom - 100) + 'px';
        
        document.body.appendChild(speechBubble);
        
        // Auto-hide after 5 seconds
        this.speechBubbleTimeout = setTimeout(() => {
            if (speechBubble.parentNode) {
                speechBubble.style.opacity = '0';
                setTimeout(() => {
                    if (speechBubble.parentNode) {
                        speechBubble.parentNode.removeChild(speechBubble);
                    }
                }, 300);
            }
        }, 5000);
    }

}

// Function to navigate to writing page
function goToWritingPage() {
    window.location.href = 'writing.html';
}

// Function to close speech bubble
function closeSpeechBubble() {
    const speechBubble = document.getElementById('speechBubble');
    if (speechBubble) {
        speechBubble.style.opacity = '0';
        setTimeout(() => {
            if (speechBubble.parentNode) {
                speechBubble.parentNode.removeChild(speechBubble);
            }
        }, 300);
    }
    
    // Clear any pending timeout
    if (window.bookStack && window.bookStack.speechBubbleTimeout) {
        clearTimeout(window.bookStack.speechBubbleTimeout);
        window.bookStack.speechBubbleTimeout = null;
    }
}

// Placeholder functions for other learning modes
function goToReading() {
    alert('읽기 학습 기능은 준비 중입니다!');
    closeSpeechBubble();
}

function goToVocabulary() {
    alert('어휘 학습 기능은 준비 중입니다!');
    closeSpeechBubble();
}

function goToGrammar() {
    alert('문법 학습 기능은 준비 중입니다!');
    closeSpeechBubble();
}

// Initialize the book stack when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.bookStack = new BookStack();
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-2px)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
        });
    });
    

    
    // Add cursor following rotation to the floating circle
    const floatingCircle = document.querySelector('.floating-circle');
    if (floatingCircle) {
        let circleTipHideTimeout = null;
        const ensureCircleTip = () => {
            let tip = document.getElementById('circleTip');
            if (!tip) {
                tip = document.createElement('div');
                tip.id = 'circleTip';
                tip.className = 'circle-tip';
                tip.textContent = '책을 클릭해보세요!';
                document.body.appendChild(tip);
            }
            return tip;
        };

        // 고정 툴팁: 초기 1회 위치 계산 후 고정
        const positionCircleTip = () => {
            const tip = ensureCircleTip();
            const rect = floatingCircle.getBoundingClientRect();
            const tipWidth = tip.offsetWidth || 160;
            const x = rect.left + rect.width / 2 - tipWidth / 2;
            const y = rect.top - 56; // 더 위로 올림
            tip.style.left = Math.max(8, x) + 'px';
            tip.style.top = Math.max(8, y - tip.offsetHeight) + 'px';
            // 초기에는 항상 보이지 않도록, 위치만 맞춤
        };

        // 초기 배치 및 리사이즈/스크롤 시 재배치
        positionCircleTip();
        window.addEventListener('resize', positionCircleTip);
        window.addEventListener('scroll', positionCircleTip, { passive: true });

        document.addEventListener('mousemove', (e) => {
            const circle = floatingCircle.getBoundingClientRect();
            const circleCenterX = circle.left + circle.width / 2;
            const circleCenterY = circle.top + circle.height / 2;
            
            const deltaX = e.clientX - circleCenterX;
            const deltaY = e.clientY - circleCenterY;
            
            let angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
            
            // Normalize angle to ensure it can turn in both directions
            if (angle > 90) {
                angle = angle - 180;
            } else if (angle < -90) {
                angle = angle + 180;
            }
            
            // Limit rotation to a natural range for a face (-60 to +60 degrees)
            angle = Math.max(-60, Math.min(60, angle));
            
            floatingCircle.style.transform = `rotate(${angle}deg)`;

            // 마우스 움직임 시 3초간 표시
            const tip = ensureCircleTip();
            tip.classList.add('show');
            if (circleTipHideTimeout) clearTimeout(circleTipHideTimeout);
            circleTipHideTimeout = setTimeout(() => {
                tip.classList.remove('show');
            }, 3000);
        });
    }
    
    // Add some particle effects when clicking the floating book
    const floatingBook = document.getElementById('floatingBook');
    floatingBook.addEventListener('click', (e) => {
        // Create particle effect
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.backgroundColor = '#4CAF50';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            
            // Random position around the book
            const rect = floatingBook.getBoundingClientRect();
            const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 100;
            const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 100;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            document.body.appendChild(particle);
            
            // Animate particle
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 50 + 20;
            const targetX = x + Math.cos(angle) * distance;
            const targetY = y + Math.sin(angle) * distance;
            
            particle.style.transition = 'all 0.8s ease-out';
            particle.style.left = targetX + 'px';
            particle.style.top = targetY + 'px';
            particle.style.opacity = '0';
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 800);
        }
    });
});
