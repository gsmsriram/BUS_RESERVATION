import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SeatGrid from "../../components/SeatGrid.jsx";
import Loader from "../../components/Loader.jsx";
import * as apiService from "../../services/apiService.js";

export default function SeatSelection() {
  const { id } = useParams(); // This is the tripId
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [seatLayout, setSeatLayout] = useState({ total: 0, booked: [] });
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hold, setHold] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTripAndSeats = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch the main trip details (like fare, route, etc.)
        const tripResponse = await apiService.getTripById(Number(id));
        setTrip(tripResponse.data);

        // Fetch seat layout (total seats and booked seats)
        const seatsResponse = await apiService.getTripSeats(Number(id));
        setSeatLayout({
          total: seatsResponse.data.total,
          booked: seatsResponse.data.booked,
        });
      } catch (e) {
        console.error("Failed to load trip/seat data:", e);
        setError(e.message || "Failed to load trip and seat information.");
      } finally {
        setLoading(false);
      }
    };
    fetchTripAndSeats();
  }, [id]);

  const toggleSeat = (seatNumber) => {
    // A new selection invalidates the previous hold
    if (hold) setHold(null);

    setSelected((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((x) => x !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const onHold = async () => {
    setError("");
    if (selected.length === 0) {
      return setError("Please select at least one seat.");
    }
    try {
      // API call to temporarily reserve the selected seats
      const holdResponse = await apiService.holdSeats(Number(id), selected);
      setHold(holdResponse.data);
    } catch (e) {
      setError(e.message || "Failed to hold seats. They may have been booked by someone else.");
    }
  };

  const onProceed = () => {
    if (!hold) {
      return setError("Please click 'Hold Seats' before proceeding to checkout.");
    }
    // Navigate to the checkout page with all necessary data
    navigate("/customer/checkout", {
      state: {
        tripId: Number(id),
        seatNumbers: selected,
        hold,
        fare: trip?.fare || 0, // Pass fare to checkout page
      },
    });
  };

  if (loading) return <Loader text="Loading seats..." />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!trip) return <div className="alert alert-warning">Trip details not found.</div>;

  const totalFare = selected.length * trip.fare;

  return (
    <div className="row g-4">
      <div className="col-lg-7">
        <div className="card card-elev p-4 text-start">
          <h4 className="mb-1 fw-bold">{trip.route.source} to {trip.route.destination}</h4>
          <p className="text-muted">Select your desired seats from the layout below.</p>
          <hr/>
          <div className="d-flex justify-content-center p-3">
            <SeatGrid
              total={seatLayout.total}
              booked={seatLayout.booked}
              selected={selected}
              onToggle={toggleSeat}
            />
          </div>
        </div>
      </div>
      <div className="col-lg-5">
        <div className="card card-elev p-4 text-start sticky-top" style={{top: '20px'}}>
          <h5 className="mb-3 fw-bold">Booking Summary</h5>
          <div className="mb-2"><strong>Trip:</strong> #{trip.id} ({trip.route.source} &rarr; {trip.route.destination})</div>
          <div className="mb-2"><strong>Seats:</strong> 
            <span className="fw-semibold ms-2">{selected.length ? selected.join(", ") : "None"}</span>
          </div>
          <div className="mb-3"><strong>Total Fare:</strong> 
            <span className="fs-4 fw-bold text-success ms-2">₹{totalFare.toFixed(2)}</span>
          </div>
          <div className="d-grid gap-2">
            <button className="btn btn-warning" onClick={onHold} disabled={selected.length === 0}>Hold Seats</button>
            <button className="btn btn-brand" onClick={onProceed} disabled={!hold}>Proceed to Checkout</button>
            <button className="btn btn-outline-secondary btn-sm mt-2" onClick={() => { setSelected([]); setHold(null); }}>Clear Selection</button>
          </div>
          {hold && (
            <div className="alert alert-success small mt-3">
              Seats held successfully! <br/>
              Hold ID: {hold.holdId} (Expires in {hold.expiresInSec}s)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}