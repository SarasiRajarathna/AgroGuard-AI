import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNav from '../components/home/PublicNav';
import Footer from '../components/home/footer';
import heroImage from '../assets/agriculture-hero.jpg';

/* ─── Intersection Observer hook for scroll animations ─── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ─── Data ─── */
const features = [
  {
    icon: '🔬',
    title: 'AI Disease Detection',
    desc: 'Upload a photo of your crop and our deep-learning model identifies disease with high accuracy within seconds.',
  },
  {
    icon: '📡',
    title: 'Real-Time Outbreak Alerts',
    desc: 'Geo-tagged outbreak data gives you instant regional warnings before disease spreads to your fields.',
  },
  {
    icon: '🌿',
    title: 'Treatment Recommendations',
    desc: 'Receive tailored, evidence-based treatment plans and eco-friendly pesticide suggestions instantly.',
  },
  {
    icon: '📊',
    title: 'Analytics Dashboard',
    desc: 'Track historical disease trends across regions with interactive charts and exportable reports.',
  },
  {
    icon: '👨‍🌾',
    title: 'Expert Officer Network',
    desc: 'Connect directly with certified agriculture officers for field visits and personalized advice.',
  },
  {
    icon: '🛡️',
    title: 'Crop Health Monitoring',
    desc: 'Continuous risk scoring for your fields so you can act proactively before losses occur.',
  },
];

const steps = [
  { num: '01', title: 'Capture & Upload', desc: 'Take a photo of the affected crop leaves or stems with your phone.' },
  { num: '02', title: 'AI Analysis', desc: 'Our model scans the image and cross-references a library of 50+ crop diseases.' },
  { num: '03', title: 'Get Diagnosis', desc: 'Receive a detailed diagnosis with confidence score and disease information.' },
  { num: '04', title: 'Take Action', desc: 'Follow recommended treatment steps or escalate to a field officer.' },
];

const stats = [
  { value: '50+', label: 'Crop Diseases Covered' },
  { value: '95%', label: 'Detection Accuracy' },
  { value: '10k+', label: 'Farmers Served' },
  { value: '< 5s', label: 'Analysis Time' },
];

/* ─── Sub-components ─── */
function FeatureCard({ icon, title, desc, delay }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`feat-card${inView ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="feat-icon">{icon}</div>
      <h3 className="feat-title">{title}</h3>
      <p className="feat-desc">{desc}</p>
    </div>
  );
}

function StepCard({ num, title, desc, delay }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`step-card${inView ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="step-num">{num}</div>
      <h3 className="step-title">{title}</h3>
      <p className="step-desc">{desc}</p>
    </div>
  );
}

