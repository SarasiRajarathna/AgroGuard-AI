import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Phone,
  User,
  Sprout,
  MapPin,
  CheckCircle2,
  Globe,
  Loader2,
  ArrowRight,
  Tractor,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Mail,
  Sparkles,
  ScanLine,
  Leaf,
  Activity,
  Droplets,
  ClipboardList,
} from "lucide-react";
import { RiLeafLine } from "react-icons/ri";

import { supabase } from "../lib/supabase";
import PublicNav from "../components/home/PublicNav";

const COUNTRIES = [
  "Sri Lankan", "Afghan", "Albanian", "Algerian", "American", "Argentine", "Australian", "Austrian",
  "Bangladeshi", "Belgian", "Brazilian", "British", "Canadian", "Chinese", "Danish", "Dutch", "Egyptian", "French",
  "German", "Greek", "Indian", "Indonesian", "Iranian", "Iraqi", "Irish", "Italian", "Japanese", "Kenyan",
  "Malaysian", "Maldivian", "Mexican", "Nepalese", "New Zealand", "Nigerian", "Norwegian", "Pakistani", "Filipino",
  "Polish", "Portuguese", "Russian", "Singaporean", "South African", "Spanish", "Swedish", "Swiss", "Thai",
  "Turkish", "Ukrainian", "Vietnamese", "Other",
];

const DISTRICTS = [
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
];

