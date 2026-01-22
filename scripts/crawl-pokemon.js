#!/usr/bin/env node
/**
 * Pokemon Data Crawler
 * PokeAPI를 사용하여 한국어 포켓몬 데이터를 수집합니다.
 *
 * 특징:
 * - 증분 수집: 기존 데이터 이후부터 재수집 가능
 * - 중복 방지: ID 기반 중복 체크
 * - Rate Limiting: API 요청 제한 준수
 * - 진행 상황 표시
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 설정
const CONFIG = {
  // PokeAPI 기본 URL
  API_BASE_URL: 'https://pokeapi.co/api/v2',

  // 데이터 파일 경로
  OUTPUT_PATH: path.join(__dirname, '..', 'src', 'data', 'pokemonData.json'),

  // 수집할 포켓몬 범위 (1-9세대: 1025마리)
  START_ID: 1,
  END_ID: 1025,

  // API 요청 간 대기 시간 (ms) - Rate limiting
  REQUEST_DELAY: 100,

  // 재시도 설정
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,

  // 배치 저장 간격 (몇 개마다 저장할지)
  SAVE_INTERVAL: 50,
};

// 세대별 포켓몬 범위
const GENERATION_RANGES = [
  { gen: 1, start: 1, end: 151 },    // 관동지방
  { gen: 2, start: 152, end: 251 },  // 성도지방
  { gen: 3, start: 252, end: 386 },  // 호연지방
  { gen: 4, start: 387, end: 493 },  // 신오지방
  { gen: 5, start: 494, end: 649 },  // 하나지방
  { gen: 6, start: 650, end: 721 },  // 칼로스지방
  { gen: 7, start: 722, end: 809 },  // 알로라지방
  { gen: 8, start: 810, end: 905 },  // 가라르지방
  { gen: 9, start: 906, end: 1025 }, // 팔데아지방
];

/**
 * 포켓몬 ID로 세대 번호 반환
 */
function getGeneration(pokemonId) {
  for (const range of GENERATION_RANGES) {
    if (pokemonId >= range.start && pokemonId <= range.end) {
      return range.gen;
    }
  }
  return 0;
}

/**
 * 지정된 시간만큼 대기
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 기존 데이터 파일 로드
 */
function loadExistingData() {
  try {
    if (fs.existsSync(CONFIG.OUTPUT_PATH)) {
      const data = fs.readFileSync(CONFIG.OUTPUT_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('기존 데이터 파일을 읽을 수 없습니다. 새로 시작합니다.');
  }
  return [];
}

/**
 * 데이터 저장
 */
function saveData(data) {
  // 디렉토리가 없으면 생성
  const dir = path.dirname(CONFIG.OUTPUT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // ID 순으로 정렬 후 저장
  const sortedData = [...data].sort((a, b) => a.id - b.id);
  fs.writeFileSync(CONFIG.OUTPUT_PATH, JSON.stringify(sortedData, null, 2), 'utf-8');
}

/**
 * PokeAPI에서 포켓몬 종 정보 가져오기 (한국어 이름 포함)
 */
async function fetchPokemonSpecies(id) {
  const url = `${CONFIG.API_BASE_URL}/pokemon-species/${id}/`;

  for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`ID ${id}: 포켓몬을 찾을 수 없습니다 (404)`);
          return null;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      // 한국어 이름 찾기
      const koreanName = data.names.find(n => n.language.name === 'ko');

      if (!koreanName) {
        console.warn(`ID ${id}: 한국어 이름을 찾을 수 없습니다`);
        return null;
      }

      return {
        id: data.id,
        name: koreanName.name,
        generation: getGeneration(data.id),
      };
    } catch (error) {
      console.error(`ID ${id} 시도 ${attempt}/${CONFIG.MAX_RETRIES} 실패:`, error.message);

      if (attempt < CONFIG.MAX_RETRIES) {
        await sleep(CONFIG.RETRY_DELAY * attempt);
      }
    }
  }

  return null;
}

/**
 * 진행 상황 표시
 */
function showProgress(current, total, pokemon) {
  const percent = Math.round((current / total) * 100);
  const bar = '█'.repeat(Math.floor(percent / 2)) + '░'.repeat(50 - Math.floor(percent / 2));

  process.stdout.write(`\r[${bar}] ${percent}% (${current}/${total})`);

  if (pokemon) {
    process.stdout.write(` - #${pokemon.id} ${pokemon.name}      `);
  }
}

