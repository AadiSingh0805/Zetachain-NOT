import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import "./MainContent.css";
import { fetchArtistImage } from "../../utils/fetchArtistImage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import DotGrid from "../../../Backgrounds/DotGrid/DotGrid"; // <-- Add this import

const MainContent = ({ currentView, searchQuery }) => {
  // Mock event data (no static images)
  const initialEvents = {
    trending: [
      {
        id: 1,
        artist: "The Weeknd",
        title: "After Hours Tour",
        date: "2024-03-15",
        venue: "Madison Square Garden",
        price: "0.5 ETH",
        available: 234,
        songs: ["Blinding Lights", "Can't Feel My Face", "The Hills"],
      },
      {
        id: 2,
        artist: "Dua Lipa",
        title: "Future Nostalgia Tour",
        date: "2024-03-20",
        venue: "Crypto.com Arena",
        price: "0.3 ETH",
        available: 156,
        songs: ["Levitating", "Don't Start Now", "Physical"],
      },
      {
        id: 3,
        artist: "Travis Scott",
        title: "Utopia World Tour",
        date: "2024-03-25",
        venue: "Barclays Center",
        price: "0.7 ETH",
        available: 89,
        songs: ["SICKO MODE", "Goosebumps", "Antidote"],
      },
    ],
    forYou: [
      {
        id: 4,
        artist: "Billie Eilish",
        title: "Happier Than Ever Tour",
        date: "2024-04-01",
        venue: "The Forum",
        price: "0.4 ETH",
        available: 312,
        songs: ["Bad Guy", "Happier Than Ever", "Ocean Eyes"],
      },
      {
        id: 5,
        artist: "Post Malone",
        title: "Twelve Carat Tour",
        date: "2024-04-05",
        venue: "T-Mobile Arena",
        price: "0.6 ETH",
        available: 178,
        songs: ["Circles", "Sunflower", "Rockstar"],
      },
    ],
    upcoming: [
      {
        id: 6,
        artist: "Arctic Monkeys",
        title: "The Car Tour",
        date: "2024-04-10",
        venue: "Red Rocks Amphitheatre",
        price: "0.45 ETH",
        available: 267,
        songs: ["Do I Wanna Know?", "R U Mine?", "Fluorescent Adolescent"],
      },
    ],
  };

  const [events, setEvents] = useState(initialEvents);

  useEffect(() => {
    const loadImages = async () => {
      const updated = { ...initialEvents };

      for (const section of Object.keys(updated)) {
        updated[section] = await Promise.all(
          updated[section].map(async (event) => {
            const image = await fetchArtistImage(event.artist);
            return { ...event, image };
          })
        );
      }

      setEvents(updated);
    };

    loadImages();
  }, []);

  const renderHomeContent = () => (
    <div className="home-content">
      <div className="greeting-section">
        <h1 className="greeting">Good evening</h1>
        <div className="quick-picks">
          {events.trending.slice(0, 6).map((event) => (
            <div key={event.id} className="quick-pick-card">
              <img
                src={
                  event.image ||
                  `https://via.placeholder.com/300x300/000000/ffffff?text=${encodeURIComponent(
                    event.artist
                  )}`
                }
                alt={event.artist}
                className="quick-pick-image"
              />
              <span className="quick-pick-title">{event.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="content-section">
        <h2 className="section-title">Trending Events</h2>
        <div className="events-grid">
          {events.trending.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>

      <div className="content-section">
        <h2 className="section-title">Based on Your Music Taste</h2>
        <div className="events-grid">
          {events.forYou.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>

      <div className="content-section">
        <h2 className="section-title">Upcoming Concerts</h2>
        <div className="events-grid">
          {events.upcoming.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderSearchContent = () => (
    <div className="search-content">
      <h1>Search Events</h1>
      {searchQuery ? (
        <div>
          <h2>Results for "{searchQuery}"</h2>
          <div className="events-grid">
            {Object.values(events)
              .flat()
              .filter(
                (event) =>
                  event.artist
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  event.title.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
          </div>
        </div>
      ) : (
        <div className="search-categories">
          <h2>Browse all</h2>
          <div className="category-grid">
            <div className="category-card rock">
              <h3>Rock</h3>
            </div>
            <div className="category-card electronic">
              <h3>Electronic</h3>
            </div>
            <div className="category-card pop">
              <h3>Pop</h3>
            </div>
            <div className="category-card jazz">
              <h3>Jazz</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case "search":
        return renderSearchContent();
      case "browse":
        return (
          <div className="browse-content">
            <h1>Browse Events</h1>
            <div className="events-grid">
              {Object.values(events)
                .flat()
                .map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
            </div>
          </div>
        );
      case "tickets":
        return (
          <div className="tickets-content">
            <h1>Your Tickets</h1>
            <p>You don't have any tickets yet. Start exploring events!</p>
          </div>
        );
      default:
        return renderHomeContent();
    }
  };

  return (
    <div
      className="main-content"
      style={{
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* DotGrid background (fixed to viewport) */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <DotGrid
          dotSize={6}
          gap={28}
          baseColor="#b0b0b0"
          activeColor="#b0b0b0"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
          style={{ opacity: 0.14 }}
        />
      </div>

      {/* Content above background */}
      <div style={{ position: "relative", zIndex: 1 }}>{renderContent()}</div>
    </div>
  );
};

export default MainContent;
