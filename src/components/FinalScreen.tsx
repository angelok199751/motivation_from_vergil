// Финальную фразу можно менять здесь.
const FINAL_TEXT = 'Ты обрёл силу. Но какой ценой?';

export default function FinalScreen({ onRestart }: { onRestart: () => void }) {
  return (
    <main className="screen start">
      <h1>{FINAL_TEXT}</h1>
      <button className="btn" onClick={onRestart}>
        ЕЩЁ РАЗ
      </button>
    </main>
  );
}
