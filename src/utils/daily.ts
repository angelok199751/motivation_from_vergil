import { shuffle } from './shuffle.ts';

/**
 * Режим «Ежедневная карточка»: порядок всех карточек перемешивается ОДИН раз
 * и сохраняется. Каждый день открывается следующая карточка из этого порядка.
 */
export type OpenedEntry = { id: string; date: string }; // date = YYYY-MM-DD по местному времени
export type DailyState = { order: string[]; opened: OpenedEntry[] };
export type StoreLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

export const DAILY_KEY = 'verg.daily.v1';
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function todayStr(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function freshState(ids: readonly string[]): DailyState {
  return { order: shuffle(ids), opened: [] };
}

/**
 * Приводит сохранённые данные к актуальному списку карточек:
 * мусор отбрасывается, удалённые карточки пропадают, новые добавляются в конец
 * в случайном порядке. Открытые карточки всегда стоят в начале order.
 */
export function normalize(raw: unknown, ids: readonly string[]): DailyState {
  const valid = new Set(ids);
  const obj = (raw && typeof raw === 'object' ? raw : {}) as { order?: unknown; opened?: unknown };

  const opened: OpenedEntry[] = [];
  const seen = new Set<string>();
  if (Array.isArray(obj.opened)) {
    for (const e of obj.opened as Array<Partial<OpenedEntry> | null>) {
      if (!e || typeof e.id !== 'string' || typeof e.date !== 'string') continue;
      if (!valid.has(e.id) || seen.has(e.id) || !DATE_RE.test(e.date)) continue;
      seen.add(e.id);
      opened.push({ id: e.id, date: e.date });
    }
  }

  const order: string[] = opened.map((e) => e.id);
  if (Array.isArray(obj.order)) {
    for (const id of obj.order as unknown[]) {
      if (typeof id === 'string' && valid.has(id) && !seen.has(id)) {
        seen.add(id);
        order.push(id);
      }
    }
  }
  order.push(...shuffle(ids.filter((id) => !seen.has(id))));
  return { order, opened };
}

/** Карточка, открытая сегодня (или «из будущего», если часы переведены назад). */
export function todaysEntry(s: DailyState, today: string = todayStr()): OpenedEntry | undefined {
  const last = s.opened[s.opened.length - 1];
  return last && last.date >= today ? last : undefined;
}

export function remaining(s: DailyState): number {
  return s.order.length - s.opened.length;
}

export function canOpen(s: DailyState, today: string = todayStr()): boolean {
  return remaining(s) > 0 && !todaysEntry(s, today);
}

/** Открывает следующую карточку, если сегодня ещё не открывали. Иначе возвращает то же состояние. */
export function openNext(s: DailyState, today: string = todayStr()): DailyState {
  if (!canOpen(s, today)) return s;
  const id = s.order[s.opened.length];
  return { order: s.order, opened: [...s.opened, { id, date: today }] };
}

function browserStore(): StoreLike | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

export function loadDaily(ids: readonly string[], store: StoreLike | null = browserStore()): DailyState {
  let raw: unknown = null;
  try {
    const text = store?.getItem(DAILY_KEY);
    if (text) raw = JSON.parse(text);
  } catch {
    raw = null;
  }
  return normalize(raw, ids);
}

export function saveDaily(s: DailyState, store: StoreLike | null = browserStore()): void {
  try {
    store?.setItem(DAILY_KEY, JSON.stringify(s));
  } catch {
    /* хранилище недоступно — работаем без сохранения */
  }
}
