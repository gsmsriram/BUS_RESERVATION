import React, { useState } from "react";
import * as apiService from "../../services/apiService.js";
import TripCard from "../../components/TripCard.jsx";
import Loader from "../../components/Loader.jsx";
import { FiSearch } from "react-icons/fi";

export default function SearchTrips() {
  const [form, setForm] = useState({ source: "", destination: "", date: "" });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResults(null);
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(form.source) || !nameRegex.test(form.destination)) {
      setError("Source and Destination should only contain letters.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.searchTrips(form);
      const transformedResults = response.data.map(trip => ({
        ...trip,
        source: trip.route.source,
        destination: trip.route.destination,
      }));
      setResults(transformedResults);
    } catch (err) {
      console.error("Search failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card card-elev p-4 mb-4">
        <h4 className="mb-3 fw-bold">Find Your Trip</h4>
        <form className="row g-3 align-items-end" onSubmit={onSubmit}>
          <div className="col-md-4">
            <label className="form-label">Source</label>
            <input className="form-control" name="source" placeholder="e.g., Mumbai" value={form.source} onChange={onChange} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Destination</label>
            <input className="form-control" name="destination" placeholder="e.g., Pune" value={form.destination} onChange={onChange} required />
          </div>
          <div className="col-md-2">
            <label className="form-label">Date</label>
            <input className="form-control" type="date" name="date" value={form.date} onChange={onChange} />
          </div>
          <div className="col-md-2">
            <button className="btn btn-brand w-100" type="submit" disabled={loading}>
              <FiSearch /> Search
            </button>
          </div>
        </form>
      </div>

      {loading && <Loader text="Searching trips..." />}
      {error && <div className="alert alert-danger">{error}</div>}

      {results && (
        <div>
          <h5 className="mb-3 fw-bold">Search Results ({results.length})</h5>
          {results.length ? (
            results.map((trip) => <TripCard key={trip.id} trip={trip} />)
          ) : (
            <div className="card card-body text-center bg-light">
                <p className="text-muted mb-0">No trips found for the selected route. Please try a different search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}