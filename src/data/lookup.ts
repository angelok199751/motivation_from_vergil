import { MEMES, type VergilMeme } from './memes';

/** Все id карточек в порядке из memes.ts */
export const ALL_IDS: string[] = MEMES.map((m) => m.id);

/** Быстрый поиск карточки по id */
export const BY_ID: Map<string, VergilMeme> = new Map(MEMES.map((m) => [m.id, m]));
