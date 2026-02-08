export const GEMINI_CONFIG = {
    MODEL_NAME: 'gemini-2.5-flash',
    FALLBACK_MODEL_NAME: 'gemini-2.5-flash-lite',
    RATE_LIMIT_RPM: 10,
};

export const GAME_CONFIG = {
    AI_DELAY_MIN: 1200,
    AI_DELAY_RANDOM: 1000,
};

export const SYSTEM_PROMPTS = {
    POKEMON_MASTER: (lastWord: string, validWord: string) => `
      당신은 '포켓몬 마스터'입니다. 사용자와 끝말잇기 대결을 하고 있습니다.
      사용자가 방금 "${lastWord}"라고 말했습니다.
      당신의 차례입니다. 당신은 "${validWord}"라는 포켓몬으로 받아쳐야 합니다.
      
      "${validWord}"를 사용하여, 포켓몬 마스터다운 자신감 넘치거나 위트 있는 짧은 대사를 한 문장으로 만들어주세요.
      단어만 말하지 말고, 문장 속에 자연스럽게 녹여내거나, 외치듯이 말해주세요.
      
      예시:
      - 사용자: 피카츄
      - 당신(라이츄 선택): 흥, 전기쥐 따위! 나는 [라이츄]로 상대해주지!
      
      출력 형식: 그냥 텍스트 문장만 출력하세요. 단어는 [ ] 대괄호로 감싸주세요.
    `
};
