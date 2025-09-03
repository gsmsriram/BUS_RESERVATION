import React from "react";
import { Link } from "react-router-dom";
import { FiClock, FiMapPin } from "react-icons/fi";

export default function TripCard({ trip }){
  return (
    <div className="card card-elev mb-3">
      <div className="card-body">
        <div className="row g-3 align-items-center">
          <div className="col-md-7">
            <h5 className="fw-bold mb-1">{trip.source} → {trip.destination}</h5>
            <div className="d-flex flex-column flex-sm-row gap-sm-3 text-muted small">
              <span className="d-flex align-items-center gap-1"><FiClock /> {new Date(trip.departureTime).toLocaleString()}</span>
              <span className="d-flex align-items-center gap-1"><FiMapPin /> Trip #{trip.id}</span>
            </div>
          </div>
          <div className="col-md-5 d-flex align-items-center justify-content-md-end gap-3">
            <div className="fs-4 fw-bold text-success">₹{trip.fare}</div>
            <Link to={`/customer/trips/${trip.id}/seats`} className="btn btn-brand">Select Seats</Link>
          </div>
        </div>
      </div>
    </div>
  );
}