function StatItem({ value, label, delay }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`stat-item${inView ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function HomePage() {
  const [heroRef, heroInView] = useInView(0.05);

  return (
    <>
      <style>{`
        /* ── Reset & base ── */
        .hp-wrap * { box-sizing: border-box; }
        .hp-wrap {
          font-family: 'Inter', system-ui, sans-serif;
          color: #111827;
          overflow-x: hidden;
        }

        /* ── Scroll-reveal utility ── */
        .feat-card, .step-card, .stat-item {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .feat-card.visible, .step-card.visible, .stat-item.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ═══════════════════════════════ HERO ═══════════════════════════════ */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background-image: url(${heroImage});
          background-size: cover;
          background-position: center 30%;
          filter: brightness(0.45);
          transform: scale(1.04);
          transition: transform 12s ease-out;
        }
        .hero-bg.loaded { transform: scale(1); }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(6, 26, 8, 0.75) 0%,
            rgba(27, 94, 32, 0.35) 60%,
            rgba(0,0,0,0.15) 100%
          );
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 8rem 2rem 5rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 4rem;
        }
        .hero-left {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 1s ease 0.2s, transform 1s ease 0.2s;
        }
        .hero-left.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(76, 175, 80, 0.18);
          border: 1px solid rgba(76, 175, 80, 0.4);
          color: #81C784;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.4rem 1rem;
          border-radius: 100px;
          margin-bottom: 1.5rem;
        }
        .hero-badge::before {
          content: '';
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #4CAF50;
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(0.85); }
        }
        .hero-title {
          font-size: clamp(2.4rem, 5vw, 3.6rem);
          font-weight: 900;
          line-height: 1.1;
          color: #ffffff;
          letter-spacing: -0.03em;
          margin: 0 0 1.25rem;
        }
        .hero-title .highlight {
          background: linear-gradient(135deg, #66BB6A, #A5D6A7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-sub {
          font-size: 1.1rem;
          line-height: 1.65;
          color: #c8deca;
          margin-bottom: 2.25rem;
          max-width: 480px;
        }
        .hero-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .btn-hero-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          background: linear-gradient(135deg, #2E7D32, #1B5E20);
          color: #fff;
          font-size: 1rem;
          font-weight: 700;
          padding: 0.85rem 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(27,94,32,0.45);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-hero-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(27,94,32,0.55);
        }
        .btn-hero-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          padding: 0.85rem 2rem;
          border-radius: 12px;
          border: 1.5px solid rgba(255,255,255,0.25);
          transition: background 0.2s, border-color 0.2s;
        }
        .btn-hero-secondary:hover {
          background: rgba(255,255,255,0.18);
          border-color: rgba(255,255,255,0.5);
        }
        /* Hero right – floating card */
        .hero-right {
          opacity: 0;
          transform: translateY(40px) scale(0.96);
          transition: opacity 1s ease 0.5s, transform 1s ease 0.5s;
        }
        .hero-right.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .hero-card {
          background: rgba(255,255,255,0.09);
          backdrop-filter: blur(22px);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .hero-card-title {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #81C784;
        }
        .hc-disease {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(0,0,0,0.22);
          border-radius: 12px;
          padding: 0.9rem 1.1rem;
          gap: 1rem;
        }
        .hc-disease-info { flex: 1; }
        .hc-disease-name { font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 0.2rem; }
        .hc-disease-crop { font-size: 0.78rem; color: #a7c5a9; }
        .hc-pill {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.3rem 0.7rem;
          border-radius: 100px;
          white-space: nowrap;
        }
        .hc-pill.high { background: rgba(239,68,68,0.18); color: #FCA5A5; border: 1px solid rgba(239,68,68,0.3); }
        .hc-pill.med  { background: rgba(251,191,36,0.18); color: #FCD34D; border: 1px solid rgba(251,191,36,0.3); }
        .hc-pill.low  { background: rgba(76,175,80,0.18);  color: #81C784;  border: 1px solid rgba(76,175,80,0.3); }
        .hc-accuracy {
          background: rgba(0,0,0,0.22);
          border-radius: 12px;
          padding: 0.9rem 1.1rem;
        }
        .hc-accuracy-label { font-size: 0.75rem; color: #a7c5a9; margin-bottom: 0.5rem; }
        .hc-accuracy-bar-wrap {
          height: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
          overflow: hidden;
        }
        .hc-accuracy-bar {
          height: 100%;
          width: 95%;
          background: linear-gradient(90deg, #4CAF50, #81C784);
          border-radius: 3px;
          animation: barGrow 1.5s 1s ease backwards;
        }
        @keyframes barGrow {
          from { width: 0; }
          to   { width: 95%; }
        }
        .hc-accuracy-pct {
          font-size: 0.78rem;
          font-weight: 700;
          color: #81C784;
          margin-top: 0.4rem;
        }

        /* ═══════════════════════════════ STATS ═══════════════════════════════ */
        .stats-section {
          background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%);
          padding: 4rem 2rem;
        }
        .stats-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }
        .stat-item {
          text-align: center;
        }
        .stat-value {
          font-size: clamp(2.2rem, 4vw, 3rem);
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.03em;
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        .stat-label {
          font-size: 0.9rem;
          color: #a7d6a9;
          font-weight: 500;
        }

        /* ══════════════════════════════ FEATURES ════════════════════════════ */
        .features-section {
          padding: 6rem 2rem;
          background: #F8FAF7;
        }
        .section-inner { max-width: 1200px; margin: 0 auto; }
        .section-label {
          text-align: center;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #2E7D32;
          margin-bottom: 0.75rem;
        }
        .section-title {
          text-align: center;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          color: #111827;
          margin: 0 auto 1rem;
          max-width: 620px;
        }
        .section-sub {
          text-align: center;
          font-size: 1.05rem;
          color: #6B7280;
          max-width: 560px;
          margin: 0 auto 3.5rem;
          line-height: 1.65;
        }
        .feat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.75rem;
        }
        .feat-card {
          background: #fff;
          border: 1px solid #E8F5E9;
          border-radius: 16px;
          padding: 2rem;
          transition: opacity 0.7s ease, transform 0.7s ease, box-shadow 0.3s;
          cursor: default;
        }
        .feat-card:hover {
          box-shadow: 0 8px 32px rgba(27,94,32,0.12);
          border-color: #A5D6A7;
          transform: translateY(-4px) !important;
        }
        .feat-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
          display: block;
        }
        .feat-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 0.6rem;
        }
        .feat-desc {
          font-size: 0.9rem;
          color: #6B7280;
          line-height: 1.65;
          margin: 0;
        }

        /* ════════════════════════════ HOW IT WORKS ══════════════════════════ */
        .how-section {
          padding: 6rem 2rem;
          background: #fff;
        }
        .step-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          position: relative;
        }
        .step-grid::before {
          content: '';
          position: absolute;
          top: 2.5rem;
          left: 12.5%;
          right: 12.5%;
          height: 2px;
          background: linear-gradient(90deg, #4CAF50, #A5D6A7);
          z-index: 0;
        }
        .step-card {
          text-align: center;
          padding: 1.5rem 1rem;
          position: relative;
          z-index: 1;
        }
        .step-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 52px; height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1B5E20, #2E7D32);
          color: #fff;
          font-size: 0.85rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          margin: 0 auto 1.25rem;
          box-shadow: 0 4px 16px rgba(27,94,32,0.35);
        }
        .step-title {
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 0.5rem;
        }
        .step-desc {
          font-size: 0.88rem;
          color: #6B7280;
          line-height: 1.6;
          margin: 0;
        }

        /* ═══════════════════════════════ ABOUT ══════════════════════════════ */
        .about-section {
          padding: 6rem 2rem;
          background: #F8FAF7;
        }
        .about-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }
        .about-image-wrap {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(27,94,32,0.18);
          position: relative;
        }
        .about-image-wrap img {
          width: 100%;
          height: 400px;
          object-fit: cover;
          display: block;
          transition: transform 0.6s ease;
        }
        .about-image-wrap:hover img { transform: scale(1.04); }
        .about-image-badge {
          position: absolute;
          bottom: 1.25rem;
          left: 1.25rem;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 0.7rem 1.1rem;
          font-size: 0.82rem;
          font-weight: 700;
          color: #1B5E20;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        }
        .about-text .section-label,
        .about-text .section-title,
        .about-text .section-sub { text-align: left; margin-left: 0; }
        .about-text .section-title { max-width: 100%; }
        .about-list {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .about-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          font-size: 0.95rem;
          color: #374151;
          line-height: 1.5;
        }
        .about-list li::before {
          content: '✓';
          color: #2E7D32;
          font-weight: 900;
          font-size: 0.9rem;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }
        .btn-about {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          background: linear-gradient(135deg, #1B5E20, #2E7D32);
          color: #fff;
          font-size: 0.95rem;
          font-weight: 700;
          padding: 0.8rem 1.75rem;
          border-radius: 10px;
          box-shadow: 0 4px 16px rgba(27,94,32,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-about:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(27,94,32,0.45);
        }

        /* ═══════════════════════════════ CTA ════════════════════════════════ */
        .cta-section {
          padding: 6rem 2rem;
          background: linear-gradient(135deg, #0a2e0d 0%, #1B5E20 100%);
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .cta-section::before {
          content: '';
          position: absolute;
          top: -40%;
          left: 50%;
          transform: translateX(-50%);
          width: 800px; height: 800px;
          background: radial-gradient(circle, rgba(76,175,80,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-inner { position: relative; z-index: 1; }
        .cta-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.03em;
          margin-bottom: 1rem;
        }
        .cta-sub {
          font-size: 1.1rem;
          color: #a7d6a9;
          max-width: 520px;
          margin: 0 auto 2.5rem;
          line-height: 1.65;
        }
        .cta-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .btn-cta-primary {
          text-decoration: none;
          background: #fff;
          color: #1B5E20;
          font-size: 1rem;
          font-weight: 700;
          padding: 0.9rem 2.25rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.28);
        }
        .btn-cta-ghost {
          text-decoration: none;
          background: transparent;
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          padding: 0.9rem 2.25rem;
          border-radius: 12px;
          border: 1.5px solid rgba(255,255,255,0.3);
          transition: background 0.2s, border-color 0.2s;
        }
        .btn-cta-ghost:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.6);
        }

        /* ═══════════════════════════════ RESPONSIVE ═════════════════════════ */
        @media (max-width: 900px) {
          .hero-content { grid-template-columns: 1fr; padding-top: 7rem; }
          .hero-right { display: none; }
          .feat-grid { grid-template-columns: repeat(2, 1fr); }
          .step-grid { grid-template-columns: repeat(2, 1fr); }
          .step-grid::before { display: none; }
          .about-inner { grid-template-columns: 1fr; gap: 3rem; }
          .stats-inner { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 580px) {
          .feat-grid { grid-template-columns: 1fr; }
          .step-grid { grid-template-columns: 1fr; }
          .stats-inner { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="hp-wrap">
        <PublicNav />

        {/* ── HERO ── */}
        <section className="hero" id="hero">
          <div className={`hero-bg${heroInView ? ' loaded' : ''}`} />
          <div className="hero-overlay" />
          <div className="hero-content" ref={heroRef}>
            {/* Left */}
            <div className={`hero-left${heroInView ? ' visible' : ''}`}>
              <div className="hero-badge">AI-Powered Agriculture Platform</div>
              <h1 className="hero-title">
                Protect Your Crops with{' '}
                <span className="highlight">Intelligent Disease Detection</span>
              </h1>
              <p className="hero-sub">
                AgroGuard AI uses cutting-edge computer vision to identify crop diseases instantly, empowering Sri Lankan farmers with real-time insights and expert guidance.
              </p>
              <div className="hero-actions">
                <Link to="/login" className="btn-hero-primary" id="hero-get-started-btn">
                  Get Started Free →
                </Link>
                <a href="#how-it-works" className="btn-hero-secondary" id="hero-how-it-works-btn">
                  ▶ See How It Works
                </a>
              </div>
            </div>

            {/* Right – mock card */}
            <div className={`hero-right${heroInView ? ' visible' : ''}`}>
              <div className="hero-card">
                <div className="hero-card-title">🔬 Live Disease Scan</div>
                {[
                  { name: 'Blast Disease', crop: 'Rice · Polonnaruwa', risk: 'high', label: 'High Risk' },
                  { name: 'Powdery Mildew', crop: 'Maize · Kurunegala', risk: 'med', label: 'Moderate' },
                  { name: 'Healthy Crop', crop: 'Tea · Nuwara Eliya', risk: 'low', label: 'Healthy' },
                ].map(item => (
                  <div key={item.name} className="hc-disease">
                    <div className="hc-disease-info">
                      <div className="hc-disease-name">{item.name}</div>
                      <div className="hc-disease-crop">{item.crop}</div>
                    </div>
                    <div className={`hc-pill ${item.risk}`}>{item.label}</div>
                  </div>
                ))}
                <div className="hc-accuracy">
                  <div className="hc-accuracy-label">Model Accuracy</div>
                  <div className="hc-accuracy-bar-wrap">
                    <div className="hc-accuracy-bar" />
                  </div>
                  <div className="hc-accuracy-pct">95.4% — Excellent</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="stats-section">
          <div className="stats-inner">
            {stats.map((s, i) => (
              <StatItem key={s.label} {...s} delay={i * 100} />
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="features-section" id="features">
          <div className="section-inner">
            <div className="section-label">Platform Features</div>
            <h2 className="section-title">Everything you need to guard your harvest</h2>
            <p className="section-sub">
              From AI diagnostics to expert officer networks, AgroGuard AI is the complete crop health platform.
            </p>
            <div className="feat-grid">
              {features.map((f, i) => (
                <FeatureCard key={f.title} {...f} delay={i * 80} />
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="how-section" id="how-it-works">
          <div className="section-inner">
            <div className="section-label">Simple Process</div>
            <h2 className="section-title">Diagnosis in four easy steps</h2>
            <p className="section-sub">No expertise required — just point, shoot, and get results.</p>
            <div className="step-grid">
              {steps.map((s, i) => (
                <StepCard key={s.num} {...s} delay={i * 120} />
              ))}
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section className="about-section" id="about">
          <div className="about-inner">
            <div className="about-image-wrap">
              <img src={heroImage} alt="Farmer inspecting crops in Sri Lankan paddy fields" />
              <div className="about-image-badge">🌾 Serving 10,000+ Farmers</div>
            </div>
            <div className="about-text">
              <div className="section-label">About AgroGuard AI</div>
              <h2 className="section-title">Built for Sri Lankan Farmers, Powered by AI</h2>
              <p className="section-sub">
                We combine deep learning, regional agricultural expertise, and a dedicated network of certified officers to deliver the most comprehensive crop protection platform in Sri Lanka.
              </p>
              <ul className="about-list">
                <li>Trained on 100,000+ crop disease images from local fields</li>
                <li>Supports rice, maize, tea, vegetables, and 15+ other crops</li>
                <li>Multilingual support in Sinhala, Tamil, and English</li>
                <li>Works offline in low-connectivity rural areas</li>
                <li>Integrated with the Department of Agriculture Sri Lanka</li>
              </ul>
              <Link to="/login" className="btn-about" id="about-get-started-btn">
                Join the Platform →
              </Link>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-section">
          <div className="cta-inner">
            <h2 className="cta-title">Ready to protect your crops?</h2>
            <p className="cta-sub">
              Join thousands of Sri Lankan farmers using AI to detect disease early, save their harvest, and increase yields.
            </p>
            <div className="cta-actions">
              <Link to="/login" className="btn-cta-primary" id="cta-start-btn">Start Free Today</Link>
              <a href="#features" className="btn-cta-ghost" id="cta-features-btn">Explore Features</a>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
