import { useEffect, useRef, useState } from 'react';
import { LIBRARY } from '../data/library';
import {
  audioState,
  getVolume,
  pauseAudio,
  playAudio,
  resumeAudio,
  seekAudio,
  setVolume,
  stopAudio,
} from '../utils/audio';

function fmt(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

const Play = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path d="M7 4v16l13-8z" fill="currentColor" />
  </svg>
);
const Pause = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path d="M6 4h4v16H6zM14 4h4v16h-4z" fill="currentColor" />
  </svg>
);
const Prev = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path d="M6 5h2v14H6zM20 5v14L9 12z" fill="currentColor" />
  </svg>
);
const Next = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path d="M16 5h2v14h-2zM4 5v14l11-7z" fill="currentColor" />
  </svg>
);

export default function LibraryScreen({ onBack }: { onBack: () => void }) {
  const [index, setIndex] = useState(-1); // номер играющего трека, -1 = ничего не выбрано
  const [failed, setFailed] = useState(-1); // номер трека, который не удалось проиграть
  const [paused, setPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVol] = useState(getVolume());
  const failedRef = useRef(false);

  // При уходе с экрана звук выключается (главная тема потом продолжится на других экранах)
  useEffect(() => () => stopAudio(), []);

  // Обновляем ползунок, пока выбран трек
  useEffect(() => {
    if (index < 0) return;
    const id = window.setInterval(() => {
      const st = audioState();
      setTime(st.time);
      setDuration(st.duration);
    }, 250);
    return () => window.clearInterval(id);
  }, [index]);

  const play = (i: number) => {
    const track = LIBRARY[i];
    if (!track) return;
    failedRef.current = false;
    setIndex(i);
    setFailed(-1);
    setPaused(false);
    setTime(0);
    setDuration(0);
    playAudio(
      track.file,
      false,
      // трек доиграл (или не запустился)
      () => {
        if (failedRef.current) {
          setIndex(-1); // ошибка: дальше не листаем, чтобы не крутить битые файлы по кругу
          return;
        }
        if (i + 1 < LIBRARY.length) play(i + 1); // автопереход к следующему
        else setIndex(-1);
      },
      () => {
        failedRef.current = true;
        setFailed(i);
      },
    );
  };

  const togglePause = () => {
    if (paused) {
      resumeAudio();
      setPaused(false);
    } else {
      pauseAudio();
      setPaused(true);
    }
  };

  const onRow = (i: number) => (i === index ? togglePause() : play(i));
  const next = () => {
    if (index + 1 < LIBRARY.length) play(index + 1);
  };
  // как в обычных плеерах: если трек играет уже больше 3 секунд — «назад» начинает его заново
  const prev = () => {
    if (time > 3 || index <= 0) {
      seekAudio(0);
      setTime(0);
    } else {
      play(index - 1);
    }
  };

  const current = index >= 0 ? LIBRARY[index] : undefined;

  return (
    <main className="screen m-list">
      <h1 className="m-title">Фонотека</h1>
      {LIBRARY.length === 0 ? (
        <p className="m-note">Треки ещё не добавлены</p>
      ) : (
        <ul className="m-tracks">
          {LIBRARY.map((t, i) => {
            const on = i === index;
            return (
              <li key={t.id}>
                <button className={`m-track${on ? ' on' : ''}`} onClick={() => onRow(i)}>
                  <span className="m-play">{on && !paused ? <Pause /> : <Play />}</span>
                  <span className="m-track-title">
                    {t.title}
                    {t.artist && <small>{t.artist}</small>}
                  </span>
                </button>
                {failed === i && (
                  <p className="m-error">
                    Не удалось воспроизвести «{t.file}». Проверь: файл лежит в public/assets/library/, путь в
                    library.ts совпадает с именем файла, формат MP3.
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {current && (
        <div className="m-player">
          <div className="m-now">
            <strong>{current.title}</strong>
            {current.artist && <small>{current.artist}</small>}
          </div>
          <div className="m-ctrls">
            <button className="m-ctrl" aria-label="Предыдущий" onClick={prev}>
              <Prev />
            </button>
            <button className="m-ctrl main" aria-label={paused ? 'Играть' : 'Пауза'} onClick={togglePause}>
              {paused ? <Play /> : <Pause />}
            </button>
            <button className="m-ctrl" aria-label="Следующий" disabled={index >= LIBRARY.length - 1} onClick={next}>
              <Next />
            </button>
          </div>
          <div className="m-seek">
            <span>{fmt(time)}</span>
            <input
              type="range"
              min={0}
              max={duration || 1}
              step={1}
              value={Math.min(time, duration || 1)}
              aria-label="Перемотка"
              onChange={(e) => {
                const v = Number(e.target.value);
                setTime(v);
                seekAudio(v);
              }}
            />
            <span>{fmt(duration)}</span>
          </div>
          <label className="m-vol">
            <span>Громкость</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              aria-label="Громкость"
              onChange={(e) => {
                const v = Number(e.target.value);
                setVol(v);
                setVolume(v);
              }}
            />
            <span>{Math.round(volume * 100)}%</span>
          </label>
        </div>
      )}

      <button className="btn alt" onClick={onBack}>
        НАЗАД
      </button>
    </main>
  );
}
