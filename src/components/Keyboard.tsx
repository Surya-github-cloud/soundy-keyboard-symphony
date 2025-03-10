
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  playNote, 
  stopAllSounds, 
  resumeAudioContext, 
  initAudioContext,
  InstrumentType
} from '../utils/audioUtils';
import { 
  allNotes, 
  isBlackKey, 
  keyToNoteMapping, 
  noteToKeyMapping,
  getBlackKeyPosition
} from '../utils/keyboardMapping';
import { Volume2, Music } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Keyboard: React.FC = () => {
  // State for active keys, volume, and instrument
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [volume, setVolume] = useState<number>(0.5);
  const [instrument, setInstrument] = useState<InstrumentType>('piano');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  // Ref to track mounted state
  const isMounted = useRef(true);
  
  // Initialize audio on first interaction
  const initializeAudio = useCallback(() => {
    if (!isInitialized) {
      initAudioContext();
      resumeAudioContext();
      setIsInitialized(true);
    }
  }, [isInitialized]);
  
  // Handle mouse/touch down on a key
  const handleKeyDown = useCallback((note: string) => {
    initializeAudio();
    
    setActiveKeys((prev) => {
      const newActiveKeys = new Set(prev);
      newActiveKeys.add(note);
      return newActiveKeys;
    });
    
    // Play the note
    playNote(note, instrument, volume);
  }, [instrument, volume, initializeAudio]);
  
  // Handle mouse/touch up on a key
  const handleKeyUp = useCallback((note: string) => {
    setActiveKeys((prev) => {
      const newActiveKeys = new Set(prev);
      newActiveKeys.delete(note);
      return newActiveKeys;
    });
    
    // In a more advanced implementation, we would stop the specific note here
  }, []);
  
  // Handle computer keyboard events
  useEffect(() => {
    const handleKeyboardDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (keyToNoteMapping[key] && !e.repeat) {
        handleKeyDown(keyToNoteMapping[key]);
      }
    };
    
    const handleKeyboardUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (keyToNoteMapping[key]) {
        handleKeyUp(keyToNoteMapping[key]);
      }
    };
    
    window.addEventListener('keydown', handleKeyboardDown);
    window.addEventListener('keyup', handleKeyboardUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyboardDown);
      window.removeEventListener('keyup', handleKeyboardUp);
    };
  }, [handleKeyDown, handleKeyUp]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      stopAllSounds();
    };
  }, []);
  
  // Render keys
  const renderKeys = () => {
    // First render white keys as the base layer
    const whiteKeys = allNotes
      .filter(note => !isBlackKey(note))
      .map((note, index) => {
        const isActive = activeKeys.has(note);
        const keyboardKey = noteToKeyMapping[note]?.toUpperCase();
        
        return (
          <div
            key={note}
            className={`white-key flex items-end justify-center pb-4 ${isActive ? 'key-pressed' : ''}`}
            onMouseDown={() => handleKeyDown(note)}
            onMouseUp={() => handleKeyUp(note)}
            onMouseLeave={() => activeKeys.has(note) && handleKeyUp(note)}
            onTouchStart={() => handleKeyDown(note)}
            onTouchEnd={() => handleKeyUp(note)}
          >
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold">{note}</span>
              {keyboardKey && (
                <span className="text-xs mt-1 opacity-60">{keyboardKey}</span>
              )}
            </div>
          </div>
        );
      });
    
    // Then render black keys on top
    const blackKeys = allNotes
      .map((note, index) => {
        if (!isBlackKey(note)) return null;
        
        const isActive = activeKeys.has(note);
        const leftPosition = getBlackKeyPosition(index);
        const keyboardKey = noteToKeyMapping[note]?.toUpperCase();
        
        return (
          <div
            key={note}
            className={`black-key flex items-end justify-center pb-3 ${isActive ? 'key-pressed' : ''}`}
            style={{ left: `${leftPosition}px` }}
            onMouseDown={() => handleKeyDown(note)}
            onMouseUp={() => handleKeyUp(note)}
            onMouseLeave={() => activeKeys.has(note) && handleKeyUp(note)}
            onTouchStart={() => handleKeyDown(note)}
            onTouchEnd={() => handleKeyUp(note)}
          >
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold">{note}</span>
              {keyboardKey && (
                <span className="text-xs mt-1 opacity-60">{keyboardKey}</span>
              )}
            </div>
          </div>
        );
      });
    
    return (
      <div className="relative h-[200px] inline-flex">
        {whiteKeys}
        {blackKeys}
      </div>
    );
  };
  
  return (
    <div 
      className="keyboard-container select-none"
      onClick={initializeAudio}
    >
      <div className="controls flex items-center justify-between mb-4 px-4">
        <div className="flex items-center gap-4">
          <div className="volume-control flex items-center gap-2">
            <Volume2 size={20} className="text-primary" />
            <Slider 
              value={[volume * 100]} 
              min={0} 
              max={100} 
              step={1}
              className="w-32"
              onValueChange={(values) => setVolume(values[0] / 100)}
            />
          </div>
        </div>
        
        <div className="instrument-select flex items-center gap-2">
          <Music size={20} className="text-primary" />
          <Select value={instrument} onValueChange={(value) => setInstrument(value as InstrumentType)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Piano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="piano">Piano</SelectItem>
              <SelectItem value="synth">Synth</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="keyboard-wrapper overflow-x-auto pb-4">
        {renderKeys()}
      </div>
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Click or use your computer keyboard to play notes</p>
      </div>
    </div>
  );
};

export default Keyboard;
