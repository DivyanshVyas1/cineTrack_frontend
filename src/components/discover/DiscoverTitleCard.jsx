import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import { buildTitleLink } from "../../lib/titleLink";

function DiscoverTitleCard({ entry, badgeLabel, badgeVariant = "blue", meta }) {
  const item = entry.title || entry.movie || entry;
  const href = buildTitleLink(item);

  return (
    <Link to={href} className="discover-title-card glass-card">
      {item.poster ? (
        <img src={item.poster} alt="" className="discover-title-card-poster" />
      ) : (
        <div className="discover-title-card-poster discover-title-card-poster-fallback">?</div>
      )}
      <div className="discover-title-card-body">
        {badgeLabel ? <Badge variant={badgeVariant}>{badgeLabel}</Badge> : null}
        <h4>{item.title}</h4>
        {item.artistName ? <p className="discover-title-card-artist">{item.artistName}</p> : null}
        {meta ? <p className="discover-title-card-meta">{meta}</p> : null}
      </div>
    </Link>
  );
}

export default DiscoverTitleCard;
