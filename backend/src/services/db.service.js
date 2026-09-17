const bcrypt = require('bcryptjs');
const { supabase, isSupabaseConfigured } = require('../config/supabase');
const {
  mapUser,
  mapFarm,
  mapCase,
  mapVisit,
  mapAlert,
  mapNotification,
  mapOutbreak,
  toUserInsert,
  toFarmInsert,
  toCaseInsert,
  toVisitInsert,
  toCaseUpdate,
} = require('../utils/mappers');

// Default BCrypt Hash for 'password123'
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('password123', 10);

// In-Memory Fallback & Sync Store
let inMemoryStore = {
  users: [
    {
      id: 1,
      name: 'Ruwan Perera',
      email: 'ruwan@farm.lk',
      password_hash: DEFAULT_PASSWORD_HASH,
      role: 'farmer',
      avatar: 'RP',
      phone: '+94 77 123 4567',
      location: 'Ampara, Eastern Province',
      farmLocation: 'Ampara, Eastern Province',
      status: 'active',
      district: 'Ampara',
      farmSize: '2.4 acres',
      cases: 12,
      createdAt: '2026-01-15T08:00:00Z',
    },
    {
      id: 2,
      name: 'Dr. Anura Bandara',
      email: 'anura@agridept.gov.lk',
      password_hash: DEFAULT_PASSWORD_HASH,
      role: 'officer',
      avatar: 'AB',
      phone: '+94 71 987 6543',
      location: 'Batticaloa & Ampara',
      status: 'active',
      district: 'Eastern Division',
      badgeId: 'AGO-2024-045',
      institution: 'Department of Agriculture',
      specialization: 'Crop Protection',
      cases: 48,
      createdAt: '2026-01-05T08:00:00Z',
    },
    {
      id: 3,
      name: 'Prof. Dhammika Silva',
      email: 'dhammika@cri.lk',
      password_hash: DEFAULT_PASSWORD_HASH,
      role: 'research',
      avatar: 'DS',
      phone: '+94 76 345 6789',
      location: 'Peradeniya CRI',
      status: 'active',
      institution: 'Crop Research Institute',
      specialization: 'Plant Pathology & Epidemiology',
      cases: 120,
      createdAt: '2026-01-01T08:00:00Z',
    },
    {
      id: 4,
      name: 'System Administrator',
      email: 'admin@agroguard.gov.lk',
      password_hash: DEFAULT_PASSWORD_HASH,
      role: 'admin',
      avatar: 'SA',
      phone: '+94 11 234 5678',
      location: 'Central Operations, Colombo',
      status: 'active',
      district: 'National HQ',
      badgeId: 'ADM-001',
      permissions: ['all'],
      cases: 34,
      createdAt: '2026-01-01T08:00:00Z',
    },
    {
      id: 5,
      name: 'Chamara Bandara',
      email: 'chamara@farm.lk',
      password_hash: DEFAULT_PASSWORD_HASH,
      role: 'farmer',
      avatar: 'CB',
      phone: '+94 77 234 5678',
      location: 'Kurunegala, North Western Province',
      farmLocation: 'Kurunegala',
      status: 'active',
      farmSize: '3.5 acres',
      cases: 5,
      createdAt: '2026-02-20T08:00:00Z',
    },
    {
      id: 6,
      name: 'Priya Jayawardena',
      email: 'priya@farm.lk',
      password_hash: DEFAULT_PASSWORD_HASH,
      role: 'farmer',
      avatar: 'PJ',
      phone: '+94 77 345 6789',
      location: 'Puttalam, North Western Province',
      farmLocation: 'Puttalam',
      status: 'active',
      farmSize: '5.0 acres',
      cases: 8,
      createdAt: '2026-03-10T08:00:00Z',
    },
    {
      id: 7,
      name: 'Nimali Fernando',
      email: 'nimali@agri.gov.lk',
      password_hash: DEFAULT_PASSWORD_HASH,
      role: 'officer',
      avatar: 'NF',
      phone: '+94 71 234 5678',
      location: 'Kandy District',
      status: 'active',
      district: 'Kandy District',
      badgeId: 'AGO-2024-089',
      cases: 47,
      createdAt: '2026-01-05T08:00:00Z',
    },
    {
      id: 8,
      name: 'Dr. Kasun Silva',
      email: 'kasun@research.lk',
      password_hash: DEFAULT_PASSWORD_HASH,
      role: 'research',
      avatar: 'KS',
      location: 'Peradeniya',
      status: 'active',
      institution: 'Dept. of Agriculture',
      specialization: 'Plant Pathology',
      cases: 0,
      createdAt: '2026-01-01T08:00:00Z',
    },
    {
      id: 9,
      name: 'Central Admin',
      email: 'admin@agroguard.lk',
      password_hash: DEFAULT_PASSWORD_HASH,
      role: 'admin',
      avatar: 'SA',
      location: 'Colombo',
      status: 'active',
      permissions: ['all'],
      cases: 10,
      createdAt: '2026-01-01T08:00:00Z',
    },
  ],

  farms: [
    { id: 1, farmerId: 1, farmName: 'Jayabima Paddy Holding', crop: 'Paddy (Rice)', variety: 'Samba / Bg 352', latitude: 7.2912, longitude: 81.6724, district: 'Ampara', province: 'Eastern Province', area: '2.4 acres', createdAt: '2026-01-15T08:00:00Z' },
    { id: 2, farmerId: 1, farmName: 'Samanala Tea Plot', crop: 'Tea', variety: 'TRI-2043', latitude: 6.9497, longitude: 80.7891, district: 'Nuwara Eliya', province: 'Central Province', area: '1.5 acres', createdAt: '2026-01-20T08:00:00Z' },
    { id: 3, farmerId: 5, farmName: 'Wayamba Maize Fields', crop: 'Maize (Corn)', variety: 'NK-6240', latitude: 7.4863, longitude: 80.3623, district: 'Kurunegala', province: 'North Western Province', area: '3.5 acres', createdAt: '2026-02-20T08:00:00Z' },
    { id: 4, farmerId: 6, farmName: 'Puttalam Palm Estate', crop: 'Coconut', variety: 'Sri Lanka Tall', latitude: 8.0362, longitude: 79.8283, district: 'Puttalam', province: 'North Western Province', area: '5.0 acres', createdAt: '2026-03-10T08:00:00Z' },
    { id: 5, farmerId: 1, farmName: 'Uva Green Tomato Farm', crop: 'Tomato', variety: 'Thilina', latitude: 6.9934, longitude: 81.0550, district: 'Badulla', province: 'Uva Province', area: '0.5 acres', createdAt: '2026-03-15T08:00:00Z' },
    { id: 6, farmerId: 10, farmName: 'Ampara East Paddy Field', crop: 'Paddy (Rice)', variety: 'Bg 358', latitude: 7.3050, longitude: 81.6810, district: 'Ampara', province: 'Eastern Province', area: '3.0 acres', createdAt: '2026-04-01T08:00:00Z' },
    { id: 7, farmerId: 11, farmName: 'Digamadulla Holdings', crop: 'Paddy (Rice)', variety: 'At 362', latitude: 7.3200, longitude: 81.6950, district: 'Ampara', province: 'Eastern Province', area: '4.2 acres', createdAt: '2026-04-05T08:00:00Z' },
    { id: 8, farmerId: 12, farmName: 'Uhana Rice Project', crop: 'Paddy (Rice)', variety: 'Bw 367', latitude: 7.3600, longitude: 81.6500, district: 'Ampara', province: 'Eastern Province', area: '2.8 acres', createdAt: '2026-04-10T08:00:00Z' },
    { id: 9, farmerId: 13, farmName: 'Polonnaruwa Harvest Farm', crop: 'Paddy (Rice)', variety: 'Keeri Samba', latitude: 7.9403, longitude: 81.0188, district: 'Polonnaruwa', province: 'North Central Province', area: '6.0 acres', createdAt: '2026-04-12T08:00:00Z' },
  ],

  cases: [
    {
      id: 'CASE-001',
      farmId: 1,
      cropType: 'Paddy (Rice)',
      variety: 'Samba',
      location: 'Ampara, Eastern Province',
      latitude: 7.2912,
      longitude: 81.6724,
      disease: 'Blast Disease',
      scientificName: 'Magnaporthe oryzae',
      confidence: 94,
      severity: 'high',
      status: 'confirmed',
      spreadRisk: 78,
      language: 'en',
      submittedAt: '2026-09-11T10:30:00Z',
      updatedAt: '2026-09-11T14:20:00Z',
      farmerId: 1,
      farmerName: 'Ruwan Perera',
      officerId: 2,
      imageUrl: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?w=800',
      symptoms: 'Diamond-shaped lesions with gray centers on leaves, brownish margins, neck rot visible',
      weatherContext: { humidity: 87, temp: 28, rainfall: 12 },
      nearbyAlerts: 3,
      treatmentSteps: [
        'Remove and destroy severely infected plant parts immediately',
        'Apply Tricyclazole (Beam) @ 0.6g/L or Isoprothiolane (Fuji-One) @ 1.5ml/L',
        'Ensure proper field drainage to reduce persistent leaf humidity',
        'Avoid excessive nitrogen application; balance with muriate of potash',
        'Monitor neighboring fields and alert farmers within 2km radius',
      ],
      preventionSteps: [
        'Plant certified resistant cultivars (Bg 358, Bg 379/2)',
        'Maintain balanced fertilization with split potassium doses',
        'Avoid late-season planting when morning dew duration exceeds 8 hours',
      ],
      affectedArea: '0.8 acres',
      estimatedLoss: '35%',
      officerNotes: 'Field symptoms match typical blast lesions. Spore count accelerated by recent morning dew. Approved application of systemic fungicide.',
      officerVerified: true,
      verifiedDisease: 'Blast Disease',
      verifiedSeverity: 'high',
      verifiedAt: '2026-09-11T14:20:00Z',
      verifiedBy: 2,
    },
    {
      id: 'CASE-002',
      farmId: 2,
      cropType: 'Tea',
      variety: 'TRI-2043',
      location: 'Nuwara Eliya, Central Province',
      latitude: 6.9497,
      longitude: 80.7891,
      disease: 'Blister Blight',
      scientificName: 'Exobasidium vexans',
      confidence: 89,
      severity: 'medium',
      status: 'escalated',
      spreadRisk: 62,
      language: 'en',
      submittedAt: '2026-09-10T08:15:00Z',
      updatedAt: '2026-09-10T16:45:00Z',
      farmerId: 1,
      farmerName: 'Ruwan Perera',
      officerId: null,
      imageUrl: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800',
      symptoms: 'Pale green translucent spots on young leaves, white powdery growth on underside',
      weatherContext: { humidity: 92, temp: 18, rainfall: 28 },
      nearbyAlerts: 1,
      treatmentSteps: [
        'Apply copper-based fungicides (Copper oxychloride) at 2.5g/L',
        'Improve air circulation by proper pruning',
        'Avoid working in wet conditions to prevent spread',
        'Apply systemic fungicide Hexaconazole @ 2ml/10L',
      ],
      preventionSteps: [
        'Regulate shade trees to allow morning sun penetration',
        'Prune bushes on correct schedule',
        'Harvest tender flush systematically',
      ],
      affectedArea: '1.2 acres',
      estimatedLoss: '20%',
      escalationReason: 'Unusually fast spread on tender flush leaves despite initial copper spray.',
      officerVerified: false,
    },
    {
      id: 'CASE-003',
      farmId: 3,
      cropType: 'Maize (Corn)',
      variety: 'NK-6240',
      location: 'Kurunegala, North Western Province',
      latitude: 7.4863,
      longitude: 80.3623,
      disease: 'Fall Armyworm',
      scientificName: 'Spodoptera frugiperda',
      confidence: 97,
      severity: 'critical',
      status: 'pending',
      spreadRisk: 91,
      language: 'en',
      submittedAt: '2026-09-11T06:00:00Z',
      updatedAt: '2026-09-11T06:00:00Z',
      farmerId: 5,
      farmerName: 'Chamara Bandara',
      officerId: null,
      imageUrl: 'https://images.unsplash.com/photo-1551893478-d726eaf0442c?w=800',
      symptoms: 'Ragged holes in leaves, frass in whorls, irregular window feeding on leaves',
      weatherContext: { humidity: 75, temp: 32, rainfall: 0 },
      nearbyAlerts: 4,
      treatmentSteps: [
        'Apply Emamectin benzoate (Proclaim) @ 0.4g/L immediately',
        'Use Spinetoram (Delegate) @ 0.5ml/L for effective control',
        'Set up pheromone traps (5 per acre) for monitoring',
        'Alert neighboring maize farmers within 5km radius',
        'Conduct scouting every 3 days',
      ],
      preventionSteps: [
        'Synchronized planting across adjacent blocks',
        'Intercrop with non-host pulses',
        'Handpick egg masses and young larvae during early whorl stage',
      ],
      affectedArea: '3.5 acres',
      estimatedLoss: '60%',
      escalationReason: 'Critical pest severity detected automatically by AI.',
      officerVerified: false,
    },
    {
      id: 'CASE-004',
      farmId: 4,
      cropType: 'Coconut',
      variety: 'Sri Lanka Tall',
      location: 'Puttalam, North Western Province',
      latitude: 8.0362,
      longitude: 79.8283,
      disease: 'Weligama Coconut Leaf Wilt',
      scientificName: 'Phytoplasma sp.',
      confidence: 71,
      severity: 'high',
      status: 'escalated',
      spreadRisk: 85,
      language: 'en',
      submittedAt: '2026-09-09T11:00:00Z',
      updatedAt: '2026-09-10T09:30:00Z',
      farmerId: 6,
      farmerName: 'Priya Jayawardena',
      officerId: 2,
      imageUrl: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?w=800',
      symptoms: 'Yellowing of lower fronds, premature nut fall, reduction in inflorescences',
      weatherContext: { humidity: 80, temp: 30, rainfall: 5 },
      nearbyAlerts: 2,
      treatmentSteps: [
        'Remove and burn all infected palms immediately',
        'Apply oxytetracycline injections to early-stage infected palms',
        'Control insect vectors (leafhopper) using insecticides',
        'Quarantine the affected area',
        'Report to Coconut Cultivation Board immediately',
      ],
      preventionSteps: [
        'Plant vector-tolerant coconut varieties',
        'Regular weed sanitation to suppress vector habitats',
        'Strict quarantine on transport of planting material',
      ],
      affectedArea: '5 acres',
      estimatedLoss: '45%',
      escalationReason: 'Low AI confidence (71%) on leaf wilt. Automatically escalated for field officer validation.',
      officerVerified: false,
    },
    {
      id: 'CASE-005',
      farmId: 5,
      cropType: 'Tomato',
      variety: 'Thilina',
      location: 'Badulla, Uva Province',
      latitude: 6.9934,
      longitude: 81.0550,
      disease: 'Late Blight',
      scientificName: 'Phytophthora infestans',
      confidence: 91,
      severity: 'high',
      status: 'treated',
      spreadRisk: 45,
      language: 'en',
      submittedAt: '2026-09-08T14:00:00Z',
      updatedAt: '2026-09-09T10:00:00Z',
      farmerId: 1,
      farmerName: 'Ruwan Perera',
      officerId: 2,
      imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800',
      symptoms: 'Water-soaked lesions on leaves, white mold on undersides, brown stem lesions',
      weatherContext: { humidity: 90, temp: 22, rainfall: 18 },
      nearbyAlerts: 1,
      treatmentSteps: [
        'Apply Metalaxyl + Mancozeb (Ridomil Gold) @ 2.5g/L',
        'Remove affected plant material and dispose properly',
        'Improve drainage and reduce leaf wetness',
        'Apply preventive copper sprays every 7 days',
      ],
      preventionSteps: [
        'Avoid overhead irrigation',
        'Stake plants and mulch soil',
        'Rotate with non-solanaceous crops',
      ],
      affectedArea: '0.5 acres',
      estimatedLoss: '25%',
      officerVerified: true,
      verifiedDisease: 'Late Blight',
      verifiedSeverity: 'high',
      verifiedAt: '2026-09-09T10:00:00Z',
      verifiedBy: 2,
    },
    {
      id: 'CASE-006',
      farmId: 6,
      cropType: 'Paddy (Rice)',
      variety: 'Bg 358',
      location: 'Ampara East, Eastern Province',
      latitude: 7.3050,
      longitude: 81.6810,
      disease: 'Blast Disease',
      scientificName: 'Magnaporthe oryzae',
      confidence: 92,
      severity: 'high',
      status: 'confirmed',
      spreadRisk: 82,
      language: 'en',
      submittedAt: '2026-09-11T16:00:00Z',
      updatedAt: '2026-09-11T18:30:00Z',
      farmerId: 10,
      farmerName: 'Sunil Jayasuriya',
      officerId: 2,
      imageUrl: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?w=800',
      symptoms: 'Spindle-shaped brown lesions with gray centers spreading rapidly across leaf blades',
      weatherContext: { humidity: 88, temp: 28, rainfall: 15 },
      nearbyAlerts: 3,
      treatmentSteps: [
        'Apply Tricyclazole @ 0.6g/L immediately',
        'Drain stagnant water from paddy bunds',
        'Suspend nitrogen top dressing',
      ],
      preventionSteps: [
        'Plant resistant varieties',
        'Maintain wide spacing for air ventilation',
      ],
      affectedArea: '1.5 acres',
      estimatedLoss: '30%',
      officerNotes: 'Matches neighboring CASE-001 spore propagation pattern. Confirmed.',
      officerVerified: true,
      verifiedDisease: 'Blast Disease',
      verifiedSeverity: 'high',
      verifiedAt: '2026-09-11T18:30:00Z',
      verifiedBy: 2,
    },
    {
      id: 'CASE-007',
      farmId: 7,
      cropType: 'Paddy (Rice)',
      variety: 'At 362',
      location: 'Digamadulla, Eastern Province',
      latitude: 7.3200,
      longitude: 81.6950,
      disease: 'Blast Disease',
      scientificName: 'Magnaporthe oryzae',
      confidence: 95,
      severity: 'critical',
      status: 'confirmed',
      spreadRisk: 88,
      language: 'en',
      submittedAt: '2026-09-11T19:00:00Z',
      updatedAt: '2026-09-11T20:45:00Z',
      farmerId: 11,
      farmerName: 'Kithsiri Gamage',
      officerId: 2,
      imageUrl: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?w=800',
      symptoms: 'Brownish necrotic lesions on flag leaves, neck blast symptoms emerging',
      weatherContext: { humidity: 89, temp: 27, rainfall: 18 },
      nearbyAlerts: 3,
      treatmentSteps: [
        'Urgent application of Isoprothiolane @ 1.5ml/L',
        'Create buffer isolation strip around affected blocks',
        'Alert regional extension center',
      ],
      preventionSteps: [
        'Treat seeds with carbendazim prior to sowing',
        'Avoid late season nitrogen application',
      ],
      affectedArea: '2.0 acres',
      estimatedLoss: '45%',
      officerNotes: 'Third confirmed blast case in 5km corridor. Urgent outbreak response triggered.',
      officerVerified: true,
      verifiedDisease: 'Blast Disease',
      verifiedSeverity: 'critical',
      verifiedAt: '2026-09-11T20:45:00Z',
      verifiedBy: 2,
    },
  ],

  fieldVisits: [
    {
      id: 'VISIT-001',
      farmerId: 1,
      farmerName: 'Ruwan Perera',
      caseId: 'CASE-001',
      location: 'Ampara, Eastern Province',
      cropType: 'Paddy (Rice)',
      scheduledDate: '2026-09-14',
      status: 'scheduled',
      priority: 'high',
      notes: 'Verify Blast Disease spore density and supply bio-control recommendations.',
    },
    {
      id: 'VISIT-002',
      farmerId: 5,
      farmerName: 'Chamara Bandara',
      caseId: 'CASE-003',
      location: 'Kurunegala, NW Province',
      cropType: 'Maize',
      scheduledDate: '2026-09-13',
      status: 'completed',
      priority: 'critical',
      notes: 'Fall armyworm pheromone traps deployed successfully.',
      observedSymptoms: 'Larval frass in 40% of whorls inspected. First instar larvae confirmed.',
      confirmedDisease: 'Fall Armyworm',
      verifiedSeverity: 'critical',
      recommendation: 'Deploy synchronized Emamectin benzoate application across 3 adjacent farms.',
      completedAt: '2026-09-11T15:00:00Z',
    },
    {
      id: 'VISIT-003',
      farmerId: 6,
      farmerName: 'Priya Jayawardena',
      caseId: 'CASE-004',
      location: 'Puttalam, NW Province',
      cropType: 'Coconut',
      scheduledDate: '2026-09-15',
      status: 'scheduled',
      priority: 'high',
      notes: 'Assess Weligama leaf wilt symptom spread and vector management protocol.',
    },
    {
      id: 'VISIT-004',
      farmerId: 11,
      farmerName: 'Kithsiri Gamage',
      caseId: 'CASE-007',
      location: 'Digamadulla, Eastern Province',
      cropType: 'Paddy (Rice)',
      scheduledDate: '2026-09-11',
      status: 'completed',
      priority: 'critical',
      notes: 'Emergency cluster verification for Ampara Rice Belt.',
      observedSymptoms: 'Neck blast sporulation visible on 30% of hills. Severe leaf necrosis.',
      confirmedDisease: 'Blast Disease',
      verifiedSeverity: 'critical',
      recommendation: 'Quarantine block 3, initiate spray buffer, alert all farms within 10km.',
      completedAt: '2026-09-11T20:45:00Z',
    },
  ],

  outbreaks: [
    { id: 1, disease: 'Blast Disease', crop: 'Paddy (Rice)', region: 'Eastern Province', district: 'Ampara', centerLat: 7.3054, centerLng: 81.6828, radiusKm: 10.0, activeCases: 3, affectedFarms: 4, trend: 'rising', severity: 'critical', status: 'confirmed', confirmedBy: 4, confirmedAt: '2026-09-11T21:00:00Z', lastUpdated: '2026-09-11' },
    { id: 2, disease: 'Fall Armyworm', crop: 'Maize (Corn)', region: 'North Western Province', district: 'Kurunegala', centerLat: 7.4863, centerLng: 80.3623, radiusKm: 15.0, activeCases: 1, affectedFarms: 1, trend: 'rising', severity: 'high', status: 'potential', confirmedBy: null, confirmedAt: null, lastUpdated: '2026-09-11' },
    { id: 3, disease: 'Blister Blight', crop: 'Tea', region: 'Central Province', district: 'Nuwara Eliya', centerLat: 6.9497, centerLng: 80.7891, radiusKm: 8.0, activeCases: 1, affectedFarms: 1, trend: 'stable', severity: 'medium', status: 'potential', confirmedBy: null, confirmedAt: null, lastUpdated: '2026-09-10' },
  ],

  alerts: [
    {
      id: 1,
      province: 'Eastern Province',
      threatLevel: 'Critical',
      cropTarget: 'Paddy (Rice)',
      message: 'Confirmed Blast Disease Outbreak Cluster in Ampara Agrarian Division. 3 active confirmed foci within 4.2 km. Neighboring farms within 10 km must apply preventive fungicide immediately.',
      createdAt: '2026-09-11T12:00:00Z',
    },
    {
      id: 2,
      province: 'North Western Province',
      threatLevel: 'High',
      cropTarget: 'Maize',
      message: 'Fall Armyworm active watch triggered across Kurunegala and Puttalam. Inspect maize whorls immediately.',
      createdAt: '2026-09-10T10:00:00Z',
    },
  ],

  notifications: [
    { id: 1, userId: 1, text: 'URGENT: Blast Disease outbreak confirmed within 2.1 km of your farm Jayabima Holding. Inspect bunds immediately.', time: '2m ago', type: 'alert', isRead: false, link: '/farmer/cases', createdAt: '2026-09-11T21:02:00Z' },
    { id: 2, userId: 1, text: 'Your case CASE-001 has been confirmed by officer Dr. Anura Bandara', time: '1h ago', type: 'success', isRead: false, link: '/farmer/diagnosis/CASE-001', createdAt: '2026-09-11T14:20:00Z' },
    { id: 3, userId: 1, text: 'Treatment reminder: Apply Tricyclazole spray today before morning dew', time: '3h ago', type: 'info', isRead: false, link: '/farmer/diagnosis/CASE-001', createdAt: '2026-09-11T12:00:00Z' },
    { id: 4, userId: 2, text: 'CASE-004 escalated to you: Low confidence AI diagnosis requires field verification in Puttalam.', time: '30m ago', type: 'alert', isRead: false, link: '/officer/case/CASE-004', createdAt: '2026-09-11T20:30:00Z' },
    { id: 5, userId: 11, text: 'Field inspection completed for CASE-007 by Dr. Anura Bandara. Case marked confirmed.', time: '3h ago', type: 'success', isRead: true, link: '/farmer/diagnosis/CASE-007', createdAt: '2026-09-11T20:45:00Z' },
  ],

  activityLogs: [],
};

