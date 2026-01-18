# 🚀 개발 로드맵 (Phase 13)

## Phase 1: 기반 설정 및 데이터
- [ ] **Step 1**: Vite + React + Tailwind CSS 프로젝트 초기화.
- [ ] **Step 2**: 1~9세대 한국어 포켓몬 이름이 포함된 `pokemonData.json` 구축.
- [ ] **Step 3**: 포켓몬 도감 컨셉의 UI 레이아웃 및 테마 색상(Red) 적용.

## Phase 2: 핵심 게임 엔진 (Local Logic)
- [ ] **Step 4**: 단어 검증 로직(`validateWord`) 구현 (DB 존재 여부, 중복 체크).
- [ ] **Step 5**: 끝말 연결 및 한국어 두음법칙 처리 로직 구현.
- [ ] **Step 6**: AI가 다음 단어를 찾는 자동 검색 알고리즘 구현.
- [ ] **Step 7**: **[New] 힌트 생성 알고리즘 구현** (규칙에 맞는 미사용 단어 하나 추출).

## Phase 3: AI 인터페이스 통합 (Audio & API)
- [ ] **Step 8**: Groq API 연동을 통한 실시간 STT 구현.
- [ ] **Step 9**: Web Speech API를 활용한 즉각적인 TTS 음성 출력 구현.
- [ ] **Step 10**: Google Gemini API 연동 및 하이브리드 응답 프롬프트 설계.

## Phase 4: UX 고도화 및 폴리싱
- [ ] **Step 11**: 음성 인식 중 상태 표시 및 대화 히스토리 UI.
- [ ] **Step 12**: **[New] 힌트 요청 전용 대화 프롬프트 최적화**.
- [ ] **Step 13**: 게임 종료 처리(패배/승리) 및 애니메이션 효과 추가.