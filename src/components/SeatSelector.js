import { useEffect } from 'react';

export default function SeatSelector({ seats = [], onSeatsChange, selectedSeats = [] }) {
  const seatMap = seats.reduce((map, seat) => {
    map[seat.number] = seat;
    return map;
  }, {});

  const toggleSeat = (seatNumber) => {
    const seat = seatMap[seatNumber];
    if (!seat || seat.booked) return;

    const updated = selectedSeats.includes(seatNumber)
      ? selectedSeats.filter((s) => s !== seatNumber)
      : [...selectedSeats, seatNumber];

    onSeatsChange(updated);
  };

  useEffect(() => {
    onSeatsChange([]);
  }, [seats]);

  const matrix = seats.reduce(
    (acc, seat) => {
      const match = seat.number.match(/^.*?(\d+)-(\d+)$/);
      if (match) {
        const row = parseInt(match[1], 10);
        const col = parseInt(match[2], 10);
        acc.rows = Math.max(acc.rows, row);
        acc.cols = Math.max(acc.cols, col);
      }
      return acc;
    },
    { rows: 0, cols: 0 }
  );

  return (
    <div className="container mb-4">
      <h4 className="mb-3 fw-semibold">Select Seats</h4>
      <div
        className="d-grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${matrix.cols}, 1fr)`,
          display: 'grid',
        }}
      >
        {seats.map((seat) => {
          const isSelected = selectedSeats.includes(seat.number);

          let backgroundColor = '#f0ededd2'; // Default light grey
          if (seat.booked) {
            backgroundColor = '#ee5a5aff'; // Light red for booked
          } else if (isSelected) {
            backgroundColor = '#6fbdf8ff'; // Light blue for selected
          }

          return (
            <button
              key={seat.number}
              onClick={() => toggleSeat(seat.number)}
              disabled={seat.booked}
              className="btn border"
              style={{
                width: '20px',
                height: '20px',
                backgroundColor,
                borderColor: '#ccc',
                cursor: seat.booked ? 'not-allowed' : 'pointer',
              }}
            >
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="d-flex gap-3 mt-3 align-items-center">
        <div className="d-flex align-items-center gap-1">
          <div style={{ width: '20px', height: '20px', backgroundColor: '#f0ededd2', border: '1px solid #ccc' }}></div>
          <small>Available</small>
        </div>
        <div className="d-flex align-items-center gap-1">
          <div style={{ width: '20px', height: '20px', backgroundColor: '#ee5a5aff', border: '1px solid #ccc' }}></div>
          <small>Booked</small>
        </div>
        <div className="d-flex align-items-center gap-1">
          <div style={{ width: '20px', height: '20px', backgroundColor: '#6fbdf8ff', border: '1px solid #ccc' }}></div>
          <small>Selected</small>
        </div>
      </div>
    </div>
  );
}
