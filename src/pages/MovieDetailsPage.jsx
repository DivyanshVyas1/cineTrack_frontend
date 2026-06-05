import { useCallback, useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { toast } from "react-toastify";

import Badge from "../components/ui/Badge";

import ProfileAddForm from "../components/profile/ProfileAddForm";

import ReviewCard from "../components/profile/ReviewCard";

import { useAuth } from "../hooks/useAuth";

import { getRateHeading, getMediaLabel } from "../lib/mediaLabels";

import { fetchMovie, fetchMovieReviews } from "../services/movieService";

import { addToList } from "../services/userService";



function MovieDetailsPage() {

  const { id } = useParams();

  const { isAuthenticated, user } = useAuth();

  const [movie, setMovie] = useState(null);

  const [reviews, setReviews] = useState([]);

  const [stats, setStats] = useState({ count: 0, average: null });

  const [loading, setLoading] = useState(true);

  const [addingToWatchlist, setAddingToWatchlist] = useState(false);



  const loadReviews = useCallback(async () => {

    const data = await fetchMovieReviews(id);

    setReviews(data.reviews || []);

    setStats(data.stats || { count: 0, average: null });

  }, [id]);



  useEffect(() => {

    const load = async () => {

      try {

        const m = await fetchMovie(id);

        setMovie(m);

        await loadReviews();

      } catch (err) {

        toast.error(err.response?.data?.message || "Title not found");

      } finally {

        setLoading(false);

      }

    };

    load();

  }, [id, loadReviews]);



  if (loading) return <div className="glass-card page-card shimmer">Loading...</div>;

  if (!movie) return <div className="glass-card page-card">Title not found.</div>;



  const userReview = user

    ? reviews.find((r) => String(r.user?._id) === String(user._id))

    : null;

  const hasUserReview = Boolean(userReview);

  const communityReviews = reviews.filter((r) => String(r.user?._id) !== String(user?._id));



  const avg = stats.average != null ? stats.average : "—";

  const mediaLabel = getMediaLabel(movie.type);



  const handleWatchlist = async () => {
    setAddingToWatchlist(true);
    try {
      await addToList(movie._id, "watchlist");
      toast.success("Added to watchlist");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to watchlist");
    } finally {
      setAddingToWatchlist(false);
    }
  };



  return (

    <div className="movie-page">

      <section

        className="movie-hero glass-card"

        style={{

          backgroundImage: movie.backdrop

            ? `linear-gradient(rgba(5,8,22,0.85), rgba(5,8,22,0.95)), url(${movie.backdrop})`

            : undefined,

        }}

      >

        <div className="movie-hero-grid">

          {movie.poster ? (

            <img src={movie.poster} alt={movie.title} className="movie-poster-img" />

          ) : (

            <div className="movie-poster glass-card movie-poster-fallback">{movie.title?.charAt(0)}</div>

          )}

          <div>

            <Badge variant="pink">{movie.type}</Badge>

            <h1>{movie.title}</h1>

            <p>{movie.overview || "No synopsis yet."}</p>

            <div className="movie-meta">

              <span>Cinescore {avg}/10</span>

              <span>{stats.count} community reviews</span>

            </div>

            {isAuthenticated ? (
              <button 
                onClick={handleWatchlist} 
                className="btn-primary" 
                style={{ marginTop: '1rem' }}
                disabled={addingToWatchlist}
              >
                {addingToWatchlist ? "Adding..." : "+ Add to Watchlist"}
              </button>
            ) : null}

          </div>

        </div>

      </section>



      <div className="movie-content-grid">

        <section className="movie-main">

          {isAuthenticated && !hasUserReview ? (

            <ProfileAddForm

              existingMovie={movie}

              defaultMediaType={movie.type === "show" ? "series" : movie.type}

              mode="log"

              heading={getRateHeading(movie.type)}

              onPosted={loadReviews}

            />

          ) : null}



          {isAuthenticated && hasUserReview ? (

            <div className="glass-card panel your-review-banner">

              <h3>Your review</h3>

              <ReviewCard review={userReview} showAuthor={false} />

            </div>

          ) : null}



          {!isAuthenticated ? (

            <p className="sidebar-muted">

              <Link to="/login">Sign in</Link> to rate this {mediaLabel}.

            </p>

          ) : null}



          <h3>Community reviews</h3>

          {communityReviews.length === 0 ? (

            <p className="sidebar-muted">

              No public reviews yet. Reviews from private profiles appear after you follow them.

            </p>

          ) : (

            communityReviews.map((r) => <ReviewCard key={r._id} review={r} showAuthor />)

          )}

        </section>

      </div>

    </div>

  );

}



export default MovieDetailsPage;

