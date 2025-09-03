import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="mb-4 text-start fw-bold">Admin Dashboard</h2>
      <div className="row g-4">
        {/* Buses Card */}
        <div className="col-md-6 col-lg-4">
          <div className="card card-elev p-3 h-100 d-flex flex-column">
            <div className="card-body">
              <h5 className="card-title fw-semibold">Buses</h5>
              <p className="card-text text-muted small">Add, view, and manage buses in the fleet.</p>
              <Link to="/admin/buses" className="btn btn-brand btn-sm mt-auto stretched-link">
                Manage Buses <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>

        {/* Routes Card */}
        <div className="col-md-6 col-lg-4">
          <div className="card card-elev p-3 h-100 d-flex flex-column">
            <div className="card-body">
              <h5 className="card-title fw-semibold">Routes</h5>
              <p className="card-text text-muted small">Define travel routes and their distances.</p>
              <Link to="/admin/routes" className="btn btn-brand btn-sm mt-auto stretched-link">
                Manage Routes <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>

        {/* Trips Card */}
        <div className="col-md-6 col-lg-4">
          <div className="card card-elev p-3 h-100 d-flex flex-column">
            <div className="card-body">
              <h5 className="card-title fw-semibold">Trips</h5>
              <p className="card-text text-muted small">Schedule trips by assigning buses to routes.</p>
              <Link to="/admin/trips" className="btn btn-brand btn-sm mt-auto stretched-link">
                Manage Trips <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}