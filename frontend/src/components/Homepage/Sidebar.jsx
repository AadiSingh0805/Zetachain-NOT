import React from "react";
import "./Sidebar.css";
import GradientText from "../../../Reactbits/GradientText/GradientText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faHouse,
  faMusic,
  faTicket,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { id: "home", icon: <FontAwesomeIcon icon={faHouse} />, label: "Home" },
    {
      id: "search",
      icon: <FontAwesomeIcon icon={faMagnifyingGlass} />,
      label: "Search",
    },
    {
      id: "browse",
      icon: <FontAwesomeIcon icon={faMusic} />,
      label: "Browse Events",
    },
    {
      id: "tickets",
      icon: <FontAwesomeIcon icon={faTicket} />,
      label: "Your Tickets",
    },
    {
      id: "playlist",
      icon: <FontAwesomeIcon icon={faHeart} />,
      label: "Liked Events",
    },
  ];

  return (
    <aside className="sidebar" aria-label="Primary">
      <div className="sidebar-header">
        <GradientText
          className="sidebar-logo"
          animationSpeed={6}
          colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
          showBorder={false}
        >
          ZetaBeats
        </GradientText>
      </div>

      <nav className="sidebar-nav" role="navigation">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.id} className="nav-li">
              <button
                className={`nav-item ${
                  currentView === item.id ? "active" : ""
                }`}
                aria-current={currentView === item.id ? "page" : undefined}
                onClick={() => setCurrentView(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="create-playlist-btn">
          <span className="plus-icon">+</span>
          Create Playlist
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
