import { RiInboxLine } from 'react-icons/ri';
import { useLanguage } from '../context/LanguageContext';

export default function EmptyState({
  icon: Icon = RiInboxLine,
  title,
  message,
  actionLabel,
  onAction,
}) {
  let t = (k) => k;
  try {
    const lang = useLanguage();
    if (lang && lang.t) t = lang.t;
  } catch {
    // fallback
  }

  const displayTitle = title || t('noRecordsFound');
  const displayMessage = message || t('noDataDisplay');

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-gray-200">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
        <Icon size={30} />
      </div>
      <h4 className="text-base font-semibold text-gray-900 mb-1">{displayTitle}</h4>
      <p className="text-sm text-gray-500 max-w-sm mb-5">{displayMessage}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