// Auto-increment helpers
let caseCounter = 8;
let farmCounter = 10;
let visitCounter = 5;
let alertCounter = 3;
let notifCounter = 6;
let userCounter = 14;

function filterCases(cases, { farmerId, status, search, role } = {}) {
  let result = [...cases];
  if (role === 'farmer' && farmerId) {
    result = result.filter(c => Number(c.farmerId) === Number(farmerId));
  }
  if (status && status !== 'all') {
    result = result.filter(c => c.status?.toLowerCase() === String(status).toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(c =>
      (c.cropType || '').toLowerCase().includes(q) ||
      (c.farmerName || '').toLowerCase().includes(q) ||
      (c.location || '').toLowerCase().includes(q) ||
      (c.disease || '').toLowerCase().includes(q)
    );
  }
  return result.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
}

class DBService {
  async getUserByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('users').select('*').eq('email', cleanEmail).single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[DBService] Supabase getUserByEmail error:', err.message);
      }
    }

    return inMemoryStore.users.find(u => u.email.toLowerCase() === cleanEmail) || null;
  }

  async getUserById(id) {
    if (!id) return null;
    const numId = Number(id);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('users').select('*').eq('id', numId).single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[DBService] Supabase getUserById error:', err.message);
      }
    }

    return inMemoryStore.users.find(u => u.id === numId) || null;
  }

  async getAllUsers(search = '') {
    const attachCounts = (users) => {
      const counts = inMemoryStore.cases.reduce((acc, c) => {
        acc[c.farmerId] = (acc[c.farmerId] || 0) + 1;
        return acc;
      }, {});
      return users.map((u) => mapUser({ ...u, cases: u.cases || counts[u.id] || 0 }));
    };

    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('users').select('id, name, email, role, location, status, district, farm_size, phone, avatar, created_at');
        if (search) {
          query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,role.ilike.%${search}%,location.ilike.%${search}%`);
        }
        const { data, error } = await query;
        if (!error && data) return attachCounts(data);
      } catch (err) {
        console.warn('[DBService] Supabase getAllUsers error:', err.message);
      }
    }

    const s = search.toLowerCase();
    return attachCounts(
      inMemoryStore.users.filter(u =>
        !s ||
        u.name.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s) ||
        u.role.toLowerCase().includes(s) ||
        (u.location && u.location.toLowerCase().includes(s))
      )
    );
  }

  async createUser(userData) {
    const newUser = {
      id: userCounter++,
      name: userData.name,
      email: userData.email.trim().toLowerCase(),
      password_hash: userData.password ? bcrypt.hashSync(userData.password, 10) : DEFAULT_PASSWORD_HASH,
      role: userData.role || 'farmer',
      avatar: userData.avatar || (userData.name ? userData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'),
      phone: userData.phone || '',
      location: userData.location || '',
      farmLocation: userData.location || '',
      status: 'active',
      district: userData.district || '',
      farmSize: userData.farmSize || '1.0 acre',
      cases: 0,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('users').insert([toUserInsert(newUser)]).select().single();
        if (!error && data) {
          inMemoryStore.users.push({ ...newUser, id: data.id });
          return { ...newUser, id: data.id };
        }
      } catch (err) {
        console.warn('[DBService] Supabase createUser error:', err.message);
      }
    }

    inMemoryStore.users.push(newUser);
    return newUser;
  }

  async updateUserStatus(id, status) {
    const numId = Number(id);
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('users').update({ status, updated_at: new Date().toISOString() }).eq('id', numId).select().single();
        if (!error && data) {
          const idx = inMemoryStore.users.findIndex(u => u.id === numId);
          if (idx !== -1) inMemoryStore.users[idx].status = status;
          return mapUser(data);
        }
      } catch (err) {
        console.warn('[DBService] Supabase updateUserStatus error:', err.message);
      }
    }

    const user = inMemoryStore.users.find(u => u.id === numId);
    if (user) user.status = status;
    return mapUser(user);
  }

  async getCases(filters = {}) {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('cases').select('*').order('created_at', { ascending: false });
        if (filters.role === 'farmer' && filters.farmerId) {
          query = query.eq('farmer_id', Number(filters.farmerId));
        }
        if (filters.status && filters.status !== 'all') {
          query = query.eq('status', filters.status);
        }
        const { data, error } = await query;
        if (!error && data) {
          return filterCases(data.map(mapCase), filters);
        }
      } catch (err) {
        console.warn('[DBService] Supabase getCases error:', err.message);
      }
    }

    return filterCases(inMemoryStore.cases.map(mapCase), filters);
  }

  async getCaseById(id) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('cases').select('*').eq('id', id).single();
        if (!error && data) return mapCase(data);
      } catch (err) {
        console.warn('[DBService] Supabase getCaseById error:', err.message);
      }
    }
    return mapCase(inMemoryStore.cases.find(c => c.id === id) || null);
  }

  async getFarms(filters = {}) {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('farms').select('*').order('id', { ascending: true });
        if (filters.farmerId) {
          query = query.eq('farmer_id', Number(filters.farmerId));
        }
        const { data, error } = await query;
        if (!error && data) return data.map(mapFarm);
      } catch (err) {
        console.warn('[DBService] Supabase getFarms error:', err.message);
      }
    }

    let farms = [...(inMemoryStore.farms || [])];
    if (filters.farmerId) {
      farms = farms.filter(f => Number(f.farmerId) === Number(filters.farmerId));
    }
    return farms.map(mapFarm);
  }

  async getFarmById(id) {
    const numId = Number(id);
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('farms').select('*').eq('id', numId).single();
        if (!error && data) return mapFarm(data);
      } catch (err) {
        console.warn('[DBService] Supabase getFarmById error:', err.message);
      }
    }
    return mapFarm((inMemoryStore.farms || []).find(f => f.id === numId) || null);
  }

  async createFarm(farmData) {
    const newFarm = {
      id: farmCounter++,
      farmerId: farmData.farmerId ? Number(farmData.farmerId) : 1,
      farmName: farmData.farmName || 'My Farm',
      crop: farmData.crop || 'Paddy',
      variety: farmData.variety || '',
      latitude: Number(farmData.latitude ?? 7.2912),
      longitude: Number(farmData.longitude ?? 81.6724),
      district: farmData.district || 'Ampara',
      province: farmData.province || 'Eastern Province',
      area: farmData.area || '1.0 acre',
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('farms').insert([toFarmInsert(newFarm)]).select().single();
        if (!error && data) {
          const mapped = mapFarm(data);
          inMemoryStore.farms.push(mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('[DBService] Supabase createFarm error:', err.message);
      }
    }

    inMemoryStore.farms.push(newFarm);
    return mapFarm(newFarm);
  }

  async createCase(caseData) {
    const newId = `CASE-${String(caseCounter++).padStart(3, '0')}`;
    const newCase = {
      id: newId,
      farmId: caseData.farmId ? Number(caseData.farmId) : null,
      cropType: caseData.cropType,
      variety: caseData.variety || '',
      location: caseData.location,
      latitude: caseData.latitude !== undefined && caseData.latitude !== null ? Number(caseData.latitude) : null,
      longitude: caseData.longitude !== undefined && caseData.longitude !== null ? Number(caseData.longitude) : null,
      language: caseData.language || 'en',
      fieldArea: caseData.fieldArea || '',
      cropStage: caseData.cropStage || '',
      disease: caseData.disease,
      scientificName: caseData.scientificName,
      confidence: caseData.confidence,
      severity: caseData.severity,
      status: caseData.status || 'pending',
      spreadRisk: caseData.spreadRisk,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      farmerId: caseData.farmerId ? Number(caseData.farmerId) : 1,
      farmerName: caseData.farmerName || 'Ruwan Perera',
      farmerPhone: caseData.farmerPhone || '',
      officerId: null,
      imageUrl: caseData.imageUrl || null,
      symptoms: caseData.symptoms || '',
      weatherContext: caseData.weatherContext || { humidity: 85, temp: 28, rainfall: 10 },
      nearbyAlerts: caseData.nearbyAlerts || 0,
      treatmentSteps: caseData.treatmentSteps || [],
      preventionSteps: caseData.preventionSteps || [],
      affectedArea: caseData.affectedArea || caseData.fieldArea || '1.0 acre',
      estimatedLoss: caseData.estimatedLoss || '30%',
      aiSource: caseData.aiSource || 'AgroGuard Dual-Engine (MobileNetV3 + Google Gemini Vision)',
      mlPrediction: caseData.mlPrediction || null,
      geminiPrediction: caseData.geminiPrediction || null,
      agreement: caseData.agreement !== undefined ? caseData.agreement : true,
      diagnosticTrace: caseData.diagnosticTrace || null,
      officerVerified: false,
      verifiedDisease: null,
      verifiedSeverity: null,
      verifiedAt: null,
      verifiedBy: null,
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('cases').insert([toCaseInsert(newCase)]).select().single();
        if (!error && data) {
          const mapped = mapCase(data);
          inMemoryStore.cases.unshift(mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('[DBService] Supabase createCase error:', err.message);
      }
    }

    inMemoryStore.cases.unshift(newCase);
    const farmer = inMemoryStore.users.find(u => u.id === newCase.farmerId);
    if (farmer) farmer.cases = (farmer.cases || 0) + 1;

    this.logActivity({
      userId: newCase.farmerId,
      action: 'CASE_SUBMITTED',
      entity: 'cases',
      entityId: newId,
      metadata: { cropType: newCase.cropType, disease: newCase.disease },
    });

    return mapCase(newCase);
  }

  async updateCase(id, updates) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('cases').update(toCaseUpdate(updates)).eq('id', id).select().single();
        if (!error && data) {
          const mapped = mapCase(data);
          const idx = inMemoryStore.cases.findIndex(c => c.id === id);
          if (idx !== -1) inMemoryStore.cases[idx] = { ...inMemoryStore.cases[idx], ...mapped };
          return mapped;
        }
      } catch (err) {
        console.warn('[DBService] Supabase updateCase error:', err.message);
      }
    }

    const idx = inMemoryStore.cases.findIndex(c => c.id === id);
    if (idx === -1) return null;
    inMemoryStore.cases[idx] = {
      ...inMemoryStore.cases[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return mapCase(inMemoryStore.cases[idx]);
  }

  async getVisits({ status } = {}) {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('field_visits').select('*').order('scheduled_date', { ascending: false });
        if (status && status !== 'all') query = query.eq('status', status);
        const { data, error } = await query;
        if (!error && data) return data.map(mapVisit);
      } catch (err) {
        console.warn('[DBService] Supabase getVisits error:', err.message);
      }
    }

    let visits = inMemoryStore.fieldVisits.map(mapVisit);
    if (status && status !== 'all') {
      visits = visits.filter(v => v.status === status);
    }
    return visits.sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));
  }

  async createVisit(visitData) {
    const newVisit = {
      id: `VISIT-${String(visitCounter++).padStart(3, '0')}`,
      farmerId: visitData.farmerId || 1,
      farmerName: visitData.farmerName || 'Ruwan Perera',
      caseId: visitData.caseId || null,
      officerId: visitData.officerId || 2,
      location: visitData.location || 'Ampara, Eastern Province',
      cropType: visitData.cropType || 'Paddy',
      scheduledDate: visitData.scheduledDate || new Date().toISOString().split('T')[0],
      status: 'scheduled',
      priority: visitData.priority || 'medium',
      notes: visitData.notes || '',
      observedSymptoms: visitData.observedSymptoms || '',
      confirmedDisease: visitData.confirmedDisease || '',
      verifiedSeverity: visitData.verifiedSeverity || '',
      recommendation: visitData.recommendation || '',
      completedAt: null,
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('field_visits').insert([toVisitInsert(newVisit)]).select().single();
        if (!error && data) {
          const mapped = mapVisit(data);
          inMemoryStore.fieldVisits.unshift(mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('[DBService] Supabase createVisit error:', err.message);
      }
    }

    inMemoryStore.fieldVisits.unshift(newVisit);
    this.logActivity({
      userId: visitData.officerId || 2,
      action: 'FIELD_VISIT_SCHEDULED',
      entity: 'field_visits',
      entityId: newVisit.id,
      metadata: { farmerName: newVisit.farmerName, scheduledDate: newVisit.scheduledDate },
    });
    return mapVisit(newVisit);
  }

  async updateVisitStatus(id, updateData) {
    const isObject = typeof updateData === 'object' && updateData !== null;
    const status = isObject ? (updateData.status || 'completed') : updateData;
    const observedSymptoms = isObject ? updateData.observedSymptoms : null;
    const confirmedDisease = isObject ? updateData.confirmedDisease : null;
    const verifiedSeverity = isObject ? updateData.verifiedSeverity : null;
    const recommendation = isObject ? updateData.recommendation : null;
    const notes = isObject ? updateData.notes : null;

    let updatedVisit = null;

    if (isSupabaseConfigured) {
      try {
        const dbUpdates = { status, updated_at: new Date().toISOString() };
        if (observedSymptoms) dbUpdates.observed_symptoms = observedSymptoms;
        if (confirmedDisease) dbUpdates.confirmed_disease = confirmedDisease;
        if (verifiedSeverity) dbUpdates.verified_severity = verifiedSeverity;
        if (recommendation) dbUpdates.recommendation = recommendation;
        if (notes) dbUpdates.notes = notes;
        if (status === 'completed') dbUpdates.completed_at = new Date().toISOString();

        const { data, error } = await supabase
          .from('field_visits')
          .update(dbUpdates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          const idx = inMemoryStore.fieldVisits.findIndex(v => v.id === id);
          if (idx !== -1) Object.assign(inMemoryStore.fieldVisits[idx], mapVisit(data));
          updatedVisit = mapVisit(data);
        }
      } catch (err) {
        console.warn('[DBService] Supabase updateVisitStatus error:', err.message);
      }
    }

    if (!updatedVisit) {
      const visit = inMemoryStore.fieldVisits.find(v => v.id === id);
      if (!visit) return null;
      visit.status = status;
      if (observedSymptoms !== null && observedSymptoms !== undefined) visit.observedSymptoms = observedSymptoms;
      if (confirmedDisease !== null && confirmedDisease !== undefined) visit.confirmedDisease = confirmedDisease;
      if (verifiedSeverity !== null && verifiedSeverity !== undefined) visit.verifiedSeverity = verifiedSeverity;
      if (recommendation !== null && recommendation !== undefined) visit.recommendation = recommendation;
      if (notes !== null && notes !== undefined) visit.notes = notes;
      if (status === 'completed') visit.completedAt = new Date().toISOString();
      updatedVisit = mapVisit(visit);
    }

    // WORKFLOW INTEGRATION: If visit completed and tied to a case, update the original case and notify the farmer!
    if (status === 'completed' && updatedVisit.caseId) {
      const existingCase = await this.getCaseById(updatedVisit.caseId);
      if (existingCase) {
        const isRejected = confirmedDisease === 'Rejected';
        const finalStatus = isRejected ? 'rejected' : 'confirmed';
        const finalDisease = (confirmedDisease && !isRejected) ? confirmedDisease : existingCase.disease;
        const finalSeverity = verifiedSeverity || existingCase.severity;

        await this.updateCase(updatedVisit.caseId, {
          status: finalStatus,
          disease: finalDisease,
          severity: finalSeverity,
          officerVerified: true,
          verifiedDisease: finalDisease,
          verifiedSeverity: finalSeverity,
          officerNotes: notes || updatedVisit.notes,
          officerRecommendation: recommendation || updatedVisit.recommendation,
          verifiedAt: new Date().toISOString(),
          verifiedBy: updatedVisit.officerId || 2,
        });

        // Push automatic notification to the farmer
        if (existingCase.farmerId) {
          await this.createNotification({
            userId: existingCase.farmerId,
            text: `Field inspection completed for your case ${updatedVisit.caseId} (${existingCase.cropType}). Confirmed diagnosis: ${finalDisease} (${finalSeverity}). Recommendation: ${recommendation || notes || 'Follow approved treatment protocol.'}`,
            type: isRejected ? 'info' : 'success',
          });
        }
      }
    }

    return updatedVisit;
  }

  async getOutbreaks() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('outbreaks').select('*').order('id', { ascending: true });
        if (!error && data) return data.map(mapOutbreak);
      } catch (err) {
        console.warn('[DBService] Supabase getOutbreaks error:', err.message);
      }
    }
    return inMemoryStore.outbreaks.map(mapOutbreak);
  }

  async getAlerts() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('alerts').select('*').order('created_at', { ascending: false });
        if (!error && data) return data.map(mapAlert);
      } catch (err) {
        console.warn('[DBService] Supabase getAlerts error:', err.message);
      }
    }
    return inMemoryStore.alerts.map(mapAlert);
  }

  async createAlert(alertData) {
    const newAlert = {
      id: alertCounter++,
      province: alertData.province,
      threatLevel: alertData.threatLevel || 'Critical',
      cropTarget: alertData.cropTarget || 'Paddy',
      message: alertData.broadcastMessage || alertData.message,
      createdBy: alertData.createdBy || null,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('alerts').insert([{
          province: newAlert.province,
          threat_level: newAlert.threatLevel,
          crop_target: newAlert.cropTarget,
          message: newAlert.message,
          created_by: newAlert.createdBy,
        }]).select().single();
        if (!error && data) {
          Object.assign(newAlert, mapAlert(data));
        }
      } catch (err) {
        console.warn('[DBService] Supabase createAlert error:', err.message);
      }
    }

    inMemoryStore.alerts.unshift(newAlert);

    const recipients = inMemoryStore.users.filter(u => u.role === 'farmer' || u.role === 'officer');
    for (const user of recipients) {
      await this.createNotification({
        userId: user.id,
        text: `REGIONAL WARNING: ${newAlert.threatLevel} alert in ${newAlert.province} for ${newAlert.cropTarget}.`,
        type: 'alert',
      });
    }

    return mapAlert(newAlert);
  }

  async getNotifications(userId) {
    const numId = Number(userId);
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', numId)
          .order('created_at', { ascending: false });
        if (!error && data) return data.map(mapNotification);
      } catch (err) {
        console.warn('[DBService] Supabase getNotifications error:', err.message);
      }
    }

    return inMemoryStore.notifications
      .filter(n => !n.userId || n.userId === numId)
      .sort((a, b) => b.id - a.id)
      .map(mapNotification);
  }

  async getUnreadNotifications(userId) {
    const all = await this.getNotifications(userId);
    return all.filter(n => !n.isRead);
  }

  async markNotificationRead(id) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('notifications').update({ is_read: true }).eq('id', Number(id)).select().single();
        if (!error && data) {
          const notif = inMemoryStore.notifications.find(n => n.id === Number(id));
          if (notif) notif.isRead = true;
          return mapNotification(data);
        }
      } catch (err) {
        console.warn('[DBService] Supabase markNotificationRead error:', err.message);
      }
    }

    const notif = inMemoryStore.notifications.find(n => n.id === Number(id));
    if (notif) notif.isRead = true;
    return mapNotification(notif);
  }

  async markAllNotificationsRead(userId) {
    const numId = Number(userId);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('notifications').update({ is_read: true }).eq('user_id', numId);
      } catch (err) {
        console.warn('[DBService] Supabase markAllNotificationsRead error:', err.message);
      }
    }
    inMemoryStore.notifications.forEach((n) => {
      if (!n.userId || n.userId === numId) n.isRead = true;
    });
    return true;
  }

  async createNotification({ userId, text, type = 'info' }) {
    const newNotif = {
      id: notifCounter++,
      userId,
      text,
      time: 'Just now',
      type,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('notifications').insert([{
          user_id: userId,
          text,
          type,
          is_read: false,
        }]).select().single();
        if (!error && data) {
          const mapped = mapNotification(data);
          inMemoryStore.notifications.unshift(mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('[DBService] Supabase createNotification error:', err.message);
      }
    }

    inMemoryStore.notifications.unshift(newNotif);
    return mapNotification(newNotif);
  }

  logActivity({ userId, action, entity, entityId, metadata = {} }) {
    const entry = {
      id: inMemoryStore.activityLogs.length + 1,
      userId,
      action,
      entity,
      entityId,
      metadata,
      timestamp: new Date().toISOString(),
    };
    inMemoryStore.activityLogs.unshift(entry);

    if (isSupabaseConfigured) {
      supabase.from('activity_logs').insert([{
        user_id: userId || null,
        action,
        entity: entity || null,
        entity_id: entityId ? String(entityId) : null,
        metadata,
      }]).then(({ error }) => {
        if (error) console.warn('[DBService] activity_logs insert skipped:', error.message);
      });
    }
  }

  async getDashboardStats(role, userId) {
    const allCases = (await this.getCases({ role: role === 'farmer' ? 'farmer' : undefined, farmerId: userId })).length
      ? await this.getCases({ role: role === 'farmer' ? 'farmer' : undefined, farmerId: userId })
      : inMemoryStore.cases.map(mapCase);

    const scopedCases = role === 'farmer'
      ? inMemoryStore.cases.filter(c => Number(c.farmerId) === Number(userId)).map(mapCase)
      : inMemoryStore.cases.map(mapCase);
    const cases = scopedCases.length ? scopedCases : allCases;
    const visits = inMemoryStore.fieldVisits;
    const users = inMemoryStore.users;
    const outbreaks = inMemoryStore.outbreaks;

    switch (role) {
      case 'farmer': {
        return {
          totalCases: cases.length,
          activeCases: cases.filter(c => c.status === 'pending' || c.status === 'escalated').length,
          confirmedCases: cases.filter(c => c.status === 'confirmed').length,
          treatedCases: cases.filter(c => c.status === 'treated').length,
          escalatedCases: cases.filter(c => c.status === 'escalated').length,
          highRisk: cases.filter(c => c.spreadRisk >= 70).length,
          cropsSaved: '78%',
          lastDiagnosis: cases[0]?.disease || 'Blast Disease',
        };
      }
      case 'officer': {
        return {
          pendingReview: cases.filter(c => c.status === 'pending' || c.status === 'escalated').length,
          fieldVisitsToday: visits.filter(v => v.status === 'scheduled').length,
          confirmedThisWeek: cases.filter(c => c.status === 'confirmed').length,
          escalatedCases: cases.filter(c => c.status === 'escalated').length,
          activeOutbreakAlerts: outbreaks.filter(o => o.severity === 'critical' || o.severity === 'high').length,
          avgResponseTime: '2.4 hrs',
          accuracy: '96%',
        };
      }
      case 'research': {
        return {
          activeOutbreaks: outbreaks.length,
          outbreakZones: `${outbreaks.length} Zones`,
          specimensAnalyzed: String(1482 + cases.length),
          aiPrecision: '94.6%',
          weatherCoeff: 'r = 0.84',
          diseasesTracked: 23,
          regionsMonitored: 9,
          alertsSent: inMemoryStore.alerts.length + 45,
          modelsDeployed: 3,
          dataPoints: '14.2K',
        };
      }
      case 'admin': {
        return {
          registeredFarmers: users.filter(u => u.role === 'farmer').length + 1236,
          activeOfficers: users.filter(u => u.role === 'officer').length + 40,
          smsSent: 5890 + inMemoryStore.alerts.length,
          aiLatency: '340 ms',
          totalUsers: users.length + 1230,
          casesToday: cases.length + 29,
          alertsSent: inMemoryStore.alerts.length + 10,
          systemUptime: '99.8%',
          pendingApprovals: 6,
        };
      }
      default:
        return {};
    }
  }
}

module.exports = new DBService();
