import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import anime from "animejs";
import "./LandingPage.css";
import Particles from "../../Backgrounds/Particles/Particles";
import GradientText from "../../Reactbits/GradientText/GradientText";
import SpotlightCard from "../../Components/SpotlightCard/SpotlightCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faTicket, faLock } from "@fortawesome/free-solid-svg-icons";
import ScrollStack, {
  ScrollStackItem,
} from "../../Components/ScrollStack/ScrollStack";
import BlurText from "../../Reactbits/BlurText/BlurText";

const LandingPage = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const ctaRef = useRef(null);

  const handleGetStarted = () => {
    navigate("/signup");
  };

  const handleLearnMore = () => {
    navigate("/login");
  };

  const handleStartJourney = () => {
    navigate("/signup");
  };

  const handleFeaturesAnimationComplete = () => {
    console.log("Features section title animation completed!");
  };

  useEffect(() => {
    // Logo animation first
    anime({
      targets: ".hero-logo",
      translateY: [-30, 0],
      opacity: [0, 1],
      duration: 1200,
      delay: 100,
      easing: "easeOutQuart",
    });

    // Initial hero animation
    anime({
      targets: ".hero-title",
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 1000,
      delay: 500, // Increased delay to come after logo
      easing: "easeOutQuart",
    });

    anime({
      targets: ".hero-subtitle",
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 800,
      delay: 800, // Increased delay
      easing: "easeOutQuart",
    });

    anime({
      targets: ".hero-cta",
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: 600,
      delay: 1100, // Increased delay
      easing: "easeOutBack",
    });

    // Scroll animations
    const observerOptions = {
      threshold: 0.3,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;

          if (target.classList.contains("features-section")) {
            anime({
              targets: ".feature-card",
              translateY: [60, 0],
              opacity: [0, 1],
              duration: 800,
              delay: anime.stagger(200),
              easing: "easeOutQuart",
            });
          }

          if (target.classList.contains("how-it-works-section")) {
            anime({
              targets: ".step-card",
              scale: [0.8, 1],
              opacity: [0, 1],
              duration: 600,
              delay: anime.stagger(300),
              easing: "easeOutBack",
            });
          }

          if (target.classList.contains("cta-section")) {
            anime({
              targets: ".cta-content",
              translateY: [40, 0],
              opacity: [0, 1],
              duration: 800,
              easing: "easeOutQuart",
            });
          }
        }
      });
    }, observerOptions);

    // Observe sections
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (howItWorksRef.current) observer.observe(howItWorksRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">
      {/* Particles Background */}
      <div className="particles-background">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* Hero Section */}
      <section className="hero-section" ref={heroRef}>
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>

        {/* ZetaBeats Logo */}
        <div className="hero-logo">
          <GradientText
            className="landing-logo"
            animationSpeed={10}
            colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
            showBorder={false}
          >
            ZetaBeats
          </GradientText>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            Where Music Meets
            <span className="highlight"> Blockchain</span>
          </h1>
          <p className="hero-subtitle">
            Experience concerts like never before. Purchase tickets with crypto,
            get priority based on your music passion, and own your seat as an
            NFT.
          </p>
          <div className="hero-cta">
            <button className="cta-button primary" onClick={handleGetStarted}>
              Get Started
            </button>
            <button className="cta-button secondary" onClick={handleLearnMore}>
              Learn More
            </button>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" ref={featuresRef}>
        <div className="container">
          <BlurText
            text="Why Choose ZetaBeats?"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleFeaturesAnimationComplete}
            className="section-title"
            as="h2"
          />
          <div className="features-grid">
            <SpotlightCard
              className="feature-card"
              spotlightColor="rgba(64, 255, 170, 0.3)"
            >
              <div className="feature-icon">
                <FontAwesomeIcon icon={faMusic} />
              </div>
              <h3>Priority Queue System</h3>
              <p>
                Your Spotify listening time determines your ticket priority.
                True fans get first access.
              </p>
            </SpotlightCard>

            <SpotlightCard
              className="feature-card"
              spotlightColor="rgba(64, 121, 255, 0.3)"
            >
              <div className="feature-icon">
                <FontAwesomeIcon icon={faTicket} />
              </div>
              <h3>NFT Tickets</h3>
              <p>
                Own your concert experience as a unique NFT. Trade, keep, or
                gift your tickets.
              </p>
            </SpotlightCard>

            <SpotlightCard
              className="feature-card"
              spotlightColor="rgba(255, 215, 0, 0.3)"
            >
              <div className="feature-icon">💎</div>
              <h3>Cryptocurrency Payments</h3>
              <p>
                Seamless crypto payments powered by ZetaChain's cross-chain
                technology.
              </p>
            </SpotlightCard>

            <SpotlightCard
              className="feature-card"
              spotlightColor="rgba(138, 43, 226, 0.3)"
            >
              <div className="feature-icon">
                <FontAwesomeIcon icon={faLock} />
              </div>
              <h3>Secure & Transparent</h3>
              <p>
                Blockchain-secured transactions ensure fairness and prevent
                scalping.
              </p>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <div className="how-it-works-section" ref={howItWorksRef}>
        <ScrollStack className="how-it-works-section" ref={howItWorksRef}>
          <h2 className="section-title">How It Works</h2>
          <ScrollStackItem>
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Connect Spotify</h3>
              <p>
                Link your Spotify account to track your listening time and build
                your fan score.
              </p>
              <button
                className="spotify-auth-btn"
                style={{ marginTop: '1rem' }}
                onClick={() => navigate('/connect-spotify')}
              >
                Connect Spotify
              </button>
            </div>
          </ScrollStackItem>
          <ScrollStackItem>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Browse Events</h3>
              <p>
                Discover upcoming concerts and events from your favorite
                artists.
              </p>
            </div>
          </ScrollStackItem>
          <ScrollStackItem>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Join Queue</h3>
              <p>
                Enter the priority queue based on your listening history and fan
                dedication.
              </p>
            </div>
          </ScrollStackItem>
          <ScrollStackItem>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Purchase Tickets</h3>
              <p>
                Buy your tickets with cryptocurrency and receive them as unique
                NFTs.
              </p>
            </div>
          </ScrollStackItem>
        </ScrollStack>
      </div>

      {/* CTA Section */}
      <section className="cta-section" ref={ctaRef}>
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Experience the Future of Concert Tickets?</h2>
            <p>Join thousands of music fans already using ZetaBeats</p>
            <button
              className="cta-button primary large"
              onClick={handleStartJourney}
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
