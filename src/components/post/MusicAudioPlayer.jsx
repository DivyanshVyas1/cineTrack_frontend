import { useRef, useState, useEffect } from "react";
import YouTube from "react-youtube";
import { formatDuration } from "../../lib/titleLink";

function MusicAudioPlayer({ src, durationSeconds = 0, className = "" }) {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(durationSeconds || 0);
  
  // We extract the videoId. Previously it might have been `/api/music/preview/VIDEO_ID`,
  // now it should just be `VIDEO_ID` directly from our updated backend.
  // We'll safely parse it just in case older posts still have the old url format in DB.
  const videoId = src?.startsWith("/api/") ? src.split("/").pop() : src;

  useEffect(() => {
    let interval;
    if (isPlaying && player) {
      interval = setInterval(async () => {
        try {
          const currentTime = await player.getCurrentTime();
          const dur = await player.getDuration();
          if (dur > 0 && duration === 0) setDuration(dur);
          setProgress((currentTime / dur) * 100 || 0);
        } catch (err) {}
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, player, duration]);

  const onReady = (event) => {
    setPlayer(event.target);
  };

  const onStateChange = (event) => {
    // 1 = playing, 2 = paused, 0 = ended
    if (event.data === 1) setIsPlaying(true);
    else setIsPlaying(false);
  };

  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const handleSeek = (e) => {
    if (!player || !duration) return;
    const newProgress = parseFloat(e.target.value);
    const seekToTime = (newProgress / 100) * duration;
    player.seekTo(seekToTime, true);
    setProgress(newProgress);
  };

  if (!videoId) return null;

  return (
    <div className={`custom-audio-player ${className}`.trim()} style={{
      display: "flex",
      alignItems: "center",
      gap: "0.8rem",
      background: "rgba(255, 255, 255, 0.03)",
      borderRadius: "12px",
      padding: "0.6rem 1rem",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      width: "100%",
    }}>
      {/* Hidden YouTube Player */}
      <div style={{ display: "none" }}>
        <YouTube 
          videoId={videoId} 
          opts={{ height: "0", width: "0", playerVars: { autoplay: 0, controls: 0 } }} 
          onReady={onReady}
          onStateChange={onStateChange}
        />
      </div>

      <button 
        type="button"
        onClick={togglePlay}
        style={{
          width: "36px", height: "36px", borderRadius: "50%",
          background: "var(--accent-1)", color: "#fff", border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", flexShrink: 0
        }}
      >
        {isPlaying ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: "2px" }}><polygon points="5 3 19 12 5 21 5 3"/></svg>
        )}
      </button>

      <input 
        type="range" 
        min="0" max="100" 
        value={progress} 
        onChange={handleSeek}
        style={{
          flexGrow: 1, height: "4px", appearance: "none", background: "rgba(255,255,255,0.2)",
          borderRadius: "2px", outline: "none", cursor: "pointer"
        }}
      />
      
      {duration > 0 && (
        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", minWidth: "35px", textAlign: "right" }}>
          {formatDuration(duration)}
        </span>
      )}
    </div>
  );
}

export default MusicAudioPlayer;
