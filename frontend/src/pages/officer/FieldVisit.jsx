import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiPhone, FiCheck, FiPlus, FiClock, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { RiTruckLine, RiLeafLine } from 'react-icons/ri';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';
import Loading from '../../components/Loading';
import { visitsAPI } from '../../services/api';

export default function FieldVisit() {
  const navigate = useNavigate();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // New visit form state
  const [farmerName, setFarmerName] = useState('Ruwan Perera');
  const [location, setLocation] = useState('Ampara, Eastern Province');
  const [cropType, setCropType] = useState('Paddy (Rice)');
  const [date, setDate] = useState('2026-09-15');
  const [notes, setNotes] = useState('Routine inspection of spore eradication');

  const loadVisits = async () => {
    try {
      setLoading(true);
      const res = await visitsAPI.getAll();
      if (res.data) setVisits(res.data);
    } catch (err) {
      console.error('[FieldVisit] Failed to load visits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisits();
  }, []);

  const handleMarkCompleted = async (visitId) => {
    try {
      await visitsAPI.updateStatus(visitId, 'completed');
      setVisits(visits.map(v => v.id === visitId ? { ...v, status: 'completed' } : v));
      setToastMessage('Field visit marked as successfully completed and report filed.');
    } catch (err) {
      setToastMessage(err.message || 'Failed to update visit status.');
    }
  };

  const handleCreateVisit = async (e) => {
    e.preventDefault();
    try {
      const res = await visitsAPI.create({
        farmerName,
        location,
        cropType,
        scheduledDate: date,
        notes,
      });

      if (res.data) {
        setVisits([res.data, ...visits]);
      }
      setIsModalOpen(false);
      setToastMessage(`New field inspection scheduled for ${farmerName} on ${date}.`);
    } catch (err) {
      setToastMessage(err.message || 'Failed to schedule visit.');
    }
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}

      <PageHeader
        title="Field Inspection Management"
        subtitle="Schedule, track, and log extension visits to verify escalated diseases and guide farmers on-site."
        action={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
          >
            <FiPlus size={16} />
            <span>Schedule Field Visit</span>
          </button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <FiCalendar size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Scheduled Visits</p>
            <p className="text-xl font-bold text-gray-900">
              {visits.filter(v => v.status === 'scheduled').length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <FiCheckCircle size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Completed This Month</p>
            <p className="text-xl font-bold text-gray-900">
              {visits.filter(v => v.status === 'completed').length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
            <RiTruckLine size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Divisional Coverage</p>
            <p className="text-xl font-bold text-gray-900">4 Agrarian Zones</p>
          </div>
        </div>
      </div>

      {/* Visits List */}
      {loading ? (
        <Loading message="Loading scheduled extension visits..." />
      ) : (
        <div className="space-y-3">
          {visits.map((visit) => (
          <div
            key={visit.id}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-emerald-200 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 flex-shrink-0 mt-0.5">
                <RiTruckLine size={22} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-gray-900 text-sm">{visit.farmerName}</h4>
                  <span className="text-xs font-mono text-gray-400">({visit.id})</span>
                  <StatusBadge status={visit.status} />
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FiMapPin size={12} className="text-gray-400" /> {visit.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <RiLeafLine size={12} className="text-gray-400" /> {visit.cropType}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-gray-700">
                    <FiCalendar size={12} className="text-gray-400" /> {visit.scheduledDate}
                  </span>
                </div>
                {visit.notes && (
                  <p className="text-xs text-gray-600 italic pt-1">
                    "{visit.notes}"
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              {visit.status === 'scheduled' && (
                <button
                  onClick={() => handleMarkCompleted(visit.id)}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <FiCheck size={14} />
                  <span>Mark Done</span>
                </button>
              )}
              <button
                onClick={() => navigate('/officer')}
                className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
              >
                Case File
              </button>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Schedule Visit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Extension Field Visit"
      >
        <form onSubmit={handleCreateVisit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Farmer Name *</label>
            <input
              type="text"
              required
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Location / Agrarian Division *</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Target Crop</label>
              <input
                type="text"
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Inspection Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Visit Objectives & Instructions</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800"
            >
              Confirm Schedule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}