import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="d-flex align-items-center justify-content-center text-center" style={{ minHeight: '80vh' }}>
      <div>
        <h1 className="display-3 fw-bold">Welcome to red bus</h1>
        <p className="lead text-muted col-md-8 mx-auto">
          Your journey starts here. Enjoy real-time seat selection, secure payments, and instant e-tickets.
        </p>
        <div className="mt-4 d-flex justify-content-center gap-3">
          {user ? (
            <Link to={user.role === 'ADMIN' ? '/admin' : '/customer/search'} className="btn btn-brand btn-lg">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-brand btn-lg">Login</Link>
              <Link to="/register" className="btn btn-outline-secondary btn-lg">Register</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}