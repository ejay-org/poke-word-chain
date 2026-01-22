# Pokemon Data Crawling Guide

이 문서는 포켓몬 끝말잇기 게임에 필요한 데이터를 수집하는 방법을 설명합니다.

## 개요

- **데이터 소스**: [PokeAPI](https://pokeapi.co/)
- **수집 대상**: 1~9세대 포켓몬 1,025마리의 한국어 이름
- **출력 형식**: JSON 파일 (`src/data/pokemonData.json`)

## 사전 준비

### Node.js 버전 확인

Node.js 18 이상이 필요합니다 (fetch API 내장).

```bash
node --version
# v18.0.0 이상이어야 합니다
```

### 의존성 설치

프로젝트 루트에서 실행:

```bash
npm install
```

## 데이터 수집 방법

### 1. 전체 수집 (처음 실행하는 경우)

```bash
npm run crawl
```

또는 직접 실행:

```bash
node scripts/crawl-pokemon.js
```

### 2. 증분 수집 (기존 데이터가 있는 경우)

스크립트를 다시 실행하면 **기존 데이터는 유지**되고, **누락된 포켓몬만 추가 수집**됩니다.

```bash
npm run crawl
```

이 기능 덕분에:
- 네트워크 오류로 중단되어도 이어서 수집 가능
- 여러 번 실행해도 중복 데이터 없음
- 새 세대 포켓몬이 추가되면 해당 범위만 추가 수집 가능

### 3. 특정 세대만 수집

```bash
# 1세대만 (피카츄, 이상해씨 등)
node scripts/crawl-pokemon.js --start 1 --end 151

# 9세대만 (팔데아 지방)
node scripts/crawl-pokemon.js --start 906 --end 1025

# 1~3세대
node scripts/crawl-pokemon.js --start 1 --end 386
```

### 4. 전체 재수집 (기존 데이터 무시)

```bash
npm run crawl:force
```

또는:

```bash
node scripts/crawl-pokemon.js --force
```

## 데이터 검증

수집 완료 후 데이터 무결성을 검증합니다:

```bash
npm run crawl:validate
```

검증 항목:
- 총 포켓몬 수 (1,025개)
- 세대별 포켓몬 수
- 중복 ID 확인
- 한국어 이름 유효성
- 누락된 포켓몬 확인

## 명령어 요약

| 명령어 | 설명 |
|--------|------|
| `npm run crawl` | 증분 수집 (누락된 것만) |
| `npm run crawl:force` | 전체 재수집 |
| `npm run crawl:validate` | 데이터 검증 |

## 출력 파일 형식

`src/data/pokemonData.json`:

```json
[
  { "id": 1, "name": "이상해씨", "generation": 1 },
  { "id": 2, "name": "이상해풀", "generation": 1 },
  { "id": 3, "name": "이상해꽃", "generation": 1 },
  ...
  { "id": 25, "name": "피카츄", "generation": 1 },
  ...
  { "id": 1025, "name": "복숭악동", "generation": 9 }
]
```

## 세대별 포켓몬 범위

| 세대 | 지역 | ID 범위 | 포켓몬 수 |
|------|------|---------|----------|
| 1세대 | 관동 | 1-151 | 151 |
| 2세대 | 성도 | 152-251 | 100 |
| 3세대 | 호연 | 252-386 | 135 |
| 4세대 | 신오 | 387-493 | 107 |
| 5세대 | 하나 | 494-649 | 156 |
| 6세대 | 칼로스 | 650-721 | 72 |
| 7세대 | 알로라 | 722-809 | 88 |
| 8세대 | 가라르 | 810-905 | 96 |
| 9세대 | 팔데아 | 906-1025 | 120 |
| **합계** | | 1-1025 | **1,025** |

## 예상 소요 시간

- 전체 수집 (1,025마리): 약 2-3분
- API 요청 간격: 100ms (Rate Limiting 준수)
- 50개마다 자동 저장 (중단 시 데이터 손실 최소화)

## 문제 해결

### "fetch is not defined" 오류

Node.js 버전이 18 미만입니다. Node.js 18 이상으로 업그레이드하세요.

```bash
# nvm 사용 시
nvm install 18
nvm use 18
```

### 일부 포켓몬 수집 실패

네트워크 오류로 일부 포켓몬 수집에 실패할 수 있습니다.
스크립트를 다시 실행하면 실패한 포켓몬만 재수집합니다.

```bash
npm run crawl
```

### 한국어 이름이 없는 포켓몬

PokeAPI에 한국어 번역이 누락된 포켓몬이 있을 수 있습니다.
검증 스크립트에서 경고로 표시됩니다.

### Rate Limiting 오류 (HTTP 429)

PokeAPI의 요청 제한에 걸린 경우입니다.
스크립트는 자동으로 재시도하지만, 계속 실패하면 잠시 후 다시 시도하세요.

## 데이터 소스 정보

### PokeAPI

- 공식 웹사이트: https://pokeapi.co/
- 문서: https://pokeapi.co/docs/v2
- 무료 사용, API 키 불필요
- 한국어 포함 다국어 지원

### 사용하는 API 엔드포인트

```
GET https://pokeapi.co/api/v2/pokemon-species/{id}/
```

응답에서 `names` 배열의 `language.name === "ko"` 항목을 추출합니다.
