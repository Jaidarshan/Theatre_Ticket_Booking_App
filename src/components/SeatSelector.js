import { useEffect, useState } from 'react';

export default function SeatSelector({ showtimeId, onSeatsChange }) {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    if (!showtimeId) return;
    fetch(`/api/showtimes/${showtimeId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSeats(data.showtime.seats);
          setSelectedSeats([]);
          onSeatsChange([]);
        }
      });
  }, [showtimeId]);

  function toggleSeat(number) {
    if (selectedSeats.includes(number)) {
      const newSeats = selectedSeats.filter(s => s !== number);
      setSelectedSeats(newSeats);
      onSeatsChange(newSeats);
    } else {
      const newSeats = [...selectedSeats, number];
      setSelectedSeats(newSeats);
      onSeatsChange(newSeats);
    }
  }

  return (
    <div>
      <h4>Select Seats</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: 300 }}>
        {seats.map(seat => (
          <div
            key={seat.number}
            onClick={() => !seat.booked && toggleSeat(seat.number)}
            style={{
              width: 30,
              height: 30,
              margin: 4,
              textAlign: 'center',
              lineHeight: '30px',
              border: '1px solid black',
              backgroundColor: seat.booked ? 'red' : selectedSeats.includes(seat.number) ? 'green' : 'white',
              cursor: seat.booked ? 'not-allowed' : 'pointer',
            }}
          >
            {seat.number}
          </div>
        ))}
      </div>
    </div>
  );
}
