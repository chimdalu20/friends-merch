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
    // Intro Animation
    tl.to(".intro-char", {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "back.out(1.7)",
      stagger: 0.1,
      delay: 0.2
    })
      .to(introRef.current, {
        opacity: 0,
        duration: 0.8,
        delay: 0.5,
        onComplete: () => {
          if (introRef.current) introRef.current.style.display = 'none';
        }
      });

  }, { scope: container });

  return (
    <main ref={container} style={{ width: '100%', height: '100vh', position: 'relative' }}>

      {/* 3D Scene Layer */}
      <Scene />

      {/* Left Fade Overlay */}
      <div className="fade-overlay left" />

      {/* Right Fade Overlay */}
      <div className="fade-overlay right" />

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
            display: 'flex',
            gap: '0.2rem',
            overflow: 'hidden'
          }}
        >
          {"F.R.I.E.N.D.S".split("").map((char, i) => (
            <span
              key={i}
              className="intro-char"
              style={{
                opacity: 0,
                transform: 'translateY(50px)',
                display: 'inline-block'
              }}
            >
              {char}
            </span>
          ))}
        </h1>
      </div>

    </main>
  );
}
