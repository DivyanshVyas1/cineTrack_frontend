import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import { buildTitleLink } from "../../lib/titleLink";



function ReviewCard({ review, showAuthor = false }) {

  const author = review.user;



  return (

    <article className="glass-card review-card">

      <div className="review-card-top">

        <div>

          {showAuthor && author ? (

            <Link to={`/profile/${author.username}`} className="review-author">

              {author.name} <span>@{author.username}</span>

            </Link>

          ) : null}

          <Link to={buildTitleLink(review)}>

            <h4>{review.movie?.title || review.title}</h4>

          </Link>

        </div>

        <Badge variant="blue">{review.rating}/10</Badge>

      </div>

      {review.note ? <p>{review.note}</p> : <p className="sidebar-muted">Rated without a written review.</p>}

      {review.isSpoiler ? <Badge variant="amber">Spoiler</Badge> : null}

      <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>

    </article>

  );

}



export default ReviewCard;

