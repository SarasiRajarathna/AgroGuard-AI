-- AgroGuard-AI PostgreSQL Seed Data (for Supabase PostgreSQL)
-- BCrypt Hash for 'password123': $2a$10$3euPcmQFCiblsZeEu5s7p.9V8KjJdZ0u5Jm3n9P0yIiqv8I2E8s5O

-- 1. SEED USERS
INSERT INTO users (id, name, email, password_hash, role, avatar, phone, location, status, district, badge_id, farm_size, institution, specialization, permissions) VALUES
(1, 'Ruwan Perera', 'ruwan@farm.lk', '$2a$10$3euPcmQFCiblsZeEu5s7p.9V8KjJdZ0u5Jm3n9P0yIiqv8I2E8s5O', 'farmer', 'RP', '+94 77 123 4567', 'Ampara, Eastern Province', 'active', 'Ampara', NULL, '2.4 acres', NULL, NULL, '[]'::jsonb),
(2, 'Dr. Anura Bandara', 'anura@agridept.gov.lk', '$2a$10$3euPcmQFCiblsZeEu5s7p.9V8KjJdZ0u5Jm3n9P0yIiqv8I2E8s5O', 'officer', 'AB', '+94 71 987 6543', 'Batticaloa & Ampara', 'active', 'Eastern Division', 'AGO-2024-045', NULL, 'Department of Agriculture', 'Crop Protection', '[]'::jsonb),
(3, 'Prof. Dhammika Silva', 'dhammika@cri.lk', '$2a$10$3euPcmQFCiblsZeEu5s7p.9V8KjJdZ0u5Jm3n9P0yIiqv8I2E8s5O', 'research', 'DS', '+94 76 345 6789', 'Peradeniya CRI', 'active', 'Central Division', 'RES-2024-012', NULL, 'Crop Research Institute', 'Plant Pathology & Epidemiology', '[]'::jsonb),
(4, 'System Administrator', 'admin@agroguard.gov.lk', '$2a$10$3euPcmQFCiblsZeEu5s7p.9V8KjJdZ0u5Jm3n9P0yIiqv8I2E8s5O', 'admin', 'SA', '+94 11 234 5678', 'Central Operations, Colombo', 'active', 'National HQ', 'ADM-001', NULL, 'Ministry of Agriculture', 'System Control', '["all"]'::jsonb),
(5, 'Chamara Bandara', 'chamara@farm.lk', '$2a$10$3euPcmQFCiblsZeEu5s7p.9V8KjJdZ0u5Jm3n9P0yIiqv8I2E8s5O', 'farmer', 'CB', '+94 77 234 5678', 'Kurunegala, North Western Province', 'active', 'Kurunegala', NULL, '3.5 acres', NULL, NULL, '[]'::jsonb),
(6, 'Priya Jayawardena', 'priya@farm.lk', '$2a$10$3euPcmQFCiblsZeEu5s7p.9V8KjJdZ0u5Jm3n9P0yIiqv8I2E8s5O', 'farmer', 'PJ', '+94 77 345 6789', 'Puttalam, North Western Province', 'active', 'Puttalam', NULL, '5.0 acres', NULL, NULL, '[]'::jsonb),
(7, 'Nimali Fernando', 'nimali@agri.gov.lk', '$2a$10$3euPcmQFCiblsZeEu5s7p.9V8KjJdZ0u5Jm3n9P0yIiqv8I2E8s5O', 'officer', 'NF', '+94 71 234 5678', 'Kandy District', 'active', 'Central Division', 'AGO-2024-089', NULL, 'Department of Agriculture', 'Extension Services', '[]'::jsonb)
ON CONFLICT (email) DO NOTHING;

