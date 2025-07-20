import { useState } from 'react';
import TheatreForm from '@/components/TheatreForm';
import MovieForm from '@/components/MovieForm';
import ShowtimeForm from '@/components/ShowtimeForm';

export default function AdminDashboard() {
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;
  if (!user || !user.isAdmin) {
    if (typeof window !== 'undefined') window.location.href = '/login';
    return <p>Redirecting...</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Admin Dashboard</h2>
        <button onClick={() => {
          localStorage.removeItem('user');
          window.location.href = '/welcome';
        }}>Logout</button>
      </div>
      <section>
        <h3>Add Theatre</h3>
        <TheatreForm />
      </section>
      <section>
        <h3>Add Movie</h3>
        <MovieForm />
      </section>
      <section>
        <h3>Add Showtime</h3>
        <ShowtimeForm />
      </section>
    </div>
  );
}
