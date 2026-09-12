import { Link } from 'react-router-dom';
import logoSrc from '../../assets/Logo.jpg';

const footerLinks = {
  Platform: [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Disease Library', href: '#' },
    { label: 'AI Diagnostics', href: '#' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'Research Papers', href: '#' },
    { label: 'Field Guide', href: '#' },
    { label: 'Support Center', href: '#' },
  ],
  Company: [
    { label: 'About Us', href: '#about' },
    { label: 'Careers', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

const socials = [
  {
    label: 'Twitter',
    href: '#',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: '#',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <>
      <style>{`
        .pub-footer {
          background: linear-gradient(180deg, #0a2e0d 0%, #061a08 100%);
          color: #a7c5a9;
          padding: 4rem 0 0;
          margin-top: 0;
        }
        .pub-footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .pub-footer-top {
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr 1fr;
          gap: 3rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .pub-footer-brand {}
        .pub-footer-logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
          margin-bottom: 1rem;
        }
        .pub-footer-logo img {
          width: 36px; height: 36px;
          object-fit: contain;
          border-radius: 8px;
        }
        .pub-footer-logo-text {
          font-size: 1.1rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.02em;
        }
        .pub-footer-tagline {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #7da87f;
          max-width: 280px;
          margin-bottom: 1.5rem;
        }
        .pub-footer-socials {
          display: flex;
          gap: 0.75rem;
        }
        .pub-footer-social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px; height: 36px;
          background: rgba(255,255,255,0.07);
          border-radius: 8px;
          color: #a7c5a9;
          text-decoration: none;
          transition: background 0.2s, color 0.2s, transform 0.2s;
        }
        .pub-footer-social-btn:hover {
          background: #2E7D32;
          color: #fff;
          transform: translateY(-2px);
        }
        .pub-footer-col-title {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #ffffff;
          margin-bottom: 1.25rem;
        }
        .pub-footer-col ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .pub-footer-col ul a {
          text-decoration: none;
          color: #7da87f;
          font-size: 0.9rem;
          transition: color 0.2s, padding-left 0.2s;
          display: inline-block;
        }
        .pub-footer-col ul a:hover {
          color: #81C784;
          padding-left: 4px;
        }
        .pub-footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 0;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .pub-footer-copy {
          font-size: 0.85rem;
          color: #4a7a4d;
        }
        .pub-footer-copy span {
          color: #4CAF50;
        }
        .pub-footer-badge {
          font-size: 0.8rem;
          color: #4a7a4d;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .pub-footer-badge::before {
          content: '';
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #4CAF50;
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @media (max-width: 900px) {
          .pub-footer-top {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
          .pub-footer-brand {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 580px) {
          .pub-footer-top {
            grid-template-columns: 1fr;
          }
          .pub-footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>

      <footer className="pub-footer" id="contact">
        <div className="pub-footer-inner">
          <div className="pub-footer-top">
            {/* Brand column */}
            <div className="pub-footer-brand">
              <Link to="/" className="pub-footer-logo">
                <img src={logoSrc} alt="AgroGuard AI logo" />
                <span className="pub-footer-logo-text">AgroGuard AI</span>
              </Link>
              <p className="pub-footer-tagline">
                Empowering Sri Lankan farmers with AI-driven crop disease detection and real-time agricultural intelligence.
              </p>
              <div className="pub-footer-socials">
                {socials.map(s => (
                  <a key={s.label} href={s.href} className="pub-footer-social-btn" aria-label={s.label}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="pub-footer-col">
                <div className="pub-footer-col-title">{title}</div>
                <ul>
                  {links.map(link => (
                    <li key={link.label}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pub-footer-bottom">
            <p className="pub-footer-copy">
              © {new Date().getFullYear()} AgroGuard AI. Built with <span>♥</span> for Sri Lankan Agriculture.
            </p>
            <div className="pub-footer-badge">
              AI-Powered Crop Protection
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
