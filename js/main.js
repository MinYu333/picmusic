'use strict';

// ===== STATE =====
let currentFile = null;
let faceApiReady = false;
let currentSong = null;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  const uploadBox = document.getElementById('uploadBox');
  const fileInput = document.getElementById('fileInput');

  uploadBox.addEventListener('dragover', e => {
    e.preventDefault();
    uploadBox.classList.add('drag-over');
  });
  uploadBox.addEventListener('dragleave', () => {
    uploadBox.classList.remove('drag-over');
  });
  uploadBox.addEventListener('drop', e => {
    e.preventDefault();
    uploadBox.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  uploadBox.addEventListener('click', () => {
    if (!currentFile) fileInput.click();
  });
  document.getElementById('uploadTrigger').addEventListener('click', e => {
    e.stopPropagation();
    fileInput.click();
  });

  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  });

  document.getElementById('findBtn').addEventListener('click', startAnalysis);
  document.getElementById('resetBtn').addEventListener('click', reset);
});

// ===== FILE HANDLING =====
function handleFile(file) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.type)) {
    alert('JPG, PNG, WEBP 이미지 파일만 업로드 가능합니다.');
    return;
  }
  currentFile = file;
  const reader = new FileReader();
  reader.onload = e => {
    const preview = document.getElementById('previewImg');
    preview.src = e.target.result;
    preview.classList.remove('hidden');
    document.getElementById('uploadPlaceholder').classList.add('hidden');
    document.getElementById('actionArea').classList.remove('hidden');
    document.getElementById('resultSection').classList.add('hidden');
  };
  reader.readAsDataURL(file);
}

function reset() {
  currentFile = null;
  currentSong = null;
  const fileInput = document.getElementById('fileInput');
  fileInput.value = '';
  document.getElementById('previewImg').classList.add('hidden');
  document.getElementById('previewImg').src = '';
  document.getElementById('uploadPlaceholder').classList.remove('hidden');
  document.getElementById('actionArea').classList.add('hidden');
  document.getElementById('resultSection').classList.add('hidden');
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('findBtn').disabled = false;
  document.getElementById('shareArea').classList.add('hidden');
}

