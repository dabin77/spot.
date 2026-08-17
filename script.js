// 화면 전환 애니메이션은 JavaScript가 정상 연결되었을 때만 활성화합니다.
const rootElement = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

rootElement.classList.add("motion-enabled");

// 카페 정보는 이 배열에서 한 번에 관리합니다.
// 현재 혼잡도와 확인 시각은 실제 조사 결과가 아닌 화면 확인용 데모 데이터입니다.
const cafes = [
  {
    id: "cafe_01",
    name: "할리스 성균관대점",
    description: "캠퍼스 주변에서 가볍게 머물 곳을 찾을 때 확인해 보세요.",
    type: "cafe",
    address: "서울 종로구 성균관로 6",
    status: "여유",
    checkedAt: "12분 전",
  },
  {
    id: "cafe_02",
    name: "킹스커피",
    description: "성균관대 주변의 카페 선택지를 비교할 수 있도록 소개합니다.",
    type: "cafe",
    address: "서울 종로구 대명길 46",
    status: "보통",
    checkedAt: "18분 전",
  },
  {
    id: "cafe_03",
    name: "스타벅스 성대입구점",
    description: "방문 전 최근 혼잡 상태를 빠르게 살펴볼 수 있습니다.",
    type: "cafe",
    address: "서울 종로구 창경궁로 235",
    status: "혼잡",
    checkedAt: "7분 전",
  },
  {
    id: "cafe_04",
    name: "이디야커피 성균관대점",
    description: "최근 확인 정보가 들어오면 혼잡 상태를 안내합니다.",
    type: "cafe",
    address: "서울 종로구 성균관로 8",
    status: "확인 필요",
    checkedAt: "아직 확인되지 않음",
  },
  {
    id: "cafe_05",
    name: "커피빈 혜화역점",
    description: "2층과 3층의 공간을 목적에 맞춰 비교해 볼 수 있는 카페입니다.",
    type: "cafe",
    address: "서울 종로구 대명길 5",
    status: "여유",
    checkedAt: "15분 전",
  },
  {
    id: "study_cafe_06",
    name: "24시 프리카페 성균관대점",
    description: "전 좌석 콘센트와 팀플룸을 갖춘 2층 스터디카페입니다.",
    type: "study-cafe",
    address: "서울 종로구 창경궁로29길 25 명륜빌딩 2층 205호",
    priceSummary: "4시간 이용권 4,000원",
    pricing: [
      {
        group: "확인된 이용권",
        items: [{ label: "자판기 이용권 4시간", value: "4,000원" }],
      },
    ],
    priceNote: "온라인에서 확인된 가격이며, 방문 전 매장의 최신 가격을 확인해 주세요.",
    status: "보통",
    checkedAt: "21분 전",
  },
  {
    id: "study_cafe_07",
    name: "작심스터디카페 서울혜화점",
    description: "3층에서 집중 학습과 장시간 이용을 비교할 수 있는 스터디카페입니다.",
    type: "study-cafe",
    address: "서울 종로구 창경궁로 253-1 3층",
    priceSummary: "2시간 4,000원부터",
    pricing: [
      {
        group: "당일 이용권",
        items: [
          { label: "2시간", value: "4,000원" },
          { label: "4시간", value: "7,000원" },
          { label: "6시간", value: "9,000원" },
          { label: "8시간", value: "10,000원" },
          { label: "12시간", value: "14,000원" },
        ],
      },
      {
        group: "시간·기간 이용권",
        items: [
          { label: "50시간", value: "80,000원" },
          { label: "100시간", value: "140,000원" },
          { label: "자유석 4주", value: "150,000원" },
          { label: "자유석 12주", value: "400,000원" },
        ],
      },
      {
        group: "별도 공간",
        items: [{ label: "5인 스터디룸", value: "7,000원" }],
      },
    ],
    priceNote: "온라인에서 확인된 가격이며, 방문 전 매장의 최신 가격을 확인해 주세요.",
    status: "혼잡",
    checkedAt: "9분 전",
  },
];

// 방문 목적별 문구와 추천 기준을 한곳에서 관리합니다.
const purposeProfiles = {
  study: {
    label: "공부·과제",
    shortLabel: "공부",
    title: "공부·과제에 맞는 공간",
    description: "조용함, 콘센트, 현재 혼잡도를 함께 살펴 추천했어요.",
  },
  team: {
    label: "팀플",
    shortLabel: "팀플",
    title: "팀플에 맞는 공간",
    description: "함께 앉기 좋은 좌석, 대화 분위기, 콘센트를 중심으로 추천했어요.",
  },
  conversation: {
    label: "대화·휴식",
    shortLabel: "대화",
    title: "대화·휴식에 맞는 공간",
    description: "편안한 좌석과 대화 분위기를 중심으로 추천했어요.",
  },
};

// 층 구성과 프리카페의 콘센트·팀플룸 정보는 사용자가 확인한 내용입니다.
// 그 밖의 혼잡도·콘센트·소음·좌석 유형·목적 적합도는 현장 조사 전 UI 확인용 데모입니다.
const demoFloorData = [
  [
    {
      name: "1층",
      status: "여유",
      outlets: "적음",
      noise: "활기참",
      seatType: "빠른 이용석",
      fit: { study: 1, team: 1, conversation: 3 },
    },
    {
      name: "2층",
      status: "보통",
      outlets: "보통",
      noise: "보통",
      seatType: "소파형 좌석",
      fit: { study: 2, team: 2, conversation: 5 },
    },
    {
      name: "3층",
      status: "여유",
      outlets: "많음",
      noise: "조용함",
      seatType: "1인 테이블",
      fit: { study: 5, team: 2, conversation: 2 },
    },
    {
      name: "4층",
      status: "확인 필요",
      outlets: "보통",
      noise: "보통",
      seatType: "큰 테이블",
      fit: { study: 3, team: 4, conversation: 2 },
    },
  ],
  [
    {
      name: "2층",
      status: "보통",
      outlets: "보통",
      noise: "활기참",
      seatType: "큰 테이블",
      fit: { study: 2, team: 5, conversation: 4 },
    },
  ],
  [
    {
      name: "1층",
      note: "픽업 전용 · 좌석 없음",
      seating: false,
      outlets: "해당 없음",
      noise: "해당 없음",
      seatType: "좌석 없음",
      fit: { study: 0, team: 0, conversation: 0 },
    },
    {
      name: "2층",
      status: "혼잡",
      outlets: "보통",
      noise: "보통",
      seatType: "혼합형 좌석",
      fit: { study: 4, team: 3, conversation: 4 },
    },
  ],
  [
    {
      name: "1층",
      status: "확인 필요",
      outlets: "적음",
      noise: "보통",
      seatType: "1~2인 테이블",
      fit: { study: 3, team: 1, conversation: 3 },
    },
  ],
  [
    {
      name: "2층",
      status: "여유",
      outlets: "보통",
      noise: "보통",
      seatType: "혼합형 좌석",
      fit: { study: 4, team: 3, conversation: 4 },
    },
    {
      name: "3층",
      status: "보통",
      outlets: "많음",
      noise: "조용함",
      seatType: "1~2인 좌석",
      fit: { study: 5, team: 2, conversation: 3 },
    },
  ],
  [
    {
      name: "2층",
      status: "보통",
      outlets: "전 좌석",
      noise: "조용함",
      seatType: "1인석·커플석·팀플룸",
      fit: { study: 5, team: 5, conversation: 2 },
    },
  ],
  [
    {
      name: "3층",
      status: "혼잡",
      outlets: "확인 필요",
      noise: "조용함",
      seatType: "집중형·오픈형 좌석",
      fit: { study: 5, team: 2, conversation: 1 },
    },
  ],
];

