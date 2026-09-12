import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiLeafLine } from 'react-icons/ri';
import { FiArrowRight, FiLock, FiMail, FiCheckCircle } from 'react-icons/fi';
import { ScanLine, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PublicNav from '../components/home/PublicNav';

/* ─────────────────────────────────────────────────────────────────
   Scoped CSS animations — login page only
───────────────────────────────────────────────────────────────── */
const LOGIN_STYLES = `
  @keyframes lp-float-up {
    0%   { transform: translateY(0px) rotate(0deg); opacity: 0.35; }
    50%  { opacity: 0.6; }
    100% { transform: translateY(-120px) rotate(15deg); opacity: 0; }
  }
  @keyframes lp-leaf-sway {
    0%, 100% { transform: rotate(-8deg) scale(1); }
    50%       { transform: rotate(8deg) scale(1.04); }
  }
  @keyframes lp-blob-drift {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(30px, -20px) scale(1.05); }
    66%       { transform: translate(-20px, 15px) scale(0.97); }
  }
  @keyframes lp-blob-drift2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    40%       { transform: translate(-35px, 25px) scale(1.08); }
    70%       { transform: translate(20px, -15px) scale(0.95); }
  }
  @keyframes lp-scan-ring {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes lp-scan-ring-rev {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(-360deg); }
  }
  @keyframes lp-pulse-glow {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50%       { opacity: 0.9; transform: scale(1.12); }
  }
  @keyframes lp-wave-move {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-80px); }
  }
  @keyframes lp-plant-grow {
    0%, 100% { transform: scaleY(1) rotate(-2deg); transform-origin: bottom center; }
    50%       { transform: scaleY(1.03) rotate(2deg); transform-origin: bottom center; }
  }
  @keyframes lp-data-orbit {
    0%   { transform: rotate(0deg) translateX(90px) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(90px) rotate(-360deg); }
  }
  @keyframes lp-card-fade {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lp-shimmer {
    0%, 100% { opacity: 0.3; }
    50%       { opacity: 0.7; }
  }
  .lp-float-p { animation: lp-float-up linear infinite; }
  .lp-leaf-s  { animation: lp-leaf-sway ease-in-out infinite; }
  .lp-blob1   { animation: lp-blob-drift  18s ease-in-out infinite; }
  .lp-blob2   { animation: lp-blob-drift2 22s ease-in-out infinite; }
  .lp-blob3   { animation: lp-blob-drift  26s ease-in-out infinite reverse; }
  .lp-ring1   { animation: lp-scan-ring     28s linear infinite; }
  .lp-ring2   { animation: lp-scan-ring-rev 20s linear infinite; }
  .lp-ring3   { animation: lp-scan-ring     40s linear infinite; }
  .lp-glow    { animation: lp-pulse-glow 3s ease-in-out infinite; }
  .lp-wave    { animation: lp-wave-move  12s linear infinite; }
  .lp-plant   { animation: lp-plant-grow 6s ease-in-out infinite; }
  .lp-orbit   { animation: lp-data-orbit 10s linear infinite; }
  .lp-shimmer { animation: lp-shimmer 2.5s ease-in-out infinite; }
  .lp-card-in { animation: lp-card-fade 0.6s ease backwards; }
  .lp-hero-panel { display: flex; flex-direction: column; }
  @media (max-width: 767px) { .lp-hero-panel { display: none; } }
`;

/* ─────────────────────────────────────────────────────────────────
   FloatingParticles
───────────────────────────────────────────────────────────────── */
function FloatingParticles() {
  const particles = [
    { l: '8%',  d: '0s',   dur: '9s',  s: 5, o: 0.4  },
    { l: '18%', d: '1.5s', dur: '11s', s: 4, o: 0.3  },
    { l: '30%', d: '3s',   dur: '8s',  s: 6, o: 0.5  },
    { l: '45%', d: '0.8s', dur: '13s', s: 3, o: 0.25 },
    { l: '60%', d: '2.2s', dur: '10s', s: 5, o: 0.4  },
    { l: '72%', d: '4s',   dur: '12s', s: 4, o: 0.3  },
    { l: '85%', d: '1s',   dur: '9s',  s: 6, o: 0.45 },
    { l: '92%', d: '3.5s', dur: '14s', s: 3, o: 0.2  },
  ];
  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          className="lp-float-p absolute bottom-0 rounded-full bg-emerald-300"
          style={{
            left: p.l,
            width: p.s,
            height: p.s,
            animationDuration: p.dur,
            animationDelay: p.d,
            opacity: p.o,
          }}
        />
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   LeafSilhouette
───────────────────────────────────────────────────────────────── */
function LeafSilhouette({ style, className }) {
  return (
    <svg
      viewBox="0 0 40 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={className}
    >
      <path
        d="M20 58 C20 58 2 42 2 22 C2 10 10 2 20 2 C30 2 38 10 38 22 C38 42 20 58 20 58Z"
        fill="rgba(134,239,172,0.12)"
        stroke="rgba(134,239,172,0.2)"
        strokeWidth="1"
      />
      <line x1="20" y1="58" x2="20" y2="8"  stroke="rgba(134,239,172,0.15)" strokeWidth="1" />
      <line x1="20" y1="35" x2="8"  y2="22" stroke="rgba(134,239,172,0.1)"  strokeWidth="0.8" />
      <line x1="20" y1="28" x2="32" y2="16" stroke="rgba(134,239,172,0.1)"  strokeWidth="0.8" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   HeroPanel — right side animated agricultural background
───────────────────────────────────────────────────────────────── */
function HeroPanel() {
  const featureCards = [
    { Icon: ScanLine,    title: 'AI Crop Scanning',        desc: 'Detect potential crop problems from images.' },
    { Icon: Leaf,        title: 'Crop Health Insights',     desc: 'Understand plant health with AI-powered analysis.' },
    { Icon: ShieldCheck, title: 'Smart Recommendations',    desc: 'Get practical guidance for healthier crops.' },
  ];

  return (
    <div
      className="lp-hero-panel relative w-full overflow-hidden bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#166534]"
      style={{ minHeight: '100vh' }}
    >
      {/* Gradient blobs */}
      <div className="lp-blob1 absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="lp-blob2 absolute top-1/2 right-[-80px] w-[380px] h-[380px] rounded-full bg-teal-400/8 blur-3xl pointer-events-none" />
      <div className="lp-blob3 absolute -bottom-24 left-1/4 w-[320px] h-[320px] rounded-full bg-green-400/8 blur-3xl pointer-events-none" />

      {/* Wave lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="lp-wave absolute bottom-0 left-0 opacity-10"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          style={{ width: '140%', height: 180 }}
        >
          <path d="M0 100 Q200 60 400 100 T800 100 T1200 100 V200 H0Z" fill="rgba(134,239,172,0.3)" />
          <path d="M0 130 Q200 90 400 130 T800 130 T1200 130 V200 H0Z" fill="rgba(52,211,153,0.2)" />
        </svg>
        <svg
          className="lp-wave absolute top-0 right-0 opacity-5"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          style={{ width: '140%', height: 160, animationDirection: 'reverse' }}
        >
          <path d="M0 80 Q300 40 600 80 T1200 80 V0 H0Z" fill="rgba(134,239,172,0.4)" />
        </svg>
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(134,239,172,1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(134,239,172,1) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Leaf silhouettes */}
      <LeafSilhouette
        className="lp-leaf-s absolute top-[12%] left-[5%] opacity-60 pointer-events-none"
        style={{ width: 48, height: 72, animationDuration: '7s' }}
      />
      <LeafSilhouette
        className="lp-leaf-s absolute top-[20%] right-[8%] opacity-40 pointer-events-none"
        style={{ width: 36, height: 54, animationDuration: '9s', animationDelay: '1.5s', transform: 'scaleX(-1)' }}
      />
      <LeafSilhouette
        className="lp-leaf-s absolute bottom-[28%] left-[8%] opacity-30 pointer-events-none"
        style={{ width: 56, height: 84, animationDuration: '11s', animationDelay: '3s' }}
      />
      <LeafSilhouette
        className="lp-leaf-s absolute bottom-[15%] right-[6%] opacity-25 pointer-events-none"
        style={{ width: 40, height: 60, animationDuration: '8s', animationDelay: '2s' }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-full px-8 md:px-12 pt-24 lg:pt-28 pb-8 md:pb-10 justify-between" style={{ minHeight: '100vh' }}>

        {/* ── Top branding ── */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/15 border border-emerald-400/25 mb-4">
            <Sparkles size={13} className="text-emerald-300" />
            <span className="text-emerald-300 text-[11px] font-semibold tracking-widest uppercase">
              AI-Powered Agriculture
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black leading-tight text-white tracking-tight mb-2">
            AgroGuard<span className="text-emerald-400">-AI</span>
          </h1>
          <p className="text-emerald-200 text-base font-semibold mb-2">Smart AI for Healthier Crops</p>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Detect crop diseases early, monitor plant health, and make smarter farming decisions
            with AI-powered insights.
          </p>
        </div>

        {/* ── Centre: AI crop illustration ── */}
        <div className="flex justify-center items-center my-6 relative" style={{ height: 240 }}>
          {/* Rotating rings */}
          <div className="lp-ring3 absolute w-56 h-56 rounded-full border border-white/5" />
          <div className="lp-ring1 absolute w-44 h-44 rounded-full border border-emerald-400/15" style={{ borderStyle: 'dashed' }} />
          <div className="lp-ring2 absolute w-32 h-32 rounded-full border border-emerald-300/20" />

          {/* Orbiting data dots */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute"
              style={{
                animation: `lp-data-orbit ${8 + i * 1.5}s linear infinite`,
                animationDelay: `${i * -1.6}s`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full bg-emerald-300 lp-shimmer"
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            </div>
          ))}

          {/* Central glow */}
          <div className="lp-glow absolute w-24 h-24 rounded-full bg-emerald-500/20 blur-xl" />

          {/* Plant SVG */}
          <svg
            className="lp-plant relative z-10"
            viewBox="0 0 120 160"
            width="110"
            height="145"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M60 150 Q60 120 60 90" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="60" cy="152" rx="28" ry="6" fill="rgba(134,239,172,0.2)" stroke="rgba(134,239,172,0.3)" strokeWidth="1" />
            <path d="M60 115 C50 105 30 108 28 95 C26 82 45 78 60 90" fill="rgba(74,222,128,0.5)" stroke="#4ade80" strokeWidth="1.5" />
            <path d="M60 115 L44 103" stroke="rgba(134,239,172,0.5)" strokeWidth="0.8" />
            <path d="M60 100 C70 88 90 90 93 77 C96 64 77 58 60 72" fill="rgba(52,211,153,0.5)" stroke="#34d399" strokeWidth="1.5" />
            <path d="M60 100 L78 84" stroke="rgba(134,239,172,0.5)" strokeWidth="0.8" />
            <ellipse cx="60" cy="82" rx="10" ry="14" fill="rgba(74,222,128,0.6)" stroke="#4ade80" strokeWidth="1.5" />
            <circle cx="60" cy="70" r="4" fill="#86efac" opacity="0.9" />
            <circle cx="60" cy="70" r="8" fill="rgba(134,239,172,0.2)" />
            <line x1="20" y1="110" x2="50" y2="110" stroke="rgba(134,239,172,0.4)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="70" y1="95"  x2="100" y2="95"  stroke="rgba(134,239,172,0.4)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="15" y1="130" x2="45"  y2="130" stroke="rgba(134,239,172,0.25)" strokeWidth="0.8" strokeDasharray="2 4" />
            <circle cx="20"  cy="110" r="2.5" fill="#34d399" opacity="0.7" />
            <circle cx="100" cy="95"  r="2.5" fill="#34d399" opacity="0.7" />
            <circle cx="15"  cy="130" r="2"   fill="#86efac" opacity="0.5" />
            <circle cx="38"  cy="72"  r="3"   fill="rgba(74,222,128,0.8)" />
            <circle cx="85"  cy="60"  r="2.5" fill="rgba(52,211,153,0.8)" />
            <circle cx="30"  cy="140" r="2"   fill="rgba(134,239,172,0.5)" />
          </svg>

          {/* Scanning bracket corners */}
          <div className="absolute w-5 h-5 border-t-2 border-l-2 border-emerald-400/50"
               style={{ top: 'calc(50% - 58px)', left: 'calc(50% - 56px)', borderRadius: '8px 0 0 0' }} />
          <div className="absolute w-5 h-5 border-t-2 border-r-2 border-emerald-400/50"
               style={{ top: 'calc(50% - 58px)', right: 'calc(50% - 56px)', borderRadius: '0 8px 0 0' }} />
          <div className="absolute w-5 h-5 border-b-2 border-l-2 border-emerald-400/50"
               style={{ bottom: 'calc(50% - 68px)', left: 'calc(50% - 56px)', borderRadius: '0 0 0 8px' }} />
          <div className="absolute w-5 h-5 border-b-2 border-r-2 border-emerald-400/50"
               style={{ bottom: 'calc(50% - 68px)', right: 'calc(50% - 56px)', borderRadius: '0 0 8px 0' }} />
        </div>

        {/* ── Glass feature cards ── */}
        <div className="grid grid-cols-3 gap-2.5">
          {featureCards.map(({ Icon, title, desc }, i) => (
            <div
              key={title}
              className="lp-card-in backdrop-blur-sm rounded-xl p-3 transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.10)',
                animationDelay: `${i * 0.12 + 0.2}s`,
              }}
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-400/20 flex items-center justify-center mb-2">
                <Icon size={14} className="text-emerald-300" />
              </div>
              <p className="text-white text-[11px] font-semibold leading-tight mb-1">{title}</p>
              <p className="text-white/50 text-[10px] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between pt-4 mt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 lp-glow" />
            <span className="text-white/40 text-[10px]">System Online</span>
          </div>
          <span className="text-white/30 text-[10px]">Dept. of Agriculture · Sri Lanka</span>
        </div>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN LOGIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole]       = useState('farmer');
  const [email, setEmail]     = useState('ruwan@farm.lk');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const roleCredentials = {
    farmer:   { email: 'ruwan@farm.lk',          name: 'Ruwan Perera',        title: 'Paddy Farmer (Ampara)'    },
    officer:  { email: 'anura@agridept.gov.lk',   name: 'Dr. Anura Bandara',   title: 'Divisional Ag Officer'    },
    research: { email: 'dhammika@cri.lk',          name: 'Prof. Dhammika Silva', title: 'Chief Epidemiologist'    },
    admin:    { email: 'admin@agroguard.gov.lk',   name: 'System Administrator', title: 'Central Operations'     },
  };

  const handleRoleSelect = (newRole) => {
    setRole(newRole);
    setEmail(roleCredentials[newRole].email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      const loggedInUser = await login(email, password, role);
      navigate(`/${loggedInUser.role || role}`);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{LOGIN_STYLES}</style>
      <PublicNav />

      {/* ── Two-column shell ── */}
      <div className="min-h-screen flex flex-row bg-[#f0faf2]">

        {/* ───────────────────────────────────────────────
            LEFT — animated agricultural hero panel
            Hidden on mobile via .lp-hero-panel CSS
        ─────────────────────────────────────────────── */}
        <div className="lp-hero-panel" style={{ width: '48%', flexShrink: 0 }}>
          <HeroPanel />
        </div>

        {/* ───────────────────────────────────────────────
            RIGHT — clean login form panel
        ─────────────────────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 pt-24 md:pt-24 relative overflow-hidden">
          {/* Soft bg blobs */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-emerald-100/60 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-teal-100/40 blur-3xl pointer-events-none" />

          <div className="relative z-10 w-full max-w-md">
            {/* Card */}
            <div
              className="bg-white rounded-3xl p-8"
              style={{ border: '1px solid #d1fae5', boxShadow: '0 8px 48px rgba(20,83,45,0.10)' }}
            >
              {/* Header */}
              <div className="mb-7 text-center">
                <div className="flex items-center justify-center gap-2.5 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-emerald-600"
                    style={{ background: '#fff', border: '1px solid #a7f3d0', boxShadow: '0 2px 8px rgba(20,83,45,0.08)' }}
                  >
                    <RiLeafLine size={22} />
                  </div>
                  <span className="text-xl font-black tracking-tight text-gray-900">
                    AgroGuard <span className="text-emerald-600">AI</span>
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Sign in to Portal</h2>
                <p className="text-xs text-gray-500 mt-1.5">
                  Select your stakeholder profile to explore the system
                </p>
              </div>

              {/* Role selector */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Select Demo Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'farmer',   label: 'Farmer',      icon: '🌾' },
                    { id: 'officer',  label: 'Agri Officer', icon: '📋' },
                    { id: 'research', label: 'Researcher',   icon: '🔬' },
                    { id: 'admin',    label: 'Admin',        icon: '⚙️' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => handleRoleSelect(item.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        role === item.id
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm ring-1 ring-emerald-400'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <div className="text-left leading-tight">
                        <div>{item.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-lg flex items-center gap-1.5 border border-emerald-100">
                  <FiCheckCircle size={13} className="text-emerald-600 flex-shrink-0" />
                  <span>
                    Acting as: <strong>{roleCredentials[role].name}</strong> ({roleCredentials[role].title})
                  </span>
                </div>
              </div>

              {/* Error */}
              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <span className="font-semibold">Error:</span> {errorMsg}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FiMail size={15} />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all"
                      placeholder="name@organization.lk"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-gray-700">Password</label>
                    <a
                      href="#forgot"
                      onClick={(e) => e.preventDefault()}
                      className="text-xs text-emerald-600 hover:underline"
                    >
                      Forgot?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FiLock size={15} />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Keep signed in + SSL */}
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Keep me signed in</span>
                  </label>
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                      <rect x="1" y="5" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M3 5V3.5a2 2 0 014 0V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    SSL Encrypted
                  </span>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #15803d, #166534)',
                    boxShadow: '0 4px 20px rgba(21,128,61,0.30)',
                  }}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Enter Dashboard</span>
                      <FiArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-100 text-center text-[11px] text-gray-400">
                AgroGuard AI Sri Lanka • Multi-Role Agri-Tech Surveillance
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}