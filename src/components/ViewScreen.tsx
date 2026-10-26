import { BY_ID } from '../data/lookup';
import MemeScreen from './MemeScreen';

type Props = {
  ids: string[];
  index: number;
  onIndex: (index: number) => void;
  onBack: () => void;
};

/** Просмотр одной карточки из галереи: картинка, подпись, её музыка и стрелки влево/вправо. */
export default function ViewScreen({ ids, index, onIndex, onBack }: Props) {
  const meme = BY_ID.get(ids[index]);
  if (!meme) {
    return (
      <main className="screen start">
        <p className="m-note">Карточка не найдена</p>
        <button className="btn alt" onClick={onBack}>
          К СПИСКУ
        </button>
      </main>
    );
  }
  return (
    <MemeScreen
      key={meme.id}
      meme={meme}
      counter={`${index + 1} / ${ids.length}`}
      playMusic
      footer={
        <div className="m-actions">
          <button
            className="btn icon prev"
            aria-label="Предыдущая"
            disabled={index <= 0}
            onClick={() => onIndex(index - 1)}
          />
          <button className="btn alt" onClick={onBack}>
            К СПИСКУ
          </button>
          <button
            className="btn icon next"
            aria-label="Следующая"
            disabled={index >= ids.length - 1}
            onClick={() => onIndex(index + 1)}
          />
        </div>
      }
    />
  );
}
