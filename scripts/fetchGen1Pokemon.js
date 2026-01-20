import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1세대 포켓몬 데이터 (ID 1~151)
const GEN1_START = 1;
const GEN1_END = 151;

// 타입 한글 변환
const typeTranslations = {
  normal: '노말',
  fire: '불꽃',
  water: '물',
  electric: '전기',
  grass: '풀',
  ice: '얼음',
  fighting: '격투',
  poison: '독',
  ground: '땅',
  flying: '비행',
  psychic: '에스퍼',
  bug: '벌레',
  rock: '바위',
  ghost: '고스트',
  dragon: '드래곤',
  dark: '악',
  steel: '강철',
  fairy: '페어리'
};

// 특성 한글 변환 (간단한 매핑, 실제로는 더 많은 특성이 있음)
const abilityTranslations = {
  overgrow: '심록',
  chlorophyll: '엽록소',
  blaze: '맹화',
  'solar-power': '선파워',
  torrent: '급류',
  rain: '비',
  'rain-dish': '비',
  'shield-dust': '인분',
  'run-away': '도주',
  'shed-skin': '탈피',
  'compound-eyes': '복안',
  tinted: '색안경',
  'tinted-lens': '색안경',
  swarm: '벌레의알림',
  sniper: '스나이퍼',
  keen: '예리한눈',
  'keen-eye': '예리한눈',
  tangled: '스너치',
  'tangled-feet': '위기회피',
  'big-pecks': '부풀린가슴',
  guts: '근성',
  'no-guard': '노가드',
  steadfast: '불굴의마음',
  intimidate: '위협',
  unnerve: '긴장감',
  'sand-veil': '모래숨기',
  'sand-rush': '모래헤치기',
  'poison-point': '독침',
  rivalry: '투쟁심',
  hustle: '의욕',
  'cute-charm': '헤롱헤롱',
  'magic-guard': '매직가드',
  unaware: '천진',
  static: '정전기',
  lightning: '피뢰침',
  'lightning-rod': '피뢰침',
  volt: '축전',
  'volt-absorb': '축전',
  synchronize: '싱크로',
  'inner-focus': '정신력',
  infiltrator: '틈새포착',
  wonder: '이상한비늘',
  'wonder-skin': '이상한피부',
  levitate: '부유',
  flash: '발화',
  'flash-fire': '타오르는불꽃',
  drought: '가뭄',
  'white-smoke': '하얀연기',
  'vital-spirit': '의욕',
  anger: '의욕',
  'anger-point': '분노의경혈',
  'sand-force': '모래의힘',
  thick: '두꺼운지방',
  'thick-fat': '두꺼운지방',
  scrappy: '배짱',
  sap: '잔디모피',
  'sap-sipper': '초식',
  hydration: '촉촉보디',
  'water-absorb': '저수',
  damp: '습기',
  'cloud-nine': '날씨부정',
  swift: '쓱쓱',
  'swift-swim': '쓱쓱',
  'water-veil': '수의베일',
  shell: '조가비갑옷',
  'shell-armor': '조가비갑옷',
  'skill-link': '연속기술',
  'own-tempo': '마이페이스',
  suction: '흡반',
  'suction-cups': '흡반',
  clear: '클리어바디',
  'clear-body': '클리어바디',
  liquid: '액체',
  'liquid-ooze': '해감액',
  sturdy: '옹골참',
  'rock-head': '돌머리',
  'sand-stream': '모래날림',
  oblivious: '둔감',
  forewarn: '미리알림',
  stench: '악취',
  'effect-spore': '포자',
  dry: '건조피부',
  'dry-skin': '건조피부',
  'poison-heal': '독힐',
  adaptability: '적응력',
  'skill-link': '연속공격',
  technician: '테크니션',
  normalize: '노말스킨',
  insomnia: '불면',
  cursed: '저주받은바디',
  'cursed-body': '저주받은바디',
  frisk: '통찰',
  'battle-armor': '전투무장',
  hyper: '하이퍼커터',
  'hyper-cutter': '하이퍼커터',
  pickup: '픽업',
  gluttony: '먹보',
  immunity: '면역',
  'thick-fat': '두꺼운지방',
  early: '일찍일어남',
  'early-bird': '일찍일어남',
  'inner-focus': '정신력',
  regenerator: '재생력',
  limber: '유연',
  imposter: '괴짜',
  cute: '헤롱헤롱',
  'arena-trap': '개미지옥',
  'sand-force': '모래의힘',
  tangled: '위기회피',
  motor: '전기엔진',
  'motor-drive': '전기엔진',
  defiant: '오기',
  competitive: '승기',
  'leaf-guard': '리프가드',
  contrary: '심술꾸러기',
  unnerve: '긴장감',
  defeatist: '무기력',
  weak: '약점',
  'weak-armor': '약점보험',
  multiscale: '멀티스케일',
  light: '라이트메탈',
  'light-metal': '라이트메탈',
  heavy: '헤비메탈',
  'heavy-metal': '헤비메탈',
  inner: '정신력',
  magic: '매직미러',
  'magic-bounce': '매직미러',
  'sap-sipper': '초식',
  'prankster': '장난꾸러기',
  'sand-force': '모래의힘',
  iron: '철주먹',
  'iron-fist': '철주먹',
  'poison-touch': '독수',
  'regenerator': '재생력',
  'big-pecks': '부풀린가슴',
  'sand-rush': '모래헤치기',
  'wonder-skin': '이상한피부',
  'analytic': '애널라이즈',
  'illusion': '일루전',
  'telepathy': '텔레파시',
  'moody': '변덕쟁이',
  'overcoat': '방진',
  'poison-touch': '독수',
  'regenerator': '재생력',
  'friend-guard': '프렌드가드',
  'healer': '힐링하트',
  'sheer-force': '우격다짐',
  'contrary': '심술꾸러기',
  'unnerve': '긴장감',
  'defiant': '오기',
  'defeatist': '무기력',
  'cursed-body': '저주받은바디',
  'mummy': '미라',
  'moxie': '자기과신',
  'justified': '정의의마음',
  'rattled': '겁쟁이',
  'magic-bounce': '매직미러',
  'sap-sipper': '초식',
  'prankster': '장난꾸러기',
  'sand-force': '모래의힘',
  'telepathy': '텔레파시',
  'pickpocket': '나쁜손버릇',
  'overcoat': '방진'
};

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Retry ${i + 1}/${retries} for ${url}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