// ===== FACE-API.JS (lazy load) =====
function loadFaceApiScript() {
  return new Promise((resolve, reject) => {
    if (window.faceapi) { resolve(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function initFaceApi() {
  if (faceApiReady) return true;
  try {
    await loadFaceApiScript();
    const MODEL_URL = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights';
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);
    faceApiReady = true;
    return true;
  } catch {
    return false;
  }
}

// 표정 → { mood, brightness }
async function detectFaceMood(imgEl) {
  const loaded = await initFaceApi();
  if (!loaded) return null;
  try {
    const result = await faceapi
      .detectSingleFace(imgEl, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.4 }))
      .withFaceExpressions();
    if (!result) return null;

    const exp = result.expressions;
    const [topExp, topScore] = Object.entries(exp).sort(([, a], [, b]) => b - a)[0];
    if (topScore < 0.4) return null;

    const moodMap = {
      happy: 'energetic', surprised: 'energetic',
      sad: 'emotional',   fearful: 'emotional',
      angry: 'intense',   disgusted: 'intense',
      neutral: null,
    };
    const brightnessMap = {
      happy: 'bright', surprised: 'bright',
      sad: 'dark',     fearful: 'dark',
      angry: 'dark',   disgusted: 'dark',
      neutral: null,
    };
    const mood       = moodMap[topExp] ?? null;
    const brightness = brightnessMap[topExp] ?? null;
    return mood ? { mood, brightness } : null;
  } catch {
    return null;
  }
}

// ===== COLOR → MOOD + BRIGHTNESS =====
// bucket: 0=빨강 1=주황 2=노랑 3=초록 4=청록 5=파랑 6=보라 7=분홍
function getColorMood(h, s, l, isHighContrast, bucket) {
  const scores = { energetic: 4, emotional: 4, intense: 4, dreamy: 4 };

  if (l > 0.6)      { scores.energetic += 2; scores.dreamy += 1; }
  else if (l > 0.4) { scores.energetic += 1; scores.dreamy += 1; }
  else if (l > 0.2) { scores.emotional += 2; scores.intense += 1; }
  else              { scores.intense += 2; scores.emotional += 1; }

  if (s > 0.5)      { scores.energetic += 2; scores.intense += 1; }
  else if (s > 0.25){ scores.energetic += 1; scores.dreamy += 1; }
  else              { scores.emotional += 2; scores.dreamy += 1; }

  if (isHighContrast) { scores.intense += 1; scores.energetic += 1; }
  else                { scores.dreamy  += 1; scores.emotional += 1; }

  if (bucket <= 2)      { scores.energetic += 1; }
  else if (bucket <= 5) { scores.dreamy += 1; }
  else                  { scores.emotional += 1; }

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  for (const [mood, score] of Object.entries(scores)) {
    rand -= score;
    if (rand <= 0) return mood;
  }
  return 'energetic';
}

function getImageBrightness(l) {
  if (l > 0.55) return 'bright';
  if (l < 0.35) return 'dark';
  return 'neutral';
}

const SEARCH_STEPS = [
  { text: '사진 분위기 분석 중...', sub: '빛, 색감, 표정을 읽고 있어요' },
  { text: '감정 해석 중...', sub: '사진의 무드를 파악하고 있어요' },
  { text: '음악 데이터베이스 탐색 중...', sub: '1,000곡 중에서 찾고 있어요' },
  { text: '딱 맞는 노래 찾는 중...', sub: '거의 다 됐어요' },
  { text: '찾았다!', sub: '' },
];

// ===== MAIN ANALYSIS FLOW =====
async function startAnalysis() {
  if (!currentFile) return;

  if (typeof MUSIC_DB === 'undefined' || Object.values(MUSIC_DB).every(a => a.length === 0)) {
    alert('음악 DB가 비어있습니다.\nupdater/ 폴더에서 스크립트를 실행해 주세요.');
    return;
  }

  setLoading(true);
  document.getElementById('resultSection').classList.add('hidden');

  let mood, videos;
  try {
    const imgEl = document.getElementById('previewImg');

    // 캔버스 분석 + 얼굴 인식 병렬 실행
    const [canvasResult, faceMood] = await Promise.all([
      analyzeWithCanvas(currentFile),
      detectFaceMood(imgEl),
    ]);

    // 얼굴 표정이 명확하면 우선, 아니면 색감 기반
    const imageBrightness = faceMood?.brightness ?? getImageBrightness(canvasResult.l);
    mood = faceMood?.mood ?? canvasResult.mood;
    videos = pickVideos(mood, imageBrightness);
  } catch (err) {
    setLoading(false);
    console.error('[픽뮤직]', err);
    alert('오류가 발생했습니다.\n' + err.message);
    return;
  }

  await runSearchAnimation();

  setLoading(false);
  renderResults(mood, videos);
}

async function runSearchAnimation() {
  const textEl = document.getElementById('loadingText');
  const subEl  = document.getElementById('loadingSub');
  const waveEl = document.getElementById('waveform');

  function setMsg(text, sub, isFinal) {
    textEl.classList.remove('found-text');
    textEl.style.animation = 'none';
    subEl.style.animation  = 'none';
    void textEl.offsetWidth;
    textEl.style.animation = '';
    subEl.style.animation  = '';
    textEl.textContent = text;
    subEl.textContent  = sub;
    if (isFinal) {
      textEl.classList.add('found-text');
      waveEl.classList.add('found');
    }
  }

  for (let i = 0; i < SEARCH_STEPS.length; i++) {
    const { text, sub } = SEARCH_STEPS[i];
    const isFinal = i === SEARCH_STEPS.length - 1;
    setMsg(text, sub, isFinal);
    await new Promise(r => setTimeout(r, isFinal ? 700 : 1050));
  }
}

// ===== MUSIC DB에서 영상 선택 =====
function pickVideos(mood, brightness) {
  const pool = MUSIC_DB[mood] || [];
  const base = pool.length >= 1 ? pool : Object.values(MUSIC_DB).flat();

  // brightness 태그가 일치하는 곡만 추린 서브풀 (최소 5곡 이상일 때만 사용)
  const filtered = brightness
    ? base.filter(s => s.tags?.brightness === brightness)
    : [];
  const source = filtered.length >= 5 ? filtered : base;

  return [[...source].sort(() => Math.random() - 0.5)[0]];
}

// ===== CANVAS 색상 분석 =====
function analyzeWithCanvas(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const SIZE = 60;
      const canvas = document.createElement('canvas');
      canvas.width = SIZE; canvas.height = SIZE;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, SIZE, SIZE);

      const data = ctx.getImageData(0, 0, SIZE, SIZE).data;
      let rSum = 0, gSum = 0, bSum = 0, count = 0;
      const brightnessValues = [];
      const hueBuckets = new Array(8).fill(0);

      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 128) continue;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        rSum += r; gSum += g; bSum += b; count++;
        const { h, s, l } = rgbToHsl(r, g, b);
        brightnessValues.push(l);
        if (s > 0.15) hueBuckets[Math.floor(h / 45) % 8]++;
      }

      if (count === 0) { reject(new Error('이미지를 분석할 수 없습니다.')); return; }

      const { h: avgH, s: avgS, l: avgL } = rgbToHsl(rSum / count, gSum / count, bSum / count);
      const avgBrightness = brightnessValues.reduce((a, b) => a + b, 0) / brightnessValues.length;
      const variance = brightnessValues.reduce((acc, v) => acc + (v - avgBrightness) ** 2, 0) / brightnessValues.length;
      const isHighContrast = variance > 0.04;
      const dominantBucket = hueBuckets.indexOf(Math.max(...hueBuckets));

      resolve({ mood: getColorMood(avgH, avgS, avgL, isHighContrast, dominantBucket), l: avgL });
    };

    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('이미지 로드 실패')); };
    img.src = url;
  });
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: h * 360, s, l };
}

