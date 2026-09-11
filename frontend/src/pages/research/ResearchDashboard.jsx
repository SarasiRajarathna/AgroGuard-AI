import { useState } from 'react';
import { FiDownload, FiBarChart2, FiActivity, FiMapPin, FiCalendar, FiFilter, FiTrendingUp, FiCloudRain, FiShield } from 'react-icons/fi';
import { RiRadarLine, RiLeafLine, RiPulseLine } from 'react-icons/ri';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import Toast from '../../components/Toast';
import { mockOutbreaks, mockCases } from '../../services/api';

export default function ResearchDashboard() {
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState('all');

  const provinces = [
    { name: 'Eastern Province', cases: 84, risk: 'Critical', activeDisease: 'Paddy Blast', farmsAtRisk: 140, color: 'bg-red-500' },
    { name: 'Central Province', cases: 42, risk: 'High', activeDisease: 'Tea Blister Blight', farmsAtRisk: 75, color: 'bg-orange-500' },
    { name: 'North Central', cases: 61, risk: 'High', activeDisease: 'Sheath Blight', farmsAtRisk: 110, color: 'bg-amber-500' },
    { name: 'North Western', cases: 29, risk: 'Moderate', activeDisease: 'Bacterial Wilt', farmsAtRisk: 45, color: 'bg-yellow-500' },
    { name: 'Western Province', cases: 14, risk: 'Low', activeDisease: 'Powdery Mildew', farmsAtRisk: 20, color: 'bg-emerald-500' },
    { name: 'Southern Province', cases: 18, risk: 'Low', activeDisease: 'Cinnamon Stripe', farmsAtRisk: 28, color: 'bg-emerald-500' },
  ];

  const handleExport = () => {
    setToastMessage('Exporting Epidemiological Surveillance Report (GeoJSON & CSV)...');
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="info"
          onClose={() => setToastMessage(null)}
        />
      )}

      <PageHeader
        title="Pathogen Surveillance & Epidemiological Analytics"
        subtitle="Crop Research Institute & National Agriculture Epidemiology Network • Real-time Spore Dynamics"
        action={
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
          >
            <FiDownload size={16} />
            <span>Export Surveillance Dataset</span>
          </button>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Outbreak Clusters"
          value="4 Zones"
          icon={RiRadarLine}
          iconBg="bg-rose-50 text-rose-600"
          trend="+1 zone"
          trendType="down"
          subtitle="Eastern & Central focal points"
        />
        <StatCard
          title="Specimens Analyzed"
          value="1,482"
          icon={RiPulseLine}
          iconBg="bg-blue-50 text-blue-600"
          trend="+14.2%"
          trendType="up"
          subtitle="YTD telemetry feeds"
        />
        <StatCard
          title="AI Classification Precision"
          value="94.6%"
          icon={FiShield}
          iconBg="bg-emerald-50 text-emerald-600"
          subtitle="Ground-truthed by Ag Officers"
        />
        <StatCard
          title="Weather Infection Coeff."
          value="r = 0.84"
          icon={FiCloudRain}
          iconBg="bg-purple-50 text-purple-600"
          subtitle="Strong humidity correlation"
        />
      </div>

      {/* Regional Surveillance Grid & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Outbreak Geography */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Provincial Epidemic Risk Map & Spatial Density</h3>
              <p className="text-xs text-gray-500">Cross-referenced with micro-meteorological radar and sentinel farm reports</p>
            </div>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Live Feed Active
            </span>
          </div>

          {/* Geospatial grid cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {provinces.map((prov) => (
              <div
                key={prov.name}
                className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-xs transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-xs">{prov.name}</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${prov.color}`} />
                </div>

                <div className="text-xs space-y-1 text-gray-600">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Threat Level:</span>
                    <span className="font-semibold text-gray-800">{prov.risk}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Primary Pathogen:</span>
                    <span className="font-semibold text-emerald-700 truncate max-w-[110px]">{prov.activeDisease}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Farms at Risk:</span>
                    <span className="font-bold text-gray-900">{prov.farmsAtRisk}</span>
                  </div>
                </div>

                {/* Risk Bar */}
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full ${prov.color}`}
                    style={{ width: `${(prov.cases / 100) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Climate & Pathogen Correlation Engine */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900 text-base">Climatic Pathogen Drivers</h3>
            <p className="text-xs text-gray-500">Environmental thresholds accelerating spore burst</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1">
              <div className="flex justify-between font-bold text-blue-900">
                <span>Relative Humidity &gt; 85%</span>
                <span className="text-red-600">+64% Spore Viability</span>
              </div>
              <p className="text-blue-800/80">
                Extended night leaf moisture promotes rapid germination of <em>Magnaporthe oryzae</em>.
              </p>
            </div>

            <div className="p-3 bg-orange-50/70 border border-orange-100 rounded-xl space-y-1">
              <div className="flex justify-between font-bold text-orange-900">
                <span>Temperature (25°C - 29°C)</span>
                <span className="text-orange-700">Optimal Growth</span>
              </div>
              <p className="text-orange-800/80">
                Peak enzyme secretion and cellular penetration within 12 hours of dew deposit.
              </p>
            </div>

            <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl space-y-1">
              <div className="flex justify-between font-bold text-purple-900">
                <span>Wind Spore Dispersion Radius</span>
                <span className="text-purple-700">6.5 km / 24h</span>
              </div>
              <p className="text-purple-800/80">
                Current monsoonal gusts create immediate drift hazard for downwind paddy fields.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Disease Incidence Trend Visualization (CSS/SVG Based) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Monthly Pathogen Incidence Trajectory</h3>
            <p className="text-xs text-gray-500">Comparing confirmed cases across major commercial crops (YTD)</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-3 h-3 rounded-full bg-emerald-600" /> Paddy Blast
            </span>
            <span className="flex items-center gap-1.5 text-blue-700">
              <span className="w-3 h-3 rounded-full bg-blue-600" /> Tea Blister Blight
            </span>
            <span className="flex items-center gap-1.5 text-amber-700">
              <span className="w-3 h-3 rounded-full bg-amber-500" /> Sheath Blight
            </span>
          </div>
        </div>

        {/* Bar chart mockup */}
        <div className="pt-4 pb-2">
          <div className="h-44 flex items-end justify-between gap-3 px-2 border-b border-gray-200">
            {[
              { month: 'Apr', blast: 40, blight: 25, sheath: 15 },
              { month: 'May', blast: 55, blight: 35, sheath: 28 },
              { month: 'Jun', blast: 70, blight: 50, sheath: 42 },
              { month: 'Jul', blast: 85, blight: 40, sheath: 60 },
              { month: 'Aug', blast: 95, blight: 65, sheath: 45 },
              { month: 'Sep (Now)', blast: 112, blight: 55, sheath: 70 },
            ].map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="w-full max-w-[50px] flex items-end justify-center gap-1 h-full">
                  <div
                    className="w-3 bg-emerald-600 hover:bg-emerald-700 rounded-t transition-all"
                    style={{ height: `${(d.blast / 120) * 100}%` }}
                    title={`Paddy Blast: ${d.blast}`}
                  />
                  <div
                    className="w-3 bg-blue-600 hover:bg-blue-700 rounded-t transition-all"
                    style={{ height: `${(d.blight / 120) * 100}%` }}
                    title={`Tea Blister: ${d.blight}`}
                  />
                  <div
                    className="w-3 bg-amber-500 hover:bg-amber-600 rounded-t transition-all"
                    style={{ height: `${(d.sheath / 120) * 100}%` }}
                    title={`Sheath Blight: ${d.sheath}`}
                  />
                </div>
                <span className="text-[11px] font-medium text-gray-500">{d.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}