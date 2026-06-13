import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReelsFeed from '../components/reels/ReelsFeed';
import '../components/reels/reels.css';

function ReelsPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  // Track ALL video IDs ever shown in this session to prevent repeats
  const [seenIds, setSeenIds] = useState(new Set());
  const location = useLocation();
  const navigate = useNavigate();

  // Parse query params, e.g. /reels?q=breaking+bad
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || 'trending movies';

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchFeed = async (currentSeenIds = new Set()) => {
    const token = localStorage.getItem('token');
    // Pass already-shown IDs so backend skips them from cache
    const exclude = currentSeenIds.size > 0 ? [...currentSeenIds].join(',') : '';
    const response = await axios.get(`${API_URL}/shorts/feed`, {
      params: { query, ...(exclude ? { exclude } : {}) },
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return response.data;
  };

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        setLoading(true);
        setSeenIds(new Set()); // Reset seen IDs on fresh load
        const data = await fetchFeed(new Set()); // no exclusions on fresh load
        if (data && data.success) {
          setVideos(data.videos);
          setSeenIds(new Set(data.videos));
        } else {
          toast.error("Could not find relevant shorts.");
        }
      } catch (err) {
        console.error("Error fetching reels:", err);
        setVideos([]);
        toast.info("Could not load shorts. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchShorts();
  }, [query]);

  const loadMoreShorts = async () => {
    if (loadingMore) return;
    try {
      setLoadingMore(true);
      const data = await fetchFeed(seenIds); // pass session seen IDs so backend skips them

      if (data && data.success) {
        // Frontend seenIds state prevents already-shown videos from being added
        const newVideos = data.videos.filter(v => !seenIds.has(v));
        if (newVideos.length > 0) {
          setVideos(prev => [...prev, ...newVideos]);
          setSeenIds(prev => {
            const updated = new Set(prev);
            newVideos.forEach(v => updated.add(v));
            return updated;
          });
        }
      }
    } catch (err) {
      console.error("Error fetching more reels:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="reels-page">
      <button className="reels-close-btn glass-button" onClick={() => navigate('/discover')}>
        &times; Close
      </button>
      
      {loading ? (
        <div className="reels-loader shimmer">
          Loading amazing shorts...
        </div>
      ) : (
        <ReelsFeed 
          videos={videos} 
          onLoadMore={loadMoreShorts} 
          loadingMore={loadingMore} 
        />
      )}
    </div>
  );
}

export default ReelsPage;
