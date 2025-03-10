// Audio context for sound generation
let audioContext: AudioContext | null = null;

// Instrument types
export type InstrumentType = 'piano' | 'synth';

// Initialize audio context (must be called after user interaction)
export const initAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Get the frequency for a given note
export const getNoteFrequency = (note: string): number => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = parseInt(note.slice(-1));
  const noteName = note.slice(0, -1);
  
  const noteIndex = notes.indexOf(noteName);
  if (noteIndex === -1) return 440; // A4 (default)
  
  // Calculate frequency using the formula: f = 440 × 2^((n-49)/12)
  // where n is the key number (A4 = 49)
  const keyNumber = 12 * (octave + 1) + noteIndex;
  return 440 * Math.pow(2, (keyNumber - 49) / 12);
};

// Play a note with the selected instrument
export const playNote = (
  note: string, 
  instrumentType: InstrumentType = 'piano', 
  volume: number = 0.5
): void => {
  if (!audioContext) {
    audioContext = initAudioContext();
  }
  
  const time = audioContext.currentTime;
  
  // Create oscillator
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  // Set instrument type
  if (instrumentType === 'piano') {
    oscillator.type = 'triangle';
  } else if (instrumentType === 'synth') {
    oscillator.type = 'sawtooth';
  }
  
  // Set frequency based on note
  oscillator.frequency.value = getNoteFrequency(note);
  
  // Set envelope
  gainNode.gain.setValueAtTime(0, time);
  gainNode.gain.linearRampToValueAtTime(volume, time + 0.02);
  
  if (instrumentType === 'piano') {
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 1.5);
  } else {
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 1.0);
  }
  
  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Start and stop
  oscillator.start(time);
  oscillator.stop(time + 2);
};

// Stop all sounds (not fully implemented in this version)
export const stopAllSounds = (): void => {
  if (audioContext) {
    // In a more complex implementation, we would keep track of all active oscillators
    // and stop them here
  }
};

// Resume audio context (needed after user interaction)
export const resumeAudioContext = (): void => {
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
};
