import { useEffect } from 'react';
import { LETTER } from '../data/letter';
import { markLetterSeen } from '../utils/letter';

export default function LetterScreen({ onBack }: { onBack: () => void }) {
  useEffect(() => {
    markLetterSeen();
  }, []);

  return (
    <main className="screen m-list">
      <h1 className="m-title">{LETTER.title}</h1>
      <article className="m-letter">
        {LETTER.paragraphs.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
        {LETTER.signature && <p className="m-sign">{LETTER.signature}</p>}
      </article>
      <button className="btn alt" onClick={onBack}>
        НАЗАД
      </button>
    </main>
  );
}
