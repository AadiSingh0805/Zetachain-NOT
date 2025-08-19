import React from "react";
import { useNavigate } from "react-router-dom";
import "./TopBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faBell,
  faUser,
  faAngleLeft,
  faAngleRight
} from "@fortawesome/free-solid-svg-icons"; // add faUser

const TopBar = ({ searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button className="nav-btn back-btn"><FontAwesomeIcon icon={faAngleLeft} /></button>
        <button className="nav-btn forward-btn"><FontAwesomeIcon icon={faAngleRight} /></button>
      </div>

      <div className="topbar-center">
        <div className="search-container">
          <span className="search-icon" aria-hidden="true">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </span>
          <input
            type="text"
            placeholder="What concert do you want to attend?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="topbar-right">
        <button className="notification-btn" aria-label="Notifications">
          <FontAwesomeIcon icon={faBell} />
        </button>
        <div className="user-menu">
          <button className="user-avatar" aria-label="User menu">
            <FontAwesomeIcon icon={faUser} />
          </button>
          <div className="user-dropdown">
            <button className="dropdown-item">Profile</button>
            <button className="dropdown-item">Settings</button>
            <button className="dropdown-item" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
