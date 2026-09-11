import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiAlertTriangle, FiCheckCircle, FiClock, FiCloudRain, FiThermometer, FiDroplet, FiMapPin, FiFilter } from 'react-icons/fi';
import { RiLeafLine, RiShieldCrossLine, RiRadarLine } from 'react-icons/ri';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import DiseaseCard from '../../components/DiseaseCard';
import EmptyState from '../../components/EmptyState';
import { mockCases, mockOutbreaks } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');

  // Filter cases for the farmer
  const farmerCases = mockCases.filter(c => filter === 'all' || c.status === filter);
  
  // Calculate farmer metrics
  const total = mockCases.length;
  const confirmed = mockCases.filter(c => c.status === 'confirmed').length;
  const pending = mockCases.filter(c => c.status === 'pending' || c.status === 'escalated').length;
  const highRisk = mockCases.filter(c => c.spreadRisk >= 70).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={`Ayubowan, ${user?.name?.split(' ')[0] || 'Ruwan'}`}
        subtitle={`Farm: ${user?.farmLocation || 'Ampara, Eastern Province'} • Real-time Crop Protection Overview`}
        action={
          <button
            onClick={() => navigate('/farmer/new-case')}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all"
          >
            <FiPlus size={18} />
            <span>New Crop Diagnosis</span>
          </button>
        }
      />

      {/* Regional Warning Alert Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-200 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-sm mt-0.5">
            <FiAlertTriangle size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                Active Regional Alert
              </span>
              <span className="text-xs text-amber-800 font-medium">Eastern Province • Paddy Cluster</span>
            </div>
            <h3 className="font-bold text-gray-900 text-sm md:text-base mt-1">
              High Risk of Blast Disease Spore Spread
            </h3>
            <p className="text-xs md:text-sm text-gray-600 mt-0.5">
              Persistent humidity (88%) and 28°C temperatures favor rapid fungal propagation. 3 neighbor holdings flagged within 4.2 km.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/farmer/new-case')}
          className="whitespace-nowrap px-3.5 py-2 bg-white hover:bg-gray-50 border border-amber-300 text-amber-900 font-semibold text-xs rounded-xl shadow-xs transition-colors"
        >
          Inspect My Field Now
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Diagnoses"
          value={total}
          icon={RiLeafLine}
          iconBg="bg-emerald-50 text-emerald-600"
          subtitle="All crops submitted"
        />
        <StatCard
          title="Confirmed Diseases"
          value={confirmed}
          icon={FiCheckCircle}
          iconBg="bg-green-50 text-green-600"
          trend="+2"
          trendType="up"
          subtitle="Validated by AI/Officer"
        />
        <StatCard
          title="In Review / Escalated"
          value={pending}
          icon={FiClock}
          iconBg="bg-amber-50 text-amber-600"
          subtitle="Under expert evaluation"
        />
        <StatCard
          title="High Spread Risks"
          value={highRisk}
          icon={RiRadarLine}
          iconBg="bg-rose-50 text-rose-600"
          trend="Alert"
          trendType="down"
          subtitle="Spore threat active"
        />
      </div>

      {/* Weather & Micro-climate Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <FiCloudRain className="text-blue-600" size={20} />
            <h3 className="font-bold text-gray-900 text-sm">Farm Micro-Climate Conditions & Pathogen Index</h3>
          </div>
          <span className="text-xs text-gray-500">Live feed • Ampara Station</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg">
              <FiDroplet size={20} />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-medium">Relative Humidity</p>
              <p className="text-lg font-bold text-gray-900">87%</p>
              <span className="text-[10px] text-amber-700 font-medium">High fungal viability</span>
            </div>
          </div>

          <div className="p-3.5 bg-orange-50/50 rounded-xl border border-orange-100 flex items-center gap-3">
            <div className="p-2.5 bg-orange-100 text-orange-700 rounded-lg">
              <FiThermometer size={20} />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-medium">Surface Temp</p>
              <p className="text-lg font-bold text-gray-900">28.4°C</p>
              <span className="text-[10px] text-emerald-700 font-medium">Optimal vegetative</span>
            </div>
          </div>

          <div className="p-3.5 bg-teal-50/50 rounded-xl border border-teal-100 flex items-center gap-3">
            <div className="p-2.5 bg-teal-100 text-teal-700 rounded-lg">
              <FiCloudRain size={20} />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-medium">Expected Rain</p>
              <p className="text-lg font-bold text-gray-900">14 mm</p>
              <span className="text-[10px] text-blue-700 font-medium">Leaf wetness 6+ hrs</span>
            </div>
          </div>

          <div className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-100 flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 text-purple-700 rounded-lg">
              <RiRadarLine size={20} />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-medium">Infection Forecast</p>
              <p className="text-lg font-bold text-purple-900">Elevated</p>
              <span className="text-[10px] text-purple-700 font-medium">Blast & Blight Watch</span>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnoses List Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Crop Health Records & AI Diagnoses</h3>
            <p className="text-xs text-gray-500">Track and review symptom progression and treatment schedules</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl self-start sm:self-auto text-xs">
            {['all', 'confirmed', 'pending', 'escalated'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded-lg font-medium capitalize transition-all ${
                  filter === status
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {farmerCases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {farmerCases.map((c) => (
              <DiseaseCard
                key={c.id}
                caseItem={c}
                onClick={() => navigate(`/farmer/diagnosis/${c.id}`)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No records matching filter"
            message="No cases match your selected status filter."
            actionLabel="Reset Filter"
            onAction={() => setFilter('all')}
          />
        )}
      </div>
    </div>
  );
}