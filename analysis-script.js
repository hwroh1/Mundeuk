// Immediate test
console.log('Analysis script loaded!');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting analysis page initialization');
    
    // Load written text from URL parameters
    loadWrittenText();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize Chart.js percentile chart
    initializePercentileChart();
    
    // Auto-run GPT analysis if text is available (429 오류로 인해 일시 중단)
    // setTimeout(() => {
    //     const urlParams = new URLSearchParams(window.location.search);
    //     const text = urlParams.get('text');
    //     const topic = urlParams.get('topic');
    //     
    //     if (text && topic && window.analyzeWithGPT) {
    //         console.log('Auto-running GPT analysis...');
    //         window.analyzeWithGPT();
    //     }
    // }, 1000); // 1초 후 자동 실행
    
    // Test function to manually trigger loadWrittenText
    window.testLoadWrittenText = function() {
        console.log('Manual test triggered');
        loadWrittenText();
    };
});

// Also try immediate execution
console.log('Script execution started');
console.log('Current URL:', window.location.href);
console.log('Search params:', window.location.search);

// Load written text from URL parameters and display in title-description
function loadWrittenText() {
    console.log('loadWrittenText function called');
    console.log('Current URL:', window.location.href);
    console.log('Search params:', window.location.search);
    
    const urlParams = new URLSearchParams(window.location.search);
    const text = urlParams.get('text');
    const topic = urlParams.get('topic');
    
    console.log('Text param:', text);
    console.log('Topic param:', topic);
    
    if (text && topic) {
        console.log('Both text and topic found, updating title description');
        const titleDescription = document.querySelector('.title-description');
        console.log('Title description element:', titleDescription);
        
        if (titleDescription) {
            // Decode the text
            const decodedText = decodeURIComponent(text);
            const decodedTopic = decodeURIComponent(topic);
            
            console.log('Decoded text:', decodedText);
            console.log('Decoded topic:', decodedTopic);
            
            // Update the title description with the written text
            titleDescription.innerHTML = `
                <div class="written-topic">
                    <strong>주제:</strong> ${decodedTopic}
                </div>
                <div class="written-text">
                    <strong>작성한 글:</strong><br>
                    ${decodedText}
                </div>
            `;
            
            console.log('Title description updated successfully');
        } else {
            console.log('Title description element not found');
        }
        
        // Update word count with actual written text length
        const wordCountElement = document.querySelector('.word-count');
        if (wordCountElement) {
            const decodedText = decodeURIComponent(text);
            wordCountElement.textContent = `${decodedText.length}/300`;
            console.log('Word count updated to:', decodedText.length);
        }
    } else {
        console.log('Text or topic parameter missing');
        console.log('Text exists:', !!text);
        console.log('Topic exists:', !!topic);
    }
}

// Initialize Chart.js Percentile Chart
function initializePercentileChart() {
    const ctx = document.getElementById('percentileChart');
    if (!ctx) return;
    
    // Generate normal distribution data
    const generateNormalDistribution = (mean, stdDev, points) => {
        const data = [];
        const labels = [];
        for (let i = 0; i <= points; i++) {
            const x = (i / points) * 100;
            const y = Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
            data.push(y);
            labels.push(x);
        }
        return { data, labels };
    };

    const distribution = generateNormalDistribution(50, 15, 100);
    
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: distribution.labels,
            datasets: [{
                label: 'Distribution',
                data: distribution.data,
                borderColor: 'transparent',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 2
            }, {
                label: 'Score Area',
                data: Array(101).fill(null), // Start with all null values
                borderColor: 'transparent',
                backgroundColor: (() => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const gradient = ctx.createLinearGradient(0, 0, 400, 0); // Horizontal gradient
                    gradient.addColorStop(0, '#FFEA00'); // Left - more opaque
                    gradient.addColorStop(0.35, '#FFF9F5');
                    gradient.addColorStop(0.7, '#07B0F2'); // Middle
                    gradient.addColorStop(1, '#32FF8A'); // Right - more transparent
                    return gradient;
                })(),
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 0,
                showLine: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            },
            elements: {
                point: {
                    hoverBackgroundColor: '#dc2626',
                    radius: 8,
                    hoverRadius: 12,
                    borderWidth: 3,
                    backgroundColor: '#dc2626',
                    borderColor: '#dc2626'
                }
            }
        }
    });

    // Animate the red dot along the curve after chart is loaded
    setTimeout(() => {
        animateRedDotAlongCurve(chart, 60);
    }, 300);
}

