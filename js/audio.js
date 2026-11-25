// Generative ambient soundtrack + UI sounds, built with the Web Audio API (no files needed).
export function createAudio() {
  let ctx = null, master, music, sfx, verb, delay, filter, lfo, timer = null, on = false, step = 0, nextT = 0;
  const CHORDS = [ // dreamy progression: Fmaj9, Am9, Dm9, Bbmaj9 (midi)
    [53, 57, 60, 64, 67], [57, 60, 64, 67, 71], [50, 53, 57, 60, 64], [46, 50, 53, 57, 60]
  ];
  const BAR = 4.8; // seconds per chord
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);

  function impulse(sec) {
    const len = ctx.sampleRate * sec, b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    return b;
  }
  function build() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
    music = ctx.createGain(); music.gain.value = 0; music.connect(master);
    sfx = ctx.createGain(); sfx.gain.value = 0.5; sfx.connect(master);
    verb = ctx.createConvolver(); verb.buffer = impulse(4.2);
    const verbGain = ctx.createGain(); verbGain.gain.value = 0.55; verb.connect(verbGain); verbGain.connect(music);
    filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 1400; filter.Q.value = 0.7;
    filter.connect(music); filter.connect(verb);
    lfo = ctx.createOscillator(); lfo.frequency.value = 0.07;
    const lfoAmt = ctx.createGain(); lfoAmt.gain.value = 650; lfo.connect(lfoAmt); lfoAmt.connect(filter.frequency); lfo.start();
    delay = ctx.createDelay(1.5); delay.delayTime.value = 0.45;
    const fb = ctx.createGain(); fb.gain.value = 0.38; delay.connect(fb); fb.connect(delay);
    const dOut = ctx.createGain(); dOut.gain.value = 0.35; delay.connect(dOut); dOut.connect(music); dOut.connect(verb);
  }
  function pad(chord, t) {
    chord.forEach((m, i) => {
      [-7, 7].forEach(det => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = i === 0 ? 'triangle' : 'sawtooth'; o.frequency.value = hz(m); o.detune.value = det;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(i === 0 ? 0.05 : 0.022, t + 1.6);
        g.gain.setValueAtTime(i === 0 ? 0.05 : 0.022, t + BAR - 0.6);
        g.gain.linearRampToValueAtTime(0, t + BAR + 1.4);
        o.connect(g); g.connect(filter); o.start(t); o.stop(t + BAR + 1.5);
      });
    });
    const b = ctx.createOscillator(), bg = ctx.createGain();
    b.type = 'sine'; b.frequency.value = hz(chord[0] - 12);
    bg.gain.setValueAtTime(0, t); bg.gain.linearRampToValueAtTime(0.09, t + 0.8); bg.gain.linearRampToValueAtTime(0, t + BAR + 0.6);
    b.connect(bg); bg.connect(music); b.start(t); b.stop(t + BAR + 0.7);
  }
  function pluck(m, t, v = 0.05) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'triangle'; o.frequency.value = hz(m);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0008, t + 1.1);
    o.connect(g); g.connect(music); g.connect(delay); g.connect(verb);
    o.start(t); o.stop(t + 1.2);
  }
  function schedule() {
    while (nextT < ctx.currentTime + 0.6) {
      const bar = Math.floor(step / 8), chord = CHORDS[bar % CHORDS.length];
      if (step % 8 === 0) pad(chord, nextT);
      const pattern = [4, 2, 3, 1, 4, 3, 2, 3];
      if (step % 8 !== 7 || Math.random() > 0.5) pluck(chord[pattern[step % 8]] + 12, nextT, step % 2 ? 0.032 : 0.045);
      if (Math.random() > 0.86) pluck(chord[4] + 24, nextT + BAR / 16, 0.02);
      nextT += BAR / 8; step++;
    }
  }
  function startMusic() {
    if (!ctx) build();
    if (ctx.state === 'suspended') ctx.resume();
    on = true;
    nextT = ctx.currentTime + 0.1;
    music.gain.cancelScheduledValues(ctx.currentTime);
    music.gain.setValueAtTime(music.gain.value, ctx.currentTime);
    music.gain.linearRampToValueAtTime(0.75, ctx.currentTime + 2.5);
    clearInterval(timer); timer = setInterval(schedule, 120); schedule();
  }
  function stopMusic() {
    on = false;
    if (!ctx) return;
    music.gain.cancelScheduledValues(ctx.currentTime);
    music.gain.setValueAtTime(music.gain.value, ctx.currentTime);
    music.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    setTimeout(() => { if (!on) clearInterval(timer); }, 900);
  }
  function blip(freq = 1320, dur = 0.06, vol = 0.05, type = 'sine') {
    if (!ctx || !on) return;
    const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t); o.frequency.exponentialRampToValueAtTime(freq * 1.5, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0005, t + dur + 0.05);
    o.connect(g); g.connect(sfx); g.connect(verb); o.start(t); o.stop(t + dur + 0.1);
  }
  function whoosh(dur = 0.9, from = 250, to = 4200, vol = 0.22) {
    if (!ctx || !on) return;
    const t = ctx.currentTime, len = ctx.sampleRate * dur, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = b;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.4;
    bp.frequency.setValueAtTime(from, t); bp.frequency.exponentialRampToValueAtTime(to, t + dur * 0.8);
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + dur * 0.55); g.gain.linearRampToValueAtTime(0, t + dur);
    src.connect(bp); bp.connect(g); g.connect(sfx); g.connect(verb); src.start(t);
  }
  function chime() {
    if (!ctx || !on) return;
    const t = ctx.currentTime;
    [76, 81, 84, 88].forEach((m, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = hz(m);
      g.gain.setValueAtTime(0, t + i * 0.07); g.gain.linearRampToValueAtTime(0.05, t + i * 0.07 + 0.01); g.gain.exponentialRampToValueAtTime(0.0005, t + i * 0.07 + 0.9);
      o.connect(g); g.connect(sfx); g.connect(verb); o.start(t + i * 0.07); o.stop(t + i * 0.07 + 1);
    });
  }
  return {
    get on() { return on; },
    start: startMusic, stop: stopMusic,
    toggle() { on ? stopMusic() : startMusic(); return on; },
    tick: () => blip(1500, 0.035, 0.03),
    click: () => blip(700, 0.08, 0.06, 'triangle'),
    whoosh, chime
  };
}
