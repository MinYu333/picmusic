'use strict';

const I18N = {
  ko: {
    'hero.title': '나에게 어울리는 노래를<br>찾아드립니다',
    'hero.sub': '내 사진을 올리면 분위기에 맞는 노래를<br>YouTube에서 바로 틀어드려요',
    'upload.main': '내 사진을 드래그하거나 클릭해서 업로드',
    'upload.hint': '셀카, 인물 사진 · JPG · PNG · WEBP',
    'upload.btn': '사진 선택',
    'find.btn': '어울리는 노래 찾기',
    'reset.btn': '다른 사진 사용',
    'save.btn': '이미지 저장',
    'x.btn': 'X에 공유',
    'native.btn': '공유하기',
    'howto.title': '이렇게 사용하세요',
    'step1.title': '사진 업로드',
    'step1.desc': '셀카, 인물 사진 어떤 사진이든 OK',
    'step2.title': '색감 분석',
    'step2.desc': '사진의 색감·밝기·분위기를 자동으로 읽어냄',
    'step3.title': '노래 추천',
    'step3.desc': 'YouTube에서 딱 맞는 노래를 골라드림',
    'faq.title': '자주 묻는 질문',
    'faq1.q': '어떤 사진을 올리면 좋나요?',
    'faq1.a': '셀카, 여행 사진, 일상 사진 등 내가 찍힌 사진이면 무엇이든 좋습니다. 표정이나 배경의 색감과 분위기를 읽어 어울리는 노래를 골라드립니다.',
    'faq2.q': '업로드한 사진이 저장되나요?',
    'faq2.a': '아니요. 업로드한 사진은 AI 분석에만 사용되며 어떠한 서버에도 저장되지 않습니다. 분석이 끝나면 즉시 사라집니다.',
    'faq3.q': '무료로 이용할 수 있나요?',
    'faq3.a': '네, 완전 무료입니다. 별도 회원가입도 필요 없습니다.',
    'faq4.q': '노래가 마음에 안 들면 어떻게 하나요?',
    'faq4.a': '같은 사진으로 다시 분석을 요청하면 다른 결과가 나올 수 있습니다. 또는 다른 사진을 시도해보세요.',
    'faq5.q': '어떤 장르의 음악이 추천되나요?',
    'faq5.a': 'K-POP, 인디, 재즈, 클래식, 팝, Lo-fi, OST 등 사진 분위기에 따라 장르에 관계없이 어울리는 음악을 추천합니다.',
    'modal.title': '음악 신청',
    'modal.sub': '추가했으면 하는 노래를 알려주세요.',
    'modal.song': '곡명',
    'modal.artist': '아티스트',
    'modal.submit': '신청하기',
    'modal.success': '감사합니다! 검토 후 추가할게요 😊',
    'nav.logo': '픽뮤직',
    'nav.home': '홈',
    'nav.music': '음악 목록',
    'nav.about': '소개',
    'nav.privacy': '개인정보처리방침',
    'nav.request': '음악 신청',
    'no.results': '어울리는 노래를 찾지 못했습니다. 다른 사진을 시도해보세요.',
    'music.title': '음악 목록',
    'music.search': '곡명 또는 아티스트 검색',
    'music.nomatch': '검색 결과가 없습니다.',
    'music.total': '총 {count}곡',
    'music.found': '{count}곡 검색됨',
    'alert.type': 'JPG, PNG, WEBP 이미지 파일만 업로드 가능합니다.',
    'alert.size': '파일 크기는 20MB 이하여야 합니다.',
    'alert.error': '오류가 발생했습니다.\n',
    'share.tweet': '내 사진에 어울리는 노래를 찾았어요 🎵\n{title}\n\n#픽뮤직',
    searchSteps: [
      { text: '사진 분위기 분석 중...', sub: '빛, 색감, 표정을 읽고 있어요' },
      { text: '감정 해석 중...', sub: '사진의 무드를 파악하고 있어요' },
      { text: '음악 데이터베이스 탐색 중...', sub: '1,000곡 중에서 찾고 있어요' },
      { text: '딱 맞는 노래 찾는 중...', sub: '거의 다 됐어요' },
      { text: '찾았다!', sub: '' },
    ],
  },
  en: {
    'hero.title': 'Find the perfect song<br>for your photo',
    'hero.sub': "Upload your photo and we'll find a matching song<br>from YouTube instantly",
    'upload.main': 'Drag & drop or click to upload your photo',
    'upload.hint': 'Selfie, portrait · JPG · PNG · WEBP',
    'upload.btn': 'Choose Photo',
    'find.btn': 'Find My Song',
    'reset.btn': 'Try Another Photo',
    'save.btn': 'Save Image',
    'x.btn': 'Share on X',
    'native.btn': 'Share',
    'howto.title': 'How it works',
    'step1.title': 'Upload Photo',
    'step1.desc': 'Any photo — selfie, portrait, scenery',
    'step2.title': 'Color Analysis',
    'step2.desc': 'Reads colors, brightness & mood automatically',
    'step3.title': 'Song Match',
    'step3.desc': 'Picks the perfect matching song from YouTube',
    'faq.title': 'FAQ',
    'faq1.q': 'What kind of photos work best?',
    'faq1.a': 'Any photo with you in it — selfies, travel, daily shots. The app reads facial expressions and color tones to find a matching song.',
    'faq2.q': 'Is my photo saved anywhere?',
    'faq2.a': 'No. Your photo is used only for analysis and is never stored on any server. It disappears immediately after analysis.',
    'faq3.q': 'Is it free?',
    'faq3.a': 'Yes, completely free. No sign-up required.',
    'faq4.q': "What if I don't like the song?",
    'faq4.a': 'Try analyzing the same photo again for a different result, or upload a different photo.',
    'faq5.q': 'What genres are recommended?',
    'faq5.a': "K-POP, indie, jazz, classical, pop, Lo-fi, OST — we match based on your photo's mood, not genre.",
    'modal.title': 'Request a Song',
    'modal.sub': "Let us know a song you'd like to add.",
    'modal.song': 'Song title',
    'modal.artist': 'Artist',
    'modal.submit': 'Submit',
    'modal.success': "Thank you! We'll review and add it. 😊",
    'nav.logo': 'PicMusic',
    'nav.home': 'Home',
    'nav.music': 'Music List',
    'nav.about': 'About',
    'nav.privacy': 'Privacy Policy',
    'nav.request': 'Request Song',
    'no.results': 'No matching song found. Try a different photo.',
    'music.title': 'Music List',
    'music.search': 'Search by song or artist',
    'music.nomatch': 'No results found.',
    'music.total': '{count} songs',
    'music.found': '{count} results',
    'alert.type': 'Only JPG, PNG, or WEBP image files are allowed.',
    'alert.size': 'File size must be 20MB or less.',
    'alert.error': 'An error occurred.\n',
    'share.tweet': 'Found a song that matches my photo! 🎵\n{title}\n\n#picmusic',
    searchSteps: [
      { text: 'Analyzing photo mood...', sub: 'Reading light, colors & expressions' },
      { text: 'Interpreting emotions...', sub: 'Figuring out the vibe of your photo' },
      { text: 'Searching music database...', sub: 'Looking through 1,000+ songs' },
      { text: 'Finding the perfect match...', sub: 'Almost there' },
      { text: 'Found it!', sub: '' },
    ],
  },
};

function getLang() {
  const saved = localStorage.getItem('picmusic-lang');
  if (saved === 'ko' || saved === 'en') return saved;
  return navigator.language.startsWith('ko') ? 'ko' : 'en';
}

function applyLang(lang) {
  const t = I18N[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) el.placeholder = t[key];
  });
  const btn = document.getElementById('langToggle');
  if (btn) btn.textContent = lang === 'ko' ? 'EN' : '한국어';
  document.documentElement.lang = lang === 'ko' ? 'ko' : 'en';
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

document.addEventListener('DOMContentLoaded', () => {
  applyLang(getLang());
  const btn = document.getElementById('langToggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const next = getLang() === 'ko' ? 'en' : 'ko';
      localStorage.setItem('picmusic-lang', next);
      applyLang(next);
      const navLinks = document.querySelector('.nav-links');
      if (navLinks) navLinks.classList.remove('open');
      const navToggle = document.getElementById('navToggle');
      if (navToggle) navToggle.textContent = '☰';
    });
  }
});

window.getLang = getLang;
window.I18N = I18N;
