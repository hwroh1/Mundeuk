// 드래그 앤 드롭 기능을 위한 JavaScript

class BookShelfManager {
    constructor() {
        this.draggedElement = null;
        this.dragOverElement = null;
        this.bookColors = ['#32FF8A', '#FFF9F5', '#FFEA00', '#07B0F2'];
        this.init();
    }

    init() {
        this.setupRandomColors();
        this.setupDragAndDrop();
        this.setupBookInteractions();
        this.loadBookPositions();
        this.randomizeAchievementBookPosition();
        this.randomizeHintBookPosition();
    }

    setupRandomColors() {
        const books = document.querySelectorAll('.book');
        const fonts = ['font-school', 'font-ongleip', 'font-bookk'];
        // 제목이 없는 책들을 위한 패턴 목록
        const patterns = ['pattern-checkered', 'pattern-striped', 'pattern-dotted', 'pattern-line-top', 'pattern-line-bottom'];
        
        books.forEach(book => {
            // 책 덩어리 안의 책들은 제외
            if (book.closest('.book-stack')) {
                return;
            }
            const randomColor = this.bookColors[Math.floor(Math.random() * this.bookColors.length)];
            book.style.setProperty('--book-color', randomColor);
            
            // 제목이 없는 책에 랜덤 패턴 할당
            const bookTitle = book.querySelector('.book-title');
            if (!bookTitle) {
                // 이미 패턴이 없으면 랜덤 패턴 추가
                const hasPattern = Array.from(book.classList).some(cls => cls.startsWith('pattern-'));
                if (!hasPattern) {
                    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
                    book.classList.add(randomPattern);
                }
                
                // 제목이 없는 책들도 랜덤 높이 설정
                if (!book.classList.contains('hint-book') && !book.classList.contains('achievement-book')) {
                    const baseHeight = 170; // 기본 최소 높이
                    const randomOffset = Math.floor(Math.random() * 81) - 40; // -40 ~ +40
                    const randomHeight = baseHeight + randomOffset;
                    book.style.setProperty('min-height', randomHeight + 'px', 'important');
                }
            }
            
            // 랜덤 폰트 할당 및 제목 길이에 따라 책 높이 조정
            if (bookTitle) {
                const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
                bookTitle.className = 'book-title ' + randomFont;
                bookTitle.style.textAlign = 'center';
                bookTitle.style.whiteSpace = 'nowrap';
                bookTitle.style.margin = '0';
                bookTitle.style.padding = '0';
                
                // 제목이 있는 책에도 랜덤으로 위쪽 검은 줄 패턴 추가 (30% 확률)
                // 단, achievement-book와 hint-book은 제외
                if (!book.classList.contains('achievement-book') && !book.classList.contains('hint-book')) {
                    if (Math.random() < 0.3) {
                        book.classList.add('pattern-line-top');
                    }
                }
                
                // 제목 길이에 따라 책 높이 조정 (90도 회전 고려)
                const titleText = bookTitle.textContent || '';
                const titleLength = titleText.length;
                // 제목 길이에 따라 최소 높이 계산 (글자당 약 20px, 기본 최소 높이 170px)
                const baseHeight = Math.max(170, titleLength * 20);
                // 랜덤 요소 추가 (±20px 범위)
                const randomOffset = Math.floor(Math.random() * 41) - 20; // -20 ~ +20
                const calculatedMinHeight = baseHeight + randomOffset;
                book.style.setProperty('min-height', calculatedMinHeight + 'px', 'important');
            }
            
            // 책 크기 기본 설정 (hint-book, achievement-book, book-stack 내부 책 제외)
            if (!book.classList.contains('hint-book') && 
                !book.classList.contains('achievement-book') &&
                !book.closest('.book-stack')) {
                book.style.display = 'block';
                book.style.height = 'auto';
                
                // 책 두께 랜덤 설정 (30px ~ 70px 범위)
                if (!book.classList.contains('horizontal')) {
                    const randomWidth = 30 + Math.floor(Math.random() * 41); // 30 ~ 70px
                    book.style.width = `${randomWidth}px`;
                    book.style.minWidth = `${randomWidth}px`;
                } else {
                    book.style.width = 'auto';
                    book.style.minWidth = '40px';
                }
                
                book.style.maxWidth = '200px';
                book.style.padding = '20px 8px 10px 8px';
            }
            
            // vertical 책들만 랜덤 간격 적용 (book-stack 내부 책 제외)
            if (!book.classList.contains('horizontal') && !book.closest('.book-stack')) {
                // 좁은 간격이 주가 되고 넓은 간격이 가끔 나오도록 조정
                let randomMargin;
                if (Math.random() < 0.8) {
                    // 80% 확률로 좁은 간격 (0.2rem ~ 1.5rem)
                    randomMargin = 0.2 + Math.random() * 1.3;
                } else {
                    // 20% 확률로 넓은 간격 (4rem ~ 6rem)
                    randomMargin = 4 + Math.random() * 4;
                }
                book.style.marginRight = `${randomMargin}rem`;
            }
            
            // 기울기를 일부 책에만 적용 (30% 확률)
            if (Math.random() < 0.3) {
                const tiltAmount = (Math.random() - 0.5) * 3; // -1.5deg ~ +1.5deg
                book.style.setProperty('--book-rotation', `${tiltAmount}deg`);
            } else {
                book.style.setProperty('--book-rotation', '0deg');
            }
            
            // horizontal-stack 그룹의 책들은 CSS에서 처리하므로 JavaScript에서 건드리지 않음
            if (book.closest('.horizontal-stack')) {
                // CSS !important로 처리되므로 JavaScript에서 transform을 건드리지 않음
                return;
            }
        });
    }

    setupDragAndDrop() {
        const books = document.querySelectorAll('.book');
        
        books.forEach(book => {
            // 책 덩어리 안의 책들은 드래그 불가능
            if (book.closest('.book-stack')) {
                return;
            }
            
            book.draggable = true;
            
            // 드래그 시작
            book.addEventListener('dragstart', (e) => {
                this.draggedElement = book;
                book.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', book.outerHTML);
            });

            // 드래그 종료
            book.addEventListener('dragend', (e) => {
                book.classList.remove('dragging');
                this.draggedElement = null;
                
                // 드래그 오버 상태 제거
                document.querySelectorAll('.book').forEach(b => {
                    b.classList.remove('drag-over');
                });
            });

            // 드래그 오버
            book.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                
                if (book !== this.draggedElement) {
                    book.classList.add('drag-over');
                    this.dragOverElement = book;
                }
            });

            // 드래그 리브
            book.addEventListener('dragleave', (e) => {
                book.classList.remove('drag-over');
            });

            // 드롭
            book.addEventListener('drop', (e) => {
                e.preventDefault();
                book.classList.remove('drag-over');
                
                if (this.draggedElement && this.draggedElement !== book) {
                    this.swapBooks(this.draggedElement, book);
                }
            });
        });

        // 책장 컨테이너에 대한 드롭 처리
        const shelves = document.querySelectorAll('.books-container');
        shelves.forEach(shelf => {
            shelf.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                
                // 드롭 가능한 영역 표시
                shelf.classList.add('drop-zone-active');
            });

            shelf.addEventListener('dragleave', (e) => {
                // 마우스가 컨테이너를 완전히 벗어났을 때만 제거
                if (!shelf.contains(e.relatedTarget)) {
                    shelf.classList.remove('drop-zone-active');
                }
            });

            shelf.addEventListener('drop', (e) => {
                e.preventDefault();
                shelf.classList.remove('drop-zone-active');
                
                if (this.draggedElement) {
                    this.moveBookToShelf(this.draggedElement, shelf, e);
                }
            });
        });
    }

    swapBooks(book1, book2) {
        const parent1 = book1.parentNode;
        const parent2 = book2.parentNode;
        
        // 애니메이션 효과
        book1.classList.add('move-animation');
        book2.classList.add('move-animation');
        
        setTimeout(() => {
            // 위치 교환
            const nextSibling1 = book1.nextSibling;
            const nextSibling2 = book2.nextSibling;
            
            parent1.insertBefore(book2, nextSibling1);
            parent2.insertBefore(book1, nextSibling2);
            
            // 애니메이션 클래스 제거
            book1.classList.remove('move-animation');
            book2.classList.remove('move-animation');
            
            // 위치 저장
            this.saveBookPositions();
        }, 100);
    }

    moveBookToShelf(book, targetShelf, dropEvent) {
        const currentShelf = book.closest('.books-container');
        
        // 애니메이션 효과
        book.classList.add('move-animation');
        
        setTimeout(() => {
            // 책을 새 책장으로 이동
            if (currentShelf !== targetShelf) {
                targetShelf.appendChild(book);
            } else {
                // 같은 책장 내에서 위치 조정
                const rect = targetShelf.getBoundingClientRect();
                const mouseX = dropEvent.clientX - rect.left;
                
                // 마우스 위치에 가장 가까운 책 찾기
                const books = Array.from(targetShelf.children).filter(child => 
                    child.classList.contains('book') && child !== book
                );
                
                let insertBefore = null;
                for (let otherBook of books) {
                    const bookRect = otherBook.getBoundingClientRect();
                    const bookX = bookRect.left - rect.left + bookRect.width / 2;
                    
                    if (mouseX < bookX) {
                        insertBefore = otherBook;
                        break;
                    }
                }
                
                if (insertBefore) {
                    targetShelf.insertBefore(book, insertBefore);
                } else {
                    targetShelf.appendChild(book);
                }
            }
            
            // 애니메이션 클래스 제거
            book.classList.remove('move-animation');
            
            // 위치 저장
            this.saveBookPositions();
        }, 100);
    }

    setupBookInteractions() {
        const books = document.querySelectorAll('.book');
        
        books.forEach(book => {
            // 책 호버 효과
            book.addEventListener('mouseenter', () => {
                book.style.transform = 'translateY(-8px) scale(1.05)';
                book.style.zIndex = '10';
            });

            book.addEventListener('mouseleave', () => {
                if (!book.classList.contains('dragging')) {
                    book.style.transform = '';
                    book.style.zIndex = '';
                }
            });
        });
    }


    saveBookPositions() {
        const shelves = document.querySelectorAll('.books-container');
        const positions = {};
        
        shelves.forEach((shelf, shelfIndex) => {
            const books = Array.from(shelf.querySelectorAll('.book'));
            positions[`shelf${shelfIndex + 1}`] = books.map(book => ({
                id: book.dataset.book || 'unknown',
                html: book.outerHTML
            }));
        });

        localStorage.setItem('bookPositions', JSON.stringify(positions));
    }

    loadBookPositions() {
        const saved = localStorage.getItem('bookPositions');
        if (!saved) return;

        try {
            const positions = JSON.parse(saved);
            
            Object.keys(positions).forEach(shelfId => {
                const shelf = document.getElementById(shelfId);
                if (!shelf) {
                    console.warn(`책장을 찾을 수 없습니다: ${shelfId}`);
                    return;
                }

                const books = positions[shelfId];
                if (!Array.isArray(books)) return;
                
                books.forEach(bookData => {
                    if (!bookData || !bookData.id) return;
                    
                    const bookElement = shelf.querySelector(`[data-book="${bookData.id}"]`);
                    if (bookElement) {
                        // 책의 위치를 저장된 순서로 조정
                        bookElement.remove();
                        shelf.appendChild(bookElement);
                    }
                });
            });
        } catch (error) {
            console.error('책 위치 로드 실패:', error);
            // 오류 발생 시 저장된 데이터 삭제
            localStorage.removeItem('bookPositions');
        }
    }

    // 업적 북을 랜덤 위치에 배치
    randomizeAchievementBookPosition() {
        const shelves = document.querySelectorAll('.books-container');
        shelves.forEach(shelf => {
            const achievementBook = shelf.querySelector('.achievement-book');
            if (!achievementBook) return;
            
            const allBooks = Array.from(shelf.querySelectorAll('.book'));
            const otherBooks = allBooks.filter(book => 
                !book.classList.contains('achievement-book') && 
                !book.classList.contains('hint-book') &&
                !book.closest('.book-stack')
            );
            
            if (otherBooks.length === 0) return;
            
            // 왼쪽 부분에 가중치를 두어 랜덤 위치 선택 (왼쪽 30% 범위 내에서 선택)
            const maxIndex = Math.floor(otherBooks.length * 0.3);
            const randomIndex = Math.floor(Math.random() * (maxIndex + 1));
            const targetBook = otherBooks[randomIndex];
            
            // achievement-book을 랜덤 위치에 삽입
            achievementBook.remove();
            shelf.insertBefore(achievementBook, targetBook);
        });
    }

    // 힌트 북을 오른쪽 부분에서 랜덤 위치에 배치
    randomizeHintBookPosition() {
        const shelves = document.querySelectorAll('.books-container');
        shelves.forEach(shelf => {
            const hintBook = shelf.querySelector('.hint-book');
            if (!hintBook) return;
            
            const allBooks = Array.from(shelf.querySelectorAll('.book'));
            const otherBooks = allBooks.filter(book => 
                !book.classList.contains('achievement-book') && 
                !book.classList.contains('hint-book') &&
                !book.closest('.book-stack')
            );
            
            if (otherBooks.length === 0) return;
            
            // 오른쪽 부분에 가중치를 두어 랜덤 위치 선택 (오른쪽 30% 범위 내에서 선택)
            const startIndex = Math.floor(otherBooks.length * 0.7);
            const randomIndex = startIndex + Math.floor(Math.random() * (otherBooks.length - startIndex));
            const targetBook = otherBooks[randomIndex];
            
            // hint-book을 랜덤 위치에 삽입
            hintBook.remove();
            shelf.insertBefore(hintBook, targetBook.nextSibling || null);
        });
    }

    // 책 랜덤 배치 기능 (디버깅용)
    randomizeBooks() {
        const shelves = document.querySelectorAll('.books-container');
        
        shelves.forEach(shelf => {
            const books = Array.from(shelf.querySelectorAll('.book'));
            books.sort(() => Math.random() - 0.5);
            
            books.forEach(book => {
                shelf.appendChild(book);
            });
        });
        
        this.saveBookPositions();
    }

    // 책 위치 초기화
    resetBookPositions() {
        localStorage.removeItem('bookPositions');
        location.reload();
    }

    // 책 색상 재설정
    resetBookColors() {
        this.setupRandomColors();
    }
    
    // 책 폰트 재할당
    resetBookFonts() {
        const books = document.querySelectorAll('.book');
        const fonts = ['font-school', 'font-ongleip', 'font-bookk'];
        
        books.forEach(book => {
            const bookTitle = book.querySelector('.book-title');
            if (bookTitle) {
                const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
                bookTitle.className = 'book-title ' + randomFont;
                bookTitle.style.textAlign = 'center';
            }
        });
    }
    
    // 책 덩어리를 중간 위치에 삽입하는 함수
    insertBookStackInMiddle() {
        const booksContainer = document.getElementById('shelf1');
        const books = Array.from(booksContainer.children).filter(child => 
            !child.classList.contains('book-stack') && 
            !child.classList.contains('achievement-book') && 
            !child.classList.contains('hint-book')
        );
        
        if (books.length > 0) {
            const bookStack = document.querySelector('.book-stack');
            
            if (bookStack) {
                // 중간 위치에 삽입
                const middleIndex = Math.floor(books.length / 2);
                booksContainer.insertBefore(bookStack, books[middleIndex]);
            }
        }
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    const bookShelfManager = new BookShelfManager();
    
    // 책 덩어리를 중간 위치에 삽입
    bookShelfManager.insertBookStackInMiddle();
    
    // 전역 함수로 노출 (디버깅용)
    window.bookShelfManager = bookShelfManager;
    
    
    console.log('📚 책장 관리자가 초기화되었습니다!');
});

// 터치 디바이스 지원
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', (e) => {
        if (e.target.classList.contains('book')) {
            e.target.draggable = true;
        }
    });
}
