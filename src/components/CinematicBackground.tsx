import React from 'react';

export default function CinematicBackground() {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none select-none">
      {/* 1. Underlying Autoplay looped background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover transform scale-102 filter brightness-[0.7] contrast-[1.05]"
      >
        <source src="/newwork 1.mp4" type="video/mp4" />
      </video>

      {/* 2. Premium Multi-Layered Dark Gradients & Backdrop Blur */}
      {/* Absolute dark screen shield */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[5px]" />
      
      {/* Ambient Radial Vignette for luxurious visual depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_15%,_rgba(5,5,7,0.85)_80%,_#050507_100%)]" />

      {/* Golden-bronze top-right header glow backing */}
      <div className="absolute top-0 right-0 w-[45rem] h-[35rem] bg-gradient-to-br from-[#C5A880]/12 to-transparent rounded-full blur-[140px] mix-blend-screen opacity-70 pointer-events-none" />

      {/* Soft platinum bottom-left vault glow backing */}
      <div className="absolute -bottom-24 -left-20 w-[45rem] h-[45rem] bg-slate-800/20 rounded-full blur-[160px] mix-blend-screen opacity-50 pointer-events-none" />
    </div>
  );
}

