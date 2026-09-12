import { FiActivity, FiMapPin, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { RiLeafLine } from 'react-icons/ri';
import StatusBadge from './StatusBadge';
import { useLanguage } from '../context/LanguageContext';

export default function DiseaseCard({ caseItem, onClick }) {
  let t = (k) => k;
  try {
    const lang = useLanguage();
    if (lang && lang.t) t = lang.t;
  } catch {
    // fallback if outside provider
  }

  if (!caseItem) return null;

  const severityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-amber-100 text-amber-800 border-amber-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    critical: 'bg-red-100 text-red-800 border-red-200',
  };

  const severityTranslated = t(`status_${caseItem.severity}`) || caseItem.severity;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group hover:border-emerald-300 relative overflow-hidden"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 group-hover:scale-105 transition-transform">
            <RiLeafLine size={24} />
          </div>
          <div className="truncate">
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
              {caseItem.disease || 'Undiagnosed Case'}
            </h3>
            <p className="text-xs text-gray-500 italic truncate">
              {caseItem.scientificName || caseItem.cropType}
            </p>
          </div>
        </div>
        <StatusBadge status={caseItem.status} />
      </div>

      <div className="space-y-2 mb-4 text-xs text-gray-600">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">{t('cropLabel')}:</span>
          <span className="font-medium text-gray-800">{caseItem.cropType} {caseItem.variety ? `(${caseItem.variety})` : ''}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">{t('confidenceScore')}:</span>
          <div className="flex items-center gap-1.5">
            <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  caseItem.confidence >= 80 ? 'bg-emerald-500' : caseItem.confidence >= 60 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${caseItem.confidence || 0}%` }}
              />
            </div>
            <span className="font-semibold text-gray-800">{caseItem.confidence}%</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">{t('severityLevel')}:</span>
          <span className={`px-2 py-0.5 rounded text-[11px] font-medium border capitalize ${severityColors[caseItem.severity] || severityColors.medium}`}>
            {severityTranslated}
          </span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 pt-1 border-t border-gray-100">
          <FiMapPin size={12} className="text-gray-400 flex-shrink-0" />
          <span className="truncate">{caseItem.location}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-emerald-600 font-medium group-hover:text-emerald-700">
        <span className="text-gray-400 font-normal">
          {new Date(caseItem.submittedAt).toLocaleDateString()}
        </span>
        <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          {t('viewCase')} <FiArrowRight size={13} />
        </span>
      </div>
    </div>
  );
}