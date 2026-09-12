import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiAlertTriangle, FiCheckCircle, FiShield, FiShare2, FiPrinter, FiUserCheck, FiSend, FiClock, FiCloudRain, FiMapPin, FiInfo, FiCheck } from 'react-icons/fi';
import { RiLeafLine, RiRadarLine, RiCapsuleLine, RiShieldCheckLine } from 'react-icons/ri';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import RiskCard from '../../components/RiskCard';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';
import Loading from '../../components/Loading';
import { casesAPI } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function DiagnosisResult() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [escalationReason, setEscalationReason] = useState('');
  const [escalated, setEscalated] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadCase() {
      try {
        setLoading(true);
        const res = await casesAPI.getById(caseId);
        if (isMounted && res.data) {
          setCaseData(res.data);
          setEscalated(res.data.status === 'escalated');
        }
      } catch (err) {
        console.error('[DiagnosisResult] Failed to load case:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (caseId) {
      loadCase();
    }
  }, [caseId]);

  const handleEscalateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await casesAPI.escalate(caseId, escalationReason);
      setEscalated(true);
      if (res.data) {
        setCaseData(res.data);
      }
      setEscalateModalOpen(false);
      setToastMessage('Case successfully escalated to Agriculture Extension Officer for field confirmation.');
    } catch (err) {
      setToastMessage(err.message || 'Failed to escalate case. Please try again.');
    }
  };

  if (loading) {
    return <Loading fullPage message="Retrieving AI leaf pathology findings..." />;
  }

  if (!caseData) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-gray-600 font-semibold">Case record not found or could not be loaded.</p>
        <button onClick={() => navigate('/farmer')} className="px-4 py-2 bg-emerald-700 text-white text-xs rounded-xl font-bold">
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Check if case is low confidence (< 75%)
  const isLowConfidence = caseData.isLowConfidence || (caseData.confidence && caseData.confidence < 75);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Back & Page Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/farmer')}
          className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <FiArrowLeft size={16} />
          <span>{t('backToDashboard')}</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-2xs"
          >
            <FiPrinter size={14} />
            <span className="hidden sm:inline">{t('printReport')}</span>
          </button>
          <button
            onClick={() => setToastMessage('Advisory link copied to clipboard for neighboring farmers.')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-2xs"
          >
            <FiShare2 size={14} />
            <span className="hidden sm:inline">{t('shareAlert')}</span>
          </button>
        </div>
      </div>

      <PageHeader
        title={
          isLowConfidence && !caseData.officerVerified
            ? t('lowConfidenceNotice')
            : `${t('diseaseDetected')}: ${caseData.disease}`
        }
        subtitle={`Case ID: #${caseData.id} • Analyzed on ${new Date(caseData.submittedAt).toLocaleDateString()} at ${new Date(caseData.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
        badge={
          <div className="flex items-center gap-2">
            <StatusBadge status={escalated ? 'escalated' : caseData.status} />
            {caseData.officerVerified && (
              <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full flex items-center gap-1">
                <RiShieldCheckLine /> {t('officerVerifiedBadge')}
              </span>
            )}
          </div>
        }
        action={
          !escalated && caseData.status !== 'confirmed' && (
            <button
              onClick={() => setEscalateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
            >
              <FiUserCheck size={16} />
              <span>{t('requestOfficerVisit')}</span>
            </button>
          )
        }
      />

      {/* STRICT CONFIDENCE TRIAGE WARNING BANNER: <75% confidence */}
      {isLowConfidence && !caseData.officerVerified && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-200 text-amber-900 rounded-xl mt-0.5">
              <FiAlertTriangle size={24} />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-amber-950">
                {t('lowConfidenceNotice')} (AI Confidence: {caseData.confidence}%)
              </h4>
              <p className="text-xs text-amber-900 leading-relaxed">
                {t('lowConfidenceExplanation')}
              </p>
            </div>
          </div>
          <div className="bg-white/80 rounded-xl p-3 border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
            <span><strong>Status:</strong> Automatically routed to Divisional Agricultural Extension Officer</span>
            <span className="font-bold text-amber-900">Dr. Anura Bandara (Assigned)</span>
          </div>
        </div>
      )}

      {/* Officer Verified Findings Card (If verified by officer) */}
      {caseData.officerVerified && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
            <RiShieldCheckLine size={20} className="text-emerald-700" />
            <span>Field Inspection Findings (Verified by {caseData.verifiedBy || 'Dr. Anura Bandara'})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div>
              <span className="text-emerald-700 font-medium">Verified Disease:</span>
              <p className="font-bold text-emerald-950 text-sm">{caseData.verifiedDisease || caseData.disease}</p>
            </div>
            <div>
              <span className="text-emerald-700 font-medium">Verified Severity:</span>
              <p className="font-bold text-emerald-950 text-sm capitalize">{caseData.verifiedSeverity || caseData.severity}</p>
            </div>
            <div>
              <span className="text-emerald-700 font-medium">Verification Date:</span>
              <p className="font-bold text-emerald-950 text-sm">
                {caseData.verifiedAt ? new Date(caseData.verifiedAt).toLocaleDateString() : 'Recent'}
              </p>
            </div>
          </div>
          {caseData.officerRecommendation && (
            <div className="mt-2 p-3 bg-white rounded-xl border border-emerald-200 text-xs text-emerald-900">
              <strong>Officer Prescription & Containment:</strong> {caseData.officerRecommendation}
            </div>
          )}
        </div>
      )}

      {/* Escalated Notification Banner (Normal manual escalation) */}
      {escalated && !isLowConfidence && (
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
              <FiClock size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-purple-900">{t('escalatedBanner')}</h4>
              <p className="text-xs text-purple-700 mt-0.5">
                Extension Officer <strong>Dr. Anura Bandara</strong> has been notified for secondary validation and field visit scheduling.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-purple-200 text-purple-800 rounded-full">
            Review Pending
          </span>
        </div>
      )}

      {/* Top Grid: Diagnosis Visuals + Epidemiological Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Inspection Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RiLeafLine size={20} className="text-emerald-600" />
              <h3 className="font-bold text-gray-900 text-base">Foliar Specimen & Vision Inspection Layer</h3>
            </div>
            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showOverlay}
                onChange={(e) => setShowOverlay(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Show Diagnostic Heatmap</span>
            </label>
          </div>

          {/* Leaf image with AI overlays */}
          <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video md:aspect-[16/9] flex items-center justify-center border border-gray-200">
            <img
              src={caseData.imageUrl || 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?w=1000&auto=format&fit=crop&q=80'}
              alt="Crop leaf sample"
              className="w-full h-full object-cover"
            />
            {showOverlay && !isLowConfidence && (
              <div className="absolute inset-0 bg-emerald-950/20 backdrop-contrast-125 pointer-events-none">
                <div className="absolute top-[32%] left-[42%] w-24 h-24 border-2 border-dashed border-red-400 bg-red-500/20 rounded-lg flex items-start justify-end p-1">
                  <span className="text-[10px] bg-red-600 text-white font-mono px-1 rounded">
                    Pathogen {caseData.confidence || 94}%
                  </span>
                </div>
                <div className="absolute top-[52%] left-[28%] w-18 h-18 border-2 border-dashed border-amber-400 bg-amber-500/20 rounded-lg flex items-start justify-end p-1">
                  <span className="text-[10px] bg-amber-600 text-white font-mono px-1 rounded">
                    Foliar Lesion
                  </span>
                </div>
              </div>
            )}
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>PlantVillage Pathology Model • {caseData.cropType}</span>
            </div>
          </div>

          {/* Confidence and Severity Metrics */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className={`p-3 border rounded-xl ${isLowConfidence ? 'bg-amber-50/70 border-amber-200' : 'bg-emerald-50/70 border-emerald-100'}`}>
              <span className="text-[11px] font-medium text-gray-700">{t('confidenceScore')}</span>
              <p className={`text-xl font-black mt-0.5 ${isLowConfidence ? 'text-amber-700' : 'text-emerald-700'}`}>
                {caseData.confidence}%
              </p>
              <span className="text-[10px] text-gray-500">
                {isLowConfidence ? '<75% Triage Alert' : 'High classification score'}
              </span>
            </div>

            <div className="p-3 bg-orange-50/70 border border-orange-100 rounded-xl">
              <span className="text-[11px] font-medium text-orange-800">{t('severityLevel')}</span>
              <p className="text-xl font-black text-orange-700 mt-0.5 capitalize">{caseData.severity}</p>
              <span className="text-[10px] text-orange-600">Immediate containment advised</span>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl">
              <span className="text-[11px] font-medium text-blue-800">{t('estimatedYieldLoss')}</span>
              <p className="text-xl font-black text-blue-700 mt-0.5">{caseData.estimatedLoss || '30-40%'}</p>
              <span className="text-[10px] text-blue-600">Without intervention</span>
            </div>
          </div>
        </div>

        {/* Right: Epidemiological Risk & Nearby Farms Alert */}
        <div className="space-y-6">
          <RiskCard
            riskScore={caseData.spreadRisk}
            weatherContext={caseData.weatherContext}
            nearbyAlerts={caseData.nearbyAlerts}
            affectedArea={caseData.affectedArea}
          />

          {/* Farm & Crop metadata summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs text-xs space-y-3">
            <h4 className="font-bold text-gray-900 text-sm border-b pb-2 flex items-center justify-between">
              <span>Specimen Coordinates & Farm</span>
              <span className="text-gray-400 font-normal">#{caseData.id}</span>
            </h4>
            <div className="flex justify-between">
              <span className="text-gray-500">{t('cropLabel')}:</span>
              <span className="font-medium text-gray-900">{caseData.cropType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{t('cultivarLabel')}:</span>
              <span className="font-medium text-gray-900">{caseData.variety || 'Bg 352 / Samba'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{t('locationLabel')}:</span>
              <span className="font-medium text-gray-900">{caseData.location}</span>
            </div>
            {caseData.latitude && caseData.longitude && (
              <div className="flex justify-between">
                <span className="text-gray-500">{t('gpsCoordinates')}:</span>
                <span className="font-mono text-gray-900">{caseData.latitude}, {caseData.longitude}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">{t('plotExtent')}:</span>
              <span className="font-medium text-gray-900">{caseData.affectedArea || '1.0 acre'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Treatment Advisory (Hidden or generic if low confidence to avoid dangerous chemical treatments) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <RiCapsuleLine size={22} className="text-emerald-700" />
          <div>
            <h3 className="font-bold text-gray-900 text-base">{t('recommendedTreatments')}</h3>
            <p className="text-xs text-gray-500">Department of Agriculture Extension Guidelines</p>
          </div>
        </div>

        {isLowConfidence && !caseData.officerVerified ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-2">
            <p className="font-bold">⚠️ Specific Chemical Prescriptions Suppressed</p>
            <p>
              To protect your crops from chemical toxicity and incorrect fungicide application, specific systemic chemicals will only be prescribed after physical officer confirmation.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-amber-800">
              <li>Isolate affected field section to avoid spore dispersal through farm footwear.</li>
              <li>Cease high-nitrogen urea fertilization immediately.</li>
              <li>Wait for Extension Officer Dr. Anura Bandara to inspect your field.</li>
            </ul>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {caseData.treatmentSteps?.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="text-xs md:text-sm text-gray-800 leading-relaxed font-medium">
                  {step}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prevention Measures */}
      {caseData.preventionSteps && caseData.preventionSteps.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <FiShield size={20} className="text-emerald-700" />
            <div>
              <h3 className="font-bold text-gray-900 text-base">{t('preventionMeasures')}</h3>
              <p className="text-xs text-gray-500">Regional containment and biosecurity</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs md:text-sm text-gray-700">
            {caseData.preventionSteps.map((prev, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <FiCheck className="text-emerald-600 mt-1 flex-shrink-0" />
                <span>{prev}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Officer Escalation Modal */}
      <Modal
        isOpen={escalateModalOpen}
        onClose={() => setEscalateModalOpen(false)}
        title="Escalate Case to Agriculture Officer"
      >
        <form onSubmit={handleEscalateSubmit} className="space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            Escalating will route this case directly to your assigned Divisional Agriculture Extension Officer (<strong>Dr. Anura Bandara</strong>). They will review the imagery, verify or correct the diagnosis, and can schedule an on-site field visit if required.
          </p>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Reason for Escalation / Additional Observations
            </label>
            <textarea
              required
              rows={3}
              value={escalationReason}
              onChange={(e) => setEscalationReason(e.target.value)}
              placeholder="e.g. Symptoms spreading rapidly despite preliminary spray; want secondary field confirmation..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setEscalateModalOpen(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-700 text-white rounded-xl text-xs font-semibold hover:bg-purple-800 transition-colors flex items-center gap-1.5"
            >
              <FiSend size={14} />
              <span>Confirm Escalation</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}