const cafeGrid = document.querySelector("#cafe-grid");
const filterButtons = document.querySelectorAll(".filter-button");
const resultCount = document.querySelector("#result-count");

const introScreen = document.querySelector("#intro-screen");
const cafesScreen = document.querySelector("#cafes-screen");
const purposeButtons = document.querySelectorAll(".purpose-button");
const purposeChangeButtons = document.querySelectorAll(".purpose-change-button");
const backToIntroButton = document.querySelector("#back-to-intro-button");
const introTitle = document.querySelector("#intro-title");
const cafesTitle = document.querySelector("#cafes-title");
const cafesOverviewDescription = document.querySelector("#cafes-overview-description");
const recommendationSummary = document.querySelector("#recommendation-summary");
const selectedPurposeLabel = document.querySelector("#selected-purpose-label");

const detailLayer = document.querySelector("#detail-layer");
const detailPanel = document.querySelector("#detail-panel");
const detailCloseButton = document.querySelector("#dialog-close-button");
const sheetDragZone = document.querySelector("#sheet-drag-zone");
const detailTitle = document.querySelector("#detail-title");
const detailStatus = document.querySelector("#detail-status");
const detailCheckedTime = document.querySelector("#detail-checked-time");
const detailDescription = document.querySelector("#detail-description");
const detailAddress = document.querySelector("#detail-address");
const detailPriceSection = document.querySelector("#detail-price-section");
const detailPriceList = document.querySelector("#detail-price-list");
const detailPriceNote = document.querySelector("#detail-price-note");
const detailCafeNumber = document.querySelector("#detail-cafe-number");
const detailPurposeSummary = document.querySelector("#detail-purpose-summary");
const detailTags = document.querySelector("#detail-tags");
const detailFloorList = document.querySelector("#detail-floor-list");
const toast = document.querySelector("#toast");

const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";

// 목적별 조회수를 추적하는 분석 시스템
const analyticsStore = {
  get() {
    try {
      return JSON.parse(localStorage.getItem("kingo_analytics")) || {
        purposeViews: {},
      };
    } catch {
      return { purposeViews: {} };
    }
  },

  trackPurposeView(purpose) {
    const data = this.get();
    if (!data.purposeViews[purpose]) {
      data.purposeViews[purpose] = 0;
    }
    data.purposeViews[purpose]++;
    localStorage.setItem("kingo_analytics", JSON.stringify(data));
  },

  getTopPurposes(limit = 3) {
    const data = this.get();
    return Object.entries(data.purposeViews)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([purpose]) => purpose);
  },

  getTrendingStats() {
    const data = this.get();
    return data.purposeViews;
  },
};

let cardObserver = null;
let cardSafetyTimer = null;
let filterTimer = null;
let filterRequestId = 0;
let activeFilter = "전체";
let pressedCard = null;

let isDialogOpen = false;
let lastDialogTrigger = null;
let lockedScrollY = 0;
let dialogCloseTimer = null;

let isDraggingSheet = false;
let dragPointerId = null;
let dragStartY = 0;
let dragDistance = 0;
let toastTimer = null;

let currentView = window.location.hash === "#cafes" ? "cafes" : "intro";
let pendingView = null;
let isViewTransitioning = false;
let viewTransitionTimer = null;
let introReadyTimer = null;

let selectedPurpose = getStoredPurpose();
let lastTrackedScreen = null;
let lastTrackedDetailOpenKey = null;
let detailEngagementLoopId = null;

// 혼잡도에 맞는 CSS 배지 이름을 돌려줍니다.
function getStatusClass(status) {
  const statusClasses = {
    여유: "badge-available",
    보통: "badge-normal",
    혼잡: "badge-crowded",
    "확인 필요": "badge-unconfirmed",
  };

  return statusClasses[status] || "badge-unconfirmed";
}

function getStoredPurpose() {
  try {
    const storedPurpose = window.sessionStorage.getItem("kingo-purpose");
    return purposeProfiles[storedPurpose] ? storedPurpose : "study";
  } catch (error) {
    return "study";
  }
}

function storePurpose(purpose) {
  try {
    window.sessionStorage.setItem("kingo-purpose", purpose);
  } catch (error) {
    // 저장이 제한된 환경에서도 현재 화면의 추천 기능은 그대로 동작합니다.
  }
}

// 목적 적합도와 데모 공간 조건을 더해 층별 추천 점수를 계산합니다.
function getFloorScore(floor, purpose) {
  if (floor.seating === false) return -1;

  const congestionScore = {
    여유: 8,
    보통: 5,
    혼잡: 0,
    "확인 필요": 2,
  }[floor.status] ?? 2;

  let score = (floor.fit?.[purpose] || 0) * 10 + congestionScore;

  if (purpose === "study") {
    if (floor.outlets === "많음" || floor.outlets === "전 좌석") score += 8;
    if (floor.outlets === "보통") score += 4;
    if (floor.noise === "조용함") score += 8;
    if (floor.noise === "보통") score += 4;
  }

  if (purpose === "team") {
    if (floor.seatType === "큰 테이블" || floor.seatType.includes("팀플룸")) score += 8;
    if (["많음", "보통", "전 좌석"].includes(floor.outlets)) score += 4;
    if (floor.noise === "보통" || floor.noise === "활기참") score += 4;
  }

  if (purpose === "conversation") {
    if (floor.seatType === "소파형 좌석") score += 8;
    if (floor.seatType === "혼합형 좌석") score += 2;
    if (floor.noise === "보통") score += 4;
    if (floor.noise === "활기참") score += 8;
  }

  return score;
}

