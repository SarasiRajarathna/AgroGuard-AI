import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export default function StatCard({
  title,
  value,
  icon: Icon,
  iconBg = 'bg-emerald-50 text-emerald-600',
  trend,
  trendType = 'up',
  subtitle,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-200 p-5 shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-emerald-300 hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${iconBg} flex items-center justify-center`}>
            <Icon size={22} />
          </div>
        )}
      </div>

      {(trend || subtitle) && (
        <div className="mt-3 flex items-center gap-2 text-xs pt-2 border-t border-gray-100">
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 font-semibold ${
                trendType === 'up' ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {trendType === 'up' ? <FiTrendingUp size={13} /> : <FiTrendingDown size={13} />}
              {trend}
            </span>
          )}
          {subtitle && <span className="text-gray-400">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
