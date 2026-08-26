import { useState } from "react";
import { Link } from "react-router-dom";
import client from "../../services/client";
import { buildTitleLink } from "../../utils/titleLink";
import "./MagicSearch.css";

function MagicSearch() {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState("movie");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [aiGuess, setAiGuess] = useState(null);

  const handleSearch = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResults(null);
    setAiGuess(null);
    try {
      const { data } = await client.post("/search/magic", { prompt, type });
      setAiGuess(data.data.guess);
      setResults(data.data.results);
    } catch (err) {
      alert(err.response?.data?.message || "AI couldn't figure it out. Try adding more details!");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="magic-search-container glass-card">
      <div className="magic-search-header">
        <h3>Can't remember the name?</h3>
        <p className="sidebar-muted">
          Describe the plot, a scene, or some lyrics, and AI will find it for you.
        </p>
      </div>
      
      <div className="magic-search-input-group">
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value)} 
          className="magic-search-select"
        >
          <option value="movie">Movies</option>
          <option value="series">Web Shows</option>
          <option value="music">Songs</option>
          <option value="book">Books</option>
        </select>
        
        <input 
          type="text" 
          placeholder="e.g. guy stuck on mars growing potatoes" 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          className="magic-search-input"
        />
        
        <button 
          onClick={handleSearch} 
          disabled={loading || !prompt.trim()} 
          className="magic-search-btn"
        >
          {loading ? "Finding..." : "Find"}
        </button>
      </div>

      {loading && (
        <div className="magic-search-loading">
          🧠 AI is guessing the title...
        </div>
      )}

      {results && (
        <div className="magic-search-results">
          <p style={{ color: "var(--success, #4ade80)", margin: "0 0 1rem 0", fontSize: "0.95rem" }}>
            AI guessed: <strong>{aiGuess?.title} {aiGuess?.year ? `(${aiGuess.year})` : ""}</strong>
          </p>
          
          {results.length > 0 ? (
            <div>
              <p className="sidebar-muted" style={{ marginBottom: "0.5rem" }}>Top results:</p>
              <div className="magic-search-results-grid">
                {results.map((item) => (
                  <Link 
                    to={buildTitleLink(item)} 
                    key={item.externalId} 
                    className="magic-search-card"
                  >
                    <img 
                      src={item.poster || "/placeholder.jpg"} 
                      alt={item.title} 
                    />
                    <h4>{item.title}</h4>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <p className="sidebar-muted">No exact matches found for this guess.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default MagicSearch;
