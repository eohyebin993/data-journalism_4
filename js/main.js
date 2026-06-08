document.addEventListener('DOMContentLoaded', () => {
  // 브라우저 실행 즉시 로드된 변수 데이터를 분석합니다.
  loadAndParseArticle();
});

/**
 * 실시간 기사 텍스트 로더 및 HTML 파서 (iframe 지원형)
 */
async function loadAndParseArticle() {
  const contentContainer = document.getElementById('dynamic-content');
  if (!contentContainer) return;

  try {
    // 1. articledata.js에 정의된 전역 변수 articleData 사용
    if (typeof articleData === 'undefined') {
      throw new Error('articledata.js 파일이 로드되지 않았거나 articleData 변수가 정의되지 않았습니다.');
    }
    const rawText = articleData;

    // 2. 줄바꿈 기준 분할 및 불필요 공백 제거
    const lines = rawText.split('\n')
                          .map(line => line.trim())
                          .filter(line => line.length > 0);

    // 3. 사진 기호(<숫자>) 연속 배치를 감지하여 2단 배열(Double Column) 처리
    const blocks = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (line.startsWith('<') && line.endsWith('>')) {
        const photoNum1 = line.slice(1, -1).trim();
        
        // 바로 다음 줄도 사진 기호라면 병렬 배치로 그룹화
        if (i + 1 < lines.length && lines[i+1].startsWith('<') && lines[i+1].endsWith('>')) {
          const photoNum2 = lines[i+1].slice(1, -1).trim();
          blocks.push({ type: 'double_photo', val1: photoNum1, val2: photoNum2 });
          i += 2;
        } else {
          blocks.push({ type: 'single_photo', val1: photoNum1 });
          i += 1;
        }
      } else {
        blocks.push({ type: 'other', val1: line });
        i += 1;
      }
    }

    // 4. 동적 마크업 조립 시작
    let htmlMarkup = '';
    let currentParagraph = [];

    // 문단 빌드 보조 함수
    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const pText = currentParagraph.join(' ').trim();
        if (pText) {
          htmlMarkup += `<p>${pText}</p>\n`;
        }
        currentParagraph = [];
      }
    };

    blocks.forEach(block => {
      if (block.type === 'other') {
        const line = block.val1;

        // 대제목 (###) 처리
        if (line.startsWith('###')) {
          flushParagraph();
          const mainTitleText = line.replace('###', '').trim();
          document.querySelector('.main-title').innerHTML = mainTitleText;
          document.querySelector('.subtitle').textContent = "실시간 지면 기사 연동 및 인터랙티브 그래프 분석";
        }
        // 소제목 (##) 처리
        else if (line.startsWith('##')) {
          flushParagraph();
          const subTitleText = line.replace('##', '').trim();
          htmlMarkup += `<h2 class="section-title">${subTitleText}</h2>\n`;
        }
        // 시각화 그래프 영역 ([숫자]) 처리 -> 1.html ~ 4.html 매핑 가동
        else if (line.startsWith('[') && line.endsWith(']')) {
          flushParagraph();
          const htmlNum = line.slice(1, -1).trim();

          // 숫자에 따른 제목 및 1.html ~ 4.html 파일 지정
          const visInfo = {
            "1": ["시각화 1: 전국 재난 분포 현황 (히트맵)", "1.html"],
            "2": ["시각화 2: 검색 비율 추이", "2.html"],
            "3": ["시각화 3: 시군구별 상세 영향 지도", "3.html"],
            "4": ["시각화 4: 텍스트 검증 데이터", "4.html"]
          };
          
          const [title, origFile] = visInfo[htmlNum] || [`시각화 ${htmlNum}`, `${htmlNum}.html`];
          const layoutClass = (htmlNum === '3') ? 'full-bleed' : 'wide-layout';
          
          // 지도 유형인 3번의 경우 넓고 크게 설계
          const heightVal = (htmlNum === '3') ? '600px' : '450px';

          htmlMarkup += `
            <!-- 시각화 [${htmlNum}] iframe 영역 시작 -->
            <div class="visualization-container ${layoutClass}">
              <div class="vis-header text-center">
                <h3 class="vis-title">${title}</h3>
                <p class="vis-desc">인터랙티브 분석 차트 (원본 파일명: ${origFile})</p>
              </div>
              <div class="chart-box" style="padding: 0; overflow: hidden; height: ${heightVal};">
                <iframe src="./assets/${origFile}" 
                        style="width: 100%; height: 100%; border: none;"
                        scrolling="no" 
                        loading="lazy">
                </iframe>
              </div>
            </div>
            <!-- 시각화 [${htmlNum}] 영역 끝 -->
          `;
        }
        // 강조 인용구 처리
        else if (line.startsWith('"') && line.endsWith('"')) {
          flushParagraph();
          htmlMarkup += `<blockquote>${line}</blockquote>\n`;
        }
        // 일반 글 본문 누적
        else {
          currentParagraph.push(line);
        }
      }
      // 단일 사진 처리
      else if (block.type === 'single_photo') {
        flushParagraph();
        const num = block.val1;
        htmlMarkup += `
          <div class="media-container wide-layout">
            <figure class="media-item">
              <img src="./assets/${num}.jpeg" alt="사진 ${num}" onerror="this.src='./assets/${num}.png'; this.onerror=function() { this.src='./assets/${num}.jpg'; this.onerror=function() { this.src='https://placehold.co/1100x500?text=photo+${num}+not+found' } }">
              <figcaption>[사진 ${num}] 관련 보충 이미지</figcaption>
            </figure>
          </div>
        `;
      }
      // 병렬 사진 (가로 2단 배치) 처리
      else if (block.type === 'double_photo') {
        flushParagraph();
        const num1 = block.val1;
        const num2 = block.val2;
        htmlMarkup += `
          <div class="media-container wide-layout double-col">
            <figure class="media-item">
              <img src="./assets/${num1}.jpeg" alt="사진 ${num1}" onerror="this.src='./assets/${num1}.png'; this.onerror=function() { this.src='./assets/${num1}.jpg'; this.onerror=function() { this.src='https://placehold.co/600x400?text=photo+${num1}+not+found' } }">
              <figcaption>[사진 ${num1}] 분석 관련 기록</figcaption>
            </figure>
            <figure class="media-item">
              <img src="./assets/${num2}.jpeg" alt="사진 ${num2}" onerror="this.src='./assets/${num2}.png'; this.onerror=function() { this.src='./assets/${num2}.jpg'; this.onerror=function() { this.src='https://placehold.co/600x400?text=photo+${num2}+not+found' } }">
              <figcaption>[사진 ${num2}] 분석 관련 기록</figcaption>
            </figure>
          </div>
        `;
      }
    });

    // 마지막에 남은 본문 문단 주입
    flushParagraph();

    // 5. 생성한 HTML 구조를 메인 지면에 대입
    contentContainer.innerHTML = htmlMarkup;

    // 6. 스크롤 반응형 fade-in 효과 초기 가동
    initScrollAnimations();

  } catch (error) {
    console.error('오류 발생:', error);
    contentContainer.innerHTML = `<p style="color:red; text-align:center; padding: 50px;">[기사 데이터 로드 오류] ${error.message}</p>`;
  }
}

/**
 * 요소 화면 등장 스크롤 애니메이션 정의
 */
function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in, .visualization-container, .media-container');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    fadeElements.forEach(el => {
      el.classList.add('fade-in');
      observer.observe(el);
    });
  } else {
    fadeElements.forEach(el => el.classList.add('visible'));
  }
}