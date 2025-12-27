'use client';

import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import { Suspense } from 'react';
import Gallery from './Gallery';

export default function Scene() {
    return (
        <Canvas
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 5], fov: 50 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 1 }}
        >
            <Suspense fallback={null}>
                <ScrollControls pages={5} damping={0.8} horizontal>
                    <Gallery />
                </ScrollControls>
            </Suspense>
            {/* Soft lighting for the 'Clean Slate' feel */}
            <ambientLight intensity={1.5} />
        </Canvas>
    );
}
