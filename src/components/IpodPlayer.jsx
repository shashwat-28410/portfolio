import React, { useState, useRef, useEffect } from 'react';

export function IpodPlayer({
  onMenu,
  art = '/_next/static/media/ipod.0s6s08dql3uzr.png',
  stickers = '/_next/static/media/ipod-stickers.03fl-q5ho8_2-.png'
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Initialize audio element with our custom soothing lofi track
    const audio = new Audio('/audio/lofi-coding.wav');
    audio.loop = true;
    audio.volume = 0.65;
    audioRef.current = audio;

    audio.onended = () => {
      setIsPlaying(false);
    };

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Audio play request was interrupted or blocked:', err);
      });
    }
  };

  const handleNext = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    if (!isPlaying) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handlePrev = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    if (!isPlaying) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <span className="chome__ipod" style={{ position: 'relative', display: 'block', width: '100%' }}>
      {/* Photorealistic 3D iPod Body Art */}
      <img src={art} alt="Retro iPod" draggable={false} style={{ width: '100%', height: 'auto', display: 'block' }} />

      {/* Colorful Pop Stickers Layer */}
      {stickers && (
        <img
          src={stickers}
          alt=""
          draggable={false}
          className="chome__ipod-stickers"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        />
      )}

      {/* Retro iPod Screen: Pure Rotating CD Display */}
      <span
        className="chome__ipod-screen"
        onClick={togglePlay}
        title={isPlaying ? "Playing Lo-Fi Coding Beats (Click to Pause)" : "Click to Play Lo-Fi Beats"}
        style={{
          position: 'absolute',
          left: '6.8%',
          top: '5.8%',
          width: '70.2%',
          height: '35%',
          borderRadius: '5px',
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.12)',
          background: 'radial-gradient(circle at center, #111827 0%, #030712 100%)',
          cursor: 'pointer',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2px'
        }}
      >
        <style>{`
          @keyframes cd-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>

        {/* Circular Rotating CD Disc fitting the screen */}
        <div
          style={{
            height: '96%',
            aspectRatio: '1 / 1',
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: isPlaying
              ? '0 0 12px rgba(126, 207, 174, 0.45), 0 2px 6px rgba(0,0,0,0.8)'
              : '0 2px 6px rgba(0,0,0,0.8)',
            animation: 'cd-spin 3.2s linear infinite',
            animationPlayState: isPlaying ? 'running' : 'paused',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            src="/images/cd-disc.png"
            alt="Rotating CD Disc"
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        </div>
      </span>

      {/* Click Wheel Menu Button */}
      {onMenu && (
        <button
          type="button"
          className="chome__ipod-menu"
          aria-label="Open the menu"
          onClick={onMenu}
          onPointerDown={(e) => e.stopPropagation()}
        />
      )}

      {/* Play / Pause Button */}
      <button
        type="button"
        className="chome__ipod-play"
        aria-label="Play or pause music"
        onClick={togglePlay}
        onPointerDown={(e) => e.stopPropagation()}
        style={{ cursor: 'pointer' }}
      />

      {/* Previous Track Button */}
      <button
        type="button"
        className="chome__ipod-prev"
        aria-label="Previous track"
        onClick={handlePrev}
        onPointerDown={(e) => e.stopPropagation()}
        style={{ cursor: 'pointer' }}
      />

      {/* Next Track Button */}
      <button
        type="button"
        className="chome__ipod-next"
        aria-label="Next track"
        onClick={handleNext}
        onPointerDown={(e) => e.stopPropagation()}
        style={{ cursor: 'pointer' }}
      />
    </span>
  );
}
