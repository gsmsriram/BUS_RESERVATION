import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as apiService from "../../services/apiService.js";
import Loader from "../../components/Loader.jsx";
import { FiDownload, FiNavigation } from "react-icons/fi";

export default function Ticket() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await apiService.getTicketById(ticketId);
        setTicket(response.data);
      } catch (e) {
        console.error("Failed to load ticket:", e);
        setError(e.response?.data?.message || "Unable to load ticket details.");
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [ticketId]);

  const downloadPdf = async () => {
    if (!ticket || !ticket.booking?.id) {
      setError("Booking information is missing, cannot download PDF.");
      return;
    };
    try {
      const response = await apiService.downloadETicketPdf(ticket.booking.id);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `e-ticket-${ticket.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download ticket PDF:", err);
      setError("Failed to download the e-ticket PDF.");
    }
  };

  if (loading) return <Loader text="Loading your ticket..." />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!ticket) return <div className="alert alert-warning">Ticket data not found.</div>;

  const { booking, payment, seatNumber, qrCode, issuedAt } = ticket;
  const trip = booking?.trip;
  const route = trip?.route;
  const user = booking?.user;

  return (
    <div className="card card-elev p-4 p-md-5 text-start mx-auto" style={{ maxWidth: '800px' }}>
      <div className="text-center mb-4">
          <h2 className="text-success fw-bold">Booking Confirmed!</h2>
          <p className="text-muted">Your e-ticket is ready. Have a safe and pleasant journey.</p>
      </div>
      <hr />
      <div className="row g-4 align-items-center">
        <div className="col-md-7">
            <h5 className="fw-bold mb-3">{route?.source} &rarr; {route?.destination}</h5>
            <p><strong>Passenger:</strong> {user?.name}</p>
            <p><strong>Departure:</strong> {trip ? new Date(trip.departureTime).toLocaleString() : 'N/A'}</p>
            <p><strong>Seat Number:</strong> <span className="badge bg-primary fs-6">{seatNumber}</span></p>
            <p><strong>Total Fare:</strong> ₹{payment?.amount.toFixed(2)}</p>
            <p className="small text-muted mt-3">Issued on: {new Date(issuedAt).toLocaleString()} | Ticket ID: #{ticket.id}</p>
        </div>
        <div className="col-md-5 text-center">
            {qrCode ? (
                <img src={`data:image/png;base64,${qrCode}`} alt="Ticket QR Code" title="Scan for details" className="img-fluid rounded" style={{ maxWidth: '200px' }}/>
            ) : (
                <div className="p-3 bg-light text-muted rounded">QR Code not available</div>
            )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-top d-flex flex-wrap gap-2 justify-content-center">
        <button className="btn btn-brand" onClick={downloadPdf}>
          <FiDownload /> Download PDF Ticket
        </button>
        <Link className="btn btn-outline-secondary" to="/customer/search">
          <FiNavigation /> Book Another Trip
        </Link>
      </div>
    </div>
  );
}