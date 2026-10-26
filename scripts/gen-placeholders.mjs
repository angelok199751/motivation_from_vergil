// Генерирует 30 заглушек-картинок и src/data/memes.ts. Запускается один раз.
import { writeFileSync } from 'node:fs';
const captions = [
  'Мотивации много не бывает','Я не остановлюсь','Сила — это когда не просишь разрешения','Нужно больше силы',
  'Сегодня ты на высоте','Слабость — не вариант','Каждый день — тренировка','Никакой пощады к лени',
  'Ты уже сильнее, чем вчера','Цель видна. Остальное — шум','Дисциплина решает','Вставай. Ещё раунд',
  'Не оглядывайся назад','Мощь в спокойствии','Это только разминка','Выше. Быстрее. Сильнее',
  'Сомнения оставь за дверью','Идём до конца','Твой ход','Нет предела — есть привычка',
  'Холодная голова, горячее сердце','Сегодня без компромиссов','Ты — своя легенда','Время работает на тебя',
  'Не просто смог — превзошёл','Один шаг до цели','Настоящая сила тиха','Пора наращивать мощь',
  'Ты неудержим','Больше POWER. Больше MOTIVATION.'
];
const items = captions.map((c, i) => {
  const n = String(i + 1).padStart(3, '0');
  const hue = 250 + (i * 7) % 60;
  writeFileSync(`public/assets/memes/verg-${n}.svg`,
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue},60%,16%)"/><stop offset="1" stop-color="hsl(${hue + 30},70%,8%)"/></linearGradient></defs><rect width="800" height="800" fill="url(#g)"/><rect x="40" y="40" width="720" height="720" fill="none" stroke="#9fb4ff" stroke-opacity=".5" stroke-width="3" stroke-dasharray="14 10"/><text x="400" y="380" text-anchor="middle" font-family="sans-serif" font-size="46" fill="#cfd8ff">Место для мема</text><text x="400" y="480" text-anchor="middle" font-family="sans-serif" font-size="110" font-weight="700" fill="#7f9bff">${i + 1}</text></svg>`);
  return `  { id: 'verg-${n}', title: 'Мем ${i + 1}', image: 'assets/memes/verg-${n}.svg', caption: ${JSON.stringify(c)}, audio: '', rare: false },`;
});
writeFileSync('src/data/memes.ts',
`export type VergilMeme = {
  id: string;
  title: string;
  /** путь к картинке относительно public/, например assets/memes/verg-001.webp */
  image: string;
  caption: string;
  /** путь к музыке этой карточки, например assets/audio/verg-001.mp3. Пусто = без звука */
  audio: string;
  rare: boolean;
};

// Мелодия на стартовом экране (положи файл в public/assets/audio/). Пусто = без звука.
export const START_AUDIO = '';

// ЗАМЕНИ картинки, подписи и музыку на свои. Сейчас это заглушки.
export const MEMES: VergilMeme[] = [
${items.join('\n')}
];
`);
