import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GRID_ROWS, GRID_COLS, NOTES } from './constants';
import type { GridType } from './types';

// --- HELPER & UTILITY FUNCTIONS ---

const createEmptyGrid = (): GridType =>
  Array.from({ length: GRID_ROWS }, () =>
    Array.from({ length: GRID_COLS }, () => false)
  );

const ROW_COLORS = [
    'bg-red-500', 'bg-orange-500', 'bg-yellow-400', 'bg-lime-400',
    'bg-green-500', 'bg-teal-400', 'bg-sky-500', 'bg-indigo-500',
];

const ROW_HIGHLIGHT_COLORS = [
    'bg-red-300', 'bg-orange-300', 'bg-yellow-200', 'bg-lime-200',
    'bg-green-300', 'bg-teal-200', 'bg-sky-300', 'bg-indigo-300',
];

// --- SVG ICON COMPONENTS ---

const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const StopIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h12v12H6z" />
  </svg>
);

const SaveIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
);

const LoadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-7l-2-3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"></path>
    </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);


// --- UI COMPONENTS ---

interface NoteCellProps {
  isActive: boolean;
  isHighlighted: boolean;
  rowIndex: number;
  onClick: () => void;
}

const NoteCell: React.FC<NoteCellProps> = ({ isActive, isHighlighted, rowIndex, onClick }) => {
  const activeColor = ROW_COLORS[rowIndex % ROW_COLORS.length];
  const highlightColor = ROW_HIGHLIGHT_COLORS[rowIndex % ROW_HIGHLIGHT_COLORS.length];

  const cellClasses = [
    'w-full', 'h-full', 'transition-colors', 'duration-100', 'cursor-pointer',
    isActive ? activeColor : 'bg-white/10',
    isHighlighted && !isActive && 'bg-white/20',
    isHighlighted && isActive && highlightColor
  ].filter(Boolean).join(' ');

  return <div className={cellClasses} onClick={onClick}></div>;
};

interface GridProps {
  grid: GridType;
  currentColumn: number;
  onNoteClick: (row: number, col: number) => void;
}

const Grid: React.FC<GridProps> = ({ grid, currentColumn, onNoteClick }) => (
  <div className="flex-grow p-3 sm:p-4 flex items-center justify-center" style={{ minHeight: 0 }}>
      <div className="grid gap-px w-full h-full max-w-[900px] max-h-full bg-white/30"
           style={{
             gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
             gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
             aspectRatio: `${GRID_COLS / GRID_ROWS}`,
             border: '1px solid rgba(255, 255, 255, 0.3)'
           }}>
        {grid.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((isActive, colIndex) => (
              <NoteCell
                key={`${rowIndex}-${colIndex}`}
                isActive={isActive}
                isHighlighted={colIndex === currentColumn}
                rowIndex={rowIndex}
                onClick={() => onNoteClick(rowIndex, colIndex)}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
  </div>
);

interface ControlsProps {
    isPlaying: boolean;
    tempo: number;
    showSaveConfirm: boolean;
    onPlayToggle: () => void;
    onTempoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClearGrid: () => void;
    onSave: () => void;
    onLoad: () => void;
    onExportMIDI: () => void;
    onExportWAV: () => void;
}

const Controls: React.FC<ControlsProps> = ({ isPlaying, tempo, showSaveConfirm, onPlayToggle, onTempoChange, onClearGrid, onSave, onLoad, onExportMIDI, onExportWAV }) => (
    <div className="bg-white/20 backdrop-blur-sm p-3 flex-shrink-0 border-t border-white/30">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <button
                onClick={onPlayToggle}
                className="p-3 bg-white/90 hover:bg-white active:bg-white/80 rounded-full text-purple-600 transition-all shadow-lg hover:shadow-xl disabled:bg-white/50 disabled:cursor-not-allowed"
                title={isPlaying ? "Stop" : "Play"}
            >
                {isPlaying ? <StopIcon className="w-5 h-5"/> : <PlayIcon className="w-5 h-5"/>}
            </button>

            <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
                <label htmlFor="tempo" className="font-medium text-white text-xs">Tempo</label>
                <input
                    type="range"
                    id="tempo"
                    min="40"
                    max="240"
                    value={tempo}
                    onChange={onTempoChange}
                    className="w-24 sm:w-32 cursor-pointer accent-white"
                    disabled={isPlaying}
                />
                <span className="w-14 text-center text-white font-mono text-xs">{tempo}</span>
            </div>

            <button
                onClick={onClearGrid}
                className="px-3 py-2 bg-white/30 hover:bg-white/40 active:bg-white/50 rounded-lg text-white transition-all disabled:bg-white/20 disabled:opacity-50 font-medium text-xs"
                disabled={isPlaying}
                title="Clear all notes"
            >
                Clear
            </button>

            <div className="h-6 w-px bg-white/40"></div>

            <button
                onClick={onExportMIDI}
                className="px-3 py-2 bg-white/30 hover:bg-white/40 active:bg-white/50 rounded-lg text-white transition-all disabled:bg-white/20 disabled:opacity-50 text-xs font-medium"
                disabled={isPlaying}
                title="Export as MIDI file"
            >
                MIDI
            </button>

            <button
                onClick={onExportWAV}
                className="px-3 py-2 bg-white/30 hover:bg-white/40 active:bg-white/50 rounded-lg text-white transition-all disabled:bg-white/20 disabled:opacity-50 text-xs font-medium"
                disabled={isPlaying}
                title="Export as WAV file (actual audio)"
            >
                WAV
            </button>
        </div>
    </div>
);


// --- MAIN APP COMPONENT ---

export default function App() {
  const [grid, setGrid] = useState<GridType>(createEmptyGrid());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentColumn, setCurrentColumn] = useState(-1);
  const [tempo, setTempo] = useState(120);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const mainGainNodeRef = useRef<GainNode | null>(null);
  const playbackIntervalRef = useRef<number | null>(null);

  const initializeAudio = useCallback(() => {
    if (!audioContextRef.current) {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = context;
        mainGainNodeRef.current = context.createGain();
        mainGainNodeRef.current.connect(context.destination);
    }
    if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
    }
  }, []);

  const playNote = useCallback((noteIndex: number, time: number) => {
    if (!audioContextRef.current || !mainGainNodeRef.current) return;
    const context = audioContextRef.current;

    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(NOTES[noteIndex], time);

    const noteGain = context.createGain();
    noteGain.gain.setValueAtTime(0, time);
    noteGain.gain.linearRampToValueAtTime(0.3, time + 0.01);
    noteGain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

    oscillator.connect(noteGain);
    noteGain.connect(mainGainNodeRef.current);

    oscillator.start(time);
    oscillator.stop(time + 0.5);
  }, []);
  
  const scheduleNotes = useCallback(() => {
    const nextColumn = (currentColumn + 1) % GRID_COLS;
    setCurrentColumn(nextColumn);
    
    if (!audioContextRef.current) return;
    const time = audioContextRef.current.currentTime;
    for (let i = 0; i < GRID_ROWS; i++) {
        if (grid[i][nextColumn]) {
            playNote(i, time);
        }
    }
  }, [currentColumn, grid, playNote]);
  
  useEffect(() => {
    if (isPlaying) {
      initializeAudio();
      const intervalTime = (60 / tempo) * 250; // for 16th notes
      playbackIntervalRef.current = window.setInterval(scheduleNotes, intervalTime);
    } else {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
        playbackIntervalRef.current = null;
      }
      setCurrentColumn(-1);
    }
    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, [isPlaying, tempo, scheduleNotes, initializeAudio]);
  
  useEffect(() => {
    if (showSaveConfirm) {
        const timer = setTimeout(() => setShowSaveConfirm(false), 2000);
        return () => clearTimeout(timer);
    }
  }, [showSaveConfirm]);

  const handleNoteClick = useCallback((row: number, col: number) => {
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = !newGrid[row][col];
    setGrid(newGrid);
  }, [grid]);

  const handlePlayToggle = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleTempoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempo(Number(e.target.value));
  };

  const handleClearGrid = () => {
    setGrid(createEmptyGrid());
  };

  const handleSave = useCallback(() => {
    if (isPlaying) {
      console.log('Cannot save while playing');
      return;
    }
    try {
      const dataToSave = { grid, tempo };
      localStorage.setItem('melody-maker-save', JSON.stringify(dataToSave));
      console.log('Melody saved successfully:', dataToSave);
      setShowSaveConfirm(true);
    } catch (error) {
      console.error('Failed to save melody:', error);
      alert('Failed to save melody. Please try again.');
    }
  }, [grid, tempo, isPlaying]);

  const handleLoad = useCallback(() => {
    if (isPlaying) {
      console.log('Cannot load while playing');
      return;
    }
    try {
      const savedDataString = localStorage.getItem('melody-maker-save');
      console.log('Loading melody from localStorage:', savedDataString);

      if (savedDataString) {
        const savedData = JSON.parse(savedDataString);
        if (savedData.grid && savedData.tempo) {
          setGrid(savedData.grid);
          setTempo(savedData.tempo);
          console.log('Melody loaded successfully:', savedData);
          alert('Melody loaded successfully!');
        } else {
          console.error('Invalid saved data format:', savedData);
          alert('Could not load melody. Saved data is in an invalid format.');
        }
      } else {
        console.log('No saved melody found');
        alert('No saved melody found!');
      }
    } catch (error) {
      console.error("Failed to load or parse saved melody:", error);
      alert('Could not load melody. The saved data might be corrupted.');
    }
  }, [isPlaying]);

  const handleExportMIDI = useCallback(() => {
    if (isPlaying) return;

    // MIDI note numbers corresponding to our frequencies
    const midiNotes = [72, 69, 67, 64, 62, 60, 57, 55]; // C5 to G3

    // Create MIDI file data
    const header = [0x4D, 0x54, 0x68, 0x64, 0x00, 0x00, 0x00, 0x06, 0x00, 0x00, 0x00, 0x01, 0x00, 0x60]; // Header
    const trackHeader = [0x4D, 0x54, 0x72, 0x6B]; // Track header "MTrk"

    const events: number[] = [];
    const ticksPerBeat = 96;
    const beatsPerMinute = tempo;
    const ticksPerColumn = ticksPerBeat / 4; // 16th notes

    // Tempo event
    const microsecondsPerBeat = Math.floor(60000000 / beatsPerMinute);
    events.push(0x00, 0xFF, 0x51, 0x03, (microsecondsPerBeat >> 16) & 0xFF, (microsecondsPerBeat >> 8) & 0xFF, microsecondsPerBeat & 0xFF);

    // Convert grid to MIDI events
    for (let col = 0; col < GRID_COLS; col++) {
      for (let row = 0; row < GRID_ROWS; row++) {
        if (grid[row][col]) {
          const note = midiNotes[row];
          const deltaTime = col === 0 && row === 0 ? 0x00 : 0x00;

          // Note On
          events.push(deltaTime, 0x90, note, 0x64); // Channel 1, velocity 100
          // Note Off (after ticksPerColumn ticks)
          events.push(ticksPerColumn, 0x80, note, 0x00);
        }
      }
    }

    // End of track
    events.push(0x00, 0xFF, 0x2F, 0x00);

    // Calculate track length
    const trackLength = events.length;
    const trackLengthBytes = [
      (trackLength >> 24) & 0xFF,
      (trackLength >> 16) & 0xFF,
      (trackLength >> 8) & 0xFF,
      trackLength & 0xFF
    ];

    // Combine all parts
    const midiData = new Uint8Array([...header, ...trackHeader, ...trackLengthBytes, ...events]);

    // Create and download blob
    const blob = new Blob([midiData], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `melody-maker-${Date.now()}.mid`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('MIDI file exported');
  }, [grid, tempo, isPlaying]);

  const handleExportWAV = useCallback(async () => {
    if (isPlaying) return;

    try {
      // Calculate total duration
      const beatDuration = 60 / tempo; // seconds per beat
      const columnDuration = beatDuration / 4; // 16th notes
      const totalDuration = GRID_COLS * columnDuration + 1; // +1 second for final notes to ring out

      // Create offline audio context
      const sampleRate = 44100;
      const offlineContext = new OfflineAudioContext(2, sampleRate * totalDuration, sampleRate);

      // Create master gain - increased volume to match playback
      const masterGain = offlineContext.createGain();
      masterGain.gain.value = 0.5; // Increased from 0.3 to 0.5 for louder export
      masterGain.connect(offlineContext.destination);

      // Schedule all notes
      for (let col = 0; col < GRID_COLS; col++) {
        const startTime = col * columnDuration;

        for (let row = 0; row < GRID_ROWS; row++) {
          if (grid[row][col]) {
            // Create oscillator for this note
            const oscillator = offlineContext.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(NOTES[row], startTime);

            // Create gain envelope - increased note volume
            const noteGain = offlineContext.createGain();
            noteGain.gain.setValueAtTime(0, startTime);
            noteGain.gain.linearRampToValueAtTime(0.7, startTime + 0.01); // Increased from 0.5 to 0.7
            noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5); // Decay

            // Connect nodes
            oscillator.connect(noteGain);
            noteGain.connect(masterGain);

            // Schedule playback
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.5);
          }
        }
      }

      console.log('Rendering audio...');

      // Render the audio
      const renderedBuffer = await offlineContext.startRendering();

      console.log('Audio rendered, creating WAV file...');

      // Convert to WAV format
      const wavData = audioBufferToWav(renderedBuffer);
      const blob = new Blob([wavData], { type: 'audio/wav' });

      // Download the file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `melody-maker-${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('WAV file exported successfully');
      alert('WAV file exported successfully!');
    } catch (error) {
      console.error('Failed to export WAV:', error);
      alert('Failed to export WAV file. Please try again.');
    }
  }, [grid, tempo, isPlaying]);

  // Helper function to convert AudioBuffer to WAV
  const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
    const numberOfChannels = buffer.numberOfChannels;
    const length = buffer.length * numberOfChannels * 2;
    const sampleRate = buffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);

    // Write WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // fmt chunk size
    view.setUint16(20, 1, true); // audio format (1 = PCM)
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true); // byte rate
    view.setUint16(32, numberOfChannels * 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample
    writeString(36, 'data');
    view.setUint32(40, length, true);

    // Write audio data
    const channels: Float32Array[] = [];
    for (let i = 0; i < numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channels[channel][i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return arrayBuffer;
  };

  return (
    <div className="h-screen flex flex-col font-sans overflow-hidden" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <header className="p-3 sm:p-4 text-center flex-shrink-0 border-b border-white/20 relative">
            <h1 style={{ fontSize: '2rem', letterSpacing: '.2rem', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, textTransform: 'uppercase' }} className="text-white">Melody Maker Plus</h1>
        </header>
        <main className="flex-grow flex flex-col w-full max-w-7xl mx-auto overflow-hidden">
            <Grid grid={grid} currentColumn={currentColumn} onNoteClick={handleNoteClick} />
        </main>
        <Controls
            isPlaying={isPlaying}
            tempo={tempo}
            showSaveConfirm={showSaveConfirm}
            onPlayToggle={handlePlayToggle}
            onTempoChange={handleTempoChange}
            onClearGrid={handleClearGrid}
            onSave={handleSave}
            onLoad={handleLoad}
            onExportMIDI={handleExportMIDI}
            onExportWAV={handleExportWAV}
        />
    </div>
  );
}