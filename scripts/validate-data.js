#!/usr/bin/env node
/**
 * Pokemon Data Validator
 * 수집된 포켓몬 데이터의 유효성을 검사합니다.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'pokemonData.json');

// 세대별 포켓몬 범위
const GENERATION_RANGES = [
  { gen: 1, start: 1, end: 151 },
  { gen: 2, start: 152, end: 251 },
  { gen: 3, start: 252, end: 386 },
  { gen: 4, start: 387, end: 493 },
  { gen: 5, start: 494, end: 649 },
  { gen: 6, start: 650, end: 721 },
  { gen: 7, start: 722, end: 809 },
  { gen: 8, start: 810, end: 905 },
  { gen: 9, start: 906, end: 1025 },
];

// 유효한 타입 목록 (영문)
const VALID_TYPES_EN = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

function validateData() {
  console.log('='.repeat(60));
  console.log('Pokemon Data Validator');
  console.log('='.repeat(60));
  console.log(`데이터 파일: ${DATA_PATH}`);
  console.log('');

  // 파일 존재 확인
  if (!fs.existsSync(DATA_PATH)) {
    console.error('오류: 데이터 파일이 존재하지 않습니다.');
    console.log('먼저 crawl-pokemon.js를 실행하여 데이터를 수집하세요.');
    process.exit(1);
  }

  // 데이터 로드
  let data;
  try {
    const content = fs.readFileSync(DATA_PATH, 'utf-8');
    data = JSON.parse(content);
  } catch (error) {
    console.error('오류: JSON 파싱 실패:', error.message);
    process.exit(1);
  }

  const errors = [];
  const warnings = [];

  // 1. 배열 확인
  if (!Array.isArray(data)) {
    errors.push('데이터가 배열 형식이 아닙니다.');
    console.error('치명적 오류: 데이터 형식이 잘못되었습니다.');
    process.exit(1);
  }

  console.log(`총 포켓몬 수: ${data.length}개`);
  console.log('');

  // 2. 각 항목 검증
  const seenIds = new Set();
  const seenNames = new Set();
  const typeStats = new Map();
  let missingFields = {
    nameEn: 0,
    types: 0,
    typesEn: 0,
    abilities: 0,
    description: 0,
    imageUrl: 0,
  };

  for (const pokemon of data) {
    // 필수 필드 확인 - id
    if (typeof pokemon.id !== 'number') {
      errors.push(`ID가 숫자가 아닙니다: ${JSON.stringify(pokemon)}`);
      continue;
    }

    // 필수 필드 확인 - name (한국어)
    if (typeof pokemon.name !== 'string' || pokemon.name.trim() === '') {
      errors.push(`ID ${pokemon.id}: 한국어 이름이 유효하지 않습니다`);
    }

    // 필수 필드 확인 - generation
    if (typeof pokemon.generation !== 'number' || pokemon.generation < 1 || pokemon.generation > 9) {
      errors.push(`ID ${pokemon.id}: 세대 정보가 유효하지 않습니다 (${pokemon.generation})`);
    }

    // 선택 필드 확인 - nameEn
    if (!pokemon.nameEn || typeof pokemon.nameEn !== 'string') {
      missingFields.nameEn++;
    }

    // 선택 필드 확인 - types
    if (!Array.isArray(pokemon.types) || pokemon.types.length === 0) {
      missingFields.types++;
    } else {
      // 타입 통계
      for (const type of pokemon.types) {
        typeStats.set(type, (typeStats.get(type) || 0) + 1);
      }
    }

    // 선택 필드 확인 - typesEn
    if (!Array.isArray(pokemon.typesEn) || pokemon.typesEn.length === 0) {
      missingFields.typesEn++;
    } else {
      // 유효한 타입인지 확인
      for (const type of pokemon.typesEn) {
        if (!VALID_TYPES_EN.includes(type)) {
          warnings.push(`ID ${pokemon.id}: 알 수 없는 타입 (${type})`);
        }
      }
    }

    // 선택 필드 확인 - abilities
    if (!Array.isArray(pokemon.abilities) || pokemon.abilities.length === 0) {
      missingFields.abilities++;
    }

    // 선택 필드 확인 - description
    if (!pokemon.description || typeof pokemon.description !== 'string') {
      missingFields.description++;
    }

    // 선택 필드 확인 - imageUrl
    if (!pokemon.imageUrl || typeof pokemon.imageUrl !== 'string') {
      missingFields.imageUrl++;
    } else if (!pokemon.imageUrl.startsWith('http')) {
      warnings.push(`ID ${pokemon.id}: 이미지 URL이 유효하지 않습니다`);
    }

    // 중복 ID 확인
    if (seenIds.has(pokemon.id)) {
      errors.push(`중복 ID 발견: ${pokemon.id}`);
    }
    seenIds.add(pokemon.id);

    // 중복 이름 확인
    if (seenNames.has(pokemon.name)) {
      warnings.push(`중복 이름 발견: ${pokemon.name} (ID: ${pokemon.id})`);
    }
    seenNames.add(pokemon.name);

    // 한글 이름 확인
    if (pokemon.name && !/[가-힣]/.test(pokemon.name)) {
      warnings.push(`ID ${pokemon.id}: 한글이 포함되지 않은 이름 (${pokemon.name})`);
    }
  }

  // 3. 누락된 ID 확인
  const missingIds = [];
  for (let id = 1; id <= 1025; id++) {
    if (!seenIds.has(id)) {
      missingIds.push(id);
    }
  }

  if (missingIds.length > 0) {
    warnings.push(`누락된 포켓몬 ID: ${missingIds.length}개`);
  }

  // 4. 세대별 통계
  console.log('세대별 현황:');
  console.log('-'.repeat(40));
  for (const range of GENERATION_RANGES) {
    const count = data.filter(p => p.generation === range.gen).length;
    const expected = range.end - range.start + 1;
    const status = count === expected ? '✓' : '✗';
    console.log(`  ${range.gen}세대: ${count.toString().padStart(3)}/${expected} ${status}`);

    if (count !== expected) {
      // 해당 세대에서 누락된 ID 찾기
      const genMissing = [];
      for (let id = range.start; id <= range.end; id++) {
        if (!seenIds.has(id)) {
          genMissing.push(id);
        }
      }
      if (genMissing.length > 0 && genMissing.length <= 10) {
        console.log(`         누락: ${genMissing.join(', ')}`);
      } else if (genMissing.length > 10) {
        console.log(`         누락: ${genMissing.slice(0, 10).join(', ')} 외 ${genMissing.length - 10}개`);
      }
    }
  }

  // 5. 필드 완성도
  console.log('');
  console.log('필드 완성도:');
  console.log('-'.repeat(40));
  const totalCount = data.length;
  console.log(`  id:          ${totalCount}/${totalCount} (100%)`);
  console.log(`  name:        ${totalCount}/${totalCount} (100%)`);
  console.log(`  nameEn:      ${totalCount - missingFields.nameEn}/${totalCount} (${Math.round((totalCount - missingFields.nameEn) / totalCount * 100)}%)`);
  console.log(`  generation:  ${totalCount}/${totalCount} (100%)`);
  console.log(`  types:       ${totalCount - missingFields.types}/${totalCount} (${Math.round((totalCount - missingFields.types) / totalCount * 100)}%)`);
  console.log(`  typesEn:     ${totalCount - missingFields.typesEn}/${totalCount} (${Math.round((totalCount - missingFields.typesEn) / totalCount * 100)}%)`);
  console.log(`  abilities:   ${totalCount - missingFields.abilities}/${totalCount} (${Math.round((totalCount - missingFields.abilities) / totalCount * 100)}%)`);
  console.log(`  description: ${totalCount - missingFields.description}/${totalCount} (${Math.round((totalCount - missingFields.description) / totalCount * 100)}%)`);
  console.log(`  imageUrl:    ${totalCount - missingFields.imageUrl}/${totalCount} (${Math.round((totalCount - missingFields.imageUrl) / totalCount * 100)}%)`);

  // 6. 타입 분포
  if (typeStats.size > 0) {
    console.log('');
    console.log('타입 분포 (한국어):');
    console.log('-'.repeat(40));
    const sortedTypes = [...typeStats.entries()].sort((a, b) => b[1] - a[1]);
    for (const [type, count] of sortedTypes) {
      console.log(`  ${type.padEnd(6)}: ${count}마리`);
    }
  }

  // 7. 결과 출력
  console.log('');
  console.log('='.repeat(60));
  console.log('검증 결과');
  console.log('='.repeat(60));

  if (errors.length > 0) {
    console.log('');
    console.log(`오류 (${errors.length}개):`);
    errors.forEach(e => console.log(`  ✗ ${e}`));
  }

  if (warnings.length > 0) {
    console.log('');
    console.log(`경고 (${warnings.length}개):`);
    warnings.slice(0, 20).forEach(w => console.log(`  ! ${w}`));
    if (warnings.length > 20) {
      console.log(`  ... 외 ${warnings.length - 20}개`);
    }
  }

  console.log('');
  if (errors.length === 0 && missingIds.length === 0) {
    console.log('✓ 데이터 검증 통과! 모든 포켓몬 데이터가 올바르게 수집되었습니다.');
    process.exit(0);
  } else if (errors.length === 0) {
    console.log(`! 데이터에 ${missingIds.length}개의 누락된 포켓몬이 있습니다.`);
    console.log('  crawl-pokemon.js를 다시 실행하면 누락된 포켓몬을 수집합니다.');
    process.exit(0);
  } else {
    console.log('✗ 데이터 검증 실패! 위의 오류를 확인하세요.');
    process.exit(1);
  }
}

validateData();