/**
 * 메인 크롤링 함수
 */
async function crawlPokemon(options = {}) {
  const {
    startId = CONFIG.START_ID,
    endId = CONFIG.END_ID,
    forceRefresh = false,
  } = options;

  console.log('='.repeat(60));
  console.log('Pokemon Data Crawler');
  console.log('='.repeat(60));
  console.log(`수집 범위: #${startId} ~ #${endId}`);
  console.log(`출력 파일: ${CONFIG.OUTPUT_PATH}`);
  console.log('');

  // 기존 데이터 로드
  let existingData = forceRefresh ? [] : loadExistingData();
  const existingIds = new Set(existingData.map(p => p.id));

  console.log(`기존 데이터: ${existingData.length}개 포켓몬`);

  // 수집할 ID 목록 생성 (기존에 없는 것만)
  const idsToFetch = [];
  for (let id = startId; id <= endId; id++) {
    if (!existingIds.has(id)) {
      idsToFetch.push(id);
    }
  }

  if (idsToFetch.length === 0) {
    console.log('모든 포켓몬 데이터가 이미 수집되어 있습니다.');
    return existingData;
  }

  console.log(`새로 수집할 포켓몬: ${idsToFetch.length}개`);
  console.log('');
  console.log('수집 시작...');
  console.log('');

  // 수집 시작
  const newData = [...existingData];
  let fetchedCount = 0;
  let failedIds = [];

  for (const id of idsToFetch) {
    const pokemon = await fetchPokemonSpecies(id);

    if (pokemon) {
      newData.push(pokemon);
      fetchedCount++;
    } else {
      failedIds.push(id);
    }

    // 진행 상황 표시
    showProgress(fetchedCount + failedIds.length, idsToFetch.length, pokemon);

    // 주기적으로 저장 (데이터 손실 방지)
    if (fetchedCount > 0 && fetchedCount % CONFIG.SAVE_INTERVAL === 0) {
      saveData(newData);
    }

    // Rate limiting
    await sleep(CONFIG.REQUEST_DELAY);
  }

  console.log('\n');

  // 최종 저장
  saveData(newData);

  // 결과 출력
  console.log('='.repeat(60));
  console.log('수집 완료!');
  console.log('='.repeat(60));
  console.log(`성공: ${fetchedCount}개`);
  console.log(`실패: ${failedIds.length}개`);
  console.log(`총 데이터: ${newData.length}개`);

  if (failedIds.length > 0) {
    console.log(`실패한 ID: ${failedIds.join(', ')}`);
    console.log('실패한 포켓몬은 스크립트를 다시 실행하면 재수집됩니다.');
  }

  // 세대별 통계
  console.log('');
  console.log('세대별 수집 현황:');
  for (const range of GENERATION_RANGES) {
    const count = newData.filter(p => p.generation === range.gen).length;
    const total = range.end - range.start + 1;
    console.log(`  ${range.gen}세대: ${count}/${total}개`);
  }

  return newData;
}

/**
 * CLI 인자 파싱
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--start' || arg === '-s') {
      options.startId = parseInt(args[++i], 10);
    } else if (arg === '--end' || arg === '-e') {
      options.endId = parseInt(args[++i], 10);
    } else if (arg === '--force' || arg === '-f') {
      options.forceRefresh = true;
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Pokemon Data Crawler - 사용법

Usage: node crawl-pokemon.js [options]

Options:
  -s, --start <id>   시작 포켓몬 ID (기본값: 1)
  -e, --end <id>     종료 포켓몬 ID (기본값: 1025)
  -f, --force        기존 데이터 무시하고 전체 재수집
  -h, --help         도움말 표시

Examples:
  node crawl-pokemon.js                    # 전체 수집 (증분)
  node crawl-pokemon.js -s 1 -e 151        # 1세대만 수집
  node crawl-pokemon.js --force            # 전체 재수집
  node crawl-pokemon.js -s 906 -e 1025     # 9세대만 수집
      `);
      process.exit(0);
    }
  }

  return options;
}

// 메인 실행
const options = parseArgs();
crawlPokemon(options).catch(error => {
  console.error('크롤링 중 오류 발생:', error);
  process.exit(1);
});
