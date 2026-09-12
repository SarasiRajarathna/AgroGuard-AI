import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiImage, FiMapPin, FiCheck, FiArrowRight, FiArrowLeft, FiCpu, FiGlobe, FiAlertTriangle } from 'react-icons/fi';
import { RiPulseLine, RiRadarLine } from 'react-icons/ri';
import PageHeader from '../../components/PageHeader';
import Toast from '../../components/Toast';
import { casesAPI, farmsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function NewCase() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();

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
  const [imageBase64, setImageBase64] = useState(null);

  // Registered Farms state
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [latitude, setLatitude] = useState(7.2833);
  const [longitude, setLongitude] = useState(81.6667);

  // Fetch farmer's registered farms on mount
  useEffect(() => {
    async function loadFarms() {
      try {
        const res = await farmsAPI.getAll();
        if (res.data && res.data.length > 0) {
          setFarms(res.data);
          const firstFarm = res.data[0];
          setSelectedFarmId(firstFarm.id);
          setLatitude(firstFarm.latitude);
          setLongitude(firstFarm.longitude);
          setLocation(firstFarm.location || [firstFarm.district, firstFarm.province].filter(Boolean).join(', ') || 'Ampara, Eastern Province');
          if (firstFarm.crop) setCropType(firstFarm.crop);
        }
      } catch (err) {
        console.warn('Could not load farms list:', err.message);
      }
    }
    loadFarms();
  }, []);

  const handleFarmSelect = (farmId) => {
    setSelectedFarmId(farmId);
    const farm = farms.find((f) => String(f.id) === String(farmId));
    if (farm) {
      setLatitude(farm.latitude);
      setLongitude(farm.longitude);
      setLocation(farm.location || [farm.district, farm.province].filter(Boolean).join(', ') || 'Ampara, Eastern Province');
      if (farm.crop) setCropType(farm.crop);
    }
  };

  // Sample presets for quick testing of authentic scenarios
  const samplePresets = [
    {
      label: 'Sample: Paddy Blast (High Confidence)',
      crop: 'Paddy (Rice)',
      variety: 'Samba',
      symptoms: 'Spindle-shaped spots with diamond center, necrotic leaf lesions, leaf drying',
      preview: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?w=600&auto=format&fit=crop&q=80',
    },
    {
      label: 'Sample: Ambiguous Foliar Wilting (Low Confidence <75%)',
      crop: 'Paddy (Rice)',
      variety: 'Bg 352',
      symptoms: 'Atypical diffuse chlorosis and mild leaf tips yellowing, non-specific etiology',
      preview: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&auto=format&fit=crop&q=80',
    },
    {
      label: 'Sample: Tomato Early Blight',
      crop: 'Tomato',
      variety: 'Thilina',
      symptoms: 'Concentric dark rings and yellow halos on bottom leaves, stem lesions',
      preview: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&auto=format&fit=crop&q=80',
    },
    {
      label: 'Sample: Tea Blister Blight (High Severity)',
      crop: 'Tea',
      variety: 'TRI-2043',
      symptoms: 'Translucent blister-like circular spots on tender flush leaves, curling margins',
      preview: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const handleApplyPreset = (preset) => {
    setCropType(preset.crop);
    setVariety(preset.variety);
    setSymptoms(preset.symptoms);
    setImagePreview(preset.preview);
    setSelectedImage({ name: `${preset.crop.toLowerCase()}-specimen.jpg` });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);

      // Convert to Base64 for Vision API payload
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [errorMessage, setErrorMessage] = useState(null);

  const handleStartAnalysis = async () => {
    const normalizedCropType = cropType?.trim();
    const normalizedLocation = location?.trim();
    if (!normalizedCropType || !normalizedLocation) {
      setErrorMessage('Please enter both a crop type and a farm location before starting the AI diagnosis.');
      setStep(1);
      return;
    }

    setAnalyzing(true);
    setErrorMessage(null);
    setAnalysisProgress(15);
    setAnalysisStage('Extracting foliar pathology features & inspecting leaf lesions...');

    const timer1 = setTimeout(() => {
      setAnalysisProgress(40);
      setAnalysisStage('Analyzing cellular symptoms with Gemini Vision & PlantVillage pathology model...');
    }, 800);

    const timer2 = setTimeout(() => {
      setAnalysisProgress(70);
      setAnalysisStage('Retrieving real micro-climate telemetry from Open-Meteo for farm coordinates...');
    }, 1600);

    const timer3 = setTimeout(() => {
      setAnalysisProgress(90);
      setAnalysisStage('Evaluating epidemiological spread risk and regional outbreak vectors...');
    }, 2400);

    try {
      const payload = {
        cropType: normalizedCropType,
        variety,
        location: normalizedLocation,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        farmId: selectedFarmId ? Number(selectedFarmId) : null,
        fieldArea,
        cropStage,
        symptoms,
        imageUrl: imagePreview,
        imageBase64,
        language,
      };

      const res = await casesAPI.create(payload);

      setTimeout(() => {
        setAnalyzing(false);
        const createdId = res?.data?.id || res?.id;
        if (!createdId) {
          setErrorMessage('AI diagnosis completed, but the created case ID was not returned. Please check your cases list.');
          return;
        }
        navigate(`/farmer/diagnosis/${createdId}`);
      }, 2900);
    } catch (err) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setAnalyzing(false);
      setErrorMessage(err.message || 'Failed to submit case for AI diagnosis. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {errorMessage && (
        <Toast
          message={errorMessage}
          type="error"
          onClose={() => setErrorMessage(null)}
        />
      )}

      <PageHeader
        title={t('stepTitle')}
        subtitle="Upload clear foliar photos to receive instant pathogen identification, live micro-climate telemetry, and language-specific agronomic advice."
      />

      {/* Stepper Indicators */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        {[
          { num: 1, title: t('selectCrop') },
          { num: 2, title: t('uploadPhoto') },
          { num: 3, title: t('submitScan') },
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
        <div className="fixed inset-0 bg-emerald-950/85 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-emerald-400 animate-pulse">
              <FiCpu size={36} />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">AgroGuard AI Multilingual Diagnosis</h3>
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
          <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{t('selectCrop')} & Location</h3>
              <p className="text-xs text-gray-500">Specify farm coordinates and crop to calibrate environmental risk engine</p>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
              <FiGlobe className="text-emerald-700 text-sm" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-xs font-semibold bg-transparent text-gray-700 focus:outline-none"
              >
                <option value="en">English (Default)</option>
                <option value="si">සිංහල (Sinhala)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Select Farm */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t('selectFarm')} *
              </label>
              {farms.length > 0 ? (
                <select
                  value={selectedFarmId}
                  onChange={(e) => handleFarmSelect(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      🏡 {f.farmName || 'Registered farm'} — {[f.district, f.province].filter(Boolean).join(', ') || 'Location not specified'} ({f.crop || 'Paddy'}, {f.area || '1.0 acre'}) [Lat: {f.latitude}, Lng: {f.longitude}]
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-xs text-gray-500 italic">No registered farms found. Using default Eastern Province coordinates.</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Target Crop *</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Paddy (Rice)">{t('cropPaddy')}</option>
                <option value="Tea">{t('cropTea')}</option>
                <option value="Chilli">{t('cropChilli')}</option>
                <option value="Tomato">{t('cropTomato')}</option>
                <option value="Corn / Maize">{t('cropCorn')}</option>
                <option value="Potato">{t('cropPotato')}</option>
                <option value="Banana">{t('cropBanana')}</option>
                <option value="Coconut">{t('cropCoconut')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Cultivar / Variety</label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="e.g. Bg 352, Keeri Samba, TRI-2043"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Location Name *</label>
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
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">GPS Latitude & Longitude</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value))}
                  placeholder="Latitude (e.g. 7.2833)"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono"
                />
                <input
                  type="number"
                  step="0.0001"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value))}
                  placeholder="Longitude (e.g. 81.6667)"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono"
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
                placeholder="e.g. 1.2 acres"
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
            <h3 className="text-lg font-bold text-gray-900">{t('uploadPhoto')} & Symptoms</h3>
            <p className="text-xs text-gray-500">{t('uploadHint')}</p>
          </div>

          {/* Quick Demo Presets */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 mb-2">
              <RiPulseLine size={16} className="text-emerald-700" />
              <span>Diagnostic Testing Presets (High Confidence vs Ambiguous Escalation)</span>
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
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Foliar Specimen Image *</label>
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
                      Ready for Gemini Vision
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
                  <p className="text-xs text-gray-400">Supports JPG, PNG, WEBP. Focus closely on diseased leaf patches or lesions.</p>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Observable symptoms */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {t('enterSymptoms')}
            </label>
            <textarea
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe discoloration, shape of lesions, wilting, or when symptoms first appeared..."
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
                  Specimen Metadata
                </h4>
                <div className="flex justify-between">
                  <span className="text-gray-500">Language:</span>
                  <span className="font-bold text-emerald-700 uppercase">{language} ({language === 'si' ? 'සිංහල' : language === 'ta' ? 'தமிழ்' : 'English'})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Crop Type:</span>
                  <span className="font-semibold text-gray-800">{cropType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cultivar:</span>
                  <span className="font-semibold text-gray-800">{variety || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-semibold text-gray-800">{location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">GPS Coordinates:</span>
                  <span className="font-mono text-gray-800">{latitude}, {longitude}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Field Plot:</span>
                  <span className="font-semibold text-gray-800">{fieldArea}</span>
                </div>
              </div>

              <div className="bg-blue-50/70 rounded-xl p-4 border border-blue-200 text-xs">
                <h4 className="font-bold text-blue-900 flex items-center gap-1.5 mb-1.5">
                  <RiRadarLine size={15} /> Real-time Open-Meteo Weather Attached
                </h4>
                <p className="text-blue-800/80 leading-relaxed">
                  The system will automatically query live humidity, rainfall, and leaf wetness for ({latitude}, {longitude}) to calculate fungal pathogen proliferation risk.
                </p>
              </div>

              <div className="bg-amber-50/70 rounded-xl p-3 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <FiAlertTriangle className="text-amber-600 mt-0.5 flex-shrink-0" size={15} />
                <span>
                  <strong>Strict Confidence Triage Rule:</strong> Diagnoses with &lt;75% confidence will be immediately escalated to an agricultural extension officer to prevent misinformed chemical treatments.
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2">Specimen Leaf Image</h4>
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100 h-56 flex items-center justify-center">
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
                <span className="font-semibold text-gray-700">Observed symptoms:</span> {symptoms}
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