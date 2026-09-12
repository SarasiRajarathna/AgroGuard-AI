import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClipboard, FiClock, FiCheckCircle, FiMapPin, FiCalendar, FiArrowRight, FiSearch, FiFilter, FiAlertTriangle } from 'react-icons/fi';
import { RiShieldCheckLine, RiTruckLine } from 'react-icons/ri';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import Loading from '../../components/Loading';
import { casesAPI, visitsAPI, adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function OfficerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cases, setCases] = useState([]);
  const [visits, setVisits] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadOfficerData() {
      try {
        setLoading(true);
        const [casesRes, visitsRes, statsRes] = await Promise.all([
          casesAPI.getAll({ role: 'officer' }).catch(() => ({ data: [] })),
          visitsAPI.getAll().catch(() => ({ data: [] })),
          adminAPI.getStats('officer').catch(() => ({ data: null })),
        ]);

        if (isMounted) {
          if (casesRes.data) setCases(casesRes.data);
          if (visitsRes.data) setVisits(visitsRes.data);
          if (statsRes.data) setStats(statsRes.data);
        }
      } catch (err) {
        console.error('[OfficerDashboard] Failed to load officer data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadOfficerData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter cases
  const filteredCases = cases.filter(c => {
    const matchesSearch =
      c.cropType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.farmerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.disease?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const pendingReview = stats?.pendingReview ?? cases.filter(c => c.status === 'pending' || c.status === 'escalated').length;
  const scheduledVisits = stats?.fieldVisitsToday ?? visits.filter(v => v.status === 'scheduled').length;
  const confirmedCases = stats?.confirmedThisWeek ?? cases.filter(c => c.status === 'confirmed').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Officer Portal: ${user?.name || 'Dr. Anura Bandara'}`}
        subtitle="Divisional Agricultural Office • Eastern Province Case Verification & Extension Pipeline"
        action={
          <button
            onClick={() => navigate('/officer/visits')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
          >
            <FiCalendar size={16} />
            <span>Manage Field Visits ({scheduledVisits})</span>
          </button>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Cases Awaiting Review"
          value={pendingReview}
          icon={FiClock}
          iconBg="bg-amber-50 text-amber-600"
          trend="Action Needed"
          trendType="down"
          subtitle="AI flagged / escalated"
        />
        <StatCard
          title="Field Visits Scheduled"
          value={scheduledVisits}
          icon={RiTruckLine}
          iconBg="bg-blue-50 text-blue-600"
          subtitle="This week's queue"
        />
        <StatCard
          title="Confirmed This Month"
          value={confirmedCases}
          icon={FiCheckCircle}
          iconBg="bg-emerald-50 text-emerald-600"
          trend="+18%"
          trendType="up"
          subtitle="Fed back to AI training"
        />
        <StatCard
          title="Active Outbreak Alerts"
          value={2}
          icon={FiAlertTriangle}
          iconBg="bg-rose-50 text-rose-600"
          subtitle="Paddy Blast & Blight"
        />
      </div>

      {/* Priority Escalation Attention Banner */}
      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-purple-600 text-white rounded-xl shadow-xs mt-0.5">
            <FiClipboard size={20} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">2 Escalated Cases Require Field Verification</h4>
            <p className="text-xs text-gray-600 mt-0.5">
              Farmers reported atypical symptom spreading. Verify pathogen identity before recommending high-potency systemic fungicides.
            </p>
          </div>
        </div>
        <button
          onClick={() => setStatusFilter('escalated')}
          className="whitespace-nowrap px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          View Escalated Queue
        </button>
      </div>

      {/* Case Management Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 md:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3.5 top-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by farmer, crop, disease, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Statuses</option>
              <option value="escalated">Escalated</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/80 text-gray-500 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-5 py-3.5">Case ID</th>
                <th className="px-5 py-3.5">Farmer & Location</th>
                <th className="px-5 py-3.5">Crop & Disease</th>
                <th className="px-5 py-3.5">AI Confidence</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Submitted</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCases.length > 0 ? (
                filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-gray-900">{c.id}</td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900">{c.farmerName}</div>
                      <div className="text-gray-400 text-[11px] flex items-center gap-1 mt-0.5">
                        <FiMapPin size={11} /> {c.location}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900">{c.disease}</div>
                      <div className="text-gray-400 text-[11px]">{c.cropType} {c.variety ? `(${c.variety})` : ''}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              c.confidence >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${c.confidence}%` }}
                          />
                        </div>
                        <span className="font-bold text-gray-900">{c.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {new Date(c.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => navigate(`/officer/case/${c.id}`)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-lg transition-colors"
                      >
                        <span>Review</span>
                        <FiArrowRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8">
                    <EmptyState
                      title="No matching cases found"
                      message="Try adjusting your search criteria or status filter."
                      actionLabel="Show All Cases"
                      onAction={() => { setSearchTerm(''); setStatusFilter('all'); }}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}