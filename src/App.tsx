import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { UI } from './components/UI';
import { AudioPlayer } from './components/AudioPlayer';

function App() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#050510]">
      <AudioPlayer />
      <Canvas
        camera={{ position: [0, 2, 5], fov: 75 }}
        gl={{ antialias: false }} // Better performance, relying on postprocessing
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <UI />
    </div>
  );
}

export default App;