function getMatchReasons(floor, purpose) {
  const reasons = [];

  if (purpose === "study") {
    reasons.push(floor.noise === "조용함" ? "조용한 분위기" : `소음 ${floor.noise}`);
    reasons.push(`콘센트 ${floor.outlets}`);
  } else if (purpose === "team") {
    reasons.push(floor.seatType);
    reasons.push(`콘센트 ${floor.outlets}`);
  } else {
    reasons.push(floor.seatType);
    reasons.push(floor.noise === "활기참" ? "대화하기 편한 분위기" : `소음 ${floor.noise}`);
  }

  if (floor.status) reasons.push(`혼잡도 ${floor.status}`);
  return reasons.slice(0, 3);
}

function getCafeRecommendation(cafeIndex, purpose = selectedPurpose) {
  const availableFloors = demoFloorData[cafeIndex].filter((floor) => floor.seating !== false);
  const rankedFloors = availableFloors
    .map((floor) => ({ floor, score: getFloorScore(floor, purpose) }))
    .sort((a, b) => b.score - a.score);
  const bestMatch = rankedFloors[0];

  return {
    floor: bestMatch.floor,
    score: bestMatch.score,
    reasons: getMatchReasons(bestMatch.floor, purpose),
  };
}

function getRankedCafes(cafeList) {
  return [...cafeList].sort((a, b) => {
    const aIndex = cafes.indexOf(a);
    const bIndex = cafes.indexOf(b);
    const scoreDifference =
      getCafeRecommendation(bIndex).score - getCafeRecommendation(aIndex).score;

    return scoreDifference || aIndex - bIndex;
  });
}

function getMatchLabel(score) {
  if (score >= 60) return "매우 잘 맞아요";
  if (score >= 40) return "잘 맞아요";
  return "비교해 보세요";
}

