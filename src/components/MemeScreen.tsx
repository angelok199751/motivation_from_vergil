import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { VergilMeme } from '../data/memes';
import { playAudio, stopAudio } from '../utils/audio';

type Props = {
  meme: VergilMeme;
  /** Маленькая строка над картинкой, например «3 / 30» */
  counter?: string;
  /** Кнопки и пояснения под подписью */
  footer: ReactNode;
  /** Играть музыку этой карточки (и остановить при уходе с экрана) */
  playMusic?: boolean;
  /** Сколько px по высоте занимает всё, кроме картинки (чтобы страница не прокручивалась). По умолчанию 290. */
  reserve?: number;
};

export default function MemeScreen({ meme, counter, footer, playMusic = false, reserve }: Props) {
  const [broken, setBroken] = useState(false);
  const boxRef = useRef<HTMLParagraphElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!playMusic) return;
    playAudio(meme.audio);
    return () => stopAudio();
  }, [meme.id, meme.audio, playMusic]);

  // Подбираем размер шрифта: на ПК строго до 2 строк, на телефоне до 4.
  useLayoutEffect(() => {
    const fit = () => {
      const box = boxRef.current;
      const text = textRef.current;
      if (!box || !text) return;
      const wide = window.innerWidth >= 900;
      const maxLines = wide ? 2 : 4;
      const minSize = wide ? 16 : 13;
      box.style.fontSize = '';
      let size = parseFloat(getComputedStyle(box).fontSize);
      const lineH = () => parseFloat(getComputedStyle(box).lineHeight);
      while (size > minSize && text.getBoundingClientRect().height > lineH() * maxLines + 1) {
        size -= 1;
        box.style.fontSize = size + 'px';
      }
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [meme.id]);

  return (
    <main className="screen meme" style={reserve ? ({ '--reserve': `${reserve}px` } as CSSProperties) : undefined}>
      {counter && <div className="counter">{counter}</div>}
      {broken ? (
        <div className="placeholder">Картинка не найдена</div>
      ) : (
        <img className="img" src={meme.image} alt={meme.title} onError={() => setBroken(true)} />
      )}
      <p className="caption" ref={boxRef}>
        <span ref={textRef}>{meme.caption}</span>
      </p>
      {footer}
    </main>
  );
}
