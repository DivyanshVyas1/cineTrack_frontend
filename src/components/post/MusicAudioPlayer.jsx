import { useRef } from "react";
import { formatDuration } from "../../lib/titleLink";

function MusicAudioPlayer({ src, durationSeconds = 0, className = "" }) {
  const audioRef = useRef(null);

  const onLoadedMetadata = () => {
    const el = audioRef.current;
    if (!el || !Number.isFinite(el.duration) || el.duration <= 0) return;
    if (!durationSeconds && el.duration > 0) {
      el.setAttribute("aria-label", `Audio preview, duration ${formatDuration(Math.floor(el.duration))}`);
    }
  };

  return (
    <div className={`music-native-player-wrap ${className}`.trim()}>
      <audio
        ref={audioRef}
        controls
        controlsList="nodownload noplaybackrate"
        preload="metadata"
        src={src}
        className="music-native-player"
        onLoadedMetadata={onLoadedMetadata}
        onDurationChange={onLoadedMetadata}
        aria-label={
          durationSeconds
            ? `Audio preview, duration ${formatDuration(durationSeconds)}`
            : "Audio preview"
        }
      >
        Preview unavailable
      </audio>
    </div>
  );
}

export default MusicAudioPlayer;
