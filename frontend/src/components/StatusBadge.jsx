const variants = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  escalated: 'bg-purple-100 text-purple-800 border-purple-200',
  treated: 'bg-blue-100 text-blue-800 border-blue-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-gray-100 text-gray-600 border-gray-200',
  critical: 'bg-red-100 text-red-700 border-red-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  medium: 'bg-amber-100 text-amber-800 border-amber-200',
  low: 'bg-green-100 text-green-700 border-green-200',
  rising: 'bg-red-100 text-red-700 border-red-200',
  stable: 'bg-amber-100 text-amber-800 border-amber-200',
  falling: 'bg-green-100 text-green-700 border-green-200',
  scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  farmer: 'bg-green-100 text-green-800 border-green-200',
  officer: 'bg-blue-100 text-blue-800 border-blue-200',
  research: 'bg-purple-100 text-purple-800 border-purple-200',
  admin: 'bg-gray-100 text-gray-800 border-gray-200',
};

const dots = {
  pending: 'bg-amber-500',
  confirmed: 'bg-green-500',
  escalated: 'bg-purple-500',
  treated: 'bg-blue-500',
  rejected: 'bg-red-500',
  active: 'bg-green-500',
  inactive: 'bg-gray-400',
  critical: 'bg-red-600',
  high: 'bg-orange-500',
  medium: 'bg-amber-500',
  low: 'bg-green-500',
  rising: 'bg-red-600',
  stable: 'bg-amber-500',
  falling: 'bg-green-500',
  scheduled: 'bg-blue-500',
  completed: 'bg-green-500',
  farmer: 'bg-green-500',
  officer: 'bg-blue-500',
  research: 'bg-purple-500',
  admin: 'bg-gray-500',
};

export default function StatusBadge({ status, showDot = true, className = '' }) {
  const statusKey = status?.toLowerCase().replace(' ', '-') || 'pending';
  const variantClass = variants[statusKey] || 'bg-gray-100 text-gray-600 border-gray-200';
  const dotClass = dots[statusKey] || 'bg-gray-400';
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantClass} ${className}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotClass}`} />}
      {label}
    </span>
  );
}