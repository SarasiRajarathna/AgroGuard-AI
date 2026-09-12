import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiAlertTriangle, FiCheckCircle, FiShield, FiShare2, FiPrinter, FiUserCheck, FiSend, FiClock, FiCloudRain, FiMapPin, FiInfo } from 'react-icons/fi';
import { RiLeafLine, RiRadarLine, RiCapsuleLine } from 'react-icons/ri';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import RiskCard from '../../components/RiskCard';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';
import Loading from '../../components/Loading';
import { casesAPI } from '../../services/api';

export default function DiagnosisResult() {
  const { caseId } = useParams();
  const navigate = useNavigate();

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
          <span>Back to Farmer Dashboard</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-2xs"
          >
            <FiPrinter size={14} />
            <span className="hidden sm:inline">Print Report</span>
          </button>
          <button
            onClick={() => setToastMessage('Advisory link copied to clipboard for neighboring farmers.')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-2xs"
          >
            <FiShare2 size={14} />
            <span className="hidden sm:inline">Share Alert</span>
          </button>
        </div>
      </div>

      <PageHeader
        title={`Diagnosis: ${caseData.disease}`}
        subtitle={`Case ID: ${caseData.id} • Analyzed on ${new Date(caseData.submittedAt).toLocaleDateString()} at ${new Date(caseData.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
        badge={<StatusBadge status={escalated ? 'escalated' : caseData.status} />}
        action={
          !escalated && caseData.status !== 'confirmed' && (
            <button
              onClick={() => setEscalateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
            >
              <FiUserCheck size={16} />
              <span>Escalate to Ag Officer</span>
            </button>
          )
        }
      />

      {/* Escalated Notification Banner */}
      {escalated && (
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
              <FiClock size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-purple-900">Escalated to Agricultural Extension Service</h4>
              <p className="text-xs text-purple-700 mt-0.5">
                Officer <strong>Dr. Anura Bandara</strong> has been notified for secondary validation and field visit scheduling.
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
              <h3 className="font-bold text-gray-900 text-base">Leaf Pathology & AI Vision Layer</h3>
            </div>
            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showOverlay}
                onChange={(e) => setShowOverlay(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Show AI Detection Heatmap</span>
            </label>
          </div>

          {/* Leaf image with AI overlays */}
          <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video md:aspect-[16/9] flex items-center justify-center border border-gray-200">
            <img
              src="https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?w=1000&auto=format&fit=crop&q=80"
              alt="Crop leaf sample"
              className="w-full h-full object-cover"
            />
            {showOverlay && (
              <div className="absolute inset-0 bg-emerald-950/20 backdrop-contrast-125 pointer-events-none">
                {/* Simulated AI lesion bounding boxes */}
                <div className="absolute top-[32%] left-[42%] w-24 h-24 border-2 border-dashed border-red-400 bg-red-500/20 rounded-lg flex items-start justify-end p-1">
                  <span className="text-[10px] bg-red-600 text-white font-mono px-1 rounded">
                    Lesion 96%
                  </span>
                </div>
                <div className="absolute top-[52%] left-[28%] w-18 h-18 border-2 border-dashed border-amber-400 bg-amber-500/20 rounded-lg flex items-start justify-end p-1">
                  <span className="text-[10px] bg-amber-600 text-white font-mono px-1 rounded">
                    Necrosis 89%
                  </span>
                </div>
              </div>
            )}
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Vision Model v3.2 • Magnaporthe Spindle Pattern</span>
            </div>
          </div>

          {/* Confidence and Severity Metrics */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
              <span className="text-[11px] font-medium text-emerald-800">AI Confidence</span>
              <p className="text-xl font-black text-emerald-700 mt-0.5">{caseData.confidence}%</p>
              <span className="text-[10px] text-emerald-600">High classification score</span>
            </div>

            <div className="p-3 bg-orange-50/70 border border-orange-100 rounded-xl">
              <span className="text-[11px] font-medium text-orange-800">Assessed Severity</span>
              <p className="text-xl font-black text-orange-700 mt-0.5 capitalize">{caseData.severity}</p>
              <span className="text-[10px] text-orange-600">Immediate containment advised</span>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl">
              <span className="text-[11px] font-medium text-blue-800">Est. Yield Impact</span>
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
              <span>Specimen Metadata</span>
              <span className="text-gray-400 font-normal">{caseData.id}</span>
            </h4>
            <div className="flex justify-between">
              <span className="text-gray-500">Crop:</span>
              <span className="font-medium text-gray-900">{caseData.cropType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Cultivar:</span>
              <span className="font-medium text-gray-900">{caseData.variety || 'Samba'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Location:</span>
              <span className="font-medium text-gray-900">{caseData.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Plot Extent:</span>
              <span className="font-medium text-gray-900">{caseData.affectedArea || '1.0 acre'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Treatment Advisory */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <RiCapsuleLine size={22} className="text-emerald-700" />
          <div>
            <h3 className="font-bold text-gray-900 text-base">Agronomic Treatment & Containment Protocol</h3>
            <p className="text-xs text-gray-500">Approved by Department of Agriculture Extension Guidelines</p>
          </div>
        </div>

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
      </div>

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