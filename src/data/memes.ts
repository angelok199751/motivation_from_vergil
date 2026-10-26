export type VergilMeme = {
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
export const START_AUDIO = 'assets/audio/theme.mp3';

// ЗАМЕНИ картинки, подписи и музыку на свои. Сейчас это заглушки.
export const MEMES: VergilMeme[] = [
  { id: 'verg-001', title: 'Мем 1', image: 'assets/memes/verg-001.svg', caption: "А кто это сегодня такой красавчик?", audio: 'assets/audio/пусть_будет.mp3', rare: false },
  { id: 'verg-002', title: 'Мем 2', image: 'assets/memes/verg-002.svg', caption: "А действительно, где?", audio: 'assets/audio/вере из мотиватион.mp3', rare: false },
  { id: 'verg-003', title: 'Мем 3', image: 'assets/memes/verg-003.svg', caption: "Возможно, сегодня придётся прибегнуть к помощи не только POWER и MOTIVATION", audio: 'assets/audio/Хочу мармеладки.mp3', rare: false },
  { id: 'verg-004', title: 'Мем 4', image: 'assets/memes/verg-004.svg', caption: "Нужно больше POWER", audio: 'assets/audio/зе шторм.mp3', rare: false },
  { id: 'verg-005', title: 'Мем 5', image: 'assets/memes/verg-005.svg', caption: "Используй максимум MOTIVATION. И таблетки не забудь", audio: 'assets/audio/вере из мотиватион.mp3', rare: false },
  { id: 'verg-006', title: 'Мем 6', image: 'assets/memes/verg-006.svg', caption: "Даже во сне ты будешь накапливать POWER и MOTIVATION", audio: 'assets/audio/Верг_в_кровати.mp3', rare: false },
  { id: 'verg-007', title: 'Мем 7', image: 'assets/memes/verg-007.svg', caption: "Сегодня ты немного душный, но это не делает твою POWER меньше", audio: 'assets/audio/атеншн класс.mp3', rare: false },
  { id: 'verg-008', title: 'Мем 8', image: 'assets/memes/verg-008.svg', caption: "А ты уже принял дозу MOTIVATION", audio: 'assets/audio/травка-мотивация.mp3', rare: false },
  { id: 'verg-009', title: 'Мем 9', image: 'assets/memes/verg-009.svg', caption: "Сегодня тебя посетят философские вопросы", audio: 'assets/audio/форм оф повер.mp3', rare: false },
  { id: 'verg-010', title: 'Мем 10', image: 'assets/memes/verg-010.svg', caption: "Постарайся сегодня не воспринимать всё ТАК буквально", audio: 'assets/audio/могилка.mp3', rare: false },
  { id: 'verg-011', title: 'Мем 11', image: 'assets/memes/verg-011.svg', caption: "Сегодня дядя Верг отсыпал тебе немного MOTIVATION. Не просри её", audio: 'assets/audio/больше повер.mp3', rare: false },
  { id: 'verg-012', title: 'Мем 12', image: 'assets/memes/verg-012.svg', caption: "Сегодня тебе придётся применить всю свою POWER. Мы не знаем зачем, но придётся", audio: 'assets/audio/больше повер.mp3', rare: false },
  { id: 'verg-013', title: 'Мем 13', image: 'assets/memes/verg-013.svg', caption: "Возможно, сегодня тебе предстоит работа в команде, а значит, будет больше POWER и MOTIVATION", audio: 'assets/audio/вере из мотиватион.mp3', rare: false },
  { id: 'verg-014', title: 'Мем 14', image: 'assets/memes/verg-014.svg', caption: "Зачем выбирать? Объединяй!", audio: 'assets/audio/сдвгшни-аутист.mp3', rare: false },
  { id: 'verg-015', title: 'Мем 15', image: 'assets/memes/verg-015.svg', caption: "Сегодня ты найдёшь формулу успеха. Формула Ямато у тебя уже есть", audio: 'assets/audio/шота полное.mp3', rare: false },
  { id: 'verg-016', title: 'Мем 16', image: 'assets/memes/verg-016.svg', caption: "Помни, POWER много не бывает", audio: 'assets/audio/бихолд_с_энергосиками.mp3', rare: false },
  { id: 'verg-017', title: 'Мем 17', image: 'assets/memes/verg-017.svg', caption: "Сегодня ты просто крут!", audio: 'assets/audio/зе шторм 2.mp3', rare: false },
  { id: 'verg-018', title: 'Мем 18', image: 'assets/memes/verg-018.svg', caption: "Сегодня тебе нужно чуть больше POWER. Выпей энергосику, братишка", audio: 'assets/audio/бихолд_с_энергосиками.mp3', rare: false },
  { id: 'verg-019', title: 'Мем 19', image: 'assets/memes/verg-019.svg', caption: "Сегодня ты просто «I am the storm that is approaching»", audio: 'assets/audio/зе шторм.mp3', rare: false },
  { id: 'verg-020', title: 'Мем 20', image: 'assets/memes/verg-020.svg', caption: "Сегодня тебе лучше побыть котиком и поднакопить POWER", audio: 'assets/audio/зе шторм 3 колыбельная котик.mp3', rare: false },
  { id: 'verg-021', title: 'Мем 21', image: 'assets/memes/verg-021.svg', caption: "Сегодня ты не чувствуешь POWER и MOTIVATION. Но ты ж не лох какой-то чтоб сдаться на первой же миссии с боссом.", audio: 'assets/audio/Верг-скелет.mp3', rare: false },
  { id: 'verg-022', title: 'Мем 22', image: 'assets/memes/verg-022.svg', caption: "Сегодня у тебя будет много вопросов и очень мало ответов. MOTIVATION особо не поможет", audio: 'assets/audio/мем_типо_песочек.mp3', rare: false },
  { id: 'verg-023', title: 'Мем 23', image: 'assets/memes/verg-023.svg', caption: "Сегодня тебя ждёт пробитие", audio: 'assets/audio/пробитие.mp3', rare: false },
  { id: 'verg-024', title: 'Мем 24', image: 'assets/memes/verg-024.svg', caption: "Никакая POWER не поможет, если ты лох", audio: 'assets/audio/вере из мотиватион.mp3', rare: false },
  { id: 'verg-025', title: 'Мем 25', image: 'assets/memes/verg-025.svg', caption: "Сегодня POWER и MOTIVATION тебе особо не помогут", audio: 'assets/audio/пусть_будет.mp3', rare: false },
  { id: 'verg-026', title: 'Мем 26', image: 'assets/memes/verg-026.svg', caption: "Ну так дашь или как?", audio: 'assets/audio/дай_повер_потрогать.mp3', rare: false },
  { id: 'verg-027', title: 'Мем 27', image: 'assets/memes/verg-027.svg', caption: "Сегодня у тебя чуть меньше MOTIVATION. Ничего, так бывает. Дядя Верг тебя пожалеет", audio: 'assets/audio/мем_типо_песочек.mp3', rare: false },
  { id: 'verg-028', title: 'Мем 28', image: 'assets/memes/verg-028.svg', caption: "Сохраняй спокойствие, братишка. Это просто избыток POWER", audio: 'assets/audio/куда-то на повер.mp3', rare: false },
  { id: 'verg-029', title: 'Мем 29', image: 'assets/memes/verg-029.svg', caption: "Сегодня твоя MOTIVATION неудержима", audio: 'assets/audio/зе шторм 2.mp3', rare: false },
  { id: 'verg-030', title: 'Мем 30', image: 'assets/memes/verg-030.svg', caption: "Больше POWER. Больше MOTIVATION.", audio: 'assets/audio/тоже на повер.mp3', rare: false },
];