-- 2. SEED CASES
INSERT INTO cases (id, farmer_id, farmer_name, crop_type, variety, location, field_area, crop_stage, symptoms, image_url, disease, scientific_name, confidence, severity, status, spread_risk, weather_context, nearby_alerts, treatment_steps, affected_area, estimated_loss, officer_id, officer_notes, escalation_reason, created_at, updated_at) VALUES
('CASE-001', 1, 'Ruwan Perera', 'Paddy (Rice)', 'Samba', 'Ampara, Eastern Province', '1.2 acres', 'Tillering / Vegetative', 'Diamond-shaped lesions with gray centers on leaves, brownish margins, neck rot visible', NULL, 'Blast Disease', 'Magnaporthe oryzae', 94, 'high', 'confirmed', 78, '{"humidity": 87, "temp": 28, "rainfall": 12}'::jsonb, 3, '["Remove and destroy severely infected plant parts immediately", "Apply Tricyclazole (Beam) @ 0.6g/L or Isoprothiolane (Fuji-One) @ 1.5ml/L", "Ensure proper field drainage to reduce humidity", "Avoid excessive nitrogen application", "Monitor neighboring fields and alert farmers within 2km radius"]'::jsonb, '0.8 acres', '35%', 2, 'Field symptoms match typical blast lesions. Spore count accelerated by recent morning dew. Approved application of systemic fungicide.', NULL, NOW() - INTERVAL '1 day', NOW() - INTERVAL '4 hours'),
('CASE-002', 1, 'Ruwan Perera', 'Tea', 'TRI-2043', 'Nuwara Eliya, Central Province', '1.5 acres', 'Flushing', 'Pale green translucent spots on young leaves, white powdery growth on underside', NULL, 'Blister Blight', 'Exobasidium vexans', 89, 'medium', 'escalated', 62, '{"humidity": 92, "temp": 18, "rainfall": 28}'::jsonb, 7, '["Apply copper-based fungicides (Copper oxychloride) at 2.5g/L", "Improve air circulation by proper pruning", "Avoid working in wet conditions to prevent spread", "Apply systemic fungicide Hexaconazole @ 2ml/10L"]'::jsonb, '1.2 acres', '20%', NULL, NULL, 'Unusually fast spread on tender flush leaves despite initial copper oxychloride spray. Need field inspection.', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),
('CASE-003', 5, 'Chamara Bandara', 'Maize (Corn)', 'NK-6240', 'Kurunegala, North Western Province', '3.5 acres', 'Whorl Stage', 'Ragged holes in leaves, frass in whorls, irregular window feeding on leaves', NULL, 'Fall Armyworm', 'Spodoptera frugiperda', 97, 'critical', 'pending', 91, '{"humidity": 75, "temp": 32, "rainfall": 0}'::jsonb, 12, '["Apply Emamectin benzoate (Proclaim) @ 0.4g/L immediately", "Use Spinetoram (Delegate) @ 0.5ml/L for effective control", "Set up pheromone traps (5 per acre) for monitoring", "Alert neighboring maize farmers within 5km radius", "Conduct scouting every 3 days"]'::jsonb, '3.5 acres', '60%', NULL, NULL, NULL, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours'),
('CASE-004', 6, 'Priya Jayawardena', 'Coconut', 'Sri Lanka Tall', 'Puttalam, North Western Province', '5.0 acres', 'Bearing', 'Yellowing of lower fronds, premature nut fall, reduction in inflorescences', NULL, 'Weligama Coconut Leaf Wilt', 'Phytoplasma sp.', 72, 'high', 'escalated', 85, '{"humidity": 80, "temp": 30, "rainfall": 5}'::jsonb, 5, '["Remove and burn all infected palms immediately", "Apply oxytetracycline injections to early-stage infected palms", "Control insect vectors (leafhopper) using insecticides", "Quarantine the affected area", "Report to Coconut Cultivation Board immediately"]'::jsonb, '5 acres', '45%', 2, NULL, 'Rapid frond necrosis observed across 8 mature palms in row 3. Requesting urgent containment inspection.', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),
('CASE-005', 1, 'Ruwan Perera', 'Tomato', 'T-245', 'Badulla, Uva Province', '0.5 acres', 'Flowering & Fruiting', 'Water-soaked lesions on leaves, white mold on undersides, brown stem lesions', NULL, 'Late Blight', 'Phytophthora infestans', 91, 'high', 'treated', 45, '{"humidity": 90, "temp": 22, "rainfall": 18}'::jsonb, 2, '["Apply Metalaxyl + Mancozeb (Ridomil Gold) @ 2.5g/L", "Remove affected plant material and dispose properly", "Improve drainage and reduce leaf wetness", "Apply preventive copper sprays every 7 days"]'::jsonb, '0.5 acres', '25%', 2, 'Farmer completed spray protocol on Sep 9. Spot necrosis arrested.', NULL, NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

-- 3. SEED FIELD VISITS
INSERT INTO field_visits (id, case_id, farmer_id, officer_id, farmer_name, location, crop_type, scheduled_date, status, priority, notes) VALUES
('VISIT-001', 'CASE-001', 1, 2, 'Ruwan Perera', 'Ampara, Eastern Province', 'Paddy (Rice)', CURRENT_DATE + INTERVAL '2 days', 'scheduled', 'high', 'Verify Blast Disease spore density and supply bio-control recommendations.'),
('VISIT-002', 'CASE-003', 5, 2, 'Chamara Bandara', 'Kurunegala, NW Province', 'Maize', CURRENT_DATE - INTERVAL '1 day', 'completed', 'critical', 'Fall armyworm pheromone traps deployed successfully. Larval population down 70%.'),
('VISIT-003', 'CASE-004', 6, 2, 'Priya Jayawardena', 'Puttalam, NW Province', 'Coconut', CURRENT_DATE + INTERVAL '3 days', 'scheduled', 'high', 'Assess Weligama leaf wilt symptom spread and vector management protocol.'),
('VISIT-004', NULL, 1, 2, 'Ruwan Perera', 'Kandy, Central Province', 'Tea', CURRENT_DATE + INTERVAL '4 days', 'scheduled', 'medium', 'Routine check of foliage fungicide spray coverage and soil moisture.')
ON CONFLICT (id) DO NOTHING;

-- 4. SEED OUTBREAKS
INSERT INTO outbreaks (id, disease, crop, region, active_cases, trend, severity, last_updated) VALUES
(1, 'Fall Armyworm', 'Maize', 'North Western', 47, 'rising', 'critical', CURRENT_DATE),
(2, 'Blast Disease', 'Paddy', 'Eastern', 31, 'stable', 'high', CURRENT_DATE),
(3, 'Blister Blight', 'Tea', 'Central', 19, 'falling', 'medium', CURRENT_DATE - INTERVAL '1 day'),
(4, 'Leaf Curl Virus', 'Chilli', 'Uva', 12, 'rising', 'medium', CURRENT_DATE - INTERVAL '1 day'),
(5, 'Weligama Leaf Wilt', 'Coconut', 'North Western', 8, 'stable', 'high', CURRENT_DATE - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- 5. SEED ALERTS
INSERT INTO alerts (id, province, threat_level, crop_target, message, created_by, created_at) VALUES
(1, 'Eastern Province', 'Critical', 'Paddy (Rice)', 'High Risk of Blast Disease Spore Spread. Persistent humidity (88%) and 28°C temperatures favor rapid fungal propagation. 3 neighbor holdings flagged.', 4, NOW() - INTERVAL '12 hours'),
(2, 'North Western', 'Critical', 'Maize', 'Fall Armyworm active watch triggered across Kurunegala and Puttalam. Apply authorized pest control within 48 hours.', 4, NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- 6. SEED NOTIFICATIONS
INSERT INTO notifications (id, user_id, text, type, is_read, created_at) VALUES
(1, 1, 'Fall Armyworm outbreak detected in your area (North Western/Eastern boundary)', 'alert', false, NOW() - INTERVAL '2 minutes'),
(2, 1, 'Your case CASE-001 has been confirmed by officer Dr. Anura Bandara', 'success', false, NOW() - INTERVAL '1 hour'),
(3, 1, 'Treatment reminder: Apply Tricyclazole spray today before morning dew', 'info', false, NOW() - INTERVAL '3 hours'),
(4, 2, '2 Escalated cases require field verification in Ampara district', 'alert', false, NOW() - INTERVAL '30 minutes')
ON CONFLICT (id) DO NOTHING;
