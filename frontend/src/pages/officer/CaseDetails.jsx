import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiX, FiCalendar, FiUser, FiMapPin, FiPhone, FiAlertTriangle, FiCheckCircle, FiSend, FiFileText } from 'react-icons/fi';
import { RiLeafLine, RiRadarLine, RiShieldCheckLine } from 'react-icons/ri';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import Toast from '../../components/Toast';
import Modal from '../../components/Modal';
import Loading from '../../components/Loading';
import { casesAPI } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function CaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [caseItem, setCaseItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState('pending');
  const [decision, setDecision] = useState('confirm'); // 'confirm' | 'modify' | 'reject'
  const [verifiedDisease, setVerifiedDisease] = useState('');
  const [officerNotes, setOfficerNotes] = useState(
    'Field symptoms match typical blast lesions. Spore count accelerated by recent morning dew. Approved application of systemic fungicide.'
  );
  const [scheduleVisit, setScheduleVisit] = useState(false);
  const [visitDate, setVisitDate] = useState('2026-09-14');
  const [toastMessage, setToastMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadCase() {
      try {
        setLoading(true);
        const res = await casesAPI.getById(id);
        if (isMounted && res.data) {
          setCaseItem(res.data);
          setCurrentStatus(res.data.status);
          setVerifiedDisease(res.data.disease);
          if (res.data.officerNotes) {
            setOfficerNotes(res.data.officerNotes);
          }
        }
      } catch (err) {
        console.error('[CaseDetails] Failed to fetch case:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (id) {
      loadCase();
    }
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await casesAPI.review(id, {
        decision,
        verifiedDisease,
        officerNotes,
        scheduleVisit,
        visitDate,
      });

      if (res.data?.case) {
        setCaseItem(res.data.case);
        setCurrentStatus(res.data.case.status);
      }

      setToastMessage(
        `Case verified as "${verifiedDisease}". Decision recorded and fed back into the AgroGuard AI model network.`
      );
    } catch (err) {
      setToastMessage(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loading fullPage message={t('analyzingData')} />;
  }

  if (!caseItem) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-gray-600 font-semibold">{t('noRecordsFound')}</p>
        <button onClick={() => navigate('/officer')} className="px-4 py-2 bg-emerald-700 text-white text-xs rounded-xl font-bold">
          {t('backToDashboard')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Back button */}
      <button
        onClick={() => navigate('/officer')}
        className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
      >
        <FiArrowLeft size={16} />
        <span>{t('backToDashboard')}</span>
      </button>

      <PageHeader
        title={`Reviewing Case: ${caseItem.id}`}
        subtitle={`Submitted by ${caseItem.farmerName} • ${caseItem.location}`}
        badge={<StatusBadge status={currentStatus} />}
      />

      {/* Grid: Case Details + Officer Action Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details, Imagery, AI Findings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Farmer & Field Info Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
              <FiUser className="text-emerald-700" size={18} />
              <span>Farmer Profile & Field Context</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-400 font-medium">Farmer Name</span>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{caseItem.farmerName}</p>
                <div className="flex items-center gap-1 text-gray-500 mt-1">
                  <FiPhone size={12} /> +94 77 123 4567
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-400 font-medium">Location</span>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{caseItem.location}</p>
                <div className="flex items-center gap-1 text-gray-500 mt-1">
                  <FiMapPin size={12} /> Block 4, Sector B
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-400 font-medium">Crop & Variety</span>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{caseItem.cropType}</p>
                <div className="text-gray-500 mt-1">
                  {caseItem.variety || 'Samba'} • {caseItem.affectedArea || '0.8 acres'}
                </div>
              </div>
            </div>

            <div className="mt-4 p-3.5 bg-gray-50/80 rounded-xl border border-gray-200 text-xs">
              <span className="font-bold text-gray-700">Reported Symptoms: </span>
              <span className="text-gray-600">{caseItem.symptoms}</span>
            </div>
          </div>

          {/* AI Vision & Specimen Photo */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <RiLeafLine className="text-emerald-700" size={18} />
                <span>AI Leaf Pathology Analysis</span>
              </h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Confidence: {caseItem.confidence}%
              </span>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video flex items-center justify-center border border-gray-200">
              <img
                src="https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?w=1000&auto=format&fit=crop&q=80"
                alt="Leaf specimen"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-[35%] left-[40%] w-28 h-28 border-2 border-dashed border-red-400 bg-red-500/20 rounded-lg p-1 text-[10px] text-white font-mono">
                Magnaporthe lesion [0.94]
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-2">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-400">Diagnosis</span>
                <p className="font-bold text-gray-900 mt-0.5">{caseItem.disease}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-400">Severity</span>
                <p className="font-bold text-orange-600 uppercase mt-0.5">{caseItem.severity}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-400">Spread Risk</span>
                <p className="font-bold text-red-600 mt-0.5">{caseItem.spreadRisk}/100</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-400">Nearby Farms</span>
                <p className="font-bold text-gray-900 mt-0.5">{caseItem.nearbyAlerts || 3} Alerted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Officer Action & Decision Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <div className="border-b border-gray-100 pb-3 mb-4">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <RiShieldCheckLine size={20} className="text-emerald-700" />
                <span>Officer Validation Action</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Your confirmation closes the feedback loop and updates regional surveillance models.
              </p>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Decision Tabs */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Validation Decision
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setDecision('confirm')}
                    className={`py-2 px-1 rounded-xl border font-semibold text-center transition-all ${
                      decision === 'confirm'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Confirm AI
                  </button>

                  <button
                    type="button"
                    onClick={() => setDecision('modify')}
                    className={`py-2 px-1 rounded-xl border font-semibold text-center transition-all ${
                      decision === 'modify'
                        ? 'bg-blue-50 border-blue-500 text-blue-800 ring-1 ring-blue-500'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Correct
                  </button>

                  <button
                    type="button"
                    onClick={() => setDecision('reject')}
                    className={`py-2 px-1 rounded-xl border font-semibold text-center transition-all ${
                      decision === 'reject'
                        ? 'bg-rose-50 border-rose-500 text-rose-800 ring-1 ring-rose-500'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* Disease override if modifying */}
              {decision === 'modify' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Corrected Pathogen / Disease *
                  </label>
                  <select
                    value={verifiedDisease}
                    onChange={(e) => setVerifiedDisease(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Blast Disease">Blast Disease (Magnaporthe oryzae)</option>
                    <option value="Sheath Blight">Sheath Blight (Rhizoctonia solani)</option>
                    <option value="Bacterial Leaf Blight">Bacterial Leaf Blight (Xanthomonas oryzae)</option>
                    <option value="Brown Spot">Brown Spot (Bipolaris oryzae)</option>
                    <option value="Blister Blight">Blister Blight (Exobasidium vexans)</option>
                  </select>
                </div>
              )}

              {/* Officer Field Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Extension Officer Notes & Treatment Directive
                </label>
                <textarea
                  rows={4}
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Enter agronomic dosage or special advice..."
                />
              </div>

              {/* Field Visit Checkbox */}
              <div className="pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 font-medium">
                  <input
                    type="checkbox"
                    checked={scheduleVisit}
                    onChange={(e) => setScheduleVisit(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Schedule On-Site Farm Inspection Visit</span>
                </label>

                {scheduleVisit && (
                  <div className="mt-2 pl-6">
                    <label className="block text-[11px] text-gray-500 mb-1">Inspection Date</label>
                    <input
                      type="date"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 rounded-lg border border-gray-300"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <FiCheckCircle size={16} />
                    <span>Submit Officer Verification</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}