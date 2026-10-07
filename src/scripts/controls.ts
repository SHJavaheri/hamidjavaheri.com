/** House lights (theme) and the ambient score (audio). */

const store = {
  get(k: string) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};

export function initTheme() {
  const root = document.documentElement;
  const btn = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  const label = document.querySelector('[data-theme-label]');
  const meta = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');
  const paint = () => {
    const light = root.dataset.theme !== 'dark';
    btn?.setAttribute('aria-pressed', String(light));
    if (label) label.textContent = light ? 'House lights up' : 'House lights down';
    meta.forEach((m) => (m.content = light ? '#fbfaf7' : '#050506'));
  };
  paint();
  btn?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    const swap = () => {
      root.dataset.theme = next;
      paint();
      window.dispatchEvent(new CustomEvent('hj:theme', { detail: next }));
    };
    // A view transition makes the lights fade rather than snap, where supported.
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (doc.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) doc.startViewTransition(swap);
    else swap();
    store.set('hj-theme', next);
  });
}

export function initAudio() {
  const audio = document.querySelector<HTMLAudioElement>('[data-audio]');
  const wrap = document.querySelector<HTMLElement>('[data-sound]');
  const btn = document.querySelector<HTMLButtonElement>('[data-sound-toggle]');
  const label = document.querySelector('[data-sound-label]');
  const slider = document.querySelector<HTMLInputElement>('[data-volume]');
  const out = document.querySelector<HTMLOutputElement>('[data-volume-out]');
  if (!audio || !btn || !slider) return;

  const savedVol = Number(store.get('hj-volume'));
  let volume = Number.isFinite(savedVol) && store.get('hj-volume') !== null ? savedVol : 5; // percent
  // Only an explicit "off" from the visitor keeps the score silent.
  let wantsSound = store.get('hj-sound') !== 'off';

  const paintVolume = () => {
    slider.value = String(volume);
    slider.style.setProperty('--fill', `${(volume / Number(slider.max)) * 100}%`);
    if (out) out.textContent = `${volume}%`;
  };
  const paint = () => {
    const on = !audio.paused && !audio.muted;
    wrap?.classList.toggle('on', on);
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', on ? 'Sound: on' : 'Sound: off');
    if (label) label.textContent = on ? 'Sound on' : 'Sound off';
  };

  let fade = 0;
  const fadeTo = (target: number, ms = 1600) => {
    cancelAnimationFrame(fade);
    const from = audio.volume, t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      audio.volume = from + (target - from) * (1 - Math.pow(1 - k, 3));
      if (k < 1) fade = requestAnimationFrame(step);
    };
    fade = requestAnimationFrame(step);
  };

  const play = async () => {
    try {
      audio.volume = 0;
      await audio.play();
      fadeTo(volume / 100);
      paint();
      return true;
    } catch {
      paint();
      return false;
    }
  };

  // 1) Try right away. Most browsers block sound until the visitor interacts.
  // 2) If blocked, the first click, tap or key press anywhere starts it.
  const unlockEvents = ['pointerdown', 'keydown', 'touchend'] as const;
  const unlock = (e: Event) => {
    if ((e.target as Element | null)?.closest?.('[data-sound]')) return; // the sound control handles itself
    unlockEvents.forEach((n) => window.removeEventListener(n, unlock, true));
    if (wantsSound && audio.paused) play();
  };
  if (wantsSound) {
    play().then((ok) => {
      if (!ok) unlockEvents.forEach((n) => window.addEventListener(n, unlock, { capture: true, passive: true }));
    });
  }

  btn.addEventListener('click', async () => {
    if (audio.paused) {
      wantsSound = true;
      store.set('hj-sound', 'on');
      if (volume === 0) { volume = 5; paintVolume(); }
      await play();
    } else {
      wantsSound = false;
      store.set('hj-sound', 'off');
      audio.pause();
      paint();
    }
  });

  slider.addEventListener('input', () => {
    volume = Number(slider.value);
    store.set('hj-volume', String(volume));
    paintVolume();
    cancelAnimationFrame(fade);
    audio.volume = volume / 100;
    if (volume > 0 && audio.paused && wantsSound) play();
  });

  // Quiet the stage when the tab is hidden; bring it back when the visitor returns.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (!audio.paused) { audio.dataset.resume = '1'; audio.pause(); } }
    else if (audio.dataset.resume) { delete audio.dataset.resume; play(); }
  });

  paintVolume();
  paint();
}
