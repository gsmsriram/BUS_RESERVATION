import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || "/";
  const message = location.state?.message;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await login(email, password);
    if (!res.ok) {
      setError(res.error);
    } else {
      if (from === "/") {
        const userRole = res.user?.role || "CUSTOMER"; 
        navigate(userRole === "ADMIN" ? "/admin" : "/customer/search", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card card-elev p-4" style={{ minWidth: '400px', maxWidth: '420px' }}>
        <div className="card-body">
            <h3 className="mb-3 text-center fw-bold">Welcome Back</h3>
            {message && <div className="alert alert-success small">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email"/>
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"/>
              </div>
              <button disabled={loading} className="btn btn-brand w-100 btn-lg mt-2">
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
            <div className="mt-4 text-center text-muted">
              New here? <Link to="/register">Create an account</Link>
            </div>
        </div>
      </div>
    </div>
  );
}