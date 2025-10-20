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
    }

    setupRandomColors() {
        const books = document.querySelectorAll('.book');
        const fonts = ['font-school', 'font-ongleip', 'font-bookk'];
        
        books.forEach(book => {
            const randomColor = this.bookColors[Math.floor(Math.random() * this.bookColors.length)];
            book.style.setProperty('--book-color', randomColor);
            
            // 랜덤 폰트 할당
            const bookTitle = book.querySelector('.book-title');
            if (bookTitle) {
                const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
                bookTitle.className = 'book-title ' + randomFont;
                bookTitle.style.position = 'relative';
                bookTitle.style.top = '0';
                bookTitle.style.left = '0';
                bookTitle.style.transform = 'none';
                bookTitle.style.textAlign = 'center';
                bookTitle.style.whiteSpace = 'nowrap';
                bookTitle.style.margin = '0';
                bookTitle.style.padding = '0';
            }
            
            // 책 크기를 제목에 맞게 자동 조정
            book.style.display = 'block';
            book.style.width = 'auto';
            book.style.height = 'auto';
            book.style.minWidth = '40px';
            book.style.minHeight = '120px';
            book.style.maxWidth = '200px';
            book.style.padding = '20px 8px 10px 8px';
            
            // 최소/최대 높이 범위에서 랜덤 높이 적용
            const minHeight = 120; // 최소 높이 (제목 공간 확보)
            const maxHeight = 200; // 최대 높이
            const randomHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
            book.style.setProperty('min-height', randomHeight + 'px', 'important');
            
            // vertical 책들만 랜덤 간격 적용
            if (!book.classList.contains('horizontal')) {
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
                bookTitle.style.display = 'flex';
                bookTitle.style.alignItems = 'center';
                bookTitle.style.justifyContent = 'center';
                bookTitle.style.textAlign = 'center';
                bookTitle.style.height = '100%';
                bookTitle.style.width = '100%';
            }
        });
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    const bookShelfManager = new BookShelfManager();
    
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
