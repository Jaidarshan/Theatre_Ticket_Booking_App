import Link from 'next/link';

export default function MovieCard({ movie }) {
  return (
    <div className="card h-100 shadow-sm border-0" style={{ width: '17rem' }}>
      {/* Poster Section */}
      <div style={{ height: '300px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={movie.posterUrl}
          alt={movie.title}
          style={{
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Content Section */}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-semibold mb-2">{movie.title}</h5>
        <p className="card-text text-muted mb-2 flex-grow-1">
          {movie.description.length > 60
            ? movie.description.substring(0, 60) + '...'
            : movie.description}
        </p>

        <span className="badge bg-light text-dark border mb-2" style={{ width: 'fit-content' }}>
          {movie.genre || 'Genre'}
        </span>

        <ul className="list-unstyled small text-muted mb-3">
          <li><strong>Duration:</strong> {movie.duration} minutes</li>
          <li><strong>Language:</strong> {movie.language}</li>
          <li><strong>Certificate:</strong> {movie.certificate}</li>
        </ul>

        <Link
          href={`/movies/${movie._id}`}
          className="btn btn-sm mt-auto"
          style={{
            backgroundColor: '#212529',
            color: '#fff',
            borderRadius: '4px',
            fontWeight: '500'
          }}
        >
          Book Tickets
        </Link>
      </div>
    </div>
  );
}
