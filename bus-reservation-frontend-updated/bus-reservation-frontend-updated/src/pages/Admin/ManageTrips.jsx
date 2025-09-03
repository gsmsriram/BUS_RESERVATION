import React, { useState, useEffect } from 'react';
import * as apiService from '../../services/apiService';
import Loader from '../../components/Loader';
import { FaTrash } from 'react-icons/fa';

export default function ManageTrips() {
    const [trips, setTrips] = useState([]);
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [form, setForm] = useState({
        busId: '', routeId: '', departureTime: '', arrivalTime: '', fare: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');

    // ... (Keep all your original functions: fetchData, handleChange, handleSubmit, handleDelete) ...
    useEffect(() => {
        const fetchData = async () => {
          try {
            const [tripsRes, busesRes, routesRes] = await Promise.all([
              apiService.getAllTrips(),
              apiService.getAllBuses(),
              apiService.getAllRoutes()
            ]);
            setTrips(tripsRes.data);
            setBuses(busesRes.data);
            setRoutes(routesRes.data);
          } catch (err) {
            setError('Failed to load necessary data. Please try again.');
            console.error(err);
          } finally {
            setLoading(false);
          }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMsg('');
        const newTrip = {
          bus: { id: form.busId },
          route: { id: form.routeId },
          departureTime: form.departureTime,
          arrivalTime: form.arrivalTime,
          fare: form.fare
        };
        try {
          await apiService.addTrip(newTrip);
          setMsg('Trip added successfully!');
          setForm({ busId: '', routeId: '', departureTime: '', arrivalTime: '', fare: '' });
          const tripsRes = await apiService.getAllTrips();
          setTrips(tripsRes.data);
        } catch (err) {
          setError('Failed to add trip.');
          console.error(err);
        }
    };

    const handleDelete = async (tripId) => {
        if (window.confirm('Are you sure you want to delete this trip?')) {
          try {
            await apiService.deleteTrip(tripId);
            setMsg('Trip deleted successfully!');
            const tripsRes = await apiService.getAllTrips();
            setTrips(tripsRes.data);
          } catch (err) {
            setError('Failed to delete trip.');
            console.error(err);
          }
        }
    };


    return (
        <div>
            <h3 className="mb-4 fw-bold">Manage Trips</h3>
            
            {msg && <div className="alert alert-success">{msg}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card card-elev p-4 mb-4">
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-6 col-lg-4">
                        <label className="form-label">Select Bus</label>
                        <select name="busId" value={form.busId} onChange={handleChange} className="form-select" required>
                            <option value="">Choose a bus...</option>
                            {buses.map(bus => <option key={bus.id} value={bus.id}>{bus.busNumber} ({bus.type})</option>)}
                        </select>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <label className="form-label">Select Route</label>
                        <select name="routeId" value={form.routeId} onChange={handleChange} className="form-select" required>
                            <option value="">Choose a route...</option>
                            {routes.map(route => <option key={route.id} value={route.id}>{route.source} to {route.destination}</option>)}
                        </select>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <label className="form-label">Departure Time</label>
                        <input type="datetime-local" name="departureTime" value={form.departureTime} onChange={handleChange} className="form-control" required />
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <label className="form-label">Arrival Time</label>
                        <input type="datetime-local" name="arrivalTime" value={form.arrivalTime} onChange={handleChange} className="form-control" required />
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <label className="form-label">Fare (₹)</label>
                        <input type="number" step="0.01" name="fare" value={form.fare} onChange={handleChange} className="form-control" placeholder="e.g., 500.00" required />
                    </div>
                    <div className="col-md-12 col-lg-4 d-flex align-items-end">
                        <button type="submit" className="btn btn-brand w-100">Add Trip</button>
                    </div>
                </form>
            </div>

            <div className="card card-elev p-4">
                <h5 className="mb-3">Scheduled Trips</h5>
                 {loading ? <Loader text="Loading trips..." /> : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Bus</th>
                                    <th>Route</th>
                                    <th>Departure</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trips.length > 0 ? trips.map(trip => (
                                    <tr key={trip.id}>
                                        <td><strong>#{trip.id}</strong></td>
                                        <td>{trip.bus.busNumber}</td>
                                        <td>{trip.route.source} &rarr; {trip.route.destination}</td>
                                        <td>{new Date(trip.departureTime).toLocaleString()}</td>
                                        <td className="text-end">
                                            <button onClick={() => handleDelete(trip.id)} className="btn btn-outline-danger btn-sm">
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="5" className="text-center p-4">No trips scheduled.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}