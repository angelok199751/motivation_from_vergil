// Запоминаем, открывали ли письмо (на иконке до этого горит метка).
const KEY = 'verg.letter.seen.v1';

export function isLetterSeen(): boolean {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function markLetterSeen(): void {
  try {
    localStorage.setItem(KEY, '1');
  } catch {
    /* хранилище недоступно */
  }
}
