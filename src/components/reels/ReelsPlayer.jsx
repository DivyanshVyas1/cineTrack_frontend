import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

function ReelsPlayer({ videoId, isActive }) {
  const [isMuted, setIsMuted] = useState(false); // Default to unmuted as requested
  const [isPaused, setIsPaused] = useState(false);
  const [player, setPlayer] = useState(null);
  const containerRef = useRef(null);
  const pressTimer = useRef(null);
  const isPressing = useRef(false);

  useEffect(() => {
    // Load YouTube Iframe API if not loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (!containerRef.current) return;
      const ytPlayer = new window.YT.Player(containerRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: isActive ? 1 : 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          loop: 1,
          playlist: videoId, // Required for loop
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          mute: 0 // Start unmuted
        },
        events: {
          onReady: (event) => {
            setPlayer(event.target);
            if (isActive) {
              event.target.playVideo();
            } else {
              event.target.pauseVideo();
            }
          },
          onStateChange: (event) => {
            // Ensure loop works smoothly
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          }
        }
      });
    };

    // If API is already ready, init immediately. Else wait for global callback.
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initPlayer();
      };
    }

    return () => {
      if (player && typeof player.destroy === 'function') {
        player.destroy();
      }
    };
  }, [videoId]); // Re-init if videoId changes

  // Handle active state changes
  useEffect(() => {
    if (player && typeof player.playVideo === 'function') {
      if (isActive) {
        if (!isPaused) {
          player.playVideo();
        }
        if (isMuted) player.mute();
        else player.unMute();
      } else {
        player.pauseVideo();
        setIsPaused(false); // Reset pause state when swiping away
      }
    }
  }, [isActive, player, isMuted, isPaused]);

  const togglePlayPause = (e) => {
    e.stopPropagation();
    if (!player || typeof player.pauseVideo !== 'function') return;
    
    // Check current state from YouTube player
    // 1 is playing, 2 is paused
    const state = player.getPlayerState();
    if (state === 1) {
      player.pauseVideo();
      setIsPaused(true);
    } else {
      player.playVideo();
      setIsPaused(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!player) return;
    if (isMuted) {
      player.unMute();
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  };

  return (
    <div className="reels-slide">
      <div className="reels-video-container">
        {/* The div that YouTube API replaces with an iframe */}
        <div ref={containerRef} className="reels-iframe"></div>
        
        {/* Transparent overlay to handle touch/mouse events */}
        <div 
          className="reels-overlay" 
          onClick={togglePlayPause}
        >
          {/* Top Right Mute/Unmute Button */}
          <button 
            onClick={toggleMute}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              zIndex: 20,
              background: 'rgba(0,0,0,0.5)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem'
            }}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          {isPaused && isActive && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="reels-mute-indicator"
            >
              <span style={{ fontSize: '3rem' }}>⏸️</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReelsPlayer;
