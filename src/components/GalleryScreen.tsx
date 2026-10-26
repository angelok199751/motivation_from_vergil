import { useEffect, useState } from 'react';
import { BY_ID } from '../data/lookup';
import { START_AUDIO } from '../data/memes';
import { playTheme } from '../utils/audio';
import type { OpenedEntry } from '../utils/daily';

type Props = {
  /** all — все карточки открыты; opened — только открытые в ежедневном режиме */
  mode: 'all' | 'opened';
  /** Порядок ячеек: для «all» — порядок из memes.ts, для «opened» — сохранённый порядок колоды */
  orderIds: string[];
  opened: OpenedEntry[];
  onPick: (ids: string[], index: number) => void;
  onBack: () => void;
};

function Thumb({ src, alt }: { src: string; alt: string }) {
  const [broken, setBroken] = useState(false);
  if (broken) return <span className="m-thumb-missing">{alt}</span>;
  return <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setBroken(true)} />;
}

function shortDate(iso: string): string {
  const [, m, d] = iso.split('-');
  return `${d}.${m}`;
}

export default function GalleryScreen({ mode, orderIds, opened, onPick, onBack }: Props) {
  // На сетке играет главная тема: уже играющая не перезапускается,
  // а прерванную карточкой музыку продолжает с того же места.
  useEffect(() => {
    if (START_AUDIO) playTheme(START_AUDIO);
  }, []);

  const openedIds = opened.map((e) => e.id);
  const dateOf = new Map(opened.map((e) => [e.id, e.date]));
  const viewIds = mode === 'all' ? orderIds : openedIds;
  const title = mode === 'all' ? 'Все карточки' : `Открытые карточки ${openedIds.length} / ${orderIds.length}`;

  return (
    <main className="screen m-list">
      <h1 className="m-title">{title}</h1>
      <div className="m-grid">
        {orderIds.map((id) => {
          const meme = BY_ID.get(id);
          if (!meme) return null;
          const unlocked = mode === 'all' || dateOf.has(id);
          if (!unlocked) {
            return (
              <div key={id} className="m-cell locked" aria-label="Карточка ещё закрыта">
                <span className="m-lock">?</span>
              </div>
            );
          }
          const index = viewIds.indexOf(id);
          const stamp = mode === 'opened' ? `${index + 1} · ${shortDate(dateOf.get(id) ?? '')}` : '';
          return (
            <button key={id} className="m-cell" onClick={() => onPick(viewIds, index)}>
              <Thumb src={meme.image} alt={meme.title} />
              {stamp && <span className="m-stamp">{stamp}</span>}
            </button>
          );
        })}
      </div>
      <button className="btn alt" onClick={onBack}>
        НАЗАД
      </button>
    </main>
  );
}
