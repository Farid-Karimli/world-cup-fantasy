import { MatchStage } from '@/types';

export const STAGE_ORDER: MatchStage[] = [
  'group',
  'round32',
  'round16',
  'quarter',
  'semi',
  'third',
  'final',
];

export function isKnockoutStage(stage: MatchStage): boolean {
  return stage !== 'group';
}

export function stageLabel(stage: MatchStage): string {
  switch (stage) {
    case 'group':
      return 'Групповой этап';
    case 'round32':
      return '1/16 финала';
    case 'round16':
      return '1/8 финала';
    case 'quarter':
      return '1/4 финала';
    case 'semi':
      return '1/2 финала';
    case 'third':
      return 'Матч за 3-е место';
    case 'final':
      return 'Финал';
  }
}

export function stageSectionLabel(stage: MatchStage): string {
  if (stage === 'group') return 'Групповой этап';
  if (stage === 'final') return 'Финал';
  return 'Плей-офф';
}
