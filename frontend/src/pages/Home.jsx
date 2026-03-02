import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">
            <span className="logo-icon">🏥</span>
            <span className="logo-text">Health Atlas</span>
          </div>
          <div className="nav-buttons">
            <button className="nav-btn login-btn" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="nav-btn register-btn" onClick={() => navigate('/register')}>
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="highlight">Health Atlas</span>
          </h1>
          <p className="hero-subtitle">
            Your Comprehensive Medical Records Management System
          </p>
          <p className="hero-description">
            Securely manage, share, and access medical records with advanced consent management 
            and AI-powered assistance
          </p>
          <div className="hero-buttons">
            <button className="cta-btn primary" onClick={() => navigate('/register')}>
              Get Started
            </button>
            <button className="cta-btn secondary" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>For Patients</h3>
            <ul className="feature-list">
              <li>Secure medical record storage</li>
              <li>Control who accesses your data</li>
              <li>Upload and manage documents</li>
              <li>View your complete medical history</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚕️</div>
            <h3>For Doctors</h3>
            <ul className="feature-list">
              <li>Request patient consent</li>
              <li>Access authorized medical records</li>
              <li>Search patients by organ/condition</li>
              <li>Comprehensive patient summaries</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👨‍💼</div>
            <h3>For Administrators</h3>
            <ul className="feature-list">
              <li>Manage user approvals</li>
              <li>System-wide statistics</li>
              <li>User management</li>
              <li>Administrative oversight</li>
            </ul>
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="ai-section">
        <div className="ai-content">
          <div className="ai-icon">🤖</div>
          <h2>AI-Powered Assistant</h2>
          <p>
            Get instant help with our intelligent chatbot that provides role-based assistance
            tailored to your needs - whether you're a patient, doctor, or administrator.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <h2 className="section-title">Why Choose Health Atlas?</h2>
        <div className="benefits-grid">
          <div className="benefit-item">
            <span className="benefit-icon">🔒</span>
            <h3>Secure & Private</h3>
            <p>Enterprise-grade security with consent-based access control</p>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">⚡</span>
            <h3>Fast & Efficient</h3>
            <p>Quick access to medical records when you need them</p>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">🌐</span>
            <h3>Always Accessible</h3>
            <p>Access your health data anytime, anywhere</p>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">🤝</span>
            <h3>Collaborative</h3>
            <p>Seamless sharing between patients and healthcare providers</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2026 Health Atlas. All rights reserved.</p>
          <p className="footer-tagline">Empowering Healthcare Through Technology</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
