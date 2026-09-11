import { RiLeafLine } from 'react-icons/ri';

export default function Loading({ fullPage = false, message = 'Analyzing agricultural data...' }) {
  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-xs z-50 flex flex-col items-center justify-center p-4">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
          <div className="absolute text-emerald-700 animate-pulse">
            <RiLeafLine size={24} />
          </div>
        </div>
        <p className="text-gray-700 font-medium text-sm animate-pulse">{message}</p>
        <p className="text-gray-400 text-xs mt-1">AgroGuard AI neural models running</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className="w-10 h-10 rounded-full border-3 border-emerald-100 border-t-emerald-600 animate-spin" />
      <p className="text-gray-500 text-xs font-medium">{message}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm animate-pulse space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-lg" />
        <div className="flex-1 space-y-1.5">
          <div className="w-3/4 h-4 bg-gray-200 rounded" />
          <div className="w-1/2 h-3 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="h-16 bg-gray-100 rounded-lg" />
      <div className="w-full h-8 bg-gray-200 rounded" />
    </div>
  );
}