// ===== RENDER =====
function renderResults(mood, videos) {
  const grid = document.getElementById('songsGrid');
  grid.innerHTML = '';

  if (videos.length === 0 || !videos[0]) {
    grid.innerHTML = '<p class="no-results">어울리는 노래를 찾지 못했습니다. 다른 사진을 시도해보세요.</p>';
    document.getElementById('shareArea').classList.add('hidden');
  } else {
    currentSong = videos[0];
    videos.forEach(video => grid.appendChild(createVideoCard(video)));
    buildShareCard(currentFile, currentSong);
  }

  const section = document.getElementById('resultSection');
  section.classList.remove('hidden');
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== SHARE CARD =====
function buildShareCard(file, song) {
  const canvas = document.getElementById('shareCanvas');
  const W = 1080, H = 1080;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // 사진 로드 후 카드 그리기
  const img = new Image();
  const url = URL.createObjectURL(file);
  img.onload = () => {
    URL.revokeObjectURL(url);
    drawShareCard(ctx, W, H, img, song);
    setupShareButtons(canvas, song);
  };
  img.src = url;
}

function drawShareCard(ctx, W, H, photo, song) {
  // 배경 그라디언트
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#09090f');
  bg.addColorStop(1, '#140d24');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 사용자 사진 (상단 60%)
  const PAD = 44;
  const PW = W - PAD * 2;
  const PH = Math.round(H * 0.58);
  const PY = PAD;
  ctx.save();
  rrect(ctx, PAD, PY, PW, PH, 36);
  ctx.clip();
  // cover fit
  const s = Math.max(PW / photo.width, PH / photo.height);
  const dw = photo.width * s, dh = photo.height * s;
  ctx.drawImage(photo, PAD + (PW - dw) / 2, PY + (PH - dh) / 2, dw, dh);
  ctx.restore();

  // 사진 하단 페이드
  const fade = ctx.createLinearGradient(0, PY + PH - 120, 0, PY + PH);
  fade.addColorStop(0, 'rgba(9,9,15,0)');
  fade.addColorStop(1, 'rgba(9,9,15,0.55)');
  ctx.fillStyle = fade;
  ctx.save();
  rrect(ctx, PAD, PY + PH - 120, PW, 120, 36);
  ctx.fill();
  ctx.restore();

  // 구분선
  const lineY = PY + PH + 52;
  ctx.strokeStyle = 'rgba(124,58,237,0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD + 40, lineY);
  ctx.lineTo(W - PAD - 40, lineY);
  ctx.stroke();

  // 음표 아이콘
  ctx.fillStyle = '#a78bfa';
  ctx.font = '40px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('♫', W / 2, lineY + 52);

  // 곡 제목 / 아티스트 분리
  const dashIdx = song.title.lastIndexOf(' - ');
  const songName  = dashIdx >= 0 ? song.title.slice(0, dashIdx) : song.title;
  const artistName = dashIdx >= 0 ? song.title.slice(dashIdx + 3) : '';

  const FONT = "'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif";

  // 곡 제목
  ctx.fillStyle = '#f1f5f9';
  ctx.textBaseline = 'alphabetic';
  const titleSize = fitFontSize(ctx, songName, `bold 60px ${FONT}`, W - PAD * 2 - 40, 60, 36);
  ctx.font = `bold ${titleSize}px ${FONT}`;
  ctx.fillText(clamp(ctx, songName, W - PAD * 2 - 40), W / 2, lineY + 130);

  // 아티스트
  if (artistName) {
    ctx.fillStyle = '#a78bfa';
    ctx.font = `500 40px ${FONT}`;
    ctx.fillText(clamp(ctx, artistName, W - PAD * 2 - 40), W / 2, lineY + 195);
  }

  // 브랜딩
  ctx.fillStyle = 'rgba(100,116,139,0.7)';
  ctx.font = `26px ${FONT}`;
  ctx.fillText('picmusic.pages.dev', W / 2, H - 44);
}

function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function fitFontSize(ctx, text, baseFont, maxW, startSize, minSize) {
  let size = startSize;
  while (size > minSize) {
    ctx.font = baseFont.replace(/\d+px/, size + 'px');
    if (ctx.measureText(text).width <= maxW) break;
    size -= 2;
  }
  return size;
}

function clamp(ctx, text, maxW) {
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 0 && ctx.measureText(t + '…').width > maxW) t = t.slice(0, -1);
  return t + '…';
}

