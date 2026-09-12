import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiCheck, FiPlus, FiClock, FiFileText, FiCheckCircle } from 'react-icons/fi';
import { RiTruckLine, RiLeafLine, RiShieldCheckLine } from 'react-icons/ri';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';
import Loading from '../../components/Loading';
import { visitsAPI } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function FieldVisit() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecordFindingsModalOpen, setIsRecordFindingsModalOpen] = useState(false);
  const [activeVisit, setActiveVisit] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // New visit form state
  const [farmerName, setFarmerName] = useState('Ruwan Perera');
  const [location, setLocation] = useState('Ampara, Eastern Province');
  const [cropType, setCropType] = useState('Paddy (Rice)');
  const [date, setDate] = useState('2026-09-15');
  const [notes, setNotes] = useState('Routine inspection of spore eradication');

  // Record findings form state
  const [observedSymptoms, setObservedSymptoms] = useState('');
  const [confirmedDisease, setConfirmedDisease] = useState('Paddy Blast (Magnaporthe oryzae)');
  const [verifiedSeverity, setVerifiedSeverity] = useState('high');
  const [recommendation, setRecommendation] = useState('Apply Tricyclazole 75% WP @ 0.6g/L immediately. Implement 10-day strict drainage and stop urea application.');

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

  const openRecordFindingsModal = (visit) => {
    setActiveVisit(visit);
    setObservedSymptoms(visit.notes || 'Observed spindle-shaped foliar necrotic lesions across multiple tillers.');
    setConfirmedDisease(visit.confirmedDisease || 'Paddy Blast (Magnaporthe oryzae)');
    setVerifiedSeverity(visit.verifiedSeverity || 'high');
    setIsRecordFindingsModalOpen(true);
  };

  const handleSaveFindings = async (e) => {
    e.preventDefault();
    if (!activeVisit) return;
    try {
      await visitsAPI.updateStatus(activeVisit.id, 'completed', {
        observedSymptoms,
        confirmedDisease,
        verifiedSeverity,
        recommendation,
        notes: recommendation,
      });

      setVisits(
        visits.map((v) =>
          v.id === activeVisit.id
            ? {
                ...v,
                status: 'completed',
                observedSymptoms,
                confirmedDisease,
                verifiedSeverity,
                recommendation,
              }
            : v
        )
      );
      setIsRecordFindingsModalOpen(false);
      setToastMessage(`Inspection findings logged for Visit #${activeVisit.id}. Linked Case #${activeVisit.caseId || 1} has been updated to Officer Verified and farmer has been notified!`);
    } catch (err) {
      setToastMessage(err.message || 'Failed to record findings.');
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
        title={t('fieldVisitsTitle')}
        subtitle="Schedule on-site inspections, record verified foliar pathology findings, and update the farmer's case record."
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
            <p className="text-xs text-gray-500 font-medium">Pending Inspections</p>
            <p className="text-xl font-bold text-gray-900">
              {visits.filter((v) => v.status === 'scheduled').length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <FiCheckCircle size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Verified & Completed</p>
            <p className="text-xl font-bold text-gray-900">
              {visits.filter((v) => v.status === 'completed').length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
            <RiTruckLine size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Field Loop Active</p>
            <p className="text-xl font-bold text-gray-900">Officer Verified Sync</p>
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
                    <span className="text-xs font-mono text-gray-400">(Visit #{visit.id})</span>
                    {visit.caseId && (
                      <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-semibold">
                        Linked Case #{visit.caseId}
                      </span>
                    )}
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

                  {visit.confirmedDisease && (
                    <div className="pt-1 flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
                      <RiShieldCheckLine className="text-emerald-600" />
                      <span>Verified: {visit.confirmedDisease} ({visit.verifiedSeverity || 'confirmed'})</span>
                    </div>
                  )}

                  {visit.recommendation && (
                    <p className="text-xs text-gray-600 italic pt-0.5">
                      "Prescription: {visit.recommendation}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                {visit.status === 'scheduled' ? (
                  <button
                    onClick={() => openRecordFindingsModal(visit)}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <FiFileText size={14} />
                    <span>Record Findings & Complete</span>
                  </button>
                ) : (
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md">
                    <FiCheck /> Findings Logged
                  </span>
                )}
                {visit.caseId && (
                  <button
                    onClick={() => navigate(`/officer/case/${visit.caseId}`)}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    View Case File
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record Findings Modal (Requirement 8: Full Field Visit Loop) */}
      <Modal
        isOpen={isRecordFindingsModalOpen}
        onClose={() => setIsRecordFindingsModalOpen(false)}
        title={`Record Officer Findings (Visit #${activeVisit?.id || ''})`}
      >
        <form onSubmit={handleSaveFindings} className="space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            Completing this inspection will update the linked case (<strong>Case #{activeVisit?.caseId || '1'}</strong>) with your verified disease diagnosis, mark it as <strong>Officer Verified</strong>, and automatically dispatch a notification to <strong>{activeVisit?.farmerName}</strong>.
          </p>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Observed Symptoms in Field *
            </label>
            <textarea
              required
              rows={2}
              value={observedSymptoms}
              onChange={(e) => setObservedSymptoms(e.target.value)}
              placeholder="e.g. Spindle lesions with necrotic centers on flag leaves, neck rot signs..."
              className="w-full text-xs px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Confirmed Pathogen / Disease *
              </label>
              <input
                type="text"
                required
                value={confirmedDisease}
                onChange={(e) => setConfirmedDisease(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Verified Severity Level *
              </label>
              <select
                value={verifiedSeverity}
                onChange={(e) => setVerifiedSeverity(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Officer Recommendations & Quarantine Advice *
            </label>
            <textarea
              required
              rows={3}
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              placeholder="Prescribe chemical treatments, water management, or isolation protocols..."
              className="w-full text-xs px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsRecordFindingsModalOpen(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 shadow-xs"
            >
              Save Findings & Notify Farmer
            </button>
          </div>
        </form>
      </Modal>

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