function updatePurposeInterface() {
  const profile = purposeProfiles[selectedPurpose];
  const rankedCafes = getRankedCafes(cafes);
  const bestCafe = rankedCafes[0];
  const bestCafeIndex = cafes.indexOf(bestCafe);
  const bestMatch = getCafeRecommendation(bestCafeIndex);

  cafesTitle.textContent = profile.title;
  cafesOverviewDescription.textContent = profile.description;
  selectedPurposeLabel.textContent = profile.label;

  purposeButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.purpose === selectedPurpose));
  });

  purposeChangeButtons.forEach((button) => {
    const isSelected = button.dataset.purpose === selectedPurpose;
    button.classList.toggle("active", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  recommendationSummary.innerHTML = `
    <div class="recommendation-summary-topline">
      <span class="recommendation-label">DEMO BEST MATCH</span>
      <span>${profile.label} 기준</span>
    </div>
    <p><strong>${bestCafe.name} ${bestMatch.floor.name}</strong>을 먼저 확인해 보세요.</p>
    <div class="recommendation-reasons">
      ${bestMatch.reasons.map((reason) => `<span>${reason}</span>`).join("")}
    </div>
    <small>현장 조사 전 샘플 데이터로 계산한 추천입니다.</small>
  `;
}

function revealCardsImmediately(cards) {
  cards.forEach((card) => {
    card.style.setProperty("--card-delay", "0ms");
    card.classList.add("is-visible");
  });
}

// 화면에 들어오는 카드를 하나씩 보여 주는 관찰 기능을 준비합니다.
function observeCards(cards, { initial = false } = {}) {
  if (cardObserver) {
    cardObserver.disconnect();
    cardObserver = null;
  }

  if (cardSafetyTimer) {
    window.clearTimeout(cardSafetyTimer);
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealCardsImmediately(cards);
    return;
  }

  cards.forEach((card, index) => {
    const delay = initial ? 620 + Math.min(index, 1) * 90 : Math.min(index * 65, 195);
    card.style.setProperty("--card-delay", `${delay}ms`);
  });

  try {
    cardObserver = new IntersectionObserver(
      (entries, observer) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        visibleEntries.forEach((entry, visibleIndex) => {
          // 첫 화면 등장 이후 스크롤된 카드는 짧은 stagger만 사용합니다.
          if (!initial || performance.now() > 1100) {
            entry.target.style.setProperty("--card-delay", `${visibleIndex * 70}ms`);
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -28px 0px",
      },
    );

    const currentObserver = cardObserver;
    let observationStarted = false;
    const startObserving = () => {
      if (observationStarted || cardObserver !== currentObserver) return;
      observationStarted = true;
      cards.forEach((card) => {
        if (card.isConnected) currentObserver.observe(card);
      });
    };

    window.requestAnimationFrame(startObserving);
    window.setTimeout(startObserving, 60);

    // 현재 화면 안의 카드는 관찰 콜백이 지연되어도 즉시 등장 절차를 시작합니다.
    const revealCardsInViewport = () => {
      cards.forEach((card) => {
        if (!card.isConnected || card.classList.contains("is-visible")) return;
        const rect = card.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          card.classList.add("is-visible");
          currentObserver.unobserve(card);
        }
      });
    };

    window.requestAnimationFrame(revealCardsInViewport);
    window.setTimeout(revealCardsInViewport, 80);
  } catch (error) {
    // 관찰 기능 생성에 실패해도 카드 자체는 항상 볼 수 있어야 합니다.
    revealCardsImmediately(cards);
    return;
  }

  // 드물게 관찰 콜백이 지연되면 현재 화면 근처의 카드만 안전하게 표시합니다.
  cardSafetyTimer = window.setTimeout(() => {
    cards.forEach((card) => {
      const cardTop = card.getBoundingClientRect().top;
      if (!card.classList.contains("is-visible") && cardTop < window.innerHeight + 80) {
        card.style.setProperty("--card-delay", "0ms");
        card.classList.add("is-visible");
        cardObserver?.unobserve(card);
      }
    });
  }, 1500);

  // 첫 화면에 없던 카드는 나중에 스크롤될 때 긴 시작 지연 없이 나타납니다.
  if (initial) {
    window.setTimeout(() => {
      cards.forEach((card, index) => {
        if (!card.classList.contains("is-visible")) {
          card.style.setProperty("--card-delay", `${(index % 2) * 70}ms`);
        }
      });
    }, 1050);
  }
}

// 전달받은 카페 목록을 카드 HTML로 만들어 화면에 보여줍니다.
function renderCafes(cafeList, options = {}) {
  const rankedCafes = getRankedCafes(cafeList);
  const globalRankMap = new Map(getRankedCafes(cafes).map((cafe, index) => [cafe, index + 1]));
  const profile = purposeProfiles[selectedPurpose];

  cafeGrid.innerHTML = rankedCafes
    .map((cafe) => {
      const cafeIndex = cafes.indexOf(cafe);
      const cafeNumber = cafeIndex + 1;
      const rank = globalRankMap.get(cafe);
      const recommendation = getCafeRecommendation(cafeIndex);
      const rankLabel = rank === 1 ? "추천 1순위" : `추천 ${rank}순위`;

      return `
        <article
          class="cafe-card cafe-card--${cafeNumber} is-animatable${rank === 1 ? " cafe-card--best" : ""}"
          data-cafe-index="${cafeIndex}"
          role="button"
          tabindex="0"
          aria-label="${rankLabel}, ${cafe.name} ${recommendation.floor.name} 상세 정보 열기"
        >
          <div class="card-visual" aria-hidden="true">
            <span class="visual-number">SPOT ${String(cafeNumber).padStart(2, "0")}</span>
            <span class="visual-rank">${rankLabel}</span>
            <span class="visual-line"></span>
          </div>

          <div class="card-body">
            <div class="card-topline">
              <h3 class="cafe-name">${cafe.name}</h3>
              <span class="demo-chip">혼잡도 데모</span>
            </div>

            <p class="cafe-description">${cafe.description}</p>

            <div class="card-place-info">
              <p class="card-address"><span>주소</span>${cafe.address}</p>
              ${
                cafe.type === "study-cafe"
                  ? `<p class="card-price"><span>이용 가격</span><strong>${cafe.priceSummary}</strong></p>`
                  : ""
              }
            </div>

            <div class="card-match-panel">
              <div class="card-match-heading">
                <span>${profile.shortLabel} 추천 공간</span>
                <strong>${recommendation.floor.name}</strong>
              </div>
              <p>${getMatchLabel(recommendation.score)}</p>
              <div class="card-match-tags">
                ${recommendation.reasons.slice(0, 2).map((reason) => `<span>${reason}</span>`).join("")}
              </div>
            </div>

            <div class="card-meta">
              <span class="status-badge ${getStatusClass(cafe.status)}">${cafe.status}</span>
              <p class="checked-time">마지막 확인 · ${cafe.checkedAt}</p>
            </div>

            <div class="card-footer">
              <span class="card-footer-label">KINGO CURATION</span>
              <button class="detail-button" type="button" aria-label="${cafe.name} 상세 정보 열기">
                상세보기
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  resultCount.textContent = `${cafeList.length}곳 · 추천순`;
  observeCards([...cafeGrid.querySelectorAll(".cafe-card")], options);
}

// 마지막으로 누른 필터만 반영해 빠른 연속 입력에서도 목록이 꼬이지 않게 합니다.
function applyFilter(selectedFilter) {
  activeFilter = selectedFilter;
  filterRequestId += 1;
  const currentRequestId = filterRequestId;

  if (filterTimer) {
    window.clearTimeout(filterTimer);
    filterTimer = null;
  }

  const filteredCafes =
    selectedFilter === "전체"
      ? cafes
      : cafes.filter((cafe) => cafe.status === selectedFilter);

  const commitFilter = () => {
    if (currentRequestId !== filterRequestId) return;

    renderCafes(filteredCafes);

    const finishGridTransition = () => {
      if (currentRequestId === filterRequestId) {
        cafeGrid.classList.remove("is-filtering");
      }
    };

    window.requestAnimationFrame(finishGridTransition);
    window.setTimeout(finishGridTransition, 60);
  };

  if (reduceMotion) {
    commitFilter();
    return;
  }

  cafeGrid.classList.add("is-filtering");
  filterTimer = window.setTimeout(commitFilter, 150);
}

// 처음 화면으로 돌아오면 필터와 카드 목록을 모두 초기 상태로 되돌립니다.
function resetFiltersToAll() {
  filterRequestId += 1;

  if (filterTimer) {
    window.clearTimeout(filterTimer);
    filterTimer = null;
  }

  activeFilter = "전체";
  cafeGrid.classList.remove("is-filtering");

  filterButtons.forEach((button) => {
    const isAllFilter = button.dataset.filter === "전체";
    button.classList.toggle("active", isAllFilter);
    button.setAttribute("aria-pressed", String(isAllFilter));
  });

  renderCafes(cafes);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextFilter = button.dataset.filter;
    if (nextFilter === activeFilter) return;

    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });

    trackEvent("filter_change", {
      status_filter: nextFilter,
      purpose: selectedPurpose,
    });

    applyFilter(nextFilter);
  });
});

function selectPurpose(purpose, { refreshCards = true, announce = false, selectionLocation = "toolbar" } = {}) {
  if (!purposeProfiles[purpose]) return;

  const isPurposeChange = purpose !== selectedPurpose;
  selectedPurpose = purpose;
  storePurpose(purpose);
  updatePurposeInterface();

  if (isPurposeChange) {
    trackEvent("purpose_select", {
      purpose,
      selection_location: selectionLocation,
    });
    analyticsStore.trackPurposeView(purpose);
  }

  if (refreshCards) applyFilter(activeFilter);
  if (announce) showToast(`${purposeProfiles[purpose].label} 기준으로 추천을 다시 정리했어요.`);
}

purposeChangeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.purpose === selectedPurpose) return;
    selectPurpose(button.dataset.purpose, { refreshCards: true, selectionLocation: "toolbar" });
  });
});

// 인기 있는 목적 항목 표시
function renderTrendingPurposes() {
  const trendingSection = document.getElementById("trending-section");
  if (!trendingSection) return;

  const topPurposes = analyticsStore.getTopPurposes(3);

  if (topPurposes.length === 0) {
    trendingSection.style.display = "none";
    return;
  }

  const container = trendingSection.querySelector(".trending-buttons");
  if (!container) return;

  container.innerHTML = topPurposes
    .map(
      (purpose) =>
        `<button class="trending-button" data-purpose="${purpose}" type="button">
          <span class="trending-badge">인기</span>
          <span>${purposeProfiles[purpose].label}</span>
        </button>`
    )
    .join("");

  trendingSection.style.display = "block";

  // 이벤트 리스너 추가
  container.querySelectorAll(".trending-button").forEach((button) => {
    button.addEventListener("click", () => {
      selectPurpose(button.dataset.purpose, {
        refreshCards: true,
        announce: true,
        selectionLocation: "trending",
      });
      navigateToScreen("cafes", { shouldFocus: true });
    });
  });
}

// 모바일에서 누르는 동안 카드가 작아지는 상태를 명시적으로 관리합니다.
function clearPressedCard() {
  if (!pressedCard) return;
  pressedCard.classList.remove("is-pressed");
  pressedCard = null;
}

cafeGrid.addEventListener("pointerdown", (event) => {
  const card = event.target.closest(".cafe-card");
  if (!card) return;

  clearPressedCard();
  pressedCard = card;
  card.classList.add("is-pressed");
});

window.addEventListener("pointerup", clearPressedCard);
window.addEventListener("pointercancel", clearPressedCard);
window.addEventListener("blur", clearPressedCard);

function getDemoTags(cafeIndex) {
  const recommendation = getCafeRecommendation(cafeIndex);
  return [...recommendation.reasons.slice(0, 2), "혼잡·추천 데모"];
}

function populateDetailPanel(cafeIndex) {
  const cafe = cafes[cafeIndex];
  const floors = demoFloorData[cafeIndex];
  const profile = purposeProfiles[selectedPurpose];
  const recommendation = getCafeRecommendation(cafeIndex);

  detailTitle.textContent = cafe.name;
  detailStatus.className = `status-badge ${getStatusClass(cafe.status)}`;
  detailStatus.textContent = cafe.status;
  detailCheckedTime.textContent = `마지막 확인 · ${cafe.checkedAt}`;
  detailDescription.textContent = cafe.description;
  detailAddress.textContent = cafe.address;
  detailCafeNumber.textContent = `SPOT ${String(cafeIndex + 1).padStart(2, "0")}`;

  // 스터디카페에만 이용 가격을 표시합니다.
  const hasPricing = cafe.type === "study-cafe" && Array.isArray(cafe.pricing);
  detailPriceSection.hidden = !hasPricing;

  if (hasPricing) {
    detailPriceList.innerHTML = cafe.pricing
      .map(
        (priceGroup) => `
          <div class="price-group">
            <h4>${priceGroup.group}</h4>
            <dl>
              ${priceGroup.items
                .map(
                  (item) => `
                    <div>
                      <dt>${item.label}</dt>
                      <dd>${item.value}</dd>
                    </div>
                  `,
                )
                .join("")}
            </dl>
          </div>
        `,
      )
      .join("");
    detailPriceNote.textContent = "온라인 확인 가격 · 변동 가능";
  } else {
    detailPriceList.innerHTML = "";
    detailPriceNote.textContent = "";
  }

  detailPurposeSummary.innerHTML = `
    <span>${profile.label} 추천 공간</span>
    <p><strong>${recommendation.floor.name}</strong> · ${getMatchLabel(recommendation.score)}</p>
    <small>현장 조사 전 샘플 데이터로 계산한 데모 추천입니다.</small>
  `;

  detailTags.innerHTML = getDemoTags(cafeIndex)
    .map((tag) => `<span class="atmosphere-tag">${tag}</span>`)
    .join("");

  detailFloorList.innerHTML = floors
    .map(
      (floor) => {
        const isRecommendedFloor = floor === recommendation.floor;
        const floorScore = floor.seating === false ? -1 : getFloorScore(floor, selectedPurpose);

        return `
        <div class="floor-item${isRecommendedFloor ? " floor-item--recommended" : ""}">
          <div class="floor-item-heading">
            <div>
              <span class="floor-item-name">${floor.name}</span>
              ${isRecommendedFloor ? `<span class="floor-best-label">${profile.shortLabel} 추천</span>` : ""}
            </div>
            ${
              floor.note
                ? `<span class="floor-item-note">${floor.note}</span>`
                : `<span class="status-badge ${getStatusClass(floor.status)}">${floor.status}</span>`
            }
          </div>

          ${
            floor.seating === false
              ? `<p class="floor-no-seat-copy">좌석 이용 목적의 추천에서는 제외되는 층입니다.</p>`
              : `
                <p class="floor-fit-copy">${profile.label} 적합도 · <strong>${getMatchLabel(floorScore)}</strong></p>
                <div class="floor-feature-grid">
                  <span><small>콘센트</small><strong>${floor.outlets}</strong></span>
                  <span><small>소음</small><strong>${floor.noise}</strong></span>
                  <span><small>좌석 예시</small><strong>${floor.seatType}</strong></span>
                </div>
              `
          }
        </div>
      `;
      },
    )
    .join("");
}

function lockPageScroll() {
  lockedScrollY = window.scrollY;
  document.body.classList.add("dialog-open");
  document.body.style.position = "fixed";
  document.body.style.top = `-${lockedScrollY}px`;
  document.body.style.width = "100%";
  document.body.style.overflow = "hidden";
}

function unlockPageScroll() {
  document.body.classList.remove("dialog-open");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  document.body.style.overflow = "";
  window.scrollTo(0, lockedScrollY);
}

function openDetailPanel(cafeIndex, trigger) {
  if (!cafes[cafeIndex]) return;

  const cafe = cafes[cafeIndex];
  const detailOpenKey = `${cafe.id}:${selectedPurpose}`;

  if (dialogCloseTimer) {
    window.clearTimeout(dialogCloseTimer);
    dialogCloseTimer = null;
  }

  populateDetailPanel(cafeIndex);
  lastDialogTrigger = trigger;

  if (!isDialogOpen) {
    lockPageScroll();
  }

  detailEngagementState.activeCafeId = String(cafe.id);
  detailEngagementState.startedAt = Date.now();
  detailEngagementState.activeElapsedMs = 0;
  if (detailEngagementLoopId) {
    window.clearTimeout(detailEngagementLoopId);
    detailEngagementLoopId = null;
  }

  if (lastTrackedDetailOpenKey !== detailOpenKey) {
    trackEvent("select_item", {
      cafe_id: cafe.id,
      cafe_name: cafe.name,
      purpose: selectedPurpose,
      rank: Number(cafeIndex) + 1,
      recommended_floor: getCafeRecommendation(cafeIndex).floor.name,
      status_filter: activeFilter,
    });

    trackEvent("view_item", {
      cafe_id: cafe.id,
      cafe_name: cafe.name,
      purpose: selectedPurpose,
      rank: Number(cafeIndex) + 1,
      recommended_floor: getCafeRecommendation(cafeIndex).floor.name,
      status_filter: activeFilter,
    });

    lastTrackedDetailOpenKey = detailOpenKey;
    maybeTrackCompareCafes(String(cafe.id));
  }

  scheduleDetailEngagementCheck();

  isDialogOpen = true;
  detailLayer.hidden = false;
  detailPanel.style.removeProperty("--sheet-drag");

  const revealDetailPanel = () => {
    if (!isDialogOpen || detailLayer.classList.contains("is-open")) return;
    detailLayer.classList.add("is-open");
    window.setTimeout(() => detailCloseButton.focus({ preventScroll: true }), reduceMotion ? 0 : 80);
  };

  window.requestAnimationFrame(() => window.requestAnimationFrame(revealDetailPanel));
  window.setTimeout(revealDetailPanel, 50);
}

function closeDetailPanel({ restoreFocus = true, onClosed = null } = {}) {
  if (!isDialogOpen) return;

  isDialogOpen = false;
  detailLayer.classList.remove("is-open");
  detailPanel.classList.remove("is-dragging");

  if (detailEngagementLoopId) {
    window.clearTimeout(detailEngagementLoopId);
    detailEngagementLoopId = null;
  }

  const focusTarget = lastDialogTrigger;
  const finishClose = () => {
    detailLayer.hidden = true;
    detailPanel.style.removeProperty("--sheet-drag");
    unlockPageScroll();

    if (restoreFocus && focusTarget?.isConnected) {
      focusTarget.focus({ preventScroll: true });
    }

    resetDetailEngagementState();
    dialogCloseTimer = null;
    if (typeof onClosed === "function") onClosed();
  };

  dialogCloseTimer = window.setTimeout(finishClose, reduceMotion ? 0 : 310);
}

// 카드 전체와 상세보기 버튼 모두 같은 상세 패널을 엽니다.
cafeGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".cafe-card");
  if (!card) return;

  openDetailPanel(Number(card.dataset.cafeIndex), event.target.closest(".detail-button") || card);
});

cafeGrid.addEventListener("keydown", (event) => {
  if (event.target.closest(".detail-button")) return;
  if (event.key !== "Enter" && event.key !== " ") return;

  const card = event.target.closest(".cafe-card");
  if (!card) return;

  event.preventDefault();
  openDetailPanel(Number(card.dataset.cafeIndex), card);
});

detailCloseButton.addEventListener("click", closeDetailPanel);
detailLayer.querySelector("[data-dialog-close]").addEventListener("click", closeDetailPanel);

function getDialogFocusableElements() {
  return [...detailPanel.querySelectorAll("button, [href], [tabindex]:not([tabindex='-1'])")].filter(
    (element) => !element.disabled && element.getClientRects().length > 0,
  );
}

// Escape 닫기와 Tab 초점 순환을 한곳에서 처리합니다.
document.addEventListener("keydown", (event) => {
  if (!isDialogOpen) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeDetailPanel();
    return;
  }

  if (event.key !== "Tab") return;

  const focusableElements = getDialogFocusableElements();
  if (focusableElements.length === 0) {
    event.preventDefault();
    detailPanel.focus();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
});

// 모바일 bottom sheet의 드래그 핸들을 아래로 당기면 닫습니다.
sheetDragZone.addEventListener("pointerdown", (event) => {
  if (!isDialogOpen || window.matchMedia("(min-width: 700px)").matches) return;

  isDraggingSheet = true;
  dragPointerId = event.pointerId;
  dragStartY = event.clientY;
  dragDistance = 0;
  detailPanel.classList.add("is-dragging");
  try {
    sheetDragZone.setPointerCapture(event.pointerId);
  } catch (error) {
    // 합성 이벤트 등 포인터 캡처가 불가능한 환경에서도 드래그 계산은 계속합니다.
  }
});

sheetDragZone.addEventListener("pointermove", (event) => {
  if (!isDraggingSheet || event.pointerId !== dragPointerId) return;

  dragDistance = Math.max(0, event.clientY - dragStartY);
  detailPanel.style.setProperty("--sheet-drag", `${dragDistance}px`);
});

function finishSheetDrag(event) {
  if (!isDraggingSheet || event.pointerId !== dragPointerId) return;

  isDraggingSheet = false;
  dragPointerId = null;
  detailPanel.classList.remove("is-dragging");

  if (dragDistance >= 70) {
    closeDetailPanel();
  } else {
    detailPanel.style.setProperty("--sheet-drag", "0px");
    window.setTimeout(() => detailPanel.style.removeProperty("--sheet-drag"), 300);
  }

  dragDistance = 0;
}

sheetDragZone.addEventListener("pointerup", finishSheetDrag);
sheetDragZone.addEventListener("pointercancel", finishSheetDrag);

// 향후 필요한 안내에만 호출할 수 있는 재사용 가능한 토스트 함수입니다.
function showToast(message, duration = 2500) {
  if (!message) return;

  if (toastTimer) {
    window.clearTimeout(toastTimer);
  }

  toast.textContent = message;
  toast.classList.remove("is-visible");

  const revealToast = () => {
    toast.classList.add("is-visible");
  };

  window.requestAnimationFrame(revealToast);
  window.setTimeout(revealToast, 40);

  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, duration);
}

function getCafeById(cafeId) {
  return cafes.find((cafe) => String(cafe.id) === String(cafeId)) || null;
}

// GA4/커스텀 이벤트는 한 곳에서 관리하고, 실제 gtag 로드 여부와 렌더링 상태를 안전하게 처리합니다.
const GA_EVENT_NAMES = new Set([
  "intro_view",
  "cafes_view",
  "purpose_select",
  "filter_change",
  "select_item",
  "view_item",
  "detail_engaged_10s",
  "compare_cafes",
  "map_click",
  "copy_address",
]);

const safeSessionStorage = {
  get(key) {
    try {
      return window.sessionStorage.getItem(key);
    } catch (error) {
      return null;
    }
  },
  set(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch (error) {
      // 저장이 제한된 환경에서도 앱은 계속 동작합니다.
    }
  },
  remove(key) {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      // 저장이 제한된 환경에서도 앱은 계속 동작합니다.
    }
  },
};

function buildCafeSearchQuery(cafeName, address) {
  return encodeURIComponent(`${cafeName} ${address}`);
}

function openMap(provider, cafe) {
  if (!cafe) return;

  const query = buildCafeSearchQuery(cafe.name, cafe.address);
  const urlMap = {
    naver: `https://map.naver.com/p/search/${query}`,
    kakao: `https://map.kakao.com/link/search/${query}`,
  };

  const targetUrl = urlMap[provider];
  if (!targetUrl) return;

  const win = window.open(targetUrl, "_blank", "noopener,noreferrer");
  if (win) {
    win.opener = null;
  }
}

function copyAddressToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "true");
  textArea.style.position = "fixed";
  textArea.style.top = "-9999px";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
  return Promise.resolve();
}

function trackEvent(eventName, parameters = {}) {
  if (!GA_EVENT_NAMES.has(eventName)) return;

  if (typeof window.gtag !== "function") {
    return;
  }

  const safeParameters = {};
  Object.entries(parameters).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      safeParameters[key] = value;
    }
  });

  if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== "G-XXXXXXXXXX") {
    window.gtag("event", eventName, safeParameters);
  }
}

