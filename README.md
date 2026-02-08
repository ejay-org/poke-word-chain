# 🎤 포켓몬 음성 끝말잇기 (Pokemon Voice Shiritori)

사용자의 음성을 인식하고, AI가 포켓몬 마스터의 목소리로 끝말잇기를 받아쳐 주는 인터랙티브 웹 애플리케이션입니다. 오직 **포켓몬 이름**으로만 대결이 가능합니다.

---

## ✨ 핵심 기능 (Core Features)

- **정밀 음성 인식 (STT):** Groq API를 사용하여 복잡한 포켓몬 이름도 정확하게 인식합니다.
- **포켓몬 전용 엔진:** 1세대부터 9세대까지의 포켓몬 데이터를 기반으로 단어의 유효성을 즉시 검증합니다.
- **지능형 끝말잇기 로직:** 한국어 특유의 두음법칙(예: '리' → '이')을 완벽하게 지원합니다.
- **AI 페르소나 응답 (LLM):** Google Gemini API가 단순 단어 제시를 넘어, 포켓몬 마스터다운 위트 있는 대화를 생성합니다.
- **실시간 음성 출력 (TTS):** Web Speech API를 통해 AI의 대답을 브라우저 내장 음성으로 즉시 출력합니다.

---

## 🛠 기술 스택 (Tech Stack)

- **Frontend:** React (Vite), Tailwind CSS
- **Audio Interface:** Web MediaRecorder API
- **AI Engine:**
  - **Groq API** (Voice to Text - Whisper 모델)
  - **Google Gemini API** (Game Logic & Persona)
  - **Web Speech API** (Text to Voice - 브라우저 내장)
- **Deployment:** Vercel (HTTPS 환경 필수)
- **Local Logic:** `gameLogic.ts` - 단어 검증 및 끝말잇기 규칙 처리 (포켓몬 DB 기반)

---

## ⚖️ 게임 규칙 (Game Rules)

1. **단어 제한:** 오직 공식 한국어 포켓몬 이름만 사용할 수 있습니다.
2. **끝말잇기:** 이전 단어의 마지막 글자로 시작하는 단어를 말해야 합니다.
3. **두음법칙 허용:** 'ㄹ', 'ㄴ'으로 시작하는 단어에 대해 한국어 맞춤법에 따른 두음법칙을 적용합니다. (예: '리'로 끝나면 '이'로 시작 가능)
4. **중복 금지:** 한 게임 내에서 이미 사용된 단어는 다시 사용할 수 없습니다.
5. **시간 제한:** 사용자가 일정 시간 내에 응답하지 못하거나 틀린 단어를 말하면 게임이 종료됩니다.

---

## 🚀 시작하기 (Setup)

### 1. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 아래 내용을 입력합니다.
```env
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
