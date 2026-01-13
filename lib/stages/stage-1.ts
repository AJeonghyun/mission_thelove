import type { Stage } from '../types';

const stage1: Stage = {
  id: 'stage-1',
  title: 'Stage 1',
  introImages: ['/intro1.png', '/intro2.png', '/intro3.png', '/intro4.png'],
  puzzleImage: '/game1.jpeg',
  puzzleTitle: '사탄의 암호',
  question:
    '위에 보이는 네 개의 이름은 사탄이 남긴 거짓된 배열이다.\n각 이름은 색으로 쓰인 조각이며 진짜 순서는 숨겨져 있다.\n아래에 놓인 색의 문양은 그 조각들이 다시 정렬된 모습이다.',
  inputMode: 'drawer',
  answer: '사랑',
};

export default stage1;
