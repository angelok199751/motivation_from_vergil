import { useCallback, useEffect, useRef, useState } from 'react';
import type { VergilMeme } from './data/memes';
import { ALL_IDS, BY_ID } from './data/lookup';
import { newDeck } from './utils/shuffle';
import { playAudio, stopAudio } from './utils/audio';
import { freshState, loadDaily, openNext, saveDaily, todayStr, type DailyState } from './utils/daily';
import StartScreen from './components/StartScreen';
import MemeScreen from './components/MemeScreen';
import FinalScreen from './components/FinalScreen';
import DailyScreen from './components/DailyScreen';
import GalleryScreen from './components/GalleryScreen';
import ViewScreen from './components/ViewScreen';
import LibraryScreen from './components/LibraryScreen';
import LetterScreen from './components/LetterScreen';
import './screens.css';

type Screen =
  | { name: 'start' }
  | { name: 'meme' } // режим «Получить больше мотивации»
  | { name: 'final' }
  | { name: 'daily' }
  | { name: 'gallery'; mode: 'all' | 'opened' }
  | { name: 'view'; ids: string[]; index: number }
  | { name: 'library' }
  | { name: 'letter' };

const START: Screen = { name: 'start' };

// Режим «Получить больше мотивации» (бесконечные случайные карточки). Скрыт из меню;
// чтобы вернуть кнопку, поставь true.
const SHOW_RANDOM_MODE = false;

export default function App() {
  const [screen, setScreen] = useState<Screen>(START);
  const screenRef = useRef<Screen>(screen);
  screenRef.current = screen;

  // ---- режим «Получить больше мотивации» (не сохраняется) ----
  const [current, setCurrent] = useState<VergilMeme | null>(null);
  const [shown, setShown] = useState(0);
  const [tick, setTick] = useState(0); // для перезапуска анимации появления
  const deck = useRef<string[]>(newDeck(ALL_IDS));
  const lastId = useRef<string | undefined>(undefined);
  const busy = useRef(false);

  // ---- режим «Ежедневная карточка» (сохраняется в памяти телефона) ----
  const [daily, setDaily] = useState<DailyState>(() => loadDaily(ALL_IDS));
  useEffect(() => {
    saveDaily(daily);
  }, [daily]);

  // ---- навигация: каждый экран — запись в истории, поэтому системная кнопка «Назад» работает сама ----
  const go = useCallback((s: Screen, replace = false) => {
    if (replace) window.history.replaceState({ screen: s }, '');
    else window.history.pushState({ screen: s }, '');
    setScreen(s);
  }, []);
  const back = useCallback(() => window.history.back(), []);

  useEffect(() => {
    window.history.replaceState({ screen: START }, '');
    const onPop = (e: PopStateEvent) => {
      const s = (e.state as { screen?: Screen } | null)?.screen;
      setScreen(s ?? START);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const next: () => void = useCallback(() => {
    if (busy.current) return; // защита от двойных нажатий
    busy.current = true;
    window.setTimeout(() => (busy.current = false), 450);

    const id = deck.current.shift();
    if (!id) {
      stopAudio();
      go({ name: 'final' }, true);
      return;
    }
    const meme = BY_ID.get(id);
    if (!meme) {
      busy.current = false;
      next();
      return;
    }
    lastId.current = id;
    setCurrent(meme);
    setShown((n) => n + 1);
    setTick((t) => t + 1);
    go({ name: 'meme' }, screenRef.current.name === 'meme');
    playAudio(meme.audio);
  }, [go]);

  const restart = useCallback(() => {
    deck.current = newDeck(ALL_IDS, lastId.current); // новый порядок на всю пачку
    setShown(0);
    setCurrent(null);
    back(); // финал открыт поверх стартового экрана, возвращаемся на него
  }, [back]);

  const openToday = useCallback(() => setDaily((d) => openNext(d, todayStr())), []);
  const resetDaily = useCallback(() => setDaily(freshState(ALL_IDS)), []);

  // ---- что показывать ----
  switch (screen.name) {
    case 'final':
      return <FinalScreen onRestart={restart} />;

    case 'meme':
      if (current) {
        return (
          <MemeScreen
            key={tick}
            meme={current}
            counter={`${shown} / ${ALL_IDS.length}`}
            footer={
              <button className="btn" onClick={next}>
                {deck.current.length === 0 ? 'ФИНАЛ' : 'БОЛЬШЕ POWER и MOTIVATION'}
              </button>
            }
          />
        );
      }
      break;

    case 'daily':
      return (
        <DailyScreen
          state={daily}
          onOpen={openToday}
          onReset={resetDaily}
          onCollection={() => go({ name: 'gallery', mode: 'opened' })}
          onBack={back}
        />
      );

    case 'gallery':
      return (
        <GalleryScreen
          mode={screen.mode}
          orderIds={screen.mode === 'all' ? ALL_IDS : daily.order}
          opened={daily.opened}
          onPick={(ids, index) => go({ name: 'view', ids, index })}
          onBack={back}
        />
      );

    case 'view':
      return (
        <ViewScreen
          ids={screen.ids}
          index={screen.index}
          onIndex={(index) => go({ name: 'view', ids: screen.ids, index }, true)}
          onBack={back}
        />
      );

    case 'library':
      return <LibraryScreen onBack={back} />;

    case 'letter':
      return <LetterScreen onBack={back} />;
  }

  return (
    <StartScreen
      onRandom={SHOW_RANDOM_MODE ? next : undefined}
      onDaily={() => go({ name: 'daily' })}
      onAll={() => go({ name: 'gallery', mode: 'all' })}
      onLibrary={() => go({ name: 'library' })}
      onLetter={() => go({ name: 'letter' })}
    />
  );
}
