import { useState, useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const config = {
    success: {
      icon: FiCheckCircle,
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      iconColor: 'text-emerald-500',
    },
    error: {
      icon: FiAlertCircle,
      bg: 'bg-rose-50 border-rose-200 text-rose-800',
      iconColor: 'text-rose-500',
    },
    warning: {
      icon: FiAlertCircle,
      bg: 'bg-amber-50 border-amber-200 text-amber-800',
      iconColor: 'text-amber-500',
    },
    info: {
      icon: FiInfo,
      bg: 'bg-blue-50 border-blue-200 text-blue-800',
      iconColor: 'text-blue-500',
    },
  };

  const { icon: Icon, bg, iconColor } = config[type] || config.info;

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-md animate-slide-up ${bg}`}>
      <Icon className={`flex-shrink-0 ${iconColor}`} size={20} />
      <p className="text-sm font-medium flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/5 rounded-lg transition-colors text-gray-500"
        >
          <FiX size={16} />
        </button>
      )}
    </div>
  );
}
