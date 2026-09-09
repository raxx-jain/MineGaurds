/**
 * Synthetic Web Audio API alerts for industrial control-room
 * Zero external audio dependencies; pure synthesized sound waves.
 * 
 * Alert Tiers:
 *   1. Normal    — short low-priority notification beep
 *   2. Warning   — repeated warning beep
 *   3. Critical  — faster repeated beep / siren
 *   4. EXTREME   — distinctive high-priority emergency alarm pattern (tunnel collapse)
 */

let audioCtx = null;
let isAudioMuted = true;
let extremeAlarmInterval = null; // persistent looping alarm for collapse

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setAudioMuted(muted) {
  isAudioMuted = muted;
  if (muted) {
    stopExtremeAlarm();
  } else {
    getAudioContext();
  }
}

export function getAudioMuted() {
  return isAudioMuted;
}

/**
 * Play a high-priority dual-tone industrial emergency siren (CRITICAL)
 */
export function playCriticalSiren() {
  if (isAudioMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    const now = ctx.currentTime;

    osc.frequency.setValueAtTime(880, now);
    osc.frequency.linearRampToValueAtTime(587, now + 0.25);
    osc.frequency.linearRampToValueAtTime(880, now + 0.5);
    osc.frequency.linearRampToValueAtTime(587, now + 0.75);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.85);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.85);
  } catch (err) {
    console.warn('Audio alert error:', err);
  }
}

/**
 * Play a short warning chime (WARNING)
 */
export function playWarningBeep() {
  if (isAudioMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;

    osc.frequency.setValueAtTime(660, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.2);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  } catch (err) {
    console.warn('Audio alert error:', err);
  }
}

/**
 * Play an action feedback click (NORMAL)
 */
export function playActionBlip() {
  if (isAudioMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    const now = ctx.currentTime;

    osc.frequency.setValueAtTime(1050, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch (err) {
    console.warn('Audio alert error:', err);
  }
}

/**
 * EXTREME EMERGENCY ALARM — Tunnel Collapse
 * A distinctive multi-tone warbling alarm that loops until stopped.
 * Very different from the single critical siren to convey maximum urgency.
 */
function playExtremeAlarmBurst() {
  if (isAudioMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Tone 1: Low menacing horn
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(220, now);
    osc1.frequency.linearRampToValueAtTime(330, now + 0.15);
    osc1.frequency.linearRampToValueAtTime(220, now + 0.3);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.linearRampToValueAtTime(0.12, now + 0.3);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Tone 2: High staccato alarm (offset by 0.35s)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(1400, now + 0.35);
    osc2.frequency.linearRampToValueAtTime(900, now + 0.55);
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.setValueAtTime(0.08, now + 0.35);
    gain2.gain.linearRampToValueAtTime(0.04, now + 0.55);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.35);
    osc2.stop(now + 0.6);

    // Tone 3: Second horn pulse (offset by 0.65s)
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'sawtooth';
    osc3.frequency.setValueAtTime(260, now + 0.65);
    osc3.frequency.linearRampToValueAtTime(380, now + 0.8);
    osc3.frequency.linearRampToValueAtTime(260, now + 0.95);
    gain3.gain.setValueAtTime(0, now);
    gain3.gain.setValueAtTime(0.15, now + 0.65);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(now + 0.65);
    osc3.stop(now + 1.0);
  } catch (err) {
    console.warn('Audio extreme alert error:', err);
  }
}

/**
 * Start the looping extreme alarm (plays every 1.2 seconds)
 */
export function startExtremeAlarm() {
  if (extremeAlarmInterval) return; // already running
  playExtremeAlarmBurst();
  extremeAlarmInterval = setInterval(() => {
    if (isAudioMuted) {
      stopExtremeAlarm();
      return;
    }
    playExtremeAlarmBurst();
  }, 1200);
}

/**
 * Stop the looping extreme alarm
 */
export function stopExtremeAlarm() {
  if (extremeAlarmInterval) {
    clearInterval(extremeAlarmInterval);
    extremeAlarmInterval = null;
  }
}

/**
 * Returns true if the extreme alarm loop is currently running.
 */
export function isExtremeAlarmActive() {
  return !!extremeAlarmInterval;
}
