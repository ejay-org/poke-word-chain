# Data

이 폴더에는 게임 데이터 파일들이 위치합니다.

## pokemonData.json

1~9세대 한국어 포켓몬 데이터베이스입니다. 끝말잇기 게임 로직과 추후 도감 기능을 모두 지원하는 구조로 설계되었습니다.

### 데이터 구조

```typescript
interface Pokemon {
  id: number;                    // 포켓몬 도감 번호
  name: string;                  // 한글 이름 (끝말잇기용)
  nameEn: string;                // 영문 이름
  generation: number;            // 세대 (1-9)
  types: string[];               // 타입 (예: ["불꽃", "비행"])
  category: string;              // 분류 (예: "화염포켓몬")
  height: number;                // 키 (m)
  weight: number;                // 무게 (kg)
  abilities: string[];           // 특성 목록
  hiddenAbility: string;         // 숨겨진 특성
  description: string;           // 포켓몬 설명
  sprites: {
    front_default: string;       // 기본 앞모습 이미지 URL
    official_artwork: string;    // 공식 일러스트 이미지 URL
  };
  stats: {
    hp: number;                  // HP
    attack: number;              // 공격
    defense: number;             // 방어
    specialAttack: number;       // 특수공격
    specialDefense: number;      // 특수방어
    speed: number;               // 스피드
    total: number;               // 총합
  };
}
```

### 데이터 출처

- **PokeAPI**: 기본 포켓몬 정보, 영문명, 타입, 능력치, 스프라이트 이미지
- **한국 포켓몬 공식 사이트**: 한글 이름, 한글 분류, 한글 설명

### 현재 상태

- ✅ 1세대 포켓몬 10개 샘플 데이터 구축 완료
- ⏳ 나머지 1세대 포켓몬 데이터 수집 예정
- ⏳ 2~9세대 포켓몬 데이터 수집 예정

### 데이터 확장 방법

추가 포켓몬 데이터를 수집할 때는 다음 순서로 진행:

1. PokeAPI에서 기본 정보 가져오기:
   - `https://pokeapi.co/api/v2/pokemon/{id}`
   - `https://pokeapi.co/api/v2/pokemon-species/{id}`

2. 한국어 데이터 추출:
   - `pokemon-species` 엔드포인트의 `names` 배열에서 `language.name === 'ko'`인 항목
   - `genera` 배열에서 한국어 분류 추출

3. JSON 배열에 추가