function sendScreenView(view) {
  const eventName = view === "cafes" ? "cafes_view" : "intro_view";
  const screenKey = `${eventName}_sent`;
  if (safeSessionStorage.get(screenKey) === "1") return;

  trackEvent(eventName);
  safeSessionStorage.set(screenKey, "1");
}

function resetScreenViewFlags() {
  safeSessionStorage.remove("intro_view_sent");
  safeSessionStorage.remove("cafes_view_sent");
}

function handleScreenViewTracking(view) {
  if (lastTrackedScreen === view) return;
  lastTrackedScreen = view;
  sendScreenView(view);
}

const detailEngagementState = {
  activeCafeId: null,
  startedAt: 0,
  activeElapsedMs: 0,
  lastVisibilityState: document.visibilityState,
  engagementSent: new Set(),
};

function getCurrentViewedCafeId() {
  return detailEngagementState.activeCafeId;
}

function getCurrentCafeContext() {
  if (detailEngagementState.activeCafeId === null) return null;
  const cafe = cafes.find((entry) => String(entry.id) === String(detailEngagementState.activeCafeId));
  if (!cafe) return null;

  return {
    cafe,
    purpose: selectedPurpose,
  };
}

function updateDetailEngagementTimer() {
  const state = detailEngagementState;
  if (!isDialogOpen || !state.activeCafeId) {
    state.startedAt = 0;
    state.activeElapsedMs = 0;
    return;
  }

  if (document.visibilityState !== "visible") {
    if (state.startedAt) {
      state.activeElapsedMs += Date.now() - state.startedAt;
      state.startedAt = 0;
    }
    return;
  }

  if (!state.startedAt) {
    state.startedAt = Date.now();
  }
}

