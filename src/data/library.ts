// ФОНОТЕКА: полные оригинальные треки, из которых нарезаны музыкальные фрагменты для карточек.
// Положи файлы в public/assets/library/ и впиши их сюда. Порядок в списке = порядок на экране.
// Советы: MP3 128–160 кбит/с хватает за глаза, иначе APK получится очень тяжёлым.

export type LibraryTrack = {
  id: string;
  title: string;
  /** необязательно: исполнитель / игра / альбом, показывается мелким шрифтом */
  artist?: string;
  /** путь относительно public/, например assets/library/bury-the-light.mp3 */
  file: string;
};

export const LIBRARY: LibraryTrack[] = [
  // Пример (раскомментируй и замени на свои):
   { id: 'lib-01', title: 'Bury the Light', artist: 'DmC 5', file: 'assets/library/lib-01.mp3' },
   { id: 'lib-02', title: 'The idol of Time and Space', artist: 'DmC 4', file: 'assets/library/lib-02.mp3' },
   { id: 'lib-03', title: 'Devils Never Cry', artist: 'DmC 3', file: 'assets/library/lib-04.mp3' },
   { id: 'lib-04', title: 'Vergil Battle 1', artist: 'DmC 3', file: 'assets/library/lib-03.mp3' },
   { id: 'lib-05', title: 'Vergil Battle 2', artist: 'DmC 3', file: 'assets/library/lib-05.mp3' },
   { id: 'lib-06', title: 'Vergil Battle 3', artist: 'DmC 3', file: 'assets/library/lib-06.mp3' },
   { id: 'lib-07', title: 'Urizen battle', artist: 'DmC 5', file: 'assets/library/lib-07.mp3' },
   { id: 'lib-08', title: 'Ultra Violet', artist: 'DmC 1', file: 'assets/library/lib-08.mp3' },
   { id: 'lib-09', title: 'Beowulf Battle', artist: 'DmC 3', file: 'assets/library/lib-09.mp3' },
];
