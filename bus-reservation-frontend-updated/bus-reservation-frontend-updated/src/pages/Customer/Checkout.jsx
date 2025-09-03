import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as apiService from "../../services/apiService.js";
import { useAuth } from '../../context/AuthContext.jsx';

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!state || !state.tripId || !state.seatNumbers || state.seatNumbers.length === 0) {
    return (
      <div className="container text-center mt-5">
        <div className="card card-elev p-4 mx-auto" style={{ maxWidth: '500px' }}>
          <h4 className="text-warning">Invalid Checkout Access</h4>
          <p className="text-muted">No trip or seat data was found. Please start by selecting seats for a trip.</p>
          <button onClick={() => navigate('/customer/search')} className="btn btn-brand mt-2">Find a Trip</button>
        </div>
      </div>
    );
  }

  const { tripId, seatNumbers, hold, fare } = state;
  const totalFare = seatNumbers.length * fare;

  const onPay = async () => {
    setError("");
    if (!user?.id) {
      setError("You must be logged in to complete a booking.");
      return;
    }
    setLoading(true);

    try {
      const response = await apiService.checkout({
        tripId,
        seatNumbers,
        holdId: hold?.holdId,
        userId: user.id
      });
      const newTicketId = response.data.ticketId;
      navigate(`/customer/ticket/${newTicketId}`, { replace: true });
    } catch (e) {
      setError(e.message || "Payment and booking failed. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="card card-elev p-4" style={{ minWidth: '450px', maxWidth: '500px' }}>
        <div className="card-body text-center">
            <h3 className="mb-3 fw-bold">Confirm Your Booking</h3>
            <p className="text-muted">Review your trip details and proceed to payment.</p>
            <hr />
            <div className="text-start mb-4">
              <p className="mb-1"><strong>Trip ID:</strong> #{tripId}</p>
              <p className="mb-1"><strong>Selected Seats:</strong> 
                <span className="fw-bold fs-5 ms-2">{seatNumbers.join(", ")}</span>
              </p>
              <p className="mb-1"><strong>Total Fare:</strong> 
                <span className="fw-bold fs-4 text-success ms-2">₹{totalFare.toFixed(2)}</span>
              </p>
            </div>
            
            {error && <div className="alert alert-danger">{error}</div>}

            <button disabled={loading} className="btn btn-brand w-100 btn-lg mt-2" onClick={onPay}>
              {loading ? "Processing..." : `Pay ₹${totalFare.toFixed(2)}`}
            </button>
        </div>
      </div>
    </div>
  );
}