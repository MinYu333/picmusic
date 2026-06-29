# 픽뮤직 (PicMusic) 개발 진행 현황

## 프로젝트 개요

사진을 업로드하면 AI가 분위기를 분석해 어울리는 노래를 YouTube에서 찾아주는 정적 웹사이트.

- **사이트명**: 픽뮤직 (PicMusic)
- **배포 목표**: Cloudflare Pages (서버 운영비 0원)
- **수익화 목표**: Google 애드센스

---

## 기술 스택

| 역할 | 도구 |
|---|---|
| 이미지 분석 | Claude API (claude-haiku-4-5-20251001) |
| 음악 검색 | YouTube Data API v3 |
| 프론트엔드 | HTML / CSS / JS (정적) |
| 배포 | Cloudflare Pages |
| 로컬 테스트 | VS Code + Live Server |

---

## 생성된 파일 목록

```
music_find/
├── index.html          ← 메인 페이지 (업로드 + 결과 + FAQ)
├── about.html          ← 사이트 소개 (애드센스 심사 대비)
├── privacy.html        ← 개인정보처리방침 (애드센스 심사 필수)
├── sitemap.xml         ← SEO
├── robots.txt          ← SEO
├── config.js           ← API 키 설정 파일 (← 여기에 키 입력 필요)
├── css/
│   └── style.css       ← 전체 스타일 (다크 테마)
└── js/
    └── main.js         ← 핵심 로직
```

---

## 사용자 흐름

1. 사진 업로드 (드래그 앤 드롭 또는 클릭)
2. "어울리는 노래 찾기" 버튼 클릭
3. Claude API가 사진의 분위기·색감·감정 분석
4. YouTube API로 키워드 검색 (키워드 3개 × 2개 결과 = 최대 6개)
5. 영상 카드 표시 → 클릭하면 즉시 재생

---

## 현재 상태

- [x] 전체 파일 구조 생성 완료
- [x] UI 구현 완료 (다크 테마, 반응형)
- [x] Claude API 연동 코드 완료
- [x] YouTube API 연동 코드 완료
- [x] 애드센스 심사 대비 페이지 완료 (about, privacy, FAQ, sitemap)
- [ ] **config.js에 실제 API 키 입력 필요** ← 현재 단계
- [ ] 로컬 Live Server에서 테스트
- [ ] GitHub 저장소 생성 및 업로드
- [ ] Cloudflare Pages 배포
- [ ] sitemap.xml / robots.txt / canonical 태그에 실제 도메인 주소 교체
- [ ] Google 서치 콘솔 등록
- [ ] 네이버 서치 어드바이저 등록
- [ ] Google 애드센스 심사 신청

---

## API 키 발급 방법

### Claude API 키
1. console.anthropic.com 접속 및 로그인
2. 좌측 메뉴 `API Keys` 클릭
3. `Create Key` 버튼 클릭
4. 생성된 키를 `config.js`의 `CLAUDE_API_KEY`에 입력

### YouTube Data API 키
1. console.cloud.google.com 접속 및 로그인
2. 상단 검색창에 `YouTube Data API v3` 검색
3. `사용 설정` 클릭
4. 좌측 메뉴 `사용자 인증 정보` → `사용자 인증 정보 만들기` → `API 키`
5. 생성된 키를 `config.js`의 `YOUTUBE_API_KEY`에 입력

### config.js 수정 예시
```js
const CONFIG = {
  CLAUDE_API_KEY: 'sk-ant-api03-xxxxxx',   // ← 실제 키 입력
  YOUTUBE_API_KEY: 'AIzaSyxxxxxx',          // ← 실제 키 입력
};
```

---

## 비용 참고

| 항목 | 비용 |
|---|---|
| Claude API (사진 1장 분석) | 약 0.003~0.01원 |
| YouTube Data API | 하루 100회 검색까지 무료 |
| Cloudflare Pages 호스팅 | 무료 |
| GitHub | 무료 |

---

## 배포 후 할 일

1. `sitemap.xml`, `robots.txt`, 각 HTML 파일의 `canonical` 태그에서  
   `https://your-domain.pages.dev` → 실제 배포 주소로 교체

2. Google 서치 콘솔에 사이트 등록 및 sitemap 제출

3. 네이버 서치 어드바이저에 사이트 등록

4. 애드센스 심사 신청 전 체크리스트:
   - 실제로 작동하는 기능이 있는가
   - 페이지 내용이 충분한가 (FAQ, 소개, 사용법)
   - 개인정보처리방침 페이지가 있는가
