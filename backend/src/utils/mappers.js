/**
 * Maps database (snake_case) and in-memory (camelCase) records
 * to the shape expected by the existing frontend.
 */

function relativeTime(iso) {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return String(iso);
  const diff = Date.now() - then;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function mapUser(row) {
  if (!row) return null;
  const { password_hash, passwordHash, ...safe } = row;
  return {
    id: safe.id,
    name: safe.name,
    email: safe.email,
    role: safe.role,
    avatar: safe.avatar || 'U',
    phone: safe.phone || '',
    location: safe.location || '',
    farmLocation: safe.farmLocation || safe.farm_location || safe.location || '',
    status: safe.status || 'active',
    district: safe.district || '',
    badgeId: safe.badgeId || safe.badge_id || '',
    farmSize: safe.farmSize || safe.farm_size || '',
    institution: safe.institution || '',
    specialization: safe.specialization || '',
    permissions: safe.permissions || [],
    cases: safe.cases || 0,
    createdAt: safe.createdAt || safe.created_at,
  };
}

function mapFarm(row) {
  if (!row) return null;
  return {
    id: row.id,
    farmerId: row.farmerId ?? row.farmer_id,
    farmName: row.farmName || row.farm_name,
    crop: row.crop,
    variety: row.variety || '',
    latitude: Number(row.latitude ?? 0),
    longitude: Number(row.longitude ?? 0),
    district: row.district,
    province: row.province,
    area: row.area || '1.0 acre',
    createdAt: row.createdAt || row.created_at,
  };
}

function mapCase(row) {
  if (!row) return null;
  return {
    id: row.id,
    cropType: row.cropType || row.crop_type,
    variety: row.variety || '',
    location: row.location,
    latitude: row.latitude !== undefined && row.latitude !== null ? Number(row.latitude) : null,
    longitude: row.longitude !== undefined && row.longitude !== null ? Number(row.longitude) : null,
    farmId: row.farmId ?? row.farm_id ?? null,
    language: row.language || 'en',
    fieldArea: row.fieldArea || row.field_area,
    cropStage: row.cropStage || row.crop_stage,
    symptoms: row.symptoms || '',
    imageUrl: row.imageUrl || row.image_url || null,
    disease: row.disease,
    scientificName: row.scientificName || row.scientific_name,
    confidence: Number(row.confidence ?? 0),
    severity: row.severity,
    status: row.status,
    spreadRisk: Number(row.spreadRisk ?? row.spread_risk ?? 0),
    weatherContext: row.weatherContext || row.weather_context || {},
    nearbyAlerts: Number(row.nearbyAlerts ?? row.nearby_alerts ?? 0),
    treatmentSteps: row.treatmentSteps || row.treatment_steps || [],
    preventionSteps: row.preventionSteps || row.prevention_steps || [],
    affectedArea: row.affectedArea || row.affected_area,
    estimatedLoss: row.estimatedLoss || row.estimated_loss,
    farmerId: row.farmerId ?? row.farmer_id,
    farmerName: row.farmerName || row.farmer_name,
    farmerPhone: row.farmerPhone || row.farmer_phone || '',
    officerId: row.officerId ?? row.officer_id ?? null,
    officerNotes: row.officerNotes || row.officer_notes || '',
    officerRecommendation: row.officerRecommendation || row.officer_recommendation || '',
    escalationReason: row.escalationReason || row.escalation_reason || '',
    officerVerified: Boolean(row.officerVerified ?? row.officer_verified ?? false),
    verifiedDisease: row.verifiedDisease || row.verified_disease || null,
    verifiedSeverity: row.verifiedSeverity || row.verified_severity || null,
    verifiedAt: row.verifiedAt || row.verified_at || null,
    verifiedBy: row.verifiedBy ?? row.verified_by ?? null,
    submittedAt: row.submittedAt || row.created_at,
    updatedAt: row.updatedAt || row.updated_at,
  };
}

function mapVisit(row) {
  if (!row) return null;
  return {
    id: row.id,
    caseId: row.caseId || row.case_id || null,
    farmerId: row.farmerId ?? row.farmer_id,
    officerId: row.officerId ?? row.officer_id,
    farmerName: row.farmerName || row.farmer_name,
    location: row.location,
    cropType: row.cropType || row.crop_type,
    scheduledDate: row.scheduledDate || row.scheduled_date,
    status: row.status,
    priority: row.priority || 'medium',
    notes: row.notes || '',
    observedSymptoms: row.observedSymptoms || row.observed_symptoms || '',
    confirmedDisease: row.confirmedDisease || row.confirmed_disease || '',
    verifiedSeverity: row.verifiedSeverity || row.verified_severity || '',
    recommendation: row.recommendation || '',
    completedAt: row.completedAt || row.completed_at || null,
    createdAt: row.createdAt || row.created_at,
  };
}

function mapAlert(row) {
  if (!row) return null;
  return {
    id: row.id,
    province: row.province,
    threatLevel: row.threatLevel || row.threat_level,
    cropTarget: row.cropTarget || row.crop_target,
    message: row.message,
    createdBy: row.createdBy ?? row.created_by,
    createdAt: row.createdAt || row.created_at,
  };
}

function mapNotification(row) {
  if (!row) return null;
  const createdAt = row.createdAt || row.created_at;
  return {
    id: row.id,
    userId: row.userId ?? row.user_id,
    text: row.text,
    type: row.type || 'info',
    isRead: row.isRead ?? row.is_read ?? false,
    link: row.link || null,
    time: row.time || relativeTime(createdAt),
    createdAt,
  };
}

function mapOutbreak(row) {
  if (!row) return null;
  return {
    id: row.id,
    disease: row.disease,
    crop: row.crop,
    region: row.region,
    district: row.district || '',
    centerLat: Number(row.centerLat ?? row.center_lat ?? 0),
    centerLng: Number(row.centerLng ?? row.center_lng ?? 0),
    radiusKm: Number(row.radiusKm ?? row.radius_km ?? 10),
    activeCases: Number(row.activeCases ?? row.active_cases ?? 0),
    affectedFarms: Number(row.affectedFarms ?? row.affected_farms ?? 0),
    trend: row.trend || 'stable',
    severity: row.severity || 'medium',
    status: row.status || 'potential',
    confirmedBy: row.confirmedBy ?? row.confirmed_by ?? null,
    confirmedAt: row.confirmedAt || row.confirmed_at || null,
    lastUpdated: row.lastUpdated || row.last_updated,
  };
}

function toUserInsert(user) {
  return {
    name: user.name,
    email: user.email,
    password_hash: user.password_hash,
    role: user.role,
    avatar: user.avatar,
    phone: user.phone || null,
    location: user.location || null,
    status: user.status || 'active',
    district: user.district || null,
    badge_id: user.badgeId || user.badge_id || null,
    farm_size: user.farmSize || user.farm_size || null,
    institution: user.institution || null,
    specialization: user.specialization || null,
    permissions: user.permissions || [],
  };
}

function toFarmInsert(f) {
  return {
    farmer_id: f.farmerId || f.farmer_id,
    farm_name: f.farmName || f.farm_name,
    crop: f.crop,
    variety: f.variety || null,
    latitude: f.latitude,
    longitude: f.longitude,
    district: f.district,
    province: f.province,
    area: f.area || '1.0 acre',
  };
}

function toCaseInsert(c) {
  return {
    id: c.id,
    farmer_id: c.farmerId || c.farmer_id || null,
    farm_id: c.farmId || c.farm_id || null,
    farmer_name: c.farmerName || c.farmer_name,
    crop_type: c.cropType || c.crop_type,
    variety: c.variety || null,
    location: c.location,
    latitude: c.latitude ?? null,
    longitude: c.longitude ?? null,
    language: c.language || 'en',
    field_area: c.fieldArea || c.field_area || null,
    crop_stage: c.cropStage || c.crop_stage || null,
    symptoms: c.symptoms || null,
    image_url: c.imageUrl || c.image_url || null,
    disease: c.disease || null,
    scientific_name: c.scientificName || c.scientific_name || null,
    confidence: c.confidence || 0,
    severity: c.severity || 'medium',
    status: c.status || 'pending',
    spread_risk: c.spreadRisk ?? c.spread_risk ?? 50,
    weather_context: c.weatherContext || c.weather_context || {},
    nearby_alerts: c.nearbyAlerts ?? c.nearby_alerts ?? 0,
    treatment_steps: c.treatmentSteps || c.treatment_steps || [],
    prevention_steps: c.preventionSteps || c.prevention_steps || [],
    affected_area: c.affectedArea || c.affected_area || null,
    estimated_loss: c.estimatedLoss || c.estimated_loss || null,
    officer_id: c.officerId ?? c.officer_id ?? null,
    officer_notes: c.officerNotes || c.officer_notes || null,
    officer_recommendation: c.officerRecommendation || c.officer_recommendation || null,
    escalation_reason: c.escalationReason || c.escalation_reason || null,
    officer_verified: Boolean(c.officerVerified ?? c.officer_verified ?? false),
    verified_disease: c.verifiedDisease || c.verified_disease || null,
    verified_severity: c.verifiedSeverity || c.verified_severity || null,
    verified_at: c.verifiedAt || c.verified_at || null,
    verified_by: c.verifiedBy ?? c.verified_by ?? null,
  };
}

function toVisitInsert(v) {
  return {
    id: v.id,
    case_id: v.caseId || v.case_id || null,
    farmer_id: v.farmerId || v.farmer_id || null,
    officer_id: v.officerId || v.officer_id || null,
    farmer_name: v.farmerName || v.farmer_name,
    location: v.location,
    crop_type: v.cropType || v.crop_type || null,
    scheduled_date: v.scheduledDate || v.scheduled_date,
    status: v.status || 'scheduled',
    priority: v.priority || 'medium',
    notes: v.notes || null,
    observed_symptoms: v.observedSymptoms || v.observed_symptoms || null,
    confirmed_disease: v.confirmedDisease || v.confirmed_disease || null,
    verified_severity: v.verifiedSeverity || v.verified_severity || null,
    recommendation: v.recommendation || null,
    completed_at: v.completedAt || v.completed_at || null,
  };
}

function toCaseUpdate(updates) {
  const mapped = {};
  if (updates.status !== undefined) mapped.status = updates.status;
  if (updates.disease !== undefined) mapped.disease = updates.disease;
  if (updates.severity !== undefined) mapped.severity = updates.severity;
  if (updates.officerId !== undefined) mapped.officer_id = updates.officerId;
  if (updates.officerNotes !== undefined) mapped.officer_notes = updates.officerNotes;
  if (updates.officerRecommendation !== undefined) mapped.officer_recommendation = updates.officerRecommendation;
  if (updates.escalationReason !== undefined) mapped.escalation_reason = updates.escalationReason;
  if (updates.officerVerified !== undefined) mapped.officer_verified = updates.officerVerified;
  if (updates.verifiedDisease !== undefined) mapped.verified_disease = updates.verifiedDisease;
  if (updates.verifiedSeverity !== undefined) mapped.verified_severity = updates.verifiedSeverity;
  if (updates.verifiedAt !== undefined) mapped.verified_at = updates.verifiedAt;
  if (updates.verifiedBy !== undefined) mapped.verified_by = updates.verifiedBy;
  if (updates.treatmentSteps !== undefined) mapped.treatment_steps = updates.treatmentSteps;
  if (updates.preventionSteps !== undefined) mapped.prevention_steps = updates.preventionSteps;
  mapped.updated_at = new Date().toISOString();
  return mapped;
}

module.exports = {
  relativeTime,
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
};
