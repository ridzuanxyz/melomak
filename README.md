# melomak

A musical sequencer web app based on Chrome Music Lab’s Melody Maker. Create melodies by clicking on a grid where time moves left to right and pitch goes up to down.

## Features

- **Interactive 8x16 Grid**: Click cells to create musical patterns with color-coded notes
- **Visual Playback**: Watch your melody play with highlighted columns in real-time
- **Tempo Control**: Adjust playback speed from 40-240 BPM with a smooth slider
- **Export Audio**: Export your melodies as MIDI or WAV files for use in other applications
- **Modern UI**: Beautiful gradient background with glassmorphism design elements
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **No Dependencies**: Runs entirely in your browser using the Web Audio API - no API keys required!

## Export Formats

- **MIDI Export**: Create standard MIDI files compatible with any DAW or music software
- **WAV Export**: Generate high-quality 44.1kHz stereo audio files ready for sharing or further processing

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

3. Open your browser and navigate to:
   ```
   http://localhost:3055
   ```
   (Port may vary - check the terminal output for the actual port)

**Note:** No API key required! This app runs entirely in your browser using the Web Audio API.

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
