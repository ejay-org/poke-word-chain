# Vercel 배포 가이드

이 프로젝트는 Vite + React 기반으로, Vercel에 매우 쉽게 배포할 수 있습니다.

## 1. 사전 준비
- GitHub에 최신 코드가 푸시되어 있어야 합니다. (이미 완료됨)
- [Vercel](https://vercel.com/) 계정이 필요합니다.

## 2. 배포 단계

1. **Vercel 로그인**: [https://vercel.com/](https://vercel.com/) 에 로그인합니다.
2. **새 프로젝트 추가**:
    - 대시보드 우측 상단의 **"Add New..."** 버튼 클릭 -> **"Project"** 선택.
    - **"Import Git Repository"**에서 본인의 GitHub 레포지토리(`poke-word-chain`)를 찾아 **"Import"** 클릭.
3. **프로젝트 설정 (Configure Project)**:
    - **Framework Preset**: `Vite` (자동으로 감지될 것입니다).
    - **Root Directory**: `./` (기본값).
    - **Build Command**: `npm run build` (기본값).
    - **Output Directory**: `dist` (기본값).
4. **환경 변수 설정 (중요!)**:
    - **Environment Variables** 섹션을 펼칩니다.
    - 다음 변수를 추가해야 합니다:
        - **NAME**: `VITE_GEMINI_API_KEY`
        - **VALUE**: (현재 사용 중인 Gemini API 키)
    - **Add** 버튼을 눌러 추가합니다.
5. **배포 시작**:
    - **"Deploy"** 버튼을 클릭합니다.
    - 배포가 완료될 때까지 잠시 기다립니다 (약 1분 소요).

## 3. 배포 완료 확인
- 배포가 성공하면 축하 메시지와 함께 도메인 주소(예: `poke-word-chain.vercel.app`)가 생성됩니다.
- 해당 주소로 접속하여 게임이 정상적으로 실행되는지 확인하세요.

## 참고 사항
- 배포 후 코드를 GitHub에 푸시하면, Vercel이 자동으로 감지하여 재배포를 수행합니다.
- API 키가 노출되지 않도록 주의하세요 (Vercel 환경 변수에만 저장).
