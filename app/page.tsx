'use client';

import dynamic from 'next/dynamic';
import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

// Dynamic import for Scene to avoid SSR
const Scene = dynamic(() => import('./components/Scene'), { ssr: false });

export default function Home() {
  const container = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // Intro Animation
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power3.out",
      delay: 0.5
    })
      .to(introRef.current, {
        opacity: 0,
        duration: 1,
        delay: 1,
        onComplete: () => {
          if (introRef.current) introRef.current.style.display = 'none';
        }
      });

  }, { scope: container });

  return (
    <main ref={container} style={{ width: '100%', height: '100vh', position: 'relative' }}>

      {/* 3D Scene Layer */}
      <Scene />

      {/* Intro Overlay */}
      <div
        ref={introRef}
        style={{
          position: 'fixed',
          top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'var(--clean-slate)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <h1
          ref={titleRef}
          style={{
            fontSize: '10vw',
            fontFamily: 'var(--font-playfair), serif',
            color: 'var(--deep-brown)',
            opacity: 0,
            transform: 'translateY(50px)'
          }}
        >
          CLEAN SLATES
        </h1>
      </div>

    </main>
  );
}