function resetDetailEngagementState() {
  detailEngagementState.activeCafeId = null;
  detailEngagementState.startedAt = 0;
  detailEngagementState.activeElapsedMs = 0;
}

function scheduleDetailEngagementCheck() {
  if (detailEngagementLoopId) {
    window.clearTimeout(detailEngagementLoopId);
    detailEngagementLoopId = null;
  }

  if (!isDialogOpen || !detailEngagementState.activeCafeId) {
    return;
  }

  if (document.visibilityState !== "visible") {
    detailEngagementState.startedAt = 0;
    return;
  }

  const context = getCurrentCafeContext();
  if (!context) return;

  const key = `${detailEngagementState.activeCafeId}:${selectedPurpose}`;
  if (detailEngagementState.engagementSent.has(key)) return;

  const totalElapsed = detailEngagementState.activeElapsedMs + (detailEngagementState.startedAt ? Date.now() - detailEngagementState.startedAt : 0);
  if (totalElapsed >= 10000) {
    detailEngagementState.engagementSent.add(key);
    trackEvent("detail_engaged_10s", {
      cafe_id: context.cafe.id,
      cafe_name: context.cafe.name,
      purpose: context.purpose,
    });
    return;
  }

  detailEngagementLoopId = window.setTimeout(scheduleDetailEngagementCheck, 250);
}

