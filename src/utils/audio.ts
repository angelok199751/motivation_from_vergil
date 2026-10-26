// Один-единственный Audio на всё приложение: наложений быть не может.
let player: HTMLAudioElement | null = null;
let current = '';
let token = 0; // номер последнего запуска: устаревшие ошибки play() игнорируются

// Главная тема: запоминаем, где остановились, чтобы продолжить с того же места.
let themeSrc = '';
let themePos = 0;

/**
 * Приводит путь из данных к рабочему адресу: убирает ведущие «./», «/» и «public/»
 * и кодирует спецсимволы в названии файла (#, ?, %, пробелы, кириллица).
 */
export function assetUrl(path: string): string {
  const p = path.trim();
  if (/^[a-z][a-z0-9+.-]*:/i.test(p)) return p; // уже полный адрес
  const clean = p.replace(/^(\.\/|\/)+/, '').replace(/^public\//, '');
  return clean
    .split('/')
    .map((seg) => {
      try {
        return encodeURIComponent(decodeURIComponent(seg));
      } catch {
        return encodeURIComponent(seg);
      }
    })
    .join('/');
}

// Громкость общая для всего приложения (тема, карточки, фонотека) и запоминается.
const VOLUME_KEY = 'verg.volume.v1';
let volume = 1;
try {
  const saved = parseFloat(localStorage.getItem(VOLUME_KEY) ?? '');
  if (saved >= 0 && saved <= 1) volume = saved;
} catch {
  /* хранилище недоступно */
}

export function getVolume(): number {
  return volume;
}

export function setVolume(v: number): void {
  volume = Math.min(1, Math.max(0, v));
  try {
    if (player) player.volume = volume;
    localStorage.setItem(VOLUME_KEY, String(volume));
  } catch {
    /* ignore */
  }
}

function get(): HTMLAudioElement {
  if (!player) {
    player = new Audio();
    player.volume = volume;
  }
  return player;
}

/** Путь к треку, который играет прямо сейчас (пусто, если тишина). */
export function currentTrack(): string {
  return current;
}

export function stopAudio(): void {
  if (player && themeSrc && current === themeSrc) themePos = player.currentTime || 0;
  token++;
  current = '';
  if (!player) return;
  try {
    player.onended = null;
    player.pause();
    player.currentTime = 0;
  } catch {
    /* ignore */
  }
}

function start(path: string, loop: boolean, onEnd?: () => void, from = 0, onError?: () => void): void {
  stopAudio();
  if (!path) return;
  const mine = token;
  try {
    const a = get();
    a.loop = loop;
    a.src = assetUrl(path);
    if (from > 0) {
      a.addEventListener(
        'loadedmetadata',
        () => {
          if (mine !== token) return;
          try {
            a.currentTime = from;
          } catch {
            /* ignore */
          }
        },
        { once: true },
      );
    } else {
      a.currentTime = 0;
    }
    current = path;
    a.onended = () => {
      if (mine !== token) return;
      current = '';
      onEnd?.();
    };
    const p = a.play();
    if (p) {
      p.catch(() => {
        if (mine !== token) return; // уже запущен другой трек или всё остановлено
        current = '';
        onError?.();
        onEnd?.();
      });
    }
  } catch {
    if (mine === token) current = '';
    onError?.();
    onEnd?.();
  }
}

/**
 * Запускает файл с начала, предыдущий звук останавливается. Ошибки глотаются.
 * onEnd вызывается, когда трек доиграл или не смог запуститься; onError — только если не смог запуститься.
 */
export function playAudio(path: string, loop = false, onEnd?: () => void, onError?: () => void): void {
  start(path, loop, onEnd, 0, onError);
}

/**
 * Главная тема. Если она уже играет — ничего не делает (не перезапускается).
 * Если её прервал другой трек — продолжается с того места, где остановилась.
 */
export function playTheme(src: string): void {
  if (!src) return;
  themeSrc = src;
  if (current === src && player && !player.paused) return;
  start(src, true, undefined, themePos);
}

// ---- управление длинными треками (фонотека) ----
export function pauseAudio(): void {
  try {
    player?.pause();
  } catch {
    /* ignore */
  }
}

export function resumeAudio(): void {
  try {
    player?.play()?.catch(() => {});
  } catch {
    /* ignore */
  }
}

export function seekAudio(seconds: number): void {
  try {
    if (player && Number.isFinite(seconds)) player.currentTime = seconds;
  } catch {
    /* ignore */
  }
}

export function audioState(): { time: number; duration: number; paused: boolean } {
  if (!player) return { time: 0, duration: 0, paused: true };
  return {
    time: player.currentTime || 0,
    duration: Number.isFinite(player.duration) ? player.duration : 0,
    paused: player.paused,
  };
}
