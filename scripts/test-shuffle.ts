// Проверка: каждая пачка содержит все id ровно по разу, порядок меняется между кругами.
import { newDeck } from '../src/utils/shuffle.ts';

const ids = Array.from({ length: 30 }, (_, i) => `id-${i}`);
let last: string | undefined;
const orders = new Set<string>();

for (let round = 0; round < 2000; round++) {
  const deck = newDeck(ids, last);
  if (deck.length !== 30 || new Set(deck).size !== 30) throw new Error('повтор или потеря карточки');
  if (!ids.every((id) => deck.includes(id))) throw new Error('не все карточки');
  if (last && deck[0] === last) throw new Error('одинаковая карточка на стыке кругов');
  orders.add(deck.join(','));
  last = deck[29];
}
if (orders.size < 1990) throw new Error('порядки повторяются слишком часто');
console.log(`OK: 2000 кругов, уникальных порядков: ${orders.size}`);
