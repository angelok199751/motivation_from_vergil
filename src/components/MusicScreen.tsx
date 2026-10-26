import { useEffect, useState } from 'react';
import { MEMES, START_AUDIO } from '../data/memes';
import { playAudio, stopAudio } from '../utils/audio';

type Track = { src: string; title: string };

/** Все треки приложения без повторов: стартовая тема и музыка карточек. */
function buildTracks(): Track[] {
  const tracks: Track[] = [];
  const seen = new Set<string>();
  if (START_AUDIO) {
    tracks.push({ src: START_AUDIO, title: 'Стартовая тема' });
    seen.add(START_AUDIO);
  }
  for (const m of MEMES) {
    if (m.audio && !seen.has(m.audio)) {
      seen.add(m.audio);
      tracks.push({ src: m.audio, title: m.title });
    }
  }
  return tracks;
}

const TRACKS = buildTracks();

export default function MusicScreen({ onBack }: { onBack: () => void }) {
  const [playing, setPlaying] = useState('');

  // При уходе с экрана музыка выключается
  useEffect(() => () => stopAudio(), []);

  const toggle = (src: string) => {
    if (playing === src) {
      stopAudio();
      setPlaying('');
      return;
    }
    setPlaying(src);
    // onEnd срабатывает, когда трек доиграл или файл не удалось проиграть
    playAudio(src, false, () => setPlaying((p) => (p === src ? '' : p)));
  };

  return (
    <main className="screen m-list">
      <h1 className="m-title">Музыка</h1>
      {TRACKS.length === 0 ? (
        <p className="m-note">Треки ещё не добавлены</p>
      ) : (
        <ul className="m-tracks">
          {TRACKS.map((t) => {
            const on = playing === t.src;
            return (
              <li key={t.src}>
                <button className={`m-track${on ? ' on' : ''}`} onClick={() => toggle(t.src)}>
                  <span className={`m-play${on ? ' stop' : ''}`} aria-hidden />
                  <span className="m-track-title">{t.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <button className="btn alt" onClick={onBack}>
        НАЗАД
      </button>
    </main>
  );
}
