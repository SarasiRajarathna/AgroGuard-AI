import { FiAlertTriangle, FiCloudRain, FiThermometer, FiDroplet, FiRadio } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

export default function RiskCard({ riskScore = 75, weatherContext, nearbyAlerts = 0, affectedArea }) {
  let t = (k) => k;
  try {
    const lang = useLanguage();
    if (lang && lang.t) t = lang.t;
  } catch {
    // fallback
  }

  const getRiskLevel = (score) => {
    if (score >= 75) return { label: t('highSpreadRisk') || 'High Spread Risk', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', bar: 'bg-red-500' };
    if (score >= 45) return { label: t('moderateRisk') || 'Moderate Risk', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', bar: 'bg-amber-500' };
    return { label: t('lowRisk') || 'Low Risk', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-500' };
  };

  const level = getRiskLevel(riskScore);

  return (
    <div className={`rounded-xl border ${level.border} ${level.bg} p-5 transition-all shadow-sm`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-white/80 shadow-xs">
            <FiAlertTriangle className={level.color} size={18} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">{t('epidemiologicalSpreadRisk')}</h4>
            <p className="text-xs text-gray-500">{t('aiGeoCalc')}</p>
          </div>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${level.border} bg-white ${level.color}`}>
          {level.label}
        </span>
      </div>

      {/* Progress Bar & Score */}
      <div className="mb-4">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-xs font-medium text-gray-700">{t('calculatedSpreadIndex')}</span>
          <span className="text-xl font-extrabold text-gray-900">{riskScore}<span className="text-xs font-normal text-gray-500">/100</span></span>
        </div>
        <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${level.bar}`}
            style={{ width: `${riskScore}%` }}
          />
        </div>
      </div>

      {/* Contextual indicators */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-200/60 text-center">
        <div className="bg-white/80 rounded-lg p-2 border border-gray-100">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-0.5">
            <FiDroplet size={13} className="text-blue-500" />
            <span className="text-[11px] font-medium text-gray-500">{t('humidity')}</span>
          </div>
          <span className="text-xs font-bold text-gray-800">
            {weatherContext?.humidity ? `${weatherContext.humidity}%` : '85%'}
          </span>
        </div>

        <div className="bg-white/80 rounded-lg p-2 border border-gray-100">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-0.5">
            <FiThermometer size={13} className="text-orange-500" />
            <span className="text-[11px] font-medium text-gray-500">{t('temp')}</span>
          </div>
          <span className="text-xs font-bold text-gray-800">
            {weatherContext?.temp ? `${weatherContext.temp}°C` : '28°C'}
          </span>
        </div>

        <div className="bg-white/80 rounded-lg p-2 border border-gray-100">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-0.5">
            <FiRadio size={13} className="text-purple-500" />
            <span className="text-[11px] font-medium text-gray-500">{t('nearby')}</span>
          </div>
          <span className="text-xs font-bold text-gray-800">
            {nearbyAlerts} Farms
          </span>
        </div>
      </div>

      {nearbyAlerts > 0 && (
        <div className="mt-3 flex items-center gap-2 p-2 bg-white/90 rounded-lg border border-red-100 text-xs text-red-700">
          <FiRadio className="text-red-500 animate-pulse flex-shrink-0" size={14} />
          <span>Automated warning triggered for {nearbyAlerts} farms within 5km radius.</span>
        </div>
      )}
    </div>
  );
}