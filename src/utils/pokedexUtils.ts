export const TYPE_COLORS: Record<string, string> = {
  노말: '#A8A77A',
  불꽃: '#EE8130',
  물: '#6390F0',
  풀: '#7AC74C',
  전기: '#F7D02C',
  얼음: '#96D9D6',
  격투: '#C22E28',
  독: '#A33EA1',
  땅: '#E2BF65',
  비행: '#A98FF3',
  에스퍼: '#F95587',
  벌레: '#A6B91A',
  바위: '#B6A136',
  고스트: '#735797',
  드래곤: '#6F35FC',
  악: '#705746',
  강철: '#B7B7CE',
  페어리: '#D685AD',
};

export const GENERATION_LABELS: Record<number, string> = {
  1: '1세대 (관동)',
  2: '2세대 (성도)',
  3: '3세대 (호연)',
  4: '4세대 (신오)',
  5: '5세대 (하나)',
  6: '6세대 (칼로스)',
  7: '7세대 (알로라)',
  8: '8세대 (가라르)',
  9: '9세대 (팔데아)',
};

export const ALL_TYPES = Object.keys(TYPE_COLORS);
export const ALL_GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