async function fetchPokemonData(id) {
  try {
    console.log(`Fetching Pokemon #${id}...`);

    // 기본 포켓몬 정보
    const pokemon = await fetchWithRetry(`https://pokeapi.co/api/v2/pokemon/${id}`);

    // 종 정보 (한글 이름 포함)
    const species = await fetchWithRetry(`https://pokeapi.co/api/v2/pokemon-species/${id}`);

    // 한글 이름 찾기
    const koreanName = species.names.find(n => n.language.name === 'ko');
    const koreanGenus = species.genera.find(g => g.language.name === 'ko');

    // 한글 설명 찾기 (가장 최신 버전의 설명)
    const koreanFlavorText = species.flavor_text_entries
      .filter(f => f.language.name === 'ko')
      .slice(-1)[0]; // 마지막 (최신) 설명 사용

    // 타입 변환
    const types = pokemon.types.map(t => typeTranslations[t.type.name] || t.type.name);

    // 특성 변환
    const abilities = pokemon.abilities
      .filter(a => !a.is_hidden)
      .map(a => abilityTranslations[a.ability.name] || a.ability.name);

    const hiddenAbility = pokemon.abilities
      .find(a => a.is_hidden);

    // 능력치 계산
    const stats = {
      hp: pokemon.stats[0].base_stat,
      attack: pokemon.stats[1].base_stat,
      defense: pokemon.stats[2].base_stat,
      specialAttack: pokemon.stats[3].base_stat,
      specialDefense: pokemon.stats[4].base_stat,
      speed: pokemon.stats[5].base_stat,
      total: pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
    };

    return {
      id: pokemon.id,
      name: koreanName ? koreanName.name : pokemon.name,
      nameEn: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
      generation: 1,
      types: types,
      category: koreanGenus ? koreanGenus.genus : '',
      height: pokemon.height / 10, // 데시미터를 미터로 변환
      weight: pokemon.weight / 10, // 헥토그램을 킬로그램으로 변환
      abilities: abilities,
      hiddenAbility: hiddenAbility
        ? (abilityTranslations[hiddenAbility.ability.name] || hiddenAbility.ability.name)
        : (abilities[0] || ''),
      description: koreanFlavorText
        ? koreanFlavorText.flavor_text.replace(/\n/g, ' ').replace(/\f/g, ' ')
        : '',
      sprites: {
        front_default: pokemon.sprites.front_default || '',
        official_artwork: pokemon.sprites.other['official-artwork'].front_default || ''
      },
      stats: stats
    };
  } catch (error) {
    console.error(`Error fetching Pokemon #${id}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('Starting to fetch Gen 1 Pokemon data...\n');

  const pokemonData = [];

  for (let id = GEN1_START; id <= GEN1_END; id++) {
    const data = await fetchPokemonData(id);
    if (data) {
      pokemonData.push(data);
      console.log(`✓ #${id} ${data.name} (${data.nameEn})`);
    }

    // API 레이트 리밋 방지를 위한 딜레이
    if (id < GEN1_END) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // JSON 파일로 저장
  const outputPath = path.join(__dirname, '../src/data/pokemonData.json');
  fs.writeFileSync(outputPath, JSON.stringify(pokemonData, null, 2), 'utf-8');

  console.log(`\n✅ Successfully fetched ${pokemonData.length} Pokemon!`);
  console.log(`📁 Saved to: ${outputPath}`);
}

main().catch(console.error);