function setupShareButtons(canvas, song) {
  document.getElementById('shareArea').classList.remove('hidden');

  // 이미지 저장
  document.getElementById('savePngBtn').onclick = () => {
    const a = document.createElement('a');
    a.download = 'picmusic.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  // X 공유
  const text = encodeURIComponent(`내 사진에 어울리는 노래를 찾았어요 🎵\n${song.title}\n\n#픽뮤직`);
  const url  = encodeURIComponent('https://picmusic.pages.dev');
  document.getElementById('xShareBtn').onclick = () => {
    window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
  };

  // Web Share API (모바일)
  const nativeBtn = document.getElementById('nativeShareBtn');
  if (navigator.share) {
    nativeBtn.classList.remove('hidden');
    nativeBtn.onclick = async () => {
      try {
        canvas.toBlob(async blob => {
          const file = new File([blob], 'picmusic.png', { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: '픽뮤직', text: song.title });
          } else {
            await navigator.share({ title: '픽뮤직', text: song.title, url: 'https://picmusic.pages.dev' });
          }
        }, 'image/png');
      } catch {}
    };
  } else {
    nativeBtn.classList.add('hidden');
  }
}

function createVideoCard(video) {
  const { id, title } = video;
  const thumb = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;

  const card = document.createElement('div');
  card.className = 'video-card';
  card.innerHTML = `
    <div class="video-thumb-wrap">
      <img src="${escHtml(thumb)}" alt="${escHtml(title)}" class="video-thumb" loading="lazy">
      <div class="play-overlay">▶</div>
    </div>
    <div class="video-info">
      <p class="video-title">${escHtml(title)}</p>
    </div>
  `;

  card.addEventListener('click', () => {
    card.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=1"
        title="${escHtml(title)}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    `;
    card.classList.add('playing');
  });

  return card;
}

// ===== UTILS =====
function setLoading(show) {
  const el = document.getElementById('loading');
  if (show) {
    document.getElementById('waveform').classList.remove('found');
    document.getElementById('loadingText').classList.remove('found-text');
    document.getElementById('loadingText').textContent = '';
    document.getElementById('loadingSub').textContent = '';
    el.classList.remove('hidden');
    document.getElementById('findBtn').disabled = true;
  } else {
    el.classList.add('hidden');
    document.getElementById('findBtn').disabled = false;
  }
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
