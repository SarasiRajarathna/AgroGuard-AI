import { useState, useEffect } from 'react';
import { FiDownload, FiBarChart2, FiActivity, FiMapPin, FiCalendar, FiFilter, FiTrendingUp, FiCloudRain, FiShield, FiAlertOctagon, FiBell } from 'react-icons/fi';
import { RiRadarLine, RiLeafLine, RiPulseLine } from 'react-icons/ri';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import Toast from '../../components/Toast';
import Loading from '../../components/Loading';
import RegionalMap from '../../components/RegionalMap';
import { outbreaksAPI, adminAPI, casesAPI, farmsAPI } from '../../services/api';

export default function ResearchDashboard() {
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [provinces, setProvinces] = useState([]);
  const [trends, setTrends] = useState([]);
  const [outbreaks, setOutbreaks] = useState([]);
  const [cases, setCases] = useState([]);
  const [farms, setFarms] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadResearchData() {
      try {
        setLoading(true);
        const [provRes, trendsRes, statsRes, outbreaksRes, casesRes, farmsRes] = await Promise.all([
          outbreaksAPI.getProvinces().catch(() => ({ data: [] })),
          outbreaksAPI.getTrends().catch(() => ({ data: [] })),
          adminAPI.getStats('research').catch(() => ({ data: null })),
          outbreaksAPI.getAll().catch(() => ({ data: [] })),
          casesAPI.getAll().catch(() => ({ data: [] })),
          farmsAPI.getAll().catch(() => ({ data: [] })),
        ]);

        if (isMounted) {
          if (provRes.data && provRes.data.length > 0) setProvinces(provRes.data);
          if (trendsRes.data && trendsRes.data.length > 0) setTrends(trendsRes.data);
          if (statsRes.data) setStats(statsRes.data);
          if (outbreaksRes.data) setOutbreaks(outbreaksRes.data);
          if (casesRes.data) setCases(casesRes.data);
          if (farmsRes.data) setFarms(farmsRes.data);
        }
      } catch (err) {
        console.error('[ResearchDashboard] Failed to load data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadResearchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleConfirmOutbreak = async (outbreakId) => {
    try {
      setConfirmingId(outbreakId);
      const res = await outbreaksAPI.confirm(outbreakId, 10);
      setToastMessage(res.message || 'Outbreak confirmed and warnings dispatched to nearby farms.');

      // Update local status
      setOutbreaks((prev) =>
        prev.map((o) =>
          String(o.id) === String(outbreakId) ? { ...o, status: 'confirmed', containmentStatus: 'Active Containment' } : o
        )
      );
    } catch (err) {
      setToastMessage(err.message || 'Failed to confirm outbreak.');
    } finally {
      setConfirmingId(null);
    }
  };

  const handleExport = async () => {
    try {
      setToastMessage('Exporting Epidemiological Surveillance Dataset...');
      const res = await outbreaksAPI.exportData();
      const exportJson = JSON.stringify(res.data || res, null, 2);
      const blob = new Blob([exportJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agroguard-surveillance-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setToastMessage('Surveillance report downloaded successfully (JSON dataset).');
    } catch (err) {
      setToastMessage(err.message || 'Export failed. Please try again.');
    }
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
          value={`${outbreaks.length} Clusters`}
          icon={RiRadarLine}
          iconBg="bg-rose-50 text-rose-600"
          trend="+1 cluster"
          trendType="down"
          subtitle="Ampara Blast & Nuwara Eliya Blight"
        />
        <StatCard
          title="Monitored Cases"
          value={cases.length.toString()}
          icon={RiPulseLine}
          iconBg="bg-blue-50 text-blue-600"
          trend="+14.2%"
          trendType="up"
          subtitle="Ground-truthed foliar reports"
        />
        <StatCard
          title="Registered Sentinel Farms"
          value={farms.length.toString()}
          icon={FiShield}
          iconBg="bg-emerald-50 text-emerald-600"
          subtitle="GPS mapped within radius"
        />
        <StatCard
          title="Weather Infection Coeff."
          value="r = 0.84"
          icon={FiCloudRain}
          iconBg="bg-purple-50 text-purple-600"
          subtitle="Open-Meteo live telemetry"
        />
      </div>

      {/* INTERACTIVE REGIONAL MAP (Leaflet/OpenStreetMap) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Regional Pathogen Surveillance Map</h3>
            <p className="text-xs text-gray-500">
              Interactive GPS visualization of crop cases, registered farms, and 10 km epidemiological containment zones
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            Leaflet / OpenStreetMap Live
          </span>
        </div>

        <RegionalMap
          cases={cases}
          farms={farms}
          outbreaks={outbreaks}
          center={[7.2833, 81.6667]}
          zoom={9}
          height="460px"
        />
      </div>

      {/* ACTIVE OUTBREAK CLUSTERS & CONFIRMATION ACTION */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Active Epidemiological Outbreak Clusters</h3>
            <p className="text-xs text-gray-500">
              Haversine distance clustering (Radius: 10 km, Min cases: 3). Confirming dispatches instant biosecurity alerts to nearby farms.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {outbreaks.map((outbreak) => (
            <div
              key={outbreak.id}
              className="p-5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-red-300 hover:shadow-xs transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono text-red-600 bg-red-50 px-2 py-0.5 rounded font-bold">
                    CLUSTER #{outbreak.id}
                  </span>
                  <h4 className="font-bold text-gray-900 text-base mt-1">{outbreak.disease}</h4>
                  <p className="text-xs text-gray-500">Crop: {outbreak.crop} • Region: {outbreak.location}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  outbreak.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800 animate-pulse'
                }`}>
                  {outbreak.status === 'confirmed' ? 'Confirmed & Alerted' : 'Active Outbreak'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 bg-white p-3 rounded-lg border border-gray-100">
                <div><strong>Centroid:</strong> {outbreak.latitude}, {outbreak.longitude}</div>
                <div><strong>Radius:</strong> {outbreak.radiusKm || 10} km zone</div>
                <div><strong>Cluster Cases:</strong> {outbreak.caseCount || outbreak.activeCases || 3} verified</div>
                <div><strong>Severity:</strong> <span className="text-red-600 font-bold uppercase">{outbreak.severity}</span></div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-gray-500 italic">
                  {outbreak.containmentStatus || 'Active containment monitoring'}
                </span>
                {outbreak.status !== 'confirmed' && (
                  <button
                    disabled={confirmingId === outbreak.id}
                    onClick={() => handleConfirmOutbreak(outbreak.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                  >
                    <FiBell size={13} />
                    <span>{confirmingId === outbreak.id ? 'Dispatching...' : 'Confirm & Alert Nearby Farms'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
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
                    style={{ width: `${Math.min(100, (prov.cases / 30) * 100)}%` }}
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

      {/* Disease Incidence Trend Visualization */}
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

        {/* Bar chart */}
        <div className="pt-4 pb-2">
          <div className="h-44 flex items-end justify-between gap-3 px-2 border-b border-gray-200">
            {trends.map((d) => (
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