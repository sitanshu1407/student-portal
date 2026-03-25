import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../api';

function Register({ onLogin }) {
const [formData, setFormData] = useState({\n    name: '',\n    email: '',\n    password: '',\n    confirmPassword: '',\n    role: 'student',\n    semester: ''\n  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { name, email, password, confirmPassword, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await register({ name, email, password, role, semester: formData.semester });
      onLogin(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="auth-logo-icon">T</div>
          </div>
          <h1>Join Trident Academy</h1>
          <p>Create your student portal account</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Create a password (min 6 characters)"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="form-group">\n            <label>Register As</label>\n            <select name="role" value={role} onChange={onChange}>\n              <option value="student">Student</option>\n              <option value="teacher">Teacher</option>\n              <option value="admin">Admin</option>\n            </select>\n          </div>\n          {role === 'teacher' && (\n            <div className="form-group">\n              <label>Semester *</label>\n              <select name="semester" value={formData.semester} onChange={onChange}>\n                <option value="">Select Semester</option>\n                <option value="Sem 1">Sem 1</option>\n                <option value="Sem 2">Sem 2</option>\n                <option value="Sem 3">Sem 3</option>\n                <option value="Sem 4">Sem 4</option>\n                <option value="Sem 5">Sem 5</option>\n                <option value="Sem 6">Sem 6</option>\n                <option value="Sem 7">Sem 7</option>\n                <option value="Sem 8">Sem 8</option>\n              </select>\n            </div>\n          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
