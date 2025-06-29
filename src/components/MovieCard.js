import Link from 'next/link';
 export default function MovieCard({ movie }) {
   return (
     <div style={{ border: '1px solid #ccc', margin: 10, padding: 10, maxWidth: 200 }}>
       <img src={movie.posterUrl} alt={movie.title} style={{ width: '100%' }} />
       <h3>{movie.title}</h3>
       <p>{movie.description.substring(0, 60)}...</p>
     <Link href={`/movies/${movie._id}`}>
       View Showtimes
     </Link>
     </div>
   );
 }