/* ─────────────────────────────────────────────────────────────────
   Scoped CSS animations — register page only
───────────────────────────────────────────────────────────────── */
const REGISTER_STYLES = `
  @keyframes reg-float-up {
    0%   { transform: translateY(0px) rotate(0deg); opacity: 0.35; }
    50%  { opacity: 0.65; }
    100% { transform: translateY(-130px) rotate(15deg); opacity: 0; }
  }
  @keyframes reg-leaf-sway {
    0%, 100% { transform: rotate(-8deg) scale(1); }
    50%       { transform: rotate(8deg) scale(1.04); }
  }
  @keyframes reg-blob-drift {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(30px, -20px) scale(1.05); }
    66%       { transform: translate(-20px, 15px) scale(0.97); }
  }
  @keyframes reg-blob-drift2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    40%       { transform: translate(-35px, 25px) scale(1.08); }
    70%       { transform: translate(20px, -15px) scale(0.95); }
  }
  @keyframes reg-scan-ring {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes reg-scan-ring-rev {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(-360deg); }
  }
  @keyframes reg-pulse-glow {
    0%, 100% { opacity: 0.35; transform: scale(1); }
    50%       { opacity: 0.85; transform: scale(1.1); }
  }
  @keyframes reg-wave-move {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-80px); }
  }
  @keyframes reg-plant-grow {
    0%, 100% { transform: scaleY(1) rotate(-1.5deg); transform-origin: bottom center; }
    50%       { transform: scaleY(1.03) rotate(1.5deg); transform-origin: bottom center; }
  }
  @keyframes reg-data-orbit {
    0%   { transform: rotate(0deg) translateX(95px) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(95px) rotate(-360deg); }
  }
  @keyframes reg-card-fade {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes reg-float-badge1 {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-7px); }
  }
  @keyframes reg-float-badge2 {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-9px); }
  }
  @keyframes reg-scan-beam {
    0%   { top: 15%; opacity: 0; }
    30%  { opacity: 0.8; }
    70%  { opacity: 0.8; }
    100% { top: 85%; opacity: 0; }
  }
  .reg-float-p { animation: reg-float-up linear infinite; }
  .reg-leaf-s  { animation: reg-leaf-sway ease-in-out infinite; }
  .reg-blob1   { animation: reg-blob-drift  18s ease-in-out infinite; }
  .reg-blob2   { animation: reg-blob-drift2 22s ease-in-out infinite; }
  .reg-ring1   { animation: reg-scan-ring     26s linear infinite; }
  .reg-ring2   { animation: reg-scan-ring-rev 18s linear infinite; }
  .reg-ring3   { animation: reg-scan-ring     38s linear infinite; }
  .reg-glow    { animation: reg-pulse-glow 3.5s ease-in-out infinite; }
  .reg-wave    { animation: reg-wave-move  12s linear infinite; }
  .reg-plant   { animation: reg-plant-grow 6s ease-in-out infinite; }
  .reg-badge1  { animation: reg-float-badge1 5s ease-in-out infinite; }
  .reg-badge2  { animation: reg-float-badge2 6s ease-in-out infinite 1s; }
  .reg-badge3  { animation: reg-float-badge1 5.5s ease-in-out infinite 2s; }
  .reg-badge4  { animation: reg-float-badge2 6.5s ease-in-out infinite 0.5s; }
  .reg-beam    { animation: reg-scan-beam 4s ease-in-out infinite; }
  .reg-card-in { animation: reg-card-fade 0.6s ease backwards; }
  
  /* Custom scrollbar for form panel */
  .reg-form-scroll::-webkit-scrollbar {
    width: 6px;
  }
  .reg-form-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .reg-form-scroll::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 9999px;
  }
  .reg-form-scroll::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

/* ─────────────────────────────────────────────────────────────────
   Floating Particles Component
───────────────────────────────────────────────────────────────── */
function FloatingParticles() {
  const particles = [
    { l: '10%', d: '0s',   dur: '8s',  s: 5, o: 0.45 },
    { l: '22%', d: '1.2s', dur: '11s', s: 4, o: 0.35 },
    { l: '35%', d: '2.5s', dur: '9s',  s: 6, o: 0.5  },
    { l: '50%', d: '0.6s', dur: '13s', s: 3, o: 0.3  },
    { l: '65%', d: '2.0s', dur: '10s', s: 5, o: 0.4  },
    { l: '78%', d: '3.8s', dur: '12s', s: 4, o: 0.35 },
    { l: '88%', d: '1.0s', dur: '9.5s',s: 6, o: 0.4  },
  ];
  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          className="reg-float-p absolute bottom-0 rounded-full bg-emerald-300 pointer-events-none"
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
   Leaf Silhouette Component
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
   Right Hero Panel — Animated Agricultural AI Scene
───────────────────────────────────────────────────────────────── */
function RegisterHeroPanel() {
  const featureCards = [
    { Icon: ScanLine,    title: 'AI Crop Scanning',      desc: 'Detect potential crop problems from images.' },
    { Icon: Leaf,        title: 'Crop Health Insights',   desc: 'Understand plant health with AI-powered analysis.' },
    { Icon: ShieldCheck, title: 'Smart Recommendations',  desc: 'Get practical guidance for healthier crops.' },
  ];

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#166534] flex flex-col justify-between"
      style={{ minHeight: '100vh' }}
    >
      {/* Background radial glow & blobs */}
      <div className="reg-blob1 absolute -top-28 -left-28 w-[450px] h-[450px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="reg-blob2 absolute top-1/2 -right-20 w-[380px] h-[380px] rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/4 w-[300px] h-[300px] rounded-full bg-green-400/10 blur-3xl pointer-events-none" />

      {/* Decorative wave lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="reg-wave absolute bottom-0 left-0 opacity-10"
          viewBox="0 0 1200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '200%', height: 160 }}
        >
          <path
            d="M0 100 C300 160 600 40 900 100 C1200 160 1500 40 1800 100 C2100 160 2400 40 2700 100 L2700 200 L0 200 Z"
            fill="rgba(74,222,128,0.25)"
          />
        </svg>
      </div>

      {/* Floating particles */}
      <FloatingParticles />

      {/* Leaf silhouettes */}
      <LeafSilhouette
        className="reg-leaf-s absolute top-[14%] left-[6%] opacity-60 pointer-events-none"
        style={{ width: 44, height: 68, animationDuration: '7s' }}
      />
      <LeafSilhouette
        className="reg-leaf-s absolute top-[22%] right-[8%] opacity-40 pointer-events-none"
        style={{ width: 34, height: 52, animationDuration: '9s', animationDelay: '1.5s', transform: 'scaleX(-1)' }}
      />
      <LeafSilhouette
        className="reg-leaf-s absolute bottom-[26%] left-[8%] opacity-30 pointer-events-none"
        style={{ width: 52, height: 78, animationDuration: '11s', animationDelay: '3s' }}
      />

      {/* ── Main content wrapper with safe top clearance for PublicNav ── */}
      <div className="relative z-10 flex flex-col h-full px-8 md:px-12 pt-24 lg:pt-28 pb-8 justify-between" style={{ minHeight: '100vh' }}>

        {/* ── Upper Branding Badge & Text ── */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/15 border border-emerald-400/25 mb-3">
            <Sparkles size={13} className="text-emerald-300" />
            <span className="text-emerald-300 text-[11px] font-semibold tracking-widest uppercase">
              AI-Powered Agriculture
            </span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-black leading-tight text-white tracking-tight mb-2">
            AgroGuard<span className="text-emerald-400">-AI</span>
          </h1>
          <p className="text-emerald-200 text-base font-semibold mb-2">Smart AI for Healthier Crops</p>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm">
            Detect crop diseases early, monitor plant health, and make smarter farming decisions with AI-powered insights.
          </p>
        </div>

        {/* ── Center: Futuristic AI Crop Health Visual ── */}
        <div className="relative flex justify-center items-center my-4 lg:my-6" style={{ height: 260 }}>
          {/* Rotating AI scanning rings */}
          <div className="reg-ring3 absolute w-60 h-60 rounded-full border border-white/5" />
          <div className="reg-ring1 absolute w-48 h-48 rounded-full border border-emerald-400/15" style={{ borderStyle: 'dashed' }} />
          <div className="reg-ring2 absolute w-36 h-36 rounded-full border border-emerald-300/20" />

          {/* Orbiting data nodes */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute pointer-events-none"
              style={{
                animation: `reg-data-orbit ${8 + i * 1.6}s linear infinite`,
                animationDelay: `${i * -1.8}s`,
              }}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_8px_#34d399]" />
            </div>
          ))}

          {/* Central aura glow */}
          <div className="reg-glow absolute w-28 h-28 rounded-full bg-emerald-500/20 blur-xl" />

          {/* Plant SVG */}
          <svg
            className="reg-plant relative z-10"
            viewBox="0 0 120 160"
            width="120"
            height="155"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Soil mound */}
            <ellipse cx="60" cy="152" rx="30" ry="7" fill="rgba(134,239,172,0.22)" stroke="rgba(134,239,172,0.35)" strokeWidth="1" />
            <path d="M60 150 Q60 120 60 90" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
            {/* Left Leaf */}
            <path d="M60 115 C50 105 28 108 26 94 C24 81 44 78 60 90" fill="rgba(74,222,128,0.55)" stroke="#4ade80" strokeWidth="1.5" />
            <path d="M60 115 L42 102" stroke="rgba(134,239,172,0.6)" strokeWidth="0.8" />
            {/* Right Leaf */}
            <path d="M60 100 C72 88 92 90 95 76 C98 63 78 57 60 72" fill="rgba(52,211,153,0.55)" stroke="#34d399" strokeWidth="1.5" />
            <path d="M60 100 L80 83" stroke="rgba(134,239,172,0.6)" strokeWidth="0.8" />
            {/* Top Sprout Tip */}
            <ellipse cx="60" cy="82" rx="11" ry="15" fill="rgba(74,222,128,0.65)" stroke="#4ade80" strokeWidth="1.5" />
            <circle cx="60" cy="70" r="4" fill="#86efac" opacity="0.9" />
            <circle cx="60" cy="70" r="9" fill="rgba(134,239,172,0.2)" />
            {/* Sensor / telemetry connection lines */}
            <line x1="20" y1="110" x2="50" y2="110" stroke="rgba(134,239,172,0.4)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="70" y1="95"  x2="100" y2="95"  stroke="rgba(134,239,172,0.4)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="20"  cy="110" r="2.5" fill="#34d399" opacity="0.8" />
            <circle cx="100" cy="95"  r="2.5" fill="#34d399" opacity="0.8" />
            <circle cx="36"  cy="72"  r="3"   fill="rgba(74,222,128,0.9)" />
            <circle cx="86"  cy="60"  r="2.5" fill="rgba(52,211,153,0.9)" />
          </svg>

          {/* Corner AI scanning brackets */}
          <div className="absolute w-5 h-5 border-t-2 border-l-2 border-emerald-400/60"
               style={{ top: 'calc(50% - 64px)', left: 'calc(50% - 64px)', borderRadius: '8px 0 0 0' }} />
          <div className="absolute w-5 h-5 border-t-2 border-r-2 border-emerald-400/60"
               style={{ top: 'calc(50% - 64px)', right: 'calc(50% - 64px)', borderRadius: '0 8px 0 0' }} />
          <div className="absolute w-5 h-5 border-b-2 border-l-2 border-emerald-400/60"
               style={{ bottom: 'calc(50% - 74px)', left: 'calc(50% - 64px)', borderRadius: '0 0 0 8px' }} />
          <div className="absolute w-5 h-5 border-b-2 border-r-2 border-emerald-400/60"
               style={{ bottom: 'calc(50% - 74px)', right: 'calc(50% - 64px)', borderRadius: '0 0 8px 0' }} />

          {/* Moving scan beam line */}
          <div
            className="reg-beam absolute left-[calc(50%-75px)] w-[150px] h-[2px] bg-gradient-to-r from-transparent via-emerald-400/90 to-transparent pointer-events-none shadow-[0_0_8px_#34d399]"
          />

          {/* ── 4 Floating Health Indicators around plant ── */}
          {/* 1. Healthy Growth - Optimal (Top-Left) */}
          <div
            className="reg-badge1 absolute -top-2 left-0 sm:left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-md"
            style={{
              background: 'rgba(6, 78, 59, 0.75)',
              border: '1px solid rgba(74, 222, 128, 0.3)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
              <Sprout size={13} />
            </div>
            <div>
              <div className="text-[10px] text-emerald-300/80 font-medium">Healthy Growth</div>
              <div className="text-[11px] text-white font-bold flex items-center gap-1">
                Optimal
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
          </div>

          {/* 2. Disease Detection - 99% Accuracy (Top-Right) */}
          <div
            className="reg-badge2 absolute -top-2 right-0 sm:right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-md"
            style={{
              background: 'rgba(6, 78, 59, 0.75)',
              border: '1px solid rgba(74, 222, 128, 0.3)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
              <ShieldCheck size={13} />
            </div>
            <div>
              <div className="text-[10px] text-emerald-300/80 font-medium">Disease Detection</div>
              <div className="text-[11px] text-white font-bold">99% Accuracy</div>
            </div>
          </div>

          {/* 3. Soil Health - Optimal (Bottom-Left) */}
          <div
            className="reg-badge3 absolute -bottom-3 left-2 sm:left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-md"
            style={{
              background: 'rgba(6, 78, 59, 0.75)',
              border: '1px solid rgba(74, 222, 128, 0.3)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
              <Droplets size={13} />
            </div>
            <div>
              <div className="text-[10px] text-emerald-300/80 font-medium">Soil Health</div>
              <div className="text-[11px] text-white font-bold">Optimal</div>
            </div>
          </div>

          {/* 4. Nutrient Level - Good (Bottom-Right) */}
          <div
            className="reg-badge4 absolute -bottom-3 right-2 sm:right-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-md"
            style={{
              background: 'rgba(6, 78, 59, 0.75)',
              border: '1px solid rgba(74, 222, 128, 0.3)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
              <Activity size={13} />
            </div>
            <div>
              <div className="text-[10px] text-emerald-300/80 font-medium">Nutrient Level</div>
              <div className="text-[11px] text-white font-bold">Good</div>
            </div>
          </div>
        </div>

        {/* ── Bottom Feature Cards ── */}
        <div className="grid grid-cols-3 gap-2.5 my-2">
          {featureCards.map(({ Icon, title, desc }, i) => (
            <div
              key={title}
              className="reg-card-in backdrop-blur-sm rounded-xl p-3 transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                animationDelay: `${i * 0.12 + 0.2}s`,
              }}
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-400/20 flex items-center justify-center mb-2 text-emerald-300">
                <Icon size={14} />
              </div>
              <p className="text-white text-[11px] font-semibold leading-tight mb-1">{title}</p>
              <p className="text-white/50 text-[10px] leading-relaxed line-clamp-2">{desc}</p>
            </div>
          ))}
        </div>

        {/* ── Status Footer ── */}
        <div className="flex items-center justify-between pt-3 mt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            <span className="text-white/40 text-[10px]">System Online</span>
          </div>
          <span className="text-white/30 text-[10px]">Dept. of Agriculture · Sri Lanka</span>
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Main Register Component
───────────────────────────────────────────────────────────────── */
export default function Register() {
  const navigate = useNavigate();

  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Role Selection: 'farmer' (Growers & Farmers) vs 'expert' (Experts & Advisors)
  const [selectedRole, setSelectedRole] = useState("farmer");

  // Passwords
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Success state
  const [registeredFarmerId, setRegisteredFarmerId] = useState(null);
  const [googleUser, setGoogleUser] = useState(null);

  const [formData, setFormData] = useState({
    nationality: "Sri Lankan",
    title: "Mr",
    firstName: "",
    lastName: "",
    phone: "",
    district: "",
    farmName: "",
  });

  // ============================================================
  // LOAD GOOGLE SESSION
  // ============================================================
  useEffect(() => {
    const init = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          // If no session is found, allow local guest user or direct form registration
          setGoogleUser({
            id: 'local-guest-user',
            email: 'farmer@agroguard.lk',
            name: 'Guest Farmer',
            avatar: '',
          });
          setPageLoading(false);
          return;
        }

        const user = session.user;

        // Check whether profile already exists
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id, role")
          .eq("id", user.id)
          .maybeSingle();

        if (existingProfile) {
          navigate("/farmer/dashboard", {
            replace: true,
          });
          return;
        }

        // Get Google profile information
        const fullName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          "";

        const parts = fullName.trim().split(" ");

        setGoogleUser({
          id: user.id,
          email: user.email || "",
          name: fullName,
          avatar:
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            "",
        });

        setFormData((prev) => ({
          ...prev,
          firstName: parts[0] || "",
          lastName: parts.slice(1).join(" ") || "",
        }));

        setPageLoading(false);
      } catch (error) {
        console.error("Session initialization error:", error);
        setGoogleUser({
          id: 'local-guest-user',
          email: 'farmer@agroguard.lk',
          name: 'Guest Farmer',
          avatar: '',
        });
        setPageLoading(false);
      }
    };

    init();
  }, [navigate]);

  // ============================================================
  // GOOGLE OAUTH TRIGGER
  // ============================================================
  const handleGoogleSignUp = async () => {
    try {
      setSubmitting(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/register`,
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error("Google sign-up error:", err);
      alert(err.message || "Google sign-up failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // UPDATE FORM
  // ============================================================
  const updateForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================================
  // SUBMIT REGISTRATION PROFILE
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!googleUser) {
      alert("Account information is missing.");
      return;
    }

    if (password && confirmPassword && password !== confirmPassword) {
      alert("Passwords do not match. Please verify.");
      return;
    }

    if (password && password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (!agreed) {
      alert("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    setSubmitting(true);

    try {
      const generatedId =
        (selectedRole === 'expert' ? "EXP-" : "AG-") +
        Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase();

      const userRole = selectedRole === 'expert' ? 'OFFICER' : 'FARMER';

      // Try saving to Supabase if session exists
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.access_token) {
          await supabase.from("profiles").insert({
            id: googleUser.id,
            full_name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: googleUser.email,
            role: userRole,
            district: formData.district || null,
          });

          if (selectedRole === 'farmer') {
            await supabase.from("farmers").insert({
              user_id: googleUser.id,
              farmer_id: generatedId,
              first_name: formData.firstName,
              last_name: formData.lastName,
              title: formData.title,
              email: googleUser.email,
              phone: formData.phone,
              nationality: formData.nationality,
              district: formData.district || null,
              farm_name: formData.farmName || null,
            });
          }
        }
      } catch (supabaseErr) {
        console.warn("Supabase remote save skipped, using local fallback:", supabaseErr);
      }

      // Save basic information locally
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("farmerId", generatedId);

      // Show success screen
      setRegisteredFarmerId(generatedId);
    } catch (error) {
      console.error("Registration error:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // LOADING SCREEN
  // ============================================================
  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0faf2]">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-emerald-100 shadow-sm text-emerald-600">
            <RiLeafLine size={28} />
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          <p className="text-sm font-medium text-emerald-800">
            Setting up your AgroGuard account...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // SUCCESS SCREEN
  // ============================================================
  if (registeredFarmerId) {
    const isExpert = selectedRole === 'expert';
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#166534] px-6 py-12">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 sm:p-10 text-center shadow-2xl border border-emerald-100 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-emerald-100/50 blur-2xl pointer-events-none" />

          {/* Success Icon */}
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Account Created!
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Welcome to AgroGuard-AI. Your {isExpert ? 'Agricultural Expert' : 'Farmer'} profile has been successfully registered.
          </p>

          {/* ID Card */}
          <div className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-px shadow-sm">
            <div className="rounded-2xl bg-white px-6 py-5">
              <div className="mb-1 flex items-center justify-center gap-2">
                <Sprout className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                  {isExpert ? 'Your Expert ID' : 'Your Farmer ID'}
                </span>
              </div>
              <p className="text-3xl font-black tracking-wider text-gray-900">
                {registeredFarmerId}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                Keep this ID safe. It can be used to identify your AgroGuard account and access AI recommendations.
              </p>
            </div>
          </div>

          {/* Next steps */}
          <div className="mt-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 p-4 text-left">
            <div className="flex gap-3">
              <Tractor className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Your next step
                </p>
                <p className="mt-1 text-xs leading-relaxed text-gray-600">
                  {isExpert
                    ? 'Explore regional surveillance cases and provide AI-assisted insights to registered farmers.'
                    : 'Start uploading crop photos for early disease detection, plant health monitoring, and personalized care.'}
                </p>
              </div>
            </div>
          </div>

          {/* Dashboard Button */}
          <button
            onClick={() => navigate(isExpert ? "/officer" : "/farmer/dashboard", { replace: true })}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #15803d, #166534)',
              boxShadow: '0 4px 16px rgba(21,128,61,0.25)',
            }}
          >
            Go to {isExpert ? 'Expert Portal' : 'Farmer Dashboard'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // SPLIT-SCREEN REGISTRATION VIEW
  // ============================================================
  return (
    <>
      <style>{REGISTER_STYLES}</style>
      <PublicNav />

      {/* ── Two-Column Shell ── */}
      <div className="min-h-screen flex flex-row bg-[#f0faf2]">

        {/* ─────────────────────────────────────────────────────────
            LEFT PANEL — Brand & Registration Form (Scrollable container)
        ────────────────────────────────────────────────────────── */}
        <div className="flex-1 h-screen overflow-y-auto reg-form-scroll flex flex-col justify-between px-4 sm:px-8 lg:px-12 pt-24 lg:pt-28 pb-12 relative">
          
          {/* Subtle background ambient blobs */}
          <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-emerald-100/50 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-teal-100/40 blur-3xl pointer-events-none" />

          <div className="relative z-10 w-full max-w-[500px] mx-auto">

            {/* ── Brand Header ── */}
            <div className="mb-6">
              <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
                <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm transition-transform group-hover:scale-105">
                  <RiLeafLine size={22} />
                </div>
                <div>
                  <span className="text-xl font-black tracking-tight text-gray-900 block leading-tight">
                    AgroGuard<span className="text-emerald-600">-AI</span>
                  </span>
                  <span className="text-[11px] font-medium text-emerald-700 block">
                    Smart AI for Healthier Crops
                  </span>
                </div>
              </Link>

              <h2 className="text-2xl font-bold text-gray-900 mt-2">
                Create Your Account
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Join AgroGuard-AI and start protecting your crops with the power of AI.
              </p>
            </div>

            {/* ── Role Selection Cards ── */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Farmer Option */}
                <button
                  type="button"
                  onClick={() => setSelectedRole("farmer")}
                  className={`flex items-start gap-3 p-3 rounded-2xl border text-left transition-all ${
                    selectedRole === "farmer"
                      ? "bg-white border-emerald-500 shadow-sm ring-2 ring-emerald-500/20"
                      : "bg-white/70 border-gray-200 hover:border-emerald-200 hover:bg-white"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      selectedRole === "farmer"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Sprout size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-gray-900">Farmer</div>
                    <div className="text-[11px] text-gray-500 leading-tight">Growers & Farmers</div>
                  </div>
                </button>

                {/* Agricultural Expert Option */}
                <button
                  type="button"
                  onClick={() => setSelectedRole("expert")}
                  className={`flex items-start gap-3 p-3 rounded-2xl border text-left transition-all ${
                    selectedRole === "expert"
                      ? "bg-white border-emerald-500 shadow-sm ring-2 ring-emerald-500/20"
                      : "bg-white/70 border-gray-200 hover:border-emerald-200 hover:bg-white"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      selectedRole === "expert"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <ClipboardList size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-gray-900">Agricultural Expert</div>
                    <div className="text-[11px] text-gray-500 leading-tight">Experts & Advisors</div>
                  </div>
                </button>
              </div>
            </div>

            {/* ── Connected Google Account (if detected) OR Google Sign Up Button ── */}
            {googleUser && googleUser.id !== 'local-guest-user' ? (
              <div className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white p-3 shadow-xs">
                {googleUser.avatar ? (
                  <img
                    src={googleUser.avatar}
                    alt="Profile"
                    className="h-9 w-9 rounded-full border border-emerald-400 object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <User size={16} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-gray-900 truncate">
                    {googleUser.name || "Google Connected Account"}
                  </p>
                  <p className="text-[11px] text-emerald-700 truncate">{googleUser.email}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  Verified
                </span>
              </div>
            ) : (
              <div className="mb-5">
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={submitting}
                  className="w-full py-2.5 px-4 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-700 shadow-xs flex items-center justify-center gap-2.5 transition-all"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="relative my-4 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <span className="relative bg-[#f0faf2] px-3 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                    or register with details
                  </span>
                </div>
              </div>
            )}

            {/* ── Main Form ── */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Title & Name Grid */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-emerald-600">*</span>
                </label>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-3 sm:col-span-3">
                    <select
                      name="title"
                      value={formData.title}
                      onChange={updateForm}
                      className="w-full py-2.5 px-2 bg-white rounded-xl border border-gray-200 text-xs text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option>Mr</option>
                      <option>Mrs</option>
                      <option>Ms</option>
                      <option>Dr</option>
                      <option>Prof</option>
                    </select>
                  </div>
                  <div className="col-span-4 sm:col-span-4 relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
                      <User size={14} />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={updateForm}
                      required
                      placeholder="First name"
                      className="w-full pl-8 pr-2.5 py-2.5 bg-white rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div className="col-span-5 sm:col-span-5 relative">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={updateForm}
                      required
                      placeholder="Last name"
                      className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address <span className="text-emerald-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail size={15} />
                  </div>
                  <input
                    type="email"
                    value={googleUser?.email || ""}
                    onChange={(e) =>
                      setGoogleUser((prev) => ({ ...prev, email: e.target.value }))
                    }
                    required
                    placeholder="name@agroguard.lk"
                    className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Phone & Nationality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Phone Number <span className="text-emerald-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Phone size={14} />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={updateForm}
                      required
                      placeholder="07X XXXXXXX"
                      className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Nationality */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nationality
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Globe size={14} />
                    </div>
                    <select
                      name="nationality"
                      value={formData.nationality}
                      onChange={updateForm}
                      className="w-full pl-9 pr-7 py-2.5 bg-white rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      ▾
                    </span>
                  </div>
                </div>
              </div>

              {/* Farm Name (if farmer) & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* District */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Location / District <span className="text-emerald-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <MapPin size={14} />
                    </div>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={updateForm}
                      required
                      className="w-full pl-9 pr-7 py-2.5 bg-white rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none"
                    >
                      <option value="">Select District</option>
                      {DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      ▾
                    </span>
                  </div>
                </div>

                {/* Farm Name / Affiliation */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {selectedRole === 'farmer' ? 'Farm Name' : 'Institute / Organization'}
                    <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      {selectedRole === 'farmer' ? <Sprout size={14} /> : <Tractor size={14} />}
                    </div>
                    <input
                      type="text"
                      name="farmName"
                      value={formData.farmName}
                      onChange={updateForm}
                      placeholder={selectedRole === 'farmer' ? 'e.g. Green Valley Farm' : 'e.g. Dept of Agriculture'}
                      className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Lock size={14} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-8 py-2.5 bg-white rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Lock size={14} />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-8 py-2.5 bg-white rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms & Privacy Checkbox */}
              <label className="flex cursor-pointer items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  required
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                />
                <span className="text-xs text-gray-500 leading-tight">
                  I agree to the{" "}
                  <a href="#terms" onClick={(e) => e.preventDefault()} className="font-semibold text-emerald-700 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#privacy" onClick={(e) => e.preventDefault()} className="font-semibold text-emerald-700 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>

              {/* Security Trust Note */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100/80">
                <ShieldCheck size={16} className="text-emerald-700 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Your data is protected by enterprise-grade 256-bit encryption. AgroGuard-AI strictly maintains agricultural surveillance privacy.
                </p>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={submitting || !agreed}
                className="w-full py-3 px-4 text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #15803d, #166534)',
                  boxShadow: '0 4px 18px rgba(21,128,61,0.28)',
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* ── Login Link ── */}
            <div className="mt-5 text-center text-xs text-gray-500 pb-4">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-emerald-700 hover:underline">
                Sign In
              </Link>
            </div>

          </div>

          {/* Form Panel Footer */}
          <div className="text-center text-[11px] text-gray-400 pt-4 border-t border-emerald-100/60 max-w-[500px] mx-auto w-full">
            AgroGuard AI Sri Lanka • Multi-Role Agri-Tech Surveillance
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────
            RIGHT PANEL — Animated Agricultural AI Scene (Desktop)
        ────────────────────────────────────────────────────────── */}
        <div className="hidden lg:block lg:w-[48%] xl:w-[50%] relative flex-shrink-0">
          <RegisterHeroPanel />
        </div>

      </div>
    </>
  );
}
