import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("CUSTOMER"); 
  const [error, setError] = useState("");

  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]{3,}$/;
    if (!nameRegex.test(name.trim())) {
      return "Name must be at least 3 characters and contain only letters and spaces.";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    const res = await register({ name, email, password, role });
    if (!res.ok) {
      setError(res.error); 
    } else {
      navigate("/login", { 
        replace: true,
        state: { message: "Registration successful! Please log in." } 
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card card-elev p-4" style={{ minWidth: '400px', maxWidth: '420px' }}>
        <div className="card-body">
            <h3 className="mb-3 text-center fw-bold">Create Your Account</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name"/>
              </div>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email"/>
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password"/>
              </div>
              <button disabled={loading} className="btn btn-brand w-100 btn-lg mt-2">
                {loading ? "Creating Account..." : "Register"}
              </button>
            </form>
            <div className="mt-4 text-center text-muted">
              Already have an account? <Link to="/login">Login</Link>
            </div>
        </div>
      </div>
    </div>
  );
}