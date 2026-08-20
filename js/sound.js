// ============================================================
//  SOUND ENGINE — Web Audio API synth (no external files)
// ============================================================
const SoundEngine = (() => {
  let ctx;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function play(fn) {
    try { fn(getCtx()); } catch (_) { /* silent fail */ }
  }

  // ---- ROCKET LAUNCH — cinematic multi-layer rocket blast ----
  function rocketLaunch() {
    play(c => {
      const dur = 4.5;
      const now = c.currentTime;

      // --- Layer 1: Ignition thump ---
      const thump = c.createOscillator();
      const thG = c.createGain();
      thump.type = 'sine';
      thump.frequency.setValueAtTime(120, now);
      thump.frequency.exponentialRampToValueAtTime(25, now + 0.25);
      thG.gain.setValueAtTime(0.5, now);
      thG.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      thump.connect(thG).connect(c.destination);
      thump.start(now);
      thump.stop(now + 0.35);

      // --- Layer 2: Deep sustained sub-bass rumble ---
      const sub = c.createOscillator();
      const subG = c.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(30, now);
      sub.frequency.linearRampToValueAtTime(55, now + 1.5);
      sub.frequency.linearRampToValueAtTime(40, now + dur);
      subG.gain.setValueAtTime(0, now);
      subG.gain.linearRampToValueAtTime(0.35, now + 0.4);
      subG.gain.setValueAtTime(0.35, now + 2.0);
      subG.gain.linearRampToValueAtTime(0, now + dur);
      sub.connect(subG).connect(c.destination);
      sub.start(now);
      sub.stop(now + dur);

      // --- Layer 3: Mid-range growl (engine roar) ---
      const growl = c.createOscillator();
      const grG = c.createGain();
      growl.type = 'sawtooth';
      growl.frequency.setValueAtTime(60, now);
      growl.frequency.linearRampToValueAtTime(140, now + 2);
      growl.frequency.linearRampToValueAtTime(90, now + dur);
      const grFilt = c.createBiquadFilter();
      grFilt.type = 'lowpass';
      grFilt.frequency.setValueAtTime(200, now);
      grFilt.frequency.linearRampToValueAtTime(800, now + 1.5);
      grFilt.frequency.linearRampToValueAtTime(300, now + dur);
      grFilt.Q.value = 4;
      grG.gain.setValueAtTime(0, now);
      grG.gain.linearRampToValueAtTime(0.18, now + 0.5);
      grG.gain.setValueAtTime(0.18, now + 2.0);
      grG.gain.linearRampToValueAtTime(0, now + dur);
      growl.connect(grFilt).connect(grG).connect(c.destination);
      growl.start(now);
      growl.stop(now + dur);

      // --- Layer 4: Second detuned growl for thickness ---
      const growl2 = c.createOscillator();
      const gr2G = c.createGain();
      growl2.type = 'square';
      growl2.frequency.setValueAtTime(62, now);
      growl2.frequency.linearRampToValueAtTime(145, now + 2);
      growl2.frequency.linearRampToValueAtTime(88, now + dur);
      const gr2Filt = c.createBiquadFilter();
      gr2Filt.type = 'lowpass';
      gr2Filt.frequency.setValueAtTime(180, now);
      gr2Filt.frequency.linearRampToValueAtTime(700, now + 1.5);
      gr2Filt.frequency.linearRampToValueAtTime(250, now + dur);
      gr2G.gain.setValueAtTime(0, now);
      gr2G.gain.linearRampToValueAtTime(0.1, now + 0.5);
      gr2G.gain.setValueAtTime(0.1, now + 2.0);
      gr2G.gain.linearRampToValueAtTime(0, now + dur);
      growl2.connect(gr2Filt).connect(gr2G).connect(c.destination);
      growl2.start(now);
      growl2.stop(now + dur);

      // --- Layer 5: Crackling fire / exhaust noise ---
      const crackBuf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
      const crackData = crackBuf.getChannelData(0);
      for (let i = 0; i < crackData.length; i++) crackData[i] = Math.random() * 2 - 1;
      const crackle = c.createBufferSource();
      crackle.buffer = crackBuf;
      const crFilt = c.createBiquadFilter();
      crFilt.type = 'bandpass';
      crFilt.frequency.setValueAtTime(1200, now);
      crFilt.frequency.linearRampToValueAtTime(3500, now + 1);
      crFilt.frequency.linearRampToValueAtTime(2000, now + dur);
      crFilt.Q.value = 0.8;
      const crDist = c.createWaveShaperFunction ? null : c.createWaveShaper();
      // Distortion curve for crackle
      if (crDist) {
        const curve = new Float32Array(256);
        for (let i = 0; i < 256; i++) {
          const x = (i / 128) - 1;
          curve[i] = (Math.PI + 200) * x / (Math.PI + 200 * Math.abs(x));
        }
        crDist.curve = curve;
      }
      const crG = c.createGain();
      crG.gain.setValueAtTime(0, now);
      crG.gain.linearRampToValueAtTime(0.22, now + 0.3);
      crG.gain.setValueAtTime(0.22, now + 2.0);
      crG.gain.linearRampToValueAtTime(0, now + dur);
      crackle.connect(crFilt);
      if (crDist) crFilt.connect(crDist).connect(crG);
      else crFilt.connect(crG);
      crG.connect(c.destination);
      crackle.start(now);
      crackle.stop(now + dur);

      // --- Layer 6: Rising whoosh (air rush) ---
      const whooshBuf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
      const whooshData = whooshBuf.getChannelData(0);
      for (let i = 0; i < whooshData.length; i++) whooshData[i] = Math.random() * 2 - 1;
      const whoosh = c.createBufferSource();
      whoosh.buffer = whooshBuf;
      const wFilt = c.createBiquadFilter();
      wFilt.type = 'bandpass';
      wFilt.frequency.setValueAtTime(300, now);
      wFilt.frequency.exponentialRampToValueAtTime(5000, now + dur * 0.5);
      wFilt.frequency.exponentialRampToValueAtTime(800, now + dur);
      wFilt.Q.value = 1.5;
      const wG = c.createGain();
      wG.gain.setValueAtTime(0, now);
      wG.gain.linearRampToValueAtTime(0.14, now + 0.8);
      wG.gain.setValueAtTime(0.14, now + 2.5);
      wG.gain.linearRampToValueAtTime(0, now + dur);
      whoosh.connect(wFilt).connect(wG).connect(c.destination);
      whoosh.start(now);
      whoosh.stop(now + dur);

      // --- Layer 7: High harmonic shimmer (metallic resonance) ---
      const shimmer = c.createOscillator();
      const shG = c.createGain();
      shimmer.type = 'triangle';
      shimmer.frequency.setValueAtTime(220, now);
      shimmer.frequency.linearRampToValueAtTime(880, now + 2.5);
      shimmer.frequency.linearRampToValueAtTime(440, now + dur);
      const shFilt = c.createBiquadFilter();
      shFilt.type = 'bandpass';
      shFilt.frequency.value = 600;
      shFilt.Q.value = 8;
      shG.gain.setValueAtTime(0, now);
      shG.gain.linearRampToValueAtTime(0.04, now + 1);
      shG.gain.linearRampToValueAtTime(0, now + dur);
      shimmer.connect(shFilt).connect(shG).connect(c.destination);
      shimmer.start(now);
      shimmer.stop(now + dur);

      // --- Layer 8: Vibrato tremolo (engine flutter) ---
      const trem = c.createOscillator();
      trem.type = 'sine';
      trem.frequency.value = 7;
      const tremGain = c.createGain();
      tremGain.gain.value = 12;
      trem.connect(tremGain).connect(sub.frequency);
      trem.start(now);
      trem.stop(now + dur);
    });
  }

  // ---- CLICK / TAP — short crisp pop ----
  function click() {
    play(c => {
      const now = c.currentTime;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain).connect(c.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    });
  }

  // ---- STAMP — heavy thud ----
  function stamp() {
    play(c => {
      const now = c.currentTime;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain).connect(c.destination);
      osc.start(now);
      osc.stop(now + 0.3);

      // Noise layer for texture
      const buf = c.createBuffer(1, c.sampleRate * 0.15, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const ns = c.createBufferSource();
      ns.buffer = buf;
      const ng = c.createGain();
      const hp = c.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 2000;
      ng.gain.setValueAtTime(0.15, now);
      ng.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      ns.connect(hp).connect(ng).connect(c.destination);
      ns.start(now);
      ns.stop(now + 0.15);
    });
  }

  // ---- SWOOSH — for logo reveal / transitions ----
  function swoosh() {
    play(c => {
      const dur = 0.6;
      const now = c.currentTime;
      const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const ns = c.createBufferSource();
      ns.buffer = buf;
      const filt = c.createBiquadFilter();
      filt.type = 'bandpass';
      filt.frequency.setValueAtTime(500, now);
      filt.frequency.exponentialRampToValueAtTime(4000, now + dur * 0.4);
      filt.frequency.exponentialRampToValueAtTime(200, now + dur);
      filt.Q.value = 2;
      const gain = c.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
      gain.gain.linearRampToValueAtTime(0, now + dur);
      ns.connect(filt).connect(gain).connect(c.destination);
      ns.start(now);
      ns.stop(now + dur);
    });
  }

  // ---- GLING — short bright chime (register success) ----
  function gling() {
    play(c => {
      const now = c.currentTime;
      [523, 659, 784].forEach((freq, i) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, now + i * 0.07);
        gain.gain.linearRampToValueAtTime(0.15, now + i * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.35);
        osc.connect(gain).connect(c.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.4);
      });
    });
  }

  return { rocketLaunch, click, stamp, swoosh, gling };
})();
