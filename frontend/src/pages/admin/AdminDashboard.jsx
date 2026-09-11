import { useState } from 'react';
import { FiUsers, FiShield, FiAlertTriangle, FiCheckCircle, FiPlus, FiSend, FiSearch, FiServer, FiRadio, FiActivity } from 'react-icons/fi';
import { RiShieldKeyholeLine, RiBroadcastLine, RiCpuLine } from 'react-icons/ri';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';
import StatusBadge from '../../components/StatusBadge';

export default function AdminDashboard() {
  const [toastMessage, setToastMessage] = useState(null);
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Broadcast form state
  const [province, setProvince] = useState('Eastern Province');
  const [threatLevel, setThreatLevel] = useState('Critical');
  const [cropTarget, setCropTarget] = useState('Paddy (Rice)');
  const [broadcastMessage, setBroadcastMessage] = useState(
    'ALERT: Blast disease spore count elevated in Eastern Province. Inspect fields immediately & drain excess standing water.'
  );

  const [users, setUsers] = useState([
    { id: 1, name: 'Ruwan Perera', email: 'ruwan@farm.lk', role: 'Farmer', location: 'Ampara', status: 'Active', cases: 14 },
    { id: 2, name: 'Dr. Anura Bandara', email: 'anura@agridept.gov.lk', role: 'Agri Officer', location: 'Batticaloa & Ampara', status: 'Active', cases: 48 },
    { id: 3, name: 'Prof. Dhammika Silva', email: 'dhammika@cri.lk', role: 'Research Officer', location: 'Peradeniya CRI', status: 'Active', cases: 120 },
    { id: 4, name: 'Kusum Wickramasinghe', email: 'kusum@farm.lk', role: 'Farmer', location: 'Polonnaruwa', status: 'Active', cases: 6 },
    { id: 5, name: 'S. Thevarajah', email: 'thevarajah@agri.gov.lk', role: 'Agri Officer', location: 'Jaffna', status: 'Active', cases: 31 },
  ]);

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    setBroadcastModalOpen(false);
    setToastMessage(`Early Warning SMS & Push Broadcast successfully transmitted to 340 farmers in ${province}!`);
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}

      <PageHeader
        title="Operations Control & System Administration"
        subtitle="Department of Agriculture • Infrastructure, Security, User Directory & Warning Broadcast System"
        action={
          <button
            onClick={() => setBroadcastModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
          >
            <RiBroadcastLine size={16} />
            <span>Broadcast Regional Alert</span>
          </button>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Registered Farmers"
          value="1,240"
          icon={FiUsers}
          iconBg="bg-emerald-50 text-emerald-600"
          trend="+84 this week"
          trendType="up"
          subtitle="Eastern & Central"
        />
        <StatCard
          title="Active Extension Officers"
          value="42"
          icon={FiShield}
          iconBg="bg-blue-50 text-blue-600"
          subtitle="9 Provincial Divisions"
        />
        <StatCard
          title="Early Warning SMS Sent"
          value="5,890"
          icon={RiBroadcastLine}
          iconBg="bg-amber-50 text-amber-600"
          subtitle="99.4% delivery rate"
        />
        <StatCard
          title="AI Pipeline Latency"
          value="340 ms"
          icon={RiCpuLine}
          iconBg="bg-purple-50 text-purple-600"
          trend="Normal"
          trendType="up"
          subtitle="Gemini Vision model"
        />
      </div>

      {/* System Service Health Status */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
        <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
          <FiServer className="text-emerald-700" size={18} />
          <span>Core Infrastructure & Microservice Health</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900">Gemini Vision AI</p>
              <span className="text-gray-400">Diagnosis Classifier</span>
            </div>
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online
            </span>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900">Weather API Telemetry</p>
              <span className="text-gray-400">Rainfall & Humidity Sync</span>
            </div>
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online
            </span>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900">Cellular SMS Broadcast</p>
              <span className="text-gray-400">Farm Early Warning</span>
            </div>
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online
            </span>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900">Supabase Relational DB</p>
              <span className="text-gray-400">Case & Model Knowledge</span>
            </div>
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online
            </span>
          </div>
        </div>
      </div>

      {/* Stakeholder Directory */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 md:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Authorized Stakeholder Directory</h3>
            <p className="text-xs text-gray-500">Manage user access across farmers, officers, and researchers</p>
          </div>

          <div className="relative max-w-xs w-full">
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Assigned Region</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Activity</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/60">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-gray-900">{u.name}</div>
                    <div className="text-[11px] text-gray-400">{u.email}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-700">{u.location}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-700">{u.cases} cases logged</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setToastMessage(`Account settings opened for ${u.name}`)}
                      className="text-xs text-emerald-700 hover:underline font-semibold"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Regional Alert Modal */}
      <Modal
        isOpen={broadcastModalOpen}
        onClose={() => setBroadcastModalOpen(false)}
        title="Broadcast Regional Outbreak Warning"
      >
        <form onSubmit={handleSendBroadcast} className="space-y-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
            <FiAlertTriangle className="flex-shrink-0 mt-0.5 text-red-600" size={16} />
            <span>
              This will trigger priority SMS and in-app alert notifications to all registered farmers and officers within the target province.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Target Province *</label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Eastern Province">Eastern Province</option>
                <option value="Central Province">Central Province</option>
                <option value="North Central">North Central</option>
                <option value="North Western">North Western</option>
                <option value="Southern Province">Southern Province</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Threat Level *</label>
              <select
                value={threatLevel}
                onChange={(e) => setThreatLevel(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Critical">Critical (Immediate Containment)</option>
                <option value="Elevated">Elevated (Active Watch)</option>
                <option value="Advisory">Advisory (Preventive)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Target Crop</label>
            <input
              type="text"
              value={cropTarget}
              onChange={(e) => setCropTarget(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Broadcast SMS Text *</label>
            <textarea
              required
              rows={3}
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setBroadcastModalOpen(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-700 text-white rounded-xl text-xs font-semibold hover:bg-rose-800 flex items-center gap-1.5"
            >
              <FiSend size={14} />
              <span>Send Broadcast</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}