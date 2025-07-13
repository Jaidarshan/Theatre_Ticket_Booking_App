import { useState, useEffect, useCallback } from 'react';

export default function SeatSelector({ seats = [], onSeatsChange }) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Seat map built before handler
  const seatMap = seats.reduce((map, seat) => {
    map[seat.number] = seat;
    return map;
  }, {});

  const toggleSeat = (seatNumber) => {
    const seat = seatMap[seatNumber];
    if (!seat || seat.booked) return;

    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const notifyChange = useCallback(() => {
    onSeatsChange(selectedSeats);
  }, [selectedSeats, onSeatsChange]);

  useEffect(() => {
    notifyChange();
  }, [notifyChange]);

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

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${matrix.cols}, minmax(0, 1fr))`,
    gap: '0.5rem',
  };

  return (
    <div>
      <h4 className="text-lg font-semibold mb-2">Select Seats</h4>
      <div style={gridStyle}>
        {seats.map((seat) => {
          const isSelected = selectedSeats.includes(seat.number);
          const bgClass = seat.booked
            ? 'bg-red-500 text-white'
            : isSelected
            ? 'bg-blue-500 text-white'
            : 'bg-white';

          return (
            <button
              key={seat.number}
              onClick={() => toggleSeat(seat.number)}
              disabled={seat.booked}
              className={`w-10 h-10 border border-gray-400 ${bgClass} rounded transition-colors`}
            >
              {seat.number}
            </button>
          );
        })}
      </div>
    </div>
  );
}
