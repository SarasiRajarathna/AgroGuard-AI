import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiImage, FiMapPin, FiInfo, FiCheck, FiArrowRight, FiArrowLeft, FiAlertCircle, FiCpu } from 'react-icons/fi';
import { RiLeafLine, RiRadarLine, RiPulseLine } from 'react-icons/ri';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../context/AuthContext';

export default function NewCase() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState('');

  // Form state
  const [cropType, setCropType] = useState('Paddy (Rice)');
  const [variety, setVariety] = useState('Bg 352 / Samba');
  const [location, setLocation] = useState(user?.farmLocation || 'Ampara, Eastern Province');
  const [fieldArea, setFieldArea] = useState('1.2 acres');
  const [cropStage, setCropStage] = useState('Tillering / Vegetative');
  const [symptoms, setSymptoms] = useState('Spindle-shaped brown lesions with grayish centers appearing on upper leaf blades.');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Sample presets for quick demo testing without requiring local files
  const samplePresets = [
    {
      label: 'Sample: Paddy Blast',
      crop: 'Paddy (Rice)',
      variety: 'Samba',
      symptoms: 'Spindle-shaped spots with gray center, leaf drying',
      preview: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?w=600&auto=format&fit=crop&q=80',
    },
    {
      label: 'Sample: Tomato Early Blight',
      crop: 'Tomato',
      variety: 'Thilina',
      symptoms: 'Concentric dark rings and yellow halos on bottom leaves',
      preview: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&auto=format&fit=crop&q=80',
    },
    {
      label: 'Sample: Tea Blister Blight',
      crop: 'Tea',
      variety: 'TRI-2043',
      symptoms: 'Translucent blister-like spots on tender flush leaves',
      preview: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const handleApplyPreset = (preset) => {
    setCropType(preset.crop);
    setVariety(preset.variety);
    setSymptoms(preset.symptoms);
    setImagePreview(preset.preview);
    setSelectedImage({ name: `${preset.crop.toLowerCase()}-symptom.jpg` });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleStartAnalysis = () => {
    setAnalyzing(true);
    setAnalysisProgress(15);
    setAnalysisStage('Extracting leaf pathology features...');

    setTimeout(() => {
      setAnalysisProgress(40);
      setAnalysisStage('Matching fungal / bacterial lesion patterns in Gemini Vision Model...');
    }, 900);

    setTimeout(() => {
      setAnalysisProgress(70);
      setAnalysisStage('Correlating micro-weather telemetry & local outbreak vectors...');
    }, 1800);

    setTimeout(() => {
      setAnalysisProgress(95);
      setAnalysisStage('Synthesizing epidemiological risk & agronomic treatment plan...');
    }, 2600);

    setTimeout(() => {
      setAnalyzing(false);
      // Navigate to diagnosis result with case ID
      navigate('/farmer/diagnosis/CASE-001');
    }, 3400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="AI Crop Disease Diagnosis"
        subtitle="Submit clear photos of affected foliage to receive instant pathogen identification, environmental risk assessment, and treatment guidelines."
      />

      {/* Stepper indicators */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        {[
          { num: 1, title: 'Crop & Location' },
          { num: 2, title: 'Upload & Symptoms' },
          { num: 3, title: 'Review & AI Scan' },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step === s.num
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : step > s.num
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {step > s.num ? <FiCheck size={14} /> : s.num}
            </div>
            <span
              className={`text-xs font-semibold hidden sm:inline ${
                step === s.num ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* AI Analysis Overlay */}
      {analyzing && (
        <div className="fixed inset-0 bg-emerald-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-emerald-400 animate-pulse">
              <FiCpu size={36} />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2">AgroGuard AI Neural Analysis Active</h3>
          <p className="text-emerald-300 text-sm max-w-md mb-6">{analysisStage}</p>

          <div className="w-full max-w-md bg-emerald-900/60 rounded-full h-3 overflow-hidden border border-emerald-500/30">
            <div
              className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>
          <span className="text-xs text-emerald-400/80 mt-2 font-mono">{analysisProgress}% Complete</span>
        </div>
      )}

      {/* Step 1: Crop & Location */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-6 shadow-xs">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-lg font-bold text-gray-900">Step 1: Crop & Field Specifications</h3>
            <p className="text-xs text-gray-500">Provide accurate crop information to calibrate the diagnosis algorithms</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Target Crop *</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Paddy (Rice)">Paddy (Rice)</option>
                <option value="Tea">Tea</option>
                <option value="Tomato">Tomato</option>
                <option value="Chili">Chili / Pepper</option>
                <option value="Corn / Maize">Corn / Maize</option>
                <option value="Cinnamon">Cinnamon</option>
                <option value="Banana">Banana</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Cultivar / Variety</label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="e.g. Bg 352, At 362, Keeri Samba"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Field / Farm Location *</label>
              <div className="relative">
                <FiMapPin className="absolute left-3.5 top-3 text-gray-400" size={16} />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Ampara, Eastern Province"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Growth Stage</label>
              <select
                value={cropStage}
                onChange={(e) => setCropStage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Seedling / Nursery">Seedling / Nursery</option>
                <option value="Tillering / Vegetative">Tillering / Vegetative</option>
                <option value="Panicle Initiation / Flowering">Panicle Initiation / Flowering</option>
                <option value="Grain Filling / Ripening">Grain Filling / Ripening</option>
                <option value="Harvest Phase">Harvest Phase</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Affected Plot Area</label>
              <input
                type="text"
                value={fieldArea}
                onChange={(e) => setFieldArea(e.target.value)}
                placeholder="e.g. 0.8 acres or 20 perches"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-all shadow-xs"
            >
              <span>Next: Photo & Symptoms</span>
              <FiArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Upload & Symptoms */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-6 shadow-xs">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-lg font-bold text-gray-900">Step 2: Crop Imagery & Observable Symptoms</h3>
            <p className="text-xs text-gray-500">High-resolution leaf photos ensure maximum AI diagnostic accuracy</p>
          </div>

          {/* Quick Demo Presets */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 mb-2">
              <RiPulseLine size={16} className="text-emerald-700" />
              <span>Quick Demo: Test with pre-loaded high-resolution diseased specimens</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {samplePresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-medium transition-colors shadow-2xs"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Crop Leaf Photograph *</label>
            <div className="border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-2xl p-6 text-center transition-colors bg-gray-50/50 relative">
              {imagePreview ? (
                <div className="space-y-3">
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Crop specimen preview"
                      className="max-h-64 rounded-xl shadow-md border border-gray-200 mx-auto object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[11px] px-2 py-0.5 rounded-full font-bold shadow">
                      Ready for Vision AI
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    {selectedImage?.name || 'crop-specimen.jpg'}
                  </div>
                  <label className="inline-block px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-xs">
                    Replace Photograph
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <FiUploadCloud size={28} />
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">
                    Drag and drop crop photo here, or <span className="text-emerald-700 underline">browse files</span>
                  </p>
                  <p className="text-xs text-gray-400">Supports JPG, PNG, WEBP (Up to 15MB). Focus on lesions or discoloration.</p>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Observable symptoms */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Observed Symptoms & Field Context
            </label>
            <textarea
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe color changes, pattern of lesions, wilting, or when symptoms first started..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-100">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-all"
            >
              <FiArrowLeft size={16} />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-all shadow-xs"
            >
              <span>Next: Review & Scan</span>
              <FiArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Submit */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-6 shadow-xs">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-lg font-bold text-gray-900">Step 3: Verification & Environmental Correlation</h3>
            <p className="text-xs text-gray-500">Confirm submission parameters prior to invoking AgroGuard neural pipeline</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2.5 text-xs">
                <h4 className="font-bold text-gray-800 uppercase tracking-wider text-[11px] mb-2 border-b pb-1">
                  Crop Metadata Summary
                </h4>
                <div className="flex justify-between">
                  <span className="text-gray-500">Crop Type:</span>
                  <span className="font-semibold text-gray-800">{cropType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Variety / Cultivar:</span>
                  <span className="font-semibold text-gray-800">{variety || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-semibold text-gray-800">{location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Growth Stage:</span>
                  <span className="font-semibold text-gray-800">{cropStage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Affected Area:</span>
                  <span className="font-semibold text-gray-800">{fieldArea}</span>
                </div>
              </div>

              <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-100 text-xs">
                <h4 className="font-bold text-blue-900 flex items-center gap-1.5 mb-1.5">
                  <RiRadarLine size={15} /> Real-time Weather Context Attached
                </h4>
                <p className="text-blue-800/80 leading-relaxed">
                  System will cross-reference regional humidity (87%), rainfall (12mm), and nearest outbreak buffer (Eastern Province) automatically.
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2">Specimen Image Preview</h4>
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100 h-52 flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Inspection target"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4 text-gray-400">
                    <FiImage size={36} className="mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No image chosen. Default Paddy Blast specimen will be used.</p>
                  </div>
                )}
              </div>

              <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600">
                <span className="font-semibold text-gray-700">Symptoms noted:</span> {symptoms}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-100">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-all"
            >
              <FiArrowLeft size={16} />
              <span>Back</span>
            </button>
            <button
              onClick={handleStartAnalysis}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <FiCpu size={18} />
              <span>Initiate AI Diagnostic Pipeline</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}