export default function PageHeader({ title, subtitle, badge, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
          {badge && <span>{badge}</span>}
        </div>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
}
