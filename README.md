# AG Metronome

A simple and responsive **visual metronome** built with **React**, **Vite**, and **TypeScript**.  
Perfect for musicians to practice timing with a clear visual beat and audio clicks.

## Features

- **Set BPM**: Adjustable between 40 and 300 using a slider or keyboard arrows
- **Multiple Time Signatures**: 2/4, 3/4, 4/4, 6/8, and 8/8
- **Visual Beat Counter**: Animated beat indicators with the active beat highlighted:
  - First beat is emphasized with higher pitch (880Hz)
  - Other beats use a lower pitch (440Hz)
- **Play / Stop**: Start or stop the metronome
- **Mute / Unmute**: Toggle sound on/off
- **Visual Aid**: Optional screen flash on first beat
- **Tap Tempo**: Calculate BPM by tapping the button or pressing Enter
- **Keyboard Shortcuts**:
  - **Space**: Toggle Play/Stop
  - **M**: Toggle Mute/Unmute
  - **V**: Toggle Visual Aid
  - **B**: Change Beats
  - **↑/↓**: Increase/Decrease BPM
  - **Enter/T**: Tap Tempo
- **Mobile-friendly**: Fully responsive layout with centered content

## Live Demo

Check out the live demo: [https://ag-metronome.vercel.app](https://ag-metronome.vercel.app)

## Testing

- Component tests (4 components)
- Custom hooks tests (4 hooks)
- Integration tests
- Type safety tests

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm test:ui
```
