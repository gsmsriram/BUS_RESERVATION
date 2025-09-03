import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div>
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <p className="fs-3">
          <span className="text-danger">Oops!</span> Page not found.
        </p>
        <p className="lead text-muted">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link to="/" className="btn btn-brand mt-4">
          Go Home
        </Link>
      </div>
    </div>
  );
}