// ── retroAudio.ts ───────────────────────────────────────────────────
// Lightweight 8-bit Sound Synthesizer via Web Audio API.
// Generates retro arcade tones without external audio assets (100% offline).

let audioCtx: AudioContext | null = null;
let soundEnabled = true;
let sirenLoopTimer: ReturnType<typeof setInterval> | null = null;
let isSirenLooping = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      audioCtx = new AudioCtx();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const retroAudio = {
  isEnabled(): boolean {
    const stored = localStorage.getItem('resqbox-sound');
    if (stored !== null) return stored === 'true';
    return soundEnabled;
  },

  setMuted(muted: boolean) {
    soundEnabled = !muted;
    localStorage.setItem('resqbox-sound', String(!muted));
  },

  toggleSound(): boolean {
    const next = !this.isEnabled();
    soundEnabled = next;
    localStorage.setItem('resqbox-sound', String(next));
    if (next) this.playSelect();
    return next;
  },

  // Soft high-frequency arcade hover blip
  playHover() {
    if (!this.isEnabled()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio context might be restricted before interaction
    }
  },

  // Confirm / Select button click
  playSelect() {
    if (!this.isEnabled()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.06); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.12); // G5

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // ignore
    }
  },

  // Level unlock / power-up fan-fare
  playUnlock() {
    if (!this.isEnabled()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + idx * 0.07;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.14);
      });
    } catch {
      // ignore
    }
  },

  // Power-up chime (item / crystal collected)
  playPowerup() {
    if (!this.isEnabled()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [330, 392, 493.88, 587.33, 659.25, 783.99]; // E4, G4, B4, D5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + idx * 0.05;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.09, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.16);
      });
    } catch {
      // ignore
    }
  },

  // Victory Fanfare
  playWin() {
    if (!this.isEnabled()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.5]; // C5, E5, G5, B5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + idx * 0.08;

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.22);
      });
    } catch {
      // ignore
    }
  },

  // Low earthquake tremor / rumble explosion
  playExplosion() {
    if (!this.isEnabled()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.65);
    } catch {
      // ignore
    }
  },

  // Warning or Error buzz (low pitch)
  playLocked() {
    if (!this.isEnabled()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.setValueAtTime(110, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {
      // ignore
    }
  },

  // Success / Achievement alias
  playSuccess() {
    this.playWin();
  },

  // Error / Incorrect answer alias
  playError() {
    this.playLocked();
  },

  // Emergency Earthquake Siren Tone
  playAlarm() {
    if (!this.isEnabled()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(850, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(650, ctx.currentTime + 0.18);
      osc.frequency.linearRampToValueAtTime(850, ctx.currentTime + 0.36);

      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.38);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // ignore
    }
  },

  // Player Hurt / Debris Hit Sound
  playHurt() {
    if (!this.isEnabled()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // ignore
    }
  },

  // Suara Ketukan Kentongan Bambu Tradisional (Resonant Wooden Slit Drum)
  playKentongan() {
    if (!this.isEnabled()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      // Resonan Rongga Bambu
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      // Ketukan Kayu Tajam (Click Transient)
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(1200, ctx.currentTime);
      clickOsc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.03);

      clickGain.gain.setValueAtTime(0.12, ctx.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      clickOsc.connect(clickGain);
      gain.connect(ctx.destination);
      clickGain.connect(ctx.destination);

      osc.start();
      clickOsc.start();
      osc.stop(ctx.currentTime + 0.15);
      clickOsc.stop(ctx.currentTime + 0.04);
    } catch {
      // ignore
    }
  },

  // Suara Gemuruh Seismik Gempa Bumi (Earthquake Rumble)
  playEarthquakeRumble() {
    if (!this.isEnabled()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(60, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(32, ctx.currentTime + 1.4);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(45, ctx.currentTime + 1.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.45);
    } catch {
      // ignore
    }
  },

  // Suara Dentuman Dahsyat Letusan Magma Merapi (Massive Volcanic Eruption Boom)
  playVolcanoBoom() {
    if (!this.isEnabled()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      // 1. Sub-bass rumble boom
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(75, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(24, ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      // Low-pass filter untuk resonansi gemuruh tanah
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 1.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.25);

      // 2. Ledakan Noise Pecahan Kawah (Eruption blast)
      const bufferSize = ctx.sampleRate * 0.8;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(350, ctx.currentTime);
      noiseFilter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.8);
      noiseFilter.Q.setValueAtTime(1.5, ctx.currentTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.18, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      whiteNoise.start();
      whiteNoise.stop(ctx.currentTime + 0.82);
    } catch {
      // ignore
    }
  },

  // Suara Sirine Peringatan Dini Bencana EWS (Emergency Warning Siren)
  playEwsSiren() {
    if (!this.isEnabled()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 1. Oscillator Utama (Sawtooth wail)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(540, now);
      osc1.frequency.linearRampToValueAtTime(880, now + 0.35);
      osc1.frequency.linearRampToValueAtTime(540, now + 0.7);

      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.02, now + 0.72);

      // 2. Oscillator Harmonik Kedua (Sine wave untuk resonansi sirene horn)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(542, now);
      osc2.frequency.linearRampToValueAtTime(884, now + 0.35);
      osc2.frequency.linearRampToValueAtTime(542, now + 0.7);

      gain2.gain.setValueAtTime(0.12, now);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.72);

      // Filter bandpass agar suara terfokus tajam dan jelas
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(750, now);
      filter.Q.setValueAtTime(1.0, now);

      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(filter);
      gain2.connect(filter);
      filter.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.75);
      osc2.stop(now + 0.75);
    } catch {
      // ignore
    }
  },

  // Mulai memutar sirine EWS secara kontinu sampai dihentikan
  startEwsSiren() {
    if (!this.isEnabled()) return;
    if (isSirenLooping) return;
    isSirenLooping = true;
    this.playEwsSiren();
    if (sirenLoopTimer) clearInterval(sirenLoopTimer);
    sirenLoopTimer = setInterval(() => {
      if (!isSirenLooping) {
        if (sirenLoopTimer) clearInterval(sirenLoopTimer);
        sirenLoopTimer = null;
        return;
      }
      this.playEwsSiren();
    }, 720);
  },

  // Hentikan putaran sirine EWS seketika
  stopEwsSiren() {
    isSirenLooping = false;
    if (sirenLoopTimer) {
      clearInterval(sirenLoopTimer);
      sirenLoopTimer = null;
    }
  },

  // ── SIMULASI GEMPA BUMI SEISMIK 3 TINGKAT ──────────────────────────────
  // 1. Gempa Ringan (3-4 SR): Gemuruh frekuensi rendah (low rumble) samar
  playLightEarthquakeRumble() {
    if (!this.isEnabled()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(45, now);
      osc.frequency.linearRampToValueAtTime(28, now + 1.8);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(75, now);
      filter.frequency.linearRampToValueAtTime(40, now + 1.8);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.85);
    } catch {
      // ignore
    }
  },

  // 2. Gempa Sedang (5-6 SR): Gemuruh jelas + deritan dinding/beton (creaking wood/concrete)
  playMediumEarthquakeWithCreak() {
    if (!this.isEnabled()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // A. Gemuruh Seismik Sedang
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(58, now);
      osc.frequency.linearRampToValueAtTime(32, now + 2.0);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(130, now);
      filter.frequency.linearRampToValueAtTime(55, now + 2.0);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 2.05);

      // B. Suara Deritan Kayu & Beton Berderit (Creaking / Groaning effect)
      const creakOsc = ctx.createOscillator();
      const creakGain = ctx.createGain();
      const creakFilter = ctx.createBiquadFilter();

      creakOsc.type = 'sawtooth';
      creakOsc.frequency.setValueAtTime(290, now + 0.15);
      creakOsc.frequency.exponentialRampToValueAtTime(160, now + 0.65);
      creakOsc.frequency.exponentialRampToValueAtTime(240, now + 1.1);
      creakOsc.frequency.exponentialRampToValueAtTime(110, now + 1.6);

      creakFilter.type = 'bandpass';
      creakFilter.frequency.setValueAtTime(260, now + 0.15);
      creakFilter.Q.setValueAtTime(4.0, now + 0.15);

      creakGain.gain.setValueAtTime(0.001, now);
      creakGain.gain.linearRampToValueAtTime(0.09, now + 0.2);
      creakGain.gain.linearRampToValueAtTime(0.03, now + 0.8);
      creakGain.gain.linearRampToValueAtTime(0.07, now + 1.2);
      creakGain.gain.exponentialRampToValueAtTime(0.001, now + 1.7);

      creakOsc.connect(creakFilter);
      creakFilter.connect(creakGain);
      creakGain.connect(ctx.destination);
      creakOsc.start(now + 0.15);
      creakOsc.stop(now + 1.75);
    } catch {
      // ignore
    }
  },

  // 3. Gempa Besar (>7 SR): Gemuruh dahsyat + beton pecah runtuh (crash) + sirine bencana
  playMajorEarthquakeWithCollapse() {
    if (!this.isEnabled()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // A. Gemuruh Bass Dahsyat
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      const subFilter = ctx.createBiquadFilter();

      subOsc.type = 'sawtooth';
      subOsc.frequency.setValueAtTime(70, now);
      subOsc.frequency.linearRampToValueAtTime(22, now + 2.5);

      subFilter.type = 'lowpass';
      subFilter.frequency.setValueAtTime(180, now);
      subFilter.frequency.linearRampToValueAtTime(40, now + 2.5);

      subGain.gain.setValueAtTime(0.26, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      subOsc.connect(subFilter);
      subFilter.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 2.55);

      // B. Efek Reruntuhan Beton / Puing Patah (Shattering Concrete Crunch Noise)
      const bufferSize = Math.floor(ctx.sampleRate * 1.2);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.4));
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const crashFilter = ctx.createBiquadFilter();
      crashFilter.type = 'lowpass';
      crashFilter.frequency.setValueAtTime(420, now + 0.1);
      crashFilter.frequency.linearRampToValueAtTime(120, now + 1.2);

      const crashGain = ctx.createGain();
      crashGain.gain.setValueAtTime(0.22, now + 0.1);
      crashGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

      noiseSource.connect(crashFilter);
      crashFilter.connect(crashGain);
      crashGain.connect(ctx.destination);
      noiseSource.start(now + 0.1);
      noiseSource.stop(now + 1.35);

      // C. Sirine Peringatan Bencana EWS
      const sirenOsc = ctx.createOscillator();
      const sirenGain = ctx.createGain();
      sirenOsc.type = 'sawtooth';
      sirenOsc.frequency.setValueAtTime(540, now + 0.3);
      sirenOsc.frequency.linearRampToValueAtTime(860, now + 0.8);
      sirenOsc.frequency.linearRampToValueAtTime(540, now + 1.3);
      sirenOsc.frequency.linearRampToValueAtTime(860, now + 1.8);

      sirenGain.gain.setValueAtTime(0.14, now + 0.3);
      sirenGain.gain.exponentialRampToValueAtTime(0.01, now + 2.1);

      sirenOsc.connect(sirenGain);
      sirenGain.connect(ctx.destination);
      sirenOsc.start(now + 0.3);
      sirenOsc.stop(now + 2.15);
    } catch {
      // ignore
    }
  }
};
