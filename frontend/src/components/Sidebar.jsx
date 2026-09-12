import { RiLeafLine } from 'react-icons/ri';
import { FiHome, FiPlusCircle, FiList, FiClipboard, FiMapPin, FiBarChart2, FiUsers, FiBell, FiSettings, FiChevronLeft, FiChevronRight, FiAlertTriangle, FiActivity } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

const roleColors = {
  farmer: 'from-green-800 to-green-900',
  officer: 'from-green-800 to-green-900',
  research: 'from-green-800 to-green-900',
  admin: 'from-green-800 to-green-900',
};

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const navConfig = {
    farmer: [
      { label: t('navDashboard'), icon: FiHome, path: '/farmer/dashboard' },
      { label: t('navNewDiagnosis'), icon: FiPlusCircle, path: '/farmer/new-case' },
      { label: t('navCases'), icon: FiList, path: '/farmer/cases' },
    ],
    officer: [
      { label: t('navDashboard'), icon: FiHome, path: '/officer/dashboard' },
      { label: t('navPendingCases'), icon: FiClipboard, path: '/officer/cases' },
      { label: t('navVisits'), icon: FiMapPin, path: '/officer/field-visits' },
    ],
    research: [
      { label: t('navDashboard'), icon: FiHome, path: '/research/dashboard' },
      { label: t('navOutbreaks'), icon: FiActivity, path: '/research/outbreaks' },
      { label: t('navAnalytics'), icon: FiBarChart2, path: '/research/analytics' },
    ],
    admin: [
      { label: t('navDashboard'), icon: FiHome, path: '/admin/dashboard' },
      { label: t('navUsers'), icon: FiUsers, path: '/admin/users' },
      { label: t('navOfficers'), icon: FiClipboard, path: '/admin/officers' },
      { label: t('navAlerts'), icon: FiBell, path: '/admin/alerts' },
      { label: t('navSettings'), icon: FiSettings, path: '/admin/settings' },
    ],
  };

  const roleLabels = {
    farmer: t('portalFarmer'),
    officer: t('portalOfficer'),
    research: t('portalResearch'),
    admin: t('portalAdmin'),
  };

  const navItems = navConfig[user.role] || [];
  const gradientClass = roleColors[user.role] || roleColors.farmer;
  const roleLabel = roleLabels[user.role] || 'Portal';

  const handleNav = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 flex flex-col
          bg-gradient-to-b ${gradientClass}
          transition-all duration-300 ease-in-out shadow-2xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
          ${collapsed ? 'lg:w-16' : 'lg:w-64'}
          w-64
        `}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 p-4 border-b border-white/10 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <RiLeafLine className="text-white text-lg" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-white font-bold text-sm leading-tight">AgroGuard AI</div>
              <div className="text-white/60 text-xs">{roleLabel}</div>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                title={collapsed ? item.label : ''}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-150 group
                  ${isActive
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
              >
                <Icon className={`text-base flex-shrink-0 ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {isActive && !collapsed && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Outbreak Alert Banner */}
        {!collapsed && (
          <div className="m-3 p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <FiAlertTriangle className="text-red-300 text-sm flex-shrink-0" />
              <span className="text-red-200 text-xs font-semibold">{t('activeOutbreak')}</span>
            </div>
            <p className="text-white/70 text-xs">Fall Armyworm — N. Western Province</p>
          </div>
        )}

        {/* Collapse Toggle (Desktop only) */}
        <div className="hidden lg:flex p-3 border-t border-white/10">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>
      </aside>
    </>
  );
}