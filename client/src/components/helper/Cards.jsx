import { Link } from "react-router-dom";
import { useRef } from "react";
import "./Card.css";

function Cards({ data, title }) {
  const cardRefs = useRef([]);

  return (
    <div className="cards-grid">
      {data.map((d, i) => (
        <Link
          to={`/${d.media_type || title}/details/${d.id}`}
          className="card group"
          key={i}
          ref={(el) => (cardRefs.current[i] = el)}
          aria-label={d.title || d.name || d.original_title || d.original_name}
        >
          <div className="placeholder">
            <img
              className="card-img"
              src={`https://image.tmdb.org/t/p/original/${d.poster_path || d.backdrop_path || d.profile_path}?`}
              alt={d.title || d.name || d.original_title || d.original_name}
              loading="lazy"
              onLoad={(e) => (e.target.className += " lazyloaded")}
            />
          </div>
          {d.vote_average && title !== "people" && (
            <div className="card-rating">{(d.vote_average * 10).toFixed()}%</div>
          )}
          <div className="card-overlay">
            <h2 className="card-title">{d.title || d.name || d.original_title || d.original_name}</h2>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Cards;
