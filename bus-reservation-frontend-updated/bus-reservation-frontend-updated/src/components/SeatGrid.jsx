import React from "react";

export default function SeatGrid({ total = 32, booked = [], selected = [], onToggle }) {
  const seats = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="d-flex flex-wrap justify-content-center" style={{ gap: '10px', maxWidth: '280px' }}>
      {seats.map(n => {
        const isBooked = booked.includes(n);
        const isSel = selected.includes(n);
        
        let cls = "seat";
        if (isBooked) cls += " booked";
        else if (isSel) cls += " selected";
        else cls += " available";

        return (
          <div
            key={n}
            className={cls}
            onClick={() => !isBooked && onToggle(n)}
            title={isBooked ? "Booked" : "Available"}
          >
            {n}
          </div>
        );
      })}
    </div>
  );
}