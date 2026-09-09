import React, { useState } from "react";

export default function ProfileDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <div className="profile-container">
      <button
        className="profile-button"
        onClick={() => setOpen(!open)}
      >
        <span className="profile-avatar">
          {user.name?.charAt(0).toUpperCase()}
        </span>

        <span>{user.name}</span>

        <span>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="profile-dropdown">

          {/* Header */}
          <div className="profile-header">
            <div className="profile-avatar large">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h4>{user.name}</h4>
              <span>
                {user.role?.charAt(0).toUpperCase() +
                  user.role?.slice(1)}
              </span>
            </div>
          </div>

          <hr />

          {/* Email */}
          <div className="profile-item">
            <strong>Email</strong>
            <span>{user.email}</span>
          </div>

          {/* Phone */}
          <div className="profile-item">
            <strong>Phone</strong>
            <span>
              {user.phone || "Not provided"}
            </span>
          </div>

          {/* Role */}
          <div className="profile-item">
            <strong>Role</strong>
            <span>
              {user.role?.charAt(0).toUpperCase() +
                user.role?.slice(1)}
            </span>
          </div>

          <hr />

          {/* Logout */}
          <button
            className="profile-logout"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>
      )}
    </div>
  );
}