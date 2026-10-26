import { useEffect, useState } from 'react';
import { BY_ID } from '../data/lookup';
import { remaining, todayStr, todaysEntry, type DailyState } from '../utils/daily';
import MemeScreen from './MemeScreen';

type Props = {
  state: DailyState;
  onOpen: () => void;
  onReset: () => void;
  onCollection: () => void;
  onBack: () => void;
};

/** Кнопка сброса с подтверждением вторым нажатием */
function ResetButton({ onReset }: { onReset: () => void }) {
  const [sure, setSure] = useState(false);
  useEffect(() => {
    if (!sure) return;
    const t = window.setTimeout(() => setSure(false), 4000);
    return () => window.clearTimeout(t);
  }, [sure]);
  return (
    <button
      className="btn ghost"
      onClick={() => {
        if (sure) onReset();
        else setSure(true);
      }}
    >
      {sure ? 'ТОЧНО СБРОСИТЬ?' : 'СБРОСИТЬ ПРОГРЕСС'}
    </button>
  );
}

export default function DailyScreen({ state, onOpen, onReset, onCollection, onBack }: Props) {
  // Дата пересчитывается, когда приложение возвращается из фона (вдруг наступил новый день).
  const [today, setToday] = useState(todayStr());
  useEffect(() => {
    const update = () => setToday(todayStr());
    document.addEventListener('visibilitychange', update);
    window.addEventListener('focus', update);
    return () => {
      document.removeEventListener('visibilitychange', update);
      window.removeEventListener('focus', update);
    };
  }, []);

  const entry = todaysEntry(state, today);
  const meme = entry ? BY_ID.get(entry.id) : undefined;
  const opened = state.opened.length;
  const total = state.order.length;
  const left = remaining(state);

  // 1. Сегодняшняя карточка уже открыта — показываем её
  if (entry && meme) {
    return (
      <MemeScreen
        key={meme.id}
        meme={meme}
        counter={`Открыто ${opened} / ${total}`}
        playMusic
        reserve={420}
        footer={
          <>
            <p className="m-note">
              {left > 0 ? 'Следующая карточка откроется завтра' : 'Это была последняя карточка!'}
            </p>
            <div className="m-actions">
              <button className="btn" onClick={onCollection}>
                ОТКРЫТЫЕ КАРТОЧКИ
              </button>
              <button className="btn alt" onClick={onBack}>
                НАЗАД
              </button>
            </div>
            <ResetButton onReset={onReset} />
          </>
        }
      />
    );
  }

  // 2. Все карточки уже открыты в прошлые дни
  if (left <= 0) {
    return (
      <main className="screen start">
        <h1 className="m-title">Все карточки открыты</h1>
        <p className="m-note">Ты собрал все {total}. Можно пересмотреть коллекцию или начать заново.</p>
        <div className="m-actions">
          <button className="btn" onClick={onCollection}>
            ОТКРЫТЫЕ КАРТОЧКИ
          </button>
          <button className="btn alt" onClick={onBack}>
            НАЗАД
          </button>
        </div>
        <ResetButton onReset={onReset} />
      </main>
    );
  }

  // 3. Сегодняшняя карточка ещё ждёт
  return (
    <main className="screen start">
      <h1 className="m-title">Карточка дня</h1>
      <p className="m-note">
        {opened === 0
          ? 'Каждый день — одна новая карточка. Первая ждёт тебя.'
          : `Сегодня тебя ждёт новая карточка. Открыто ${opened} из ${total}.`}
      </p>
      <button className="btn" onClick={onOpen}>
        ОТКРЫТЬ КАРТОЧКУ
      </button>
      <div className="m-actions">
        {opened > 0 && (
          <button className="btn alt" onClick={onCollection}>
            ОТКРЫТЫЕ КАРТОЧКИ
          </button>
        )}
        <button className="btn alt" onClick={onBack}>
          НАЗАД
        </button>
      </div>
      {opened > 0 && <ResetButton onReset={onReset} />}
    </main>
  );
}
