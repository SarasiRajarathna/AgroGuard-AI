import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiLeafLine, RiShieldCheckLine, RiRadarLine, RiUserStarLine } from 'react-icons/ri';
import { FiArrowRight, FiLock, FiMail, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [role, setRole] = useState('farmer');
  const [email, setEmail] = useState('ruwan@farm.lk');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const roleCredentials = {
    farmer: { email: 'ruwan@farm.lk', name: 'Ruwan Perera', title: 'Paddy Farmer (Ampara)' },
    officer: { email: 'anura@agridept.gov.lk', name: 'Dr. Anura Bandara', title: 'Divisional Ag Officer' },
    research: { email: 'dhammika@cri.lk', name: 'Prof. Dhammika Silva', title: 'Chief Epidemiologist' },
    admin: { email: 'admin@agroguard.gov.lk', name: 'System Administrator', title: 'Central Operations' },
  };

  const handleRoleSelect = (newRole) => {
    setRole(newRole);
    setEmail(roleCredentials[newRole].email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(role);
      setLoading(false);
      navigate(`/${role}`);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left Branding Panel */}
      <div className="md:w-1/2 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white p-8 md:p-14 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <RiLeafLine size={28} />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                AgroGuard <span className="text-emerald-400 font-semibold">AI</span>
              </span>
              <p className="text-xs text-emerald-300 font-medium tracking-wide uppercase">National Crop Health Surveillance</p>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-8 leading-tight text-white/95">
            Intelligent Crop Disease Detection & Epidemic Early Warning.
          </h2>
          <p className="text-emerald-200/80 text-sm mt-3 leading-relaxed max-w-md">
            Empowering Sri Lankan agriculture with computer vision diagnostics, micro-climate pathogen risk modeling, and instant field officer escalation.
          </p>
        </div>

        {/* Workflow Highlights */}
        <div className="my-10 space-y-4 relative z-10">
          <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
              <RiLeafLine size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">AI Vision Analysis</h4>
              <p className="text-xs text-emerald-200/70">Instant leaf pathology classification with confidence metrics</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs">
            <div className="p-2 rounded-lg bg-teal-500/20 text-teal-300">
              <RiRadarLine size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Weather & Outbreak Correlation</h4>
              <p className="text-xs text-emerald-200/70">Dynamic spread risk index calculated from local humidity and rainfall</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
              <RiShieldCheckLine size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Closed-Loop Officer Verification</h4>
              <p className="text-xs text-emerald-200/70">Uncertain cases escalate to regional officers to refine AI knowledge</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-emerald-400/60 relative z-10 flex items-center justify-between border-t border-white/10 pt-4">
          <span>Department of Agriculture Sri Lanka</span>
          <span>Version 2.4-ai</span>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-16">
        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl p-8">
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-bold text-gray-900">Sign in to Portal</h3>
            <p className="text-xs text-gray-500 mt-1">Select your stakeholder profile to explore the system</p>
          </div>

          {/* Quick Role Selector */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Select Demo Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'farmer', label: 'Farmer', icon: '🌾' },
                { id: 'officer', label: 'Agri Officer', icon: '📋' },
                { id: 'research', label: 'Researcher', icon: '🔬' },
                { id: 'admin', label: 'Admin', icon: '⚙️' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleRoleSelect(item.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    role === item.id
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs ring-1 ring-emerald-400'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <div className="text-left leading-tight">
                    <div>{item.label}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-2 text-[11px] text-emerald-700 bg-emerald-50/70 p-2 rounded-lg flex items-center gap-1.5 border border-emerald-100">
              <FiCheckCircle size={13} className="text-emerald-600 flex-shrink-0" />
              <span>Acting as: <strong>{roleCredentials[role].name}</strong> ({roleCredentials[role].title})</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiMail size={16} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="name@organization.lk"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-700">Password</label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-xs text-emerald-600 hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiLock size={16} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                <span>Keep me signed in</span>
              </label>
              <span className="text-emerald-700 font-medium">SSL Encrypted</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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

          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
            AgroGuard AI Sri Lanka • Multi-Role Agri-Tech Surveillance
          </div>
        </div>
      </div>
    </div>
  );
}