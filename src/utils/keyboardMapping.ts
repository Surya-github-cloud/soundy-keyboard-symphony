
// Mapping of keyboard keys to notes
export const keyToNoteMapping: Record<string, string> = {
  'a': 'C4',
  'w': 'C#4',
  's': 'D4',
  'e': 'D#4',
  'd': 'E4',
  'f': 'F4',
  't': 'F#4',
  'g': 'G4',
  'y': 'G#4',
  'h': 'A4',
  'u': 'A#4',
  'j': 'B4',
  'k': 'C5',
  'o': 'C#5',
  'l': 'D5',
  'p': 'D#5',
  ';': 'E5',
  "'": 'F5',
};

// Mapping of notes to keyboard keys (reverse mapping)
export const noteToKeyMapping: Record<string, string> = Object.entries(keyToNoteMapping)
  .reduce((acc, [key, note]) => {
    acc[note] = key;
    return acc;
  }, {} as Record<string, string>);

// List of all notes in order
export const allNotes = [
  'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
  'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5'
];

// Determine if a note is a black key
export const isBlackKey = (note: string): boolean => {
  return note.includes('#');
};

// Get the position of a black key
export const getBlackKeyPosition = (index: number): number => {
  // Calculate the position of black keys relative to white keys
  const whiteKeyWidth = 60; // width of a white key in pixels
  
  // Different offsets based on the pattern of black keys on a piano
  const offsets = {
    'C#': 0.75,
    'D#': 1.75,
    'F#': 3.75,
    'G#': 4.75,
    'A#': 5.75,
    'C#5': 7.75,
    'D#5': 8.75,
  };
  
  const noteName = allNotes[index].replace(/[0-9]/g, '');
  const octave = allNotes[index].slice(-1);
  const noteWithOctave = noteName + (octave === '5' ? '5' : '');
  
  return (offsets[noteWithOctave as keyof typeof offsets] || 0) * whiteKeyWidth;
};
