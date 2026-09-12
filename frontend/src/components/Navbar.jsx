import { useState, useEffect } from 'react';
import { FiMenu, FiBell, FiChevronDown, FiLogOut, FiUser, FiSettings } from 'react-icons/fi';
import { RiLeafLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { notificationsAPI } from '../services/api';
import { FiGlobe } from 'react-icons/fi';

const roleTheme = {
  farmer: { label: 'Farmer', bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  officer: { label: 'Officer', bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  research: { label: 'Researcher', bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  admin: { label: 'Admin', bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
};

export default function Navbar({ setIsOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadNotifications() {
      try {
        const res = await notificationsAPI.getAll();
        if (isMounted && res.data) {
          setNotifications(res.data);
        }
      } catch (err) {
        console.warn('[Navbar] Failed to load notifications:', err.message);
      }
    }

    if (user) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 30000);
      return () => {
        isMounted = false;
        clearInterval(interval);
      };
    }
  }, [user]);

  const handleMarkRead = async (id) => {
    try {
      await notificationsAPI.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const theme = roleTheme[user?.role] || roleTheme.farmer;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 shadow-sm">
      {/* Left: Mobile menu + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <FiMenu className="text-xl" />
        </button>
        <div className="flex items-center gap-2">
          <RiLeafLine className="text-green-700 text-xl hidden sm:block" />
          <span className="font-bold text-gray-900 text-sm sm:text-base">AgroGuard AI</span>
        </div>
      </div>

      {/* Right: Language + Notifications + User */}
      <div className="flex items-center gap-2">
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => { setLangOpen(!langOpen); setNotifOpen(false); setDropdownOpen(false); }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 text-xs font-semibold transition-colors shadow-xs"
            title="Switch Language / භාෂාව මාරු කරන්න / மொழியை மாற்றவும்"
          >
            <FiGlobe className="text-green-700 text-sm" />
            <span>{language === 'si' ? 'සිංහල' : language === 'ta' ? 'தமிழ்' : 'English'}</span>
            <FiChevronDown className="text-gray-400 text-xs" />
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-xl shadow-lg border border-gray-200 z-50 py-1 overflow-hidden animate-fade-in-up">
              <button
                onClick={() => { setLanguage('en'); setLangOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors flex items-center justify-between ${
                  language === 'en' ? 'bg-green-50 text-green-800 font-bold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>English</span>
                {language === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-green-600" />}
              </button>
              <button
                onClick={() => { setLanguage('si'); setLangOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors flex items-center justify-between ${
                  language === 'si' ? 'bg-green-50 text-green-800 font-bold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>සිංහල (Sinhala)</span>
                {language === 'si' && <span className="w-1.5 h-1.5 rounded-full bg-green-600" />}
              </button>
              <button
                onClick={() => { setLanguage('ta'); setLangOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors flex items-center justify-between ${
                  language === 'ta' ? 'bg-green-50 text-green-800 font-bold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>தமிழ் (Tamil)</span>
                {language === 'ta' && <span className="w-1.5 h-1.5 rounded-full bg-green-600" />}
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); setLangOpen(false); }}
            className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <FiBell className="text-xl" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 animate-fade-in-up overflow-hidden">
              <div className="p-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
              </div>
              <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.type === 'alert' ? 'bg-red-500' : n.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 leading-snug">{n.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-gray-100 text-center">
                <button className="text-xs text-green-700 font-medium hover:underline">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.avatar || 'U'}
            </div>
            <div className="hidden sm:block text-left min-w-0">
              <div className="text-sm font-semibold text-gray-900 leading-tight truncate max-w-28">{user?.name}</div>
              <div className={`text-xs px-1.5 py-0.5 rounded-full w-fit ${theme.bg} ${theme.text} font-medium leading-tight`}>
                {theme.label}
              </div>
            </div>
            <FiChevronDown className="text-gray-400 text-sm hidden sm:block" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden animate-fade-in-up">
              <div className="p-3 border-b border-gray-100">
                <div className="font-semibold text-gray-900 text-sm">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
              <div className="py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <FiUser className="text-gray-400" /> Profile
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <FiSettings className="text-gray-400" /> Settings
                </button>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FiLogOut className="text-red-500" /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}