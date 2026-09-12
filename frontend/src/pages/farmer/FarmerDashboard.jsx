import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiAlertTriangle, FiCheckCircle, FiClock, FiCloudRain, FiThermometer, FiDroplet, FiMapPin, FiFilter } from 'react-icons/fi';
import { RiLeafLine, RiShieldCrossLine, RiRadarLine } from 'react-icons/ri';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import DiseaseCard from '../../components/DiseaseCard';
import EmptyState from '../../components/EmptyState';
import Loading from '../../components/Loading';
import { casesAPI, adminAPI, weatherAPI, alertsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState(null);
  const [weather, setWeather] = useState(null);
  const [activeAlert, setActiveAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setLoading(true);
        const [casesRes, statsRes, weatherRes, alertsRes] = await Promise.all([
          casesAPI.getAll({ role: 'farmer' }).catch(() => ({ data: [] })),
          adminAPI.getStats('farmer').catch(() => ({ data: null })),
          weatherAPI.getCurrent(user?.farmLocation || 'Ampara').catch(() => ({ data: null })),
          alertsAPI.getActive().catch(() => ({ data: [] })),
        ]);

        if (isMounted) {
          if (casesRes.data) setCases(casesRes.data);
          if (statsRes.data) setStats(statsRes.data);
          if (weatherRes.data) setWeather(weatherRes.data);
          if (alertsRes.data && alertsRes.data.length > 0) {
            setActiveAlert(alertsRes.data[0]);
          }
        }
      } catch (err) {
        console.error('[FarmerDashboard] Failed to fetch dashboard data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Filter cases for current farmer tab
  const farmerCases = cases.filter(c => filter === 'all' || c.status === filter);

  // Compute metrics from real cases if backend stats not loaded yet
  const total = stats?.totalCases ?? cases.length;
  const confirmed = stats?.confirmedCases ?? cases.filter(c => c.status === 'confirmed').length;
  const pending = stats?.activeCases ?? cases.filter(c => c.status === 'pending' || c.status === 'escalated').length;
  const highRisk = stats?.highRisk ?? cases.filter(c => c.spreadRisk >= 70).length;

  const currentTemp = weather?.current?.temp ?? 28.4;
  const currentHumidity = weather?.current?.humidity ?? 87;
  const currentRain = weather?.current?.rainfall ?? 14;
  const forecastText = weather?.forecastIndex ?? 'Elevated';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={`${t('farmerGreeting')}, ${user?.name?.split(' ')[0] || 'Ruwan'}`}
        subtitle={`Farm: ${user?.farmLocation || user?.location || 'Ampara, Eastern Province'} • ${t('farmerSubtitle')}`}
        action={
          <button
            onClick={() => navigate('/farmer/new-case')}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all"
          >
            <FiPlus size={18} />
            <span>{t('newCropDiagnosisBtn')}</span>
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
                {t('activeRegionalAlert')}
              </span>
              <span className="text-xs text-amber-800 font-medium">
                {activeAlert?.province || 'Eastern Province'} • {activeAlert?.cropTarget || 'Paddy Cluster'}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-sm md:text-base mt-1">
              {activeAlert?.threatLevel ? `${activeAlert.threatLevel}: ` : ''}{t('highSporeRisk')}
            </h3>
            <p className="text-xs md:text-sm text-gray-600 mt-0.5">
              {activeAlert?.message || 'Persistent humidity and optimal temperatures favor rapid fungal propagation. Holdings flagged.'}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/farmer/new-case')}
          className="whitespace-nowrap px-3.5 py-2 bg-white hover:bg-gray-50 border border-amber-300 text-amber-900 font-semibold text-xs rounded-xl shadow-xs transition-colors"
        >
          {t('inspectFieldBtn')}
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('statTotalDiagnoses')}
          value={total}
          icon={RiLeafLine}
          iconBg="bg-emerald-50 text-emerald-600"
          subtitle={t('statAllCropsSub')}
        />
        <StatCard
          title={t('statConfirmedDiseases')}
          value={confirmed}
          icon={FiCheckCircle}
          iconBg="bg-green-50 text-green-600"
          trend="+2"
          trendType="up"
          subtitle={t('statValidatedSub')}
        />
        <StatCard
          title={t('statInReview')}
          value={pending}
          icon={FiClock}
          iconBg="bg-amber-50 text-amber-600"
          subtitle={t('statUnderEvalSub')}
        />
        <StatCard
          title={t('statHighSpreadRisks')}
          value={highRisk}
          icon={RiRadarLine}
          iconBg="bg-rose-50 text-rose-600"
          trend="Alert"
          trendType="down"
          subtitle={t('statSporeActiveSub')}
        />
      </div>

      {/* Weather & Micro-climate Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <FiCloudRain className="text-blue-600" size={20} />
            <h3 className="font-bold text-gray-900 text-sm">{t('microclimateTitle')}</h3>
          </div>
          <span className="text-xs text-gray-500">{t('liveFeed')} • {weather?.location || 'Ampara Station'}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg">
              <FiDroplet size={20} />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-medium">{t('relativeHumidity')}</p>
              <p className="text-lg font-bold text-gray-900">{currentHumidity}%</p>
              <span className="text-[10px] text-amber-700 font-medium">{t('highFungalViability')}</span>
            </div>
          </div>

          <div className="p-3.5 bg-orange-50/50 rounded-xl border border-orange-100 flex items-center gap-3">
            <div className="p-2.5 bg-orange-100 text-orange-700 rounded-lg">
              <FiThermometer size={20} />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-medium">{t('surfaceTemp')}</p>
              <p className="text-lg font-bold text-gray-900">{currentTemp}°C</p>
              <span className="text-[10px] text-emerald-700 font-medium">{t('optimalVegetative')}</span>
            </div>
          </div>

          <div className="p-3.5 bg-teal-50/50 rounded-xl border border-teal-100 flex items-center gap-3">
            <div className="p-2.5 bg-teal-100 text-teal-700 rounded-lg">
              <FiCloudRain size={20} />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-medium">{t('expectedRain')}</p>
              <p className="text-lg font-bold text-gray-900">{currentRain} mm</p>
              <span className="text-[10px] text-blue-700 font-medium">{t('leafWetness')}</span>
            </div>
          </div>

          <div className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-100 flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 text-purple-700 rounded-lg">
              <RiRadarLine size={20} />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-medium">{t('infectionForecast')}</p>
              <p className="text-lg font-bold text-purple-900">{forecastText}</p>
              <span className="text-[10px] text-purple-700 font-medium">Blast & Blight Watch</span>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnoses List Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-base">{t('cropRecordsTitle')}</h3>
            <p className="text-xs text-gray-500">{t('cropRecordsSubtitle')}</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl self-start sm:self-auto text-xs">
            {['all', 'confirmed', 'pending', 'escalated'].map((status) => {
              const labelMap = {
                all: t('filterAll'),
                confirmed: t('filterConfirmed'),
                pending: t('filterPending'),
                escalated: t('filterEscalated'),
              };
              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    filter === status
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {labelMap[status] || status}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <Loading message={t('loadingDiagnoses')} />
        ) : farmerCases.length > 0 ? (
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
            title={t('noRecordsTitle')}
            message={t('noRecordsMessage')}
            actionLabel={t('resetFilter')}
            onAction={() => setFilter('all')}
          />
        )}
      </div>
    </div>
  );
}