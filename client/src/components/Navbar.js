import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'status-admin';
      case 'teacher':
        return 'status-teacher';
      default:
        return 'status-student';
    }
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        <span>🎓</span> Trident Academy
      </Link>
      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        {user.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
      </div>
      <div className="navbar-user">
        <span>{user.name}</span>
        <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
          {user.role}
        </span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
