import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs';
import './LandingPage.css';


const LandingPage = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const ctaRef = useRef(null);

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleLearnMore = () => {
    navigate('/login');
  };

  const handleStartJourney = () => {
    navigate('/signup');
  };

  useEffect(() => {
    // Initial hero animation
    anime({
      targets: '.hero-title',
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 1000,
      delay: 300,
      easing: 'easeOutQuart'
    });

    anime({
      targets: '.hero-subtitle',
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 800,
      delay: 600,
      easing: 'easeOutQuart'
    });

    anime({
      targets: '.hero-cta',
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: 600,
      delay: 900,
      easing: 'easeOutBack'
    });

    // Scroll animations
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          
          if (target.classList.contains('features-section')) {
            anime({
              targets: '.feature-card',
              translateY: [60, 0],
              opacity: [0, 1],
              duration: 800,
              delay: anime.stagger(200),
              easing: 'easeOutQuart'
            });
          }
          
          if (target.classList.contains('how-it-works-section')) {
            anime({
              targets: '.step-card',
              scale: [0.8, 1],
              opacity: [0, 1],
              duration: 600,
              delay: anime.stagger(300),
              easing: 'easeOutBack'
            });
          }
          
          if (target.classList.contains('cta-section')) {
            anime({
              targets: '.cta-content',
              translateY: [40, 0],
              opacity: [0, 1],
              duration: 800,
              easing: 'easeOutQuart'
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
      {/* Hero Section */}
      <section className="hero-section" ref={heroRef}>
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            Where Music Meets
            <span className="highlight"> Blockchain</span>
          </h1>
          <p className="hero-subtitle">
            Experience concerts like never before. Purchase tickets with crypto, 
            get priority based on your music passion, and own your seat as an NFT.
          </p>
          <div className="hero-cta">
            <button className="cta-button primary" onClick={handleGetStarted}>Get Started</button>
            <button className="cta-button secondary" onClick={handleLearnMore}>Learn More</button>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" ref={featuresRef}>
        <div className="container">
          <h2 className="section-title">Why Choose ZetaBeats?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎵</div>
              <h3>Priority Queue System</h3>
              <p>Your Spotify listening time determines your ticket priority. True fans get first access.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎫</div>
              <h3>NFT Tickets</h3>
              <p>Own your concert experience as a unique NFT. Trade, keep, or gift your tickets.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💎</div>
              <h3>Cryptocurrency Payments</h3>
              <p>Seamless crypto payments powered by ZetaChain's cross-chain technology.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Transparent</h3>
              <p>Blockchain-secured transactions ensure fairness and prevent scalping.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section" ref={howItWorksRef}>
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Connect Spotify</h3>
              <p>Link your Spotify account to track your listening time and build your fan score.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Browse Events</h3>
              <p>Discover upcoming concerts and events from your favorite artists.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Join Queue</h3>
              <p>Enter the priority queue based on your listening history and fan dedication.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Purchase Tickets</h3>
              <p>Buy your tickets with cryptocurrency and receive them as unique NFTs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" ref={ctaRef}>
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Experience the Future of Concert Tickets?</h2>
            <p>Join thousands of music fans already using ZetaBeats</p>
            <button className="cta-button primary large" onClick={handleStartJourney}>Start Your Journey</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;