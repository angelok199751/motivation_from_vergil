import { useEffect, useState } from 'react';
import { START_AUDIO } from '../data/memes';
import { playTheme } from '../utils/audio';
import { isLetterSeen } from '../utils/letter';

type Props = {
  /** Режим «Получить больше мотивации». Если не передан — кнопка скрыта. */
  onRandom?: () => void;
  onDaily: () => void;
  onAll: () => void;
  onLibrary: () => void;
  onLetter: () => void;
};

export default function StartScreen({ onRandom, onDaily, onAll, onLibrary, onLetter }: Props) {
  const [unread] = useState(() => !isLetterSeen());

  // Главная тема играет постоянно. Если браузер заблокировал автозапуск —
  // стартует с первого касания. Уже играющая тема не перезапускается.
  useEffect(() => {
    if (!START_AUDIO) return;
    playTheme(START_AUDIO);
    const kick = () => playTheme(START_AUDIO);
    window.addEventListener('pointerdown', kick, { once: true });
    return () => window.removeEventListener('pointerdown', kick);
  }, []);

  return (
    <main className="screen start">
      <button className="m-letter-btn" onClick={onLetter} aria-label="Письмо">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3.5 6.5 12 13l8.5-6.5" />
        </svg>
        {unread && <i className="m-dot" aria-hidden />}
      </button>
      <h1>Какой Вергилий ты сегодня?</h1>
      <nav className="m-menu">
        {onRandom && (
          <button className="btn" onClick={onRandom}>
            ПОЛУЧИТЬ БОЛЬШЕ МОТИВАЦИИ
          </button>
        )}
        <button className={onRandom ? 'btn alt' : 'btn'} onClick={onDaily}>
          ЕЖЕДНЕВНАЯ КАРТОЧКА
        </button>
        <button className="btn alt" onClick={onAll}>
          ВСЕ КАРТОЧКИ
        </button>
        <button className="btn alt" onClick={onLibrary}>
          ФОНОТЕКА
        </button>
      </nav>
    </main>
  );
}
