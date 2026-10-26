// Проверка логики «Ежедневной карточки»: node --experimental-strip-types scripts/test-daily.ts
import {
  canOpen, freshState, loadDaily, normalize, openNext, remaining, saveDaily, todayStr, todaysEntry,
  type DailyState, type StoreLike,
} from '../src/utils/daily.ts';

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error('FAIL: ' + msg);
}

const ids = Array.from({ length: 30 }, (_, i) => `m${i + 1}`);
const day = (n: number) => `2026-11-${String(n).padStart(2, '0')}`;

// 1. свежая колода: все id по разу
let s: DailyState = freshState(ids);
assert(s.order.length === 30 && new Set(s.order).size === 30, 'колода из 30 уникальных');
assert(s.opened.length === 0 && canOpen(s, day(1)), 'в начале можно открыть');

// 2. один раз в день
s = openNext(s, day(1));
assert(s.opened.length === 1 && s.opened[0].id === s.order[0], 'открылась первая карточка колоды');
assert(!canOpen(s, day(1)), 'второй раз в тот же день нельзя');
assert(openNext(s, day(1)) === s, 'повторное открытие в тот же день ничего не меняет');
assert(todaysEntry(s, day(1))?.id === s.order[0], 'сегодняшняя карточка найдена');
assert(todaysEntry(s, day(2)) === undefined, 'на следующий день сегодняшней нет');

// 3. часы переведены назад — новую карточку получить нельзя
assert(!canOpen(s, '2026-10-01'), 'перевод часов назад не даёт новую карточку');

// 4. 30 дней подряд: все карточки, без повторов, дальше открывать нечего
for (let d = 2; d <= 30; d++) {
  assert(canOpen(s, day(d)), `день ${d}: можно открыть`);
  s = openNext(s, day(d));
}
assert(s.opened.length === 30 && new Set(s.opened.map((e) => e.id)).size === 30, 'открыты все 30 без повторов');
assert(remaining(s) === 0 && !canOpen(s, '2026-12-31'), 'после 30-й открывать нечего');

// 5. сохранение и загрузка (имитация обновления страницы)
const mem = new Map<string, string>();
const store: StoreLike = { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => void mem.set(k, v) };
let t = freshState(ids);
t = openNext(t, day(1));
t = openNext(t, day(2));
saveDaily(t, store);
const loaded = loadDaily(ids, store);
assert(JSON.stringify(loaded) === JSON.stringify(t), 'после перезагрузки прогресс и порядок те же');
assert(loadDaily(ids, store).order.join() === t.order.join(), 'порядок колоды не меняется');

// 6. повреждённые данные не ломают приложение
for (const bad of ['', '{', 'null', '[]', '{"order":5,"opened":"x"}', '{"opened":[{"id":"zzz","date":"2026-11-01"}]}']) {
  mem.set('verg.daily.v1', bad);
  const r = loadDaily(ids, store);
  assert(r.order.length === 30 && new Set(r.order).size === 30 && r.opened.length === 0, `мусор «${bad}» -> чистое состояние`);
}
assert(loadDaily(ids, null).order.length === 30, 'без хранилища всё работает');

// 7. список карточек изменился: удалённые пропадают, новые добавляются, открытые сохраняются
const t2 = openNext(openNext(freshState(ids), day(1)), day(2));
const newIds = [...ids.filter((id) => id !== t2.opened[1].id), 'new1', 'new2'];
const n = normalize(JSON.parse(JSON.stringify(t2)), newIds);
assert(n.order.length === 31 && new Set(n.order).size === 31, 'колода пересобрана из актуальных карточек');
assert(n.opened.length === 1 && n.opened[0].id === t2.opened[0].id, 'удалённая открытая карточка исчезла, остальные сохранились');
assert(n.order[0] === n.opened[0].id, 'открытые стоят в начале колоды');
assert(n.order.includes('new1') && n.order.includes('new2'), 'новые карточки добавлены');

// 8. дата в местном времени
assert(todayStr(new Date(2026, 0, 5, 23, 59)) === '2026-01-05', 'формат даты YYYY-MM-DD');

console.log('OK: логика ежедневной карточки работает');