function handleVisibilityChange() {
  if (!isDialogOpen) return;
  if (document.visibilityState !== "visible") {
    if (detailEngagementState.startedAt) {
      detailEngagementState.activeElapsedMs += Date.now() - detailEngagementState.startedAt;
      detailEngagementState.startedAt = 0;
    }
    return;
  }

  if (detailEngagementState.activeCafeId) {
    detailEngagementState.startedAt = Date.now();
    scheduleDetailEngagementCheck();
  }
}

function readVisitedCafes() {
  const raw = safeSessionStorage.get("kingo_compared_cafes");
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writeVisitedCafes(list) {
  safeSessionStorage.set("kingo_compared_cafes", JSON.stringify(list.slice(-8)));
}

function maybeTrackCompareCafes(cafeId) {
  const visited = readVisitedCafes();
  const unique = [...new Set([...visited, cafeId])];

  if (unique.length >= 2) {
    const compareKey = `compare_cafes_sent:${selectedPurpose}`;
    if (safeSessionStorage.get(compareKey) !== "1") {
      trackEvent("compare_cafes", {
        distinct_cafe_count: 2,
        purpose: selectedPurpose,
      });
      safeSessionStorage.set(compareKey, "1");
    }
  }

  writeVisitedCafes(unique);
}

function setGaMeasurementId(newMeasurementId) {
  if (typeof newMeasurementId !== "string" || !newMeasurementId.trim()) return;
  const safeId = newMeasurementId.trim();
  if (safeId === GA_MEASUREMENT_ID) return;
  if (typeof window !== "undefined") {
    window.GA_MEASUREMENT_ID = safeId;
  }
}

window.GA_MEASUREMENT_ID = GA_MEASUREMENT_ID;
window.trackEvent = trackEvent;
window.showKingoToast = showToast;
window.openMap = openMap;
window.copyAddressToClipboard = copyAddressToClipboard;

// 페이지 로드 시 트렌딩 목적 표시
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderTrendingPurposes);
} else {
  renderTrendingPurposes();
}

function attachDetailActionHandlers() {
  const buttons = document.querySelectorAll(".detail-action-button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const cafe = getCurrentCafeContext()?.cafe;
      if (!cafe) return;

      if (button.dataset.mapProvider === "naver") {
        trackEvent("map_click", {
          cafe_id: cafe.id,
          cafe_name: cafe.name,
          map_provider: "naver",
          purpose: selectedPurpose,
        });
        openMap("naver", cafe);
        return;
      }

      if (button.dataset.mapProvider === "kakao") {
        trackEvent("map_click", {
          cafe_id: cafe.id,
          cafe_name: cafe.name,
          map_provider: "kakao",
          purpose: selectedPurpose,
        });
        openMap("kakao", cafe);
        return;
      }

      if (button.dataset.copyAddress === "true") {
        trackEvent("copy_address", {
          cafe_id: cafe.id,
          cafe_name: cafe.name,
          purpose: selectedPurpose,
        });

        try {
          const copyPromise = copyAddressToClipboard(cafe.address);
          copyPromise
            .then(() => {
              showToast("주소를 복사했어요.");
            })
            .catch(() => {
              showToast("주소를 복사했어요.");
            });
        } catch (error) {
          showToast("주소를 복사했어요.");
        }
      }
    });
  });
}

// 해시에 맞춰 시작 화면과 카페 목록 화면을 판별합니다.
function getViewFromHash() {
  return window.location.hash === "#cafes" ? "cafes" : "intro";
}

function getScreen(view) {
  return view === "cafes" ? cafesScreen : introScreen;
}

function getViewTitle(view) {
  return view === "cafes" ? cafesTitle : introTitle;
}

function setScreenAccessibility(screen, isActive) {
  screen.hidden = !isActive;
  screen.setAttribute("aria-hidden", String(!isActive));
  screen.inert = !isActive;
}

