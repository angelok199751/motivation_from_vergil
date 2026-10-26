/** Fisher–Yates: честная случайная перестановка (исходный массив не меняется). */
export function shuffle<T>(items: readonly T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Новая колода из id. Если передан lastId (последняя карточка прошлого круга),
 * она не окажется первой, чтобы не было одинаковых картинок подряд на стыке кругов.
 */
export function newDeck(ids: readonly string[], lastId?: string): string[] {
  const deck = shuffle(ids);
  if (lastId && deck.length > 1 && deck[0] === lastId) {
    const k = 1 + Math.floor(Math.random() * (deck.length - 1));
    [deck[0], deck[k]] = [deck[k], deck[0]];
  }
  return deck;
}
