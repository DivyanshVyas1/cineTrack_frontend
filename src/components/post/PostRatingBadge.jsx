import Badge from "../ui/Badge";

function PostRatingBadge({ rating, className = "" }) {
  if (rating == null || rating === "") return null;
  return (
    <Badge variant="blue" className={`post-rating-badge ${className}`.trim()}>
      {rating}/10
    </Badge>
  );
}

export default PostRatingBadge;