function clearScreenTransitionClasses(screen) {
  screen.classList.remove(
    "screen-enter",
    "screen-leave",
    "screen-transition-active",
    "from-back",
    "to-back",
    "is-transition-screen",
  );
  screen.style.removeProperty("top");
}

// 시작 화면으로 다시 돌아올 때도 여섯 요소의 순차 등장을 재생합니다.
function replayIntroEntrance() {
  if (introReadyTimer) window.clearTimeout(introReadyTimer);

  introScreen.classList.remove("is-intro-ready");
  if (reduceMotion) {
    introScreen.classList.add("is-intro-ready");
    return;
  }

  const revealIntro = () => introScreen.classList.add("is-intro-ready");
  window.requestAnimationFrame(() => window.requestAnimationFrame(revealIntro));

  // 백그라운드 탭 등에서 animation frame이 늦어져도 내용이 투명하게 남지 않게 합니다.
  introReadyTimer = window.setTimeout(revealIntro, 80);
}

function restartCafeCardAnimations() {
  const cards = [...cafeGrid.querySelectorAll(".cafe-card")];
  cards.forEach((card) => card.classList.remove("is-visible"));
  observeCards(cards);
}

function focusViewTitle(view) {
  const title = getViewTitle(view);
  window.setTimeout(() => title.focus({ preventScroll: true }), reduceMotion ? 0 : 40);
}

// URL을 직접 #cafes로 열어도 브라우저 뒤로가기가 시작 화면으로 이어지게 합니다.
function seedViewHistory() {
  if (window.history.state?.kingoView) return;

  const baseUrl = window.location.href.split("#")[0];
  if (window.location.hash === "#cafes") {
    window.history.replaceState({ kingoView: "intro" }, "", `${baseUrl}#intro`);
    window.history.pushState({ kingoView: "cafes" }, "", `${baseUrl}#cafes`);
    return;
  }

  const introUrl = window.location.hash === "#intro" ? `${baseUrl}#intro` : baseUrl;
  window.history.replaceState({ kingoView: "intro" }, "", introUrl);
}

function showViewImmediately(view, { focus = false, resetFilter = false } = {}) {
  if (viewTransitionTimer) {
    window.clearTimeout(viewTransitionTimer);
    viewTransitionTimer = null;
  }

  [introScreen, cafesScreen].forEach(clearScreenTransitionClasses);
  document.body.classList.remove("view-transitioning");

  const activeScreen = getScreen(view);
  const inactiveScreen = getScreen(view === "cafes" ? "intro" : "cafes");
  setScreenAccessibility(activeScreen, true);
  setScreenAccessibility(inactiveScreen, false);
  activeScreen.classList.add("is-current");
  inactiveScreen.classList.remove("is-current");

  currentView = view;
  pendingView = null;
  isViewTransitioning = false;
  rootElement.dataset.initialView = view;
  document.body.classList.toggle("view-intro", view === "intro");
  window.scrollTo(0, 0);

  if (resetFilter) resetFiltersToAll();
  if (view === "intro") replayIntroEntrance();
  else restartCafeCardAnimations();

  handleScreenViewTracking(view);

  if (focus) focusViewTitle(view);
}

// 두 화면을 겹쳐 놓고 opacity와 transform만으로 짧게 전환합니다.
function transitionToView(view, { focus = true } = {}) {
  if (view === currentView || view === pendingView) return;

  if (isViewTransitioning) {
    showViewImmediately(view, { focus, resetFilter: view === "intro" });
    return;
  }

  isViewTransitioning = true;
  pendingView = view;

  const previousView = currentView;
  const sourceScreen = getScreen(previousView);
  const targetScreen = getScreen(view);
  const isReturning = view === "intro";
  const previousScrollY = previousView === "cafes" ? window.scrollY : 0;

  document.body.classList.add("view-transitioning");
  document.body.classList.remove("view-intro");
  setScreenAccessibility(targetScreen, true);
  sourceScreen.inert = true;

  sourceScreen.classList.add("is-transition-screen", "screen-leave");
  targetScreen.classList.add("is-transition-screen", "screen-enter");
  if (previousView === "cafes") sourceScreen.style.top = `-${previousScrollY}px`;
  if (isReturning) {
    sourceScreen.classList.add("to-back");
    targetScreen.classList.add("from-back");
    replayIntroEntrance();
  } else {
    restartCafeCardAnimations();
  }

  const startTransition = () => {
    sourceScreen.classList.add("screen-transition-active");
    targetScreen.classList.add("screen-transition-active");
  };

  window.requestAnimationFrame(() => window.requestAnimationFrame(startTransition));
  window.setTimeout(startTransition, 60);

  const finishTransition = () => {
    if (pendingView !== view) return;

    setScreenAccessibility(sourceScreen, false);
    setScreenAccessibility(targetScreen, true);
    sourceScreen.classList.remove("is-current");
    targetScreen.classList.add("is-current");
    clearScreenTransitionClasses(sourceScreen);
    clearScreenTransitionClasses(targetScreen);

    currentView = view;
    pendingView = null;
    isViewTransitioning = false;
    viewTransitionTimer = null;
    rootElement.dataset.initialView = view;
    document.body.classList.remove("view-transitioning");
    document.body.classList.toggle("view-intro", view === "intro");
    window.scrollTo(0, 0);

    if (view === "intro") resetFiltersToAll();

    if (focus) focusViewTitle(view);
  };

  viewTransitionTimer = window.setTimeout(finishTransition, reduceMotion ? 0 : 540);
}

function routeToCurrentHash() {
  const requestedView = getViewFromHash();
  if (requestedView === currentView || requestedView === pendingView) return;

  if (isDialogOpen) {
    closeDetailPanel({
      restoreFocus: false,
      onClosed: () => transitionToView(requestedView),
    });
    return;
  }

  transitionToView(requestedView);
}

purposeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (currentView === "cafes" || isViewTransitioning) return;

    selectPurpose(button.dataset.purpose, { refreshCards: false, selectionLocation: "intro" });
    renderCafes(cafes);
    window.history.pushState({ kingoView: "cafes", purpose: selectedPurpose }, "", "#cafes");
    transitionToView("cafes");
  });
});

backToIntroButton.addEventListener("click", () => {
  if (currentView !== "cafes" || isViewTransitioning) return;
  window.history.back();
});

window.addEventListener("popstate", routeToCurrentHash);
window.addEventListener("hashchange", routeToCurrentHash);
document.addEventListener("visibilitychange", handleVisibilityChange);

// 카드 데이터는 미리 만들되, 현재 해시에 해당하는 화면만 표시합니다.
seedViewHistory();
updatePurposeInterface();
renderCafes(cafes);
showViewImmediately(getViewFromHash());
attachDetailActionHandlers();
