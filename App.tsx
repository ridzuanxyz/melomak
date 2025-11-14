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
    'w-full', 'h-full', 'rounded', 'transition-colors', 'duration-100', 'cursor-pointer',
    isActive ? activeColor : 'bg-slate-800 hover:bg-slate-700',
    isHighlighted && !isActive && 'bg-slate-600/50',
    isHighlighted && isActive && highlightColor
  ].join(' ');

  return <div className={cellClasses} onClick={onClick}></div>;
};

interface GridProps {
  grid: GridType;
  currentColumn: number;
  onNoteClick: (row: number, col: number) => void;
}

const Grid: React.FC<GridProps> = ({ grid, currentColumn, onNoteClick }) => (
  <div className="flex-grow p-4 overflow-x-auto">
      <div className="grid min-w-[800px] h-full gap-1 sm:gap-1.5" style={{ gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`, gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`}}>
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
}

const Controls: React.FC<ControlsProps> = ({ isPlaying, tempo, showSaveConfirm, onPlayToggle, onTempoChange, onClearGrid, onSave, onLoad }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm p-4 sticky bottom-0 border-t border-slate-700 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        <button onClick={onPlayToggle} className="p-3 bg-cyan-500 hover:bg-cyan-600 rounded-full text-white transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed">
            {isPlaying ? <StopIcon className="w-6 h-6"/> : <PlayIcon className="w-6 h-6"/>}
        </button>
        <div className="flex items-center gap-3">
            <label htmlFor="tempo" className="font-medium text-slate-300">Tempo</label>
            <input type="range" id="tempo" min="40" max="240" value={tempo} onChange={onTempoChange} className="w-32 sm:w-48 cursor-pointer" disabled={isPlaying}/>
            <span className="w-12 text-center text-slate-200 font-mono">{tempo} BPM</span>
        </div>
        <div className="relative">
             <button onClick={onSave} className="p-3 bg-slate-600 hover:bg-slate-700 rounded-full text-slate-200 transition-colors disabled:bg-slate-700" disabled={isPlaying}>
                <SaveIcon className="w-6 h-6" />
            </button>
            {showSaveConfirm && (
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-md text-sm font-semibold shadow-lg whitespace-nowrap">
                    Saved!
                </span>
            )}
        </div>
        <button onClick={onLoad} className="p-3 bg-slate-600 hover:bg-slate-700 rounded-full text-slate-200 transition-colors disabled:bg-slate-700" disabled={isPlaying}>
            <LoadIcon className="w-6 h-6" />
        </button>
        <button onClick={onClearGrid} className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-md text-slate-200 transition-colors disabled:bg-slate-700" disabled={isPlaying}>
            Clear
        </button>
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
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(NOTES[noteIndex], time);

    const noteGain = context.createGain();
    noteGain.gain.setValueAtTime(0.5, time);
    noteGain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

    oscillator.connect(noteGain);
    noteGain.connect(mainGainNodeRef.current);

    oscillator.start(time);
    oscillator.stop(time + 0.2);
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

  const handleSave = () => {
    if (isPlaying) return;
    const dataToSave = { grid, tempo };
    localStorage.setItem('melody-maker-save', JSON.stringify(dataToSave));
    setShowSaveConfirm(true);
  };

  const handleLoad = () => {
    if (isPlaying) return;
    const savedDataString = localStorage.getItem('melody-maker-save');
    if (savedDataString) {
      try {
        const savedData = JSON.parse(savedDataString);
        if (savedData.grid && savedData.tempo) {
          setGrid(savedData.grid);
          setTempo(savedData.tempo);
        } else {
            alert('Could not load melody. Saved data is in an invalid format.');
        }
      } catch (error) {
        console.error("Failed to load or parse saved melody:", error);
        alert('Could not load melody. The saved data might be corrupted.');
      }
    } else {
      alert('No saved melody found!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
        <header className="p-4 text-center">
            <h1 className="text-3xl font-bold text-slate-100 tracking-wider">Melody Maker</h1>
            <p className="text-slate-400">Click the grid to create a melody. Save and load your creations.</p>
        </header>
        <main className="flex-grow flex flex-col w-full max-w-7xl mx-auto">
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
        />
    </div>
  );
}