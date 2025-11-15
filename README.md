# melomak

A musical sequencer web app based on Chrome Music Lab's Melody Maker. Create melodies by clicking on a grid where time moves left to right and pitch goes up to down.

## Features

- **Interactive 8x16 Grid**: Color-coded musical patterns
- **Visual Playback**: Real-time column highlighting
- **Tempo Control**: 40-240 BPM range
- **Export**: MIDI files (DAW-compatible) and WAV audio (44.1kHz stereo)
- **Modern UI**: Gradient background with glassmorphism
- **Responsive**: Works on desktop and mobile
- **No Dependencies**: Runs entirely in your browser using Web Audio API

## Run Locally

**Prerequisites:** Node.js (v16 or higher)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open your browser at `http://localhost:3055` (port may vary)

## How to Use

1. **Create**: Click grid cells to add or remove notes - each row represents a different pitch
2. **Play**: Hit the play button to hear your melody loop
3. **Adjust Tempo**: Use the tempo slider to change playback speed (40-240 BPM)
4. **Export**: Click MIDI or WAV to download your melody
5. **Clear**: Reset the grid to start fresh

## Tech Stack

- **React 19** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Web Audio API** - Browser-native audio synthesis

Based on [Chrome Music Lab - Melody Maker](https://github.com/googlecreativelab/chrome-music-lab/tree/master/melodymaker)
