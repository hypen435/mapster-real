import React from "react";
import "../home.css";

// Importing SVG icons for features - you would replace these with your actual icon components or image tags
import techImage from "../images/GettyImages-1253795678.jpg"; 
import techimage2 from "../images/images (15).jpg"
import techimage3 from "../images/images (16).jpg"
import techimage4 from "../images/images (17).jpg"
import demovideo from "../images/small-vecteezy_south-tangerang-indonesia-march-7-2022-janitor-picks-up_7422993_small.mp4"
export default function HomeExtended() {
  return (
    <main className="page-container">
      {/* Background decorative blobs */}
      <div className="background-glow">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* Hero Section */}
      <header className="hero-section">
  {/* Video background */}
  
  <video
    src={demovideo}
    autoPlay
    muted
    loop
    playsInline
    className="hero-video-bg"
  >
    Sorry, your browser doesn't support embedded videos.
  </video>

  {/* Content overlay */}
  <div className="hero-content">
    <h1 className="hero-title">
      Mapster – Report and Track Local Issues Easily
    </h1>
    <p className="hero-subtitle">
      Mapster is a clean, fast, and simple platform that empowers you to
      report community issues and stay informed by tracking local reports
      near you. Join your neighbors in making your area safer and better
      by submitting or viewing verified issue reports with real-time updates.
    </p>
    <div className="btn-group">
      <a className="btn btn-primary" href="/report">Report an Issue</a>
      <a className="btn btn-secondary" href="/issues">View Issues</a>
    </div>
  </div>
</header>


      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <img src={techimage2} alt="Stage Icon" className="feature-icon" />
            <h3>Create an invite-only place where you belong</h3>
            <p>
              Discord servers are organized into topic-based channels where you can collaborate, share, and just talk about your day.
            </p>
          </div>
          <div className="feature-card">
            <img src={techimage3} alt="Voice Icon" className="feature-icon" />
            <h3>Where hanging out is easy</h3>
            <p>
              Grab a seat in a voice channel when you’re free. Friends in your server can see you’re around and instantly pop in to talk.
            </p>
          </div>
          <div className="feature-card">
            <img src={techimage4} alt="Admin Icon" className="feature-icon" />
            <h3>From few to a fandom</h3>
            <p>
              Get any community running with moderation tools and custom member access. Give members special powers, set up private channels, and more.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section - Reimagined as a more visual section like Discord's site */}
      <section className="how-it-works-section">
        <div className="how-it-works-content">
          <div className="how-it-works-text">
            <h2 className="section-title">RELIABLE TECH FOR STAYING CLOSE</h2>
            <p>
              Low-latency voice and video feels like you’re in the same room. Wave hello over video, watch friends stream their games, or gather up and have a drawing session with screen share.
            </p>
          </div>
          <div className="how-it-works-visual">
            <img src={techImage} alt=""/>
          </div>
        </div>
      </section>


      {/* Call To Action Section */}
      <section className="cta-section">
        <h2 className="section-title">Join our community today!</h2>
        <div className="btn-group">
          <a className="btn btn-primary cta-btn" href="/report">
            Community
          </a>
        </div>
      </section>

      {/* Footer Section */}
    </main>
  );
}