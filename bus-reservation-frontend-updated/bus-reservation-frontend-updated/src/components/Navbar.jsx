import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          red bus
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Left-aligned Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user && user.role === 'ADMIN' && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin">Dashboard</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/buses">Manage Buses</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/routes">Manage Routes</NavLink>
                </li>
                 <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/trips">Manage Trips</NavLink>
                </li>
              </>
            )}
            {user && user.role === 'CUSTOMER' && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/customer/search">Search Trips</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/customer/bookings">My Bookings</NavLink>
                </li>
              </>
            )}
          </ul>

          {/* Right-aligned Links and User Info */}
          <div className="navbar-nav ms-auto align-items-lg-center">
            {!user ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">Login</NavLink>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-brand btn-sm" to="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <FiUser className="me-1" /> {user.name}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li>
                      <button className="dropdown-item d-flex align-items-center" onClick={handleLogout}>
                        <FiLogOut className="me-2" /> Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}