import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoSrc from '../../assets/Logo.jpg';

export default function PublicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <style>{`
        .pub-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          transition: background 0.4s ease, box-shadow 0.4s ease, padding 0.3s ease;
          padding: 1.25rem 0;
        }
        .pub-nav.scrolled {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 1px 24px rgba(27, 94, 32, 0.10);
          padding: 0.75rem 0;
        }
        .pub-nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .pub-nav-logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
        }
        .pub-nav-logo img {
          width: 38px;
          height: 38px;
          object-fit: contain;
          border-radius: 8px;
        }
        .pub-nav-logo-text {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #1B5E20, #4CAF50);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .pub-nav-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .pub-nav-links a {
          text-decoration: none;
          color: white;
          font-size: 0.925rem;
          font-weight: 500;
          padding: 0.5rem 0.85rem;
          border-radius: 8px;
          transition: background 0.2s, color 0.2s;
        }
        .pub-nav-links a:hover {
          background: #E8F5E9;
          color: #1B5E20;
        }
        .pub-nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .btn-nav-ghost {
          text-decoration: none;
          color: #1B5E20;
          font-size: 0.9rem;
          font-weight: 600;
          padding: 0.5rem 1.1rem;
          border-radius: 8px;
          border: 1.5px solid #1B5E20;
          transition: background 0.2s, color 0.2s;
        }
        .btn-nav-ghost:hover {
          background: #1B5E20;
          color: #fff;
        }
        .btn-nav-primary {
          text-decoration: none;
          color: #fff;
          font-size: 0.9rem;
          font-weight: 600;
          padding: 0.5rem 1.25rem;
          border-radius: 8px;
          background: linear-gradient(135deg, #1B5E20, #2E7D32);
          box-shadow: 0 2px 12px rgba(27, 94, 32, 0.3);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-nav-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 18px rgba(27, 94, 32, 0.4);
        }
        .pub-nav-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .pub-nav-hamburger span {
          display: block;
          width: 24px;
          height: 2px;
          background: #1B5E20;
          border-radius: 2px;
          transition: transform 0.3s, opacity 0.3s;
        }
        .pub-nav-mobile {
          display: none;
          flex-direction: column;
          gap: 0.5rem;
          position: absolute;
          top: 100%;
          left: 0; right: 0;
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(20px);
          padding: 1rem 2rem 1.5rem;
          border-bottom: 1px solid #E8F5E9;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          animation: slideDown 0.25s ease;
        }
        .pub-nav-mobile.open { display: flex; }
        .pub-nav-mobile a {
          text-decoration: none;
          color: #374151;
          font-size: 1rem;
          font-weight: 500;
          padding: 0.6rem 0.5rem;
          border-bottom: 1px solid #F0F4F0;
          transition: color 0.2s;
        }
        .pub-nav-mobile a:hover { color: #1B5E20; }
        .pub-nav-mobile-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .pub-nav-links, .pub-nav-actions { display: none; }
          .pub-nav-hamburger { display: flex; }
        }
      `}</style>

      <nav className={`pub-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="pub-nav-inner">
          <Link to="/" className="pub-nav-logo">
            <img src={logoSrc} alt="AgroGuard AI logo" />
            <span className="pub-nav-logo-text">AgroGuard AI</span>
          </Link>

          <ul className="pub-nav-links">
            {navLinks.map(link => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>

          <div className="pub-nav-actions">
            <Link to="/login" className="btn-nav-ghost">Login</Link>
            <Link to="/register" className="btn-nav-primary">Sign In</Link>
          </div>

          <button
            id="pub-nav-hamburger-btn"
            className="pub-nav-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`pub-nav-mobile${menuOpen ? ' open' : ''}`}>
          {navLinks.map(link => (
            <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
          <div className="pub-nav-mobile-actions">
            <Link to="/login" className="btn-nav-ghost" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" className="btn-nav-primary" onClick={() => setMenuOpen(false)}>Sign In</Link>
          </div>
        </div>
      </nav>
    </>
  );
}
