import React, { useState, useRef, useEffect } from 'react';
import ReelsPlayer from './ReelsPlayer';

function ReelsFeed({ videos, onLoadMore, loadingMore }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  const scrollToIndex = (index) => {
    if (index >= 0 && index < videos.length && containerRef.current) {
      const windowHeight = containerRef.current.clientHeight;
      containerRef.current.scrollTo({
        top: index * windowHeight,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        scrollToIndex(activeIndex - 1);
      } else if (e.key === 'ArrowDown') {
        scrollToIndex(activeIndex + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, videos.length]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    
    // Calculate which slide is mostly in view
    const scrollPosition = containerRef.current.scrollTop;
    const windowHeight = containerRef.current.clientHeight;
    
    const index = Math.round(scrollPosition / windowHeight);
    if (index !== activeIndex && index >= 0 && index < videos.length) {
      setActiveIndex(index);
      
      // Trigger load more when user reaches the second-to-last video
      if (index >= videos.length - 2 && onLoadMore) {
        onLoadMore();
      }
    }
  };

  return (
    <div 
      className="reels-feed-container" 
      ref={containerRef} 
      onScroll={handleScroll}
    >
      {videos.map((videoId, index) => (
        <ReelsPlayer 
          key={`${videoId}-${index}`} 
          videoId={videoId} 
          isActive={index === activeIndex} 
        />
      ))}
      
      {/* Scroll controls for desktop */}
      <div className="reels-nav-buttons">
        <button 
          className="reels-nav-btn" 
          onClick={() => scrollToIndex(activeIndex - 1)}
          disabled={activeIndex === 0}
        >
          ▲
        </button>
        <button 
          className="reels-nav-btn" 
          onClick={() => scrollToIndex(activeIndex + 1)}
          disabled={activeIndex === videos.length - 1 && !loadingMore}
        >
          ▼
        </button>
      </div>
      
      {loadingMore && (
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', zIndex: 10 }}>
          Loading more...
        </div>
      )}
    </div>
  );
}

export default ReelsFeed;