// Function to animate red dot along the curve
function animateRedDotAlongCurve(chart, targetPercent) {
    const areaDataset = chart.data.datasets[1]; // Score Area
    const redDot = document.getElementById('animatedRedDot');
    const mean = 50;
    const stdDev = 15;
    
    // Start from 0% and animate to target
    let currentPercent = 0;
    const animationDuration = 2000; // 2 seconds
    const steps = 100; // 100 steps for smooth animation
    const stepDuration = animationDuration / steps;
    
    const animate = () => {
        if (currentPercent <= targetPercent) {
            // Create area data - fill up to current position
            const areaData = [];
            for (let i = 0; i <= Math.floor(currentPercent); i++) {
                const yValue = Math.exp(-0.5 * Math.pow((i - mean) / stdDev, 2));
                areaData.push(yValue);
            }
            // Fill the rest with null
            for (let i = Math.floor(currentPercent) + 1; i <= 100; i++) {
                areaData.push(null);
            }
            areaDataset.data = areaData;
            
            // Position the HTML red dot
            const chartArea = chart.chartArea;
            const canvas = chart.canvas;
            
            // Calculate position
            const xPosition = (currentPercent / 100) * (chartArea.right - chartArea.left) + chartArea.left;
            const yValue = Math.exp(-0.5 * Math.pow((currentPercent - mean) / stdDev, 2));
            const yPosition = chartArea.bottom - (yValue * (chartArea.bottom - chartArea.top));
            
            // Convert to percentage relative to container
            const relativeX = ((xPosition - chartArea.left) / (chartArea.right - chartArea.left)) * 100;
            const relativeY = ((yPosition - chartArea.top) / (chartArea.bottom - chartArea.top)) * 100;
            
            redDot.style.left = `${relativeX}%`;
            redDot.style.top = `${relativeY}%`;
            redDot.style.opacity = '1';
            
            if (currentPercent >= targetPercent) {
                // Final position - make dot larger
                redDot.style.width = '16px';
                redDot.style.height = '16px';
            } else {
                // Moving - normal size
                redDot.style.width = '12px';
                redDot.style.height = '12px';
            }
            
            chart.update('none'); // Update without animation
            
            currentPercent += targetPercent / steps;
            setTimeout(animate, stepDuration);
        }
    };
    
    animate();
}

// Function to update score and animate red dot (for dynamic score changes)
window.updateScore = function(newScorePercent) {
    // This function can be called to update the score dynamically
    // For example: updateScore(75) for 75th percentile
    
    const chart = Chart.getChart('percentileChart');
    if (chart) {
        // Update the percentile text
        const percentileText = document.querySelector('.percentile-score');
        if (percentileText) {
            percentileText.textContent = `상위 ${100 - newScorePercent}%`;
        }
        
        // Reset both area and point to start from beginning
        const areaDataset = chart.data.datasets[1];
        const pointDataset = chart.data.datasets[2];
        
        // Clear both datasets
        areaDataset.data = Array(101).fill(null);
        pointDataset.data = Array(101).fill(null);
        pointDataset.pointRadius = 0;
        
        chart.update('none');
        
        // Animate to new position with synchronized area and point
        animateRedDotAlongCurve(chart, newScorePercent);
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Home button functionality
    document.querySelector('.home-button').addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add hover effects for interactive elements
    document.querySelectorAll('.nav-btn, .home-button').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}



// Add smooth scroll behavior for the entire page
document.documentElement.style.scrollBehavior = 'smooth';

// Initialize all animations when page loads
window.addEventListener('load', function() {
    // Ensure all animations start properly
    setTimeout(() => {
        document.body.style.visibility = 'visible';
    }, 100);
});

// Add loading state
document.body.style.visibility = 'hidden';

// 숫자 카운트(도넛)
function countTo(el, target, dur = 1200) {
    const start = 0;
    const startTime = performance.now();
    const step = (now) => {
      const p = Math.min((now - startTime) / dur, 1);
      const val = (start + (target - start) * p).toFixed(1);
      el.textContent = val;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  
  // 스크롤 트리거(공통)
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("animate");
          // 게이지 숫자와 프로그레스 동시 시작
          const num = e.target.querySelector?.(".gauge-number");
          const progress = e.target.querySelector?.(".gauge-progress");
          if (num && !num.dataset.done) {
            num.dataset.done = "1";
            // 숫자 카운팅과 프로그레스 애니메이션을 동시에 시작
            countTo(num, 86.7, 2000); // 2초로 조정하여 gaugeFill과 동일하게
            if (progress) {
              progress.style.animation = 'none';
              progress.offsetHeight; // 강제 리플로우
              progress.style.animation = 'gaugeFill 2s ease 0s forwards';
            }
          }
          // 스택 바 높이 반영
          e.target.querySelectorAll?.(".segment").forEach((seg) => {
            const pct = Number(seg.getAttribute("data-percentage") || 0);
            seg.style.height = pct + "%";
          });
        }
      });
    },
    { threshold: 0.2 }
  );
  
  // animate-on-scroll, 주요 섹션에 부착
  document.querySelectorAll(".animate-on-scroll, .card").forEach((el) => io.observe(el));
  
  // Set radar chart bar heights based on scores
  function setRadarBarHeights() {
    const scores = {
      vocabulary: 86,
      difficulty: 89,
      structure: 80,
      logic: 90
    };
    
    Object.entries(scores).forEach(([category, score]) => {
      const barHeight = (score / 100) * 100; // Convert to pixels (100px max)
      const lineEnd = 200 - barHeight; // Calculate line end point for new center (200,200)
      
      const bar = document.querySelector(`.data-bar.${category}`);
      const line = document.querySelector(`.data-line.${category}`);
      
      if (bar) {
        bar.style.setProperty('--bar-height', `${barHeight}px`);
      }
      if (line) {
        line.style.setProperty('--line-end', `${lineEnd}`);
      }
    });
  }
  
  // Initialize radar chart heights
  setRadarBarHeights();

// 새로운 레이더 차트 JavaScript
function setBar(line, angleDeg, length) {
    const cx = 200, cy = 240; // 400x300 viewBox의 중심점
    const rad = (Math.PI / 180) * angleDeg;
    // 점수를 0-100에서 0-120 픽셀로 변환 (Grid.svg 크기에 맞게)
    const pixelLength = (length / 100) * 200;
    const x2 = cx + pixelLength * Math.cos(rad);
    const y2 = cy - pixelLength * Math.sin(rad);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
}

const scores = {
    vocabulary: 86,
    difficulty: 89,
    structure: 80,
    logic: 90
};

const angles = {
    vocabulary: 144,
    difficulty: 108,
    structure: 72,
    logic: 36
};

function initializeRadarChart() {
    setTimeout(() => {
        // 모든 라인을 초기 상태(중심점)로 설정
        Object.keys(scores).forEach(key => {
            const line = document.querySelector(`.data-bar.${key}`);
            if (line) {
                line.setAttribute("x2", 200);
                line.setAttribute("y2", 240);
            }
        });
        
        // 각 라인을 순차적으로 길어지게 애니메이션
        Object.keys(scores).forEach((key, index) => {
            setTimeout(() => {
                const line = document.querySelector(`.data-bar.${key}`);
                if (line) {
                    animateLineGrowth(line, angles[key], scores[key]);
                }
            }, index * 300); // 300ms 간격으로 순차 시작
        });
    }, 500);
}

// 라인이 길어지는 애니메이션 함수
function animateLineGrowth(line, angleDeg, targetLength) {
    const cx = 200, cy = 240; // 중심점
    const rad = (Math.PI / 180) * angleDeg;
    const targetPixelLength = (targetLength / 100) * 200;
    
    let currentLength = 0;
    const duration = 1000; // 1초 동안 애니메이션
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // easeOutQuart 이징으로 자연스러운 감속
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        
        currentLength = targetPixelLength * easeProgress;
        const x2 = cx + currentLength * Math.cos(rad);
        const y2 = cy - currentLength * Math.sin(rad);
        
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

// 스택형 막대 그래프 초기화
function initializeStackedBar() {
    const segments = document.querySelectorAll('.bar-segment');
    
    // 모든 세그먼트를 초기 높이(0)로 설정
    segments.forEach(segment => {
        segment.style.height = '0%';
    });
    
    // 각 세그먼트를 순차적으로 애니메이션
    segments.forEach((segment, index) => {
        setTimeout(() => {
            const percentage = segment.getAttribute('data-percentage');
            animateBarSegment(segment, percentage);
        }, index * 200); // 200ms 간격으로 순차 시작
    });
}

// 개별 막대 세그먼트 애니메이션 함수
function animateBarSegment(segment, targetPercentage) {
    let currentHeight = 0;
    const duration = 800; // 800ms 애니메이션
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // easeOutCubic 이징으로 자연스러운 감속
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        currentHeight = targetPercentage * easeProgress;
        segment.style.height = currentHeight + '%';
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

window.addEventListener("load", () => {
    initializeRadarChart();
    initializeStackedBar();
});
  