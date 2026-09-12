-- AgroGuard-AI PostgreSQL Database Schema (for Supabase PostgreSQL)
-- Created for National Crop Health Surveillance System

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('farmer', 'officer', 'research', 'admin')),
    avatar VARCHAR(10) DEFAULT 'U',
    phone VARCHAR(50),
    location VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    district VARCHAR(100),
    badge_id VARCHAR(50),
    farm_size VARCHAR(50),
    institution VARCHAR(255),
    specialization VARCHAR(100),
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FARMS TABLE (Geo-located agricultural holdings)
CREATE TABLE IF NOT EXISTS farms (
    id SERIAL PRIMARY KEY,
    farmer_id INT REFERENCES users(id) ON DELETE CASCADE,
    farm_name VARCHAR(150) NOT NULL,
    crop VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    latitude NUMERIC(9,6) NOT NULL,
    longitude NUMERIC(9,6) NOT NULL,
    district VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    area VARCHAR(50) DEFAULT '1.0 acre',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CASES TABLE (Crop Diagnoses & Health Records)
CREATE TABLE IF NOT EXISTS cases (
    id VARCHAR(50) PRIMARY KEY,
    farmer_id INT REFERENCES users(id) ON DELETE SET NULL,
    farm_id INT REFERENCES farms(id) ON DELETE SET NULL,
    farmer_name VARCHAR(100) NOT NULL,
    crop_type VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    location VARCHAR(255) NOT NULL,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    field_area VARCHAR(50),
    crop_stage VARCHAR(100),
    symptoms TEXT,
    image_url TEXT,
    disease VARCHAR(150),
    scientific_name VARCHAR(150),
    confidence INT DEFAULT 0,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'escalated', 'treated', 'rejected')),
    spread_risk INT DEFAULT 50,
    language VARCHAR(10) DEFAULT 'en',
    weather_context JSONB DEFAULT '{}'::jsonb,
    nearby_alerts INT DEFAULT 0,
    treatment_steps JSONB DEFAULT '[]'::jsonb,
    prevention_steps JSONB DEFAULT '[]'::jsonb,
    affected_area VARCHAR(50),
    estimated_loss VARCHAR(50),
    officer_id INT REFERENCES users(id) ON DELETE SET NULL,
    officer_notes TEXT,
    officer_recommendation TEXT,
    escalation_reason TEXT,
    officer_verified BOOLEAN DEFAULT FALSE,
    verified_disease VARCHAR(150),
    verified_severity VARCHAR(20) CHECK (verified_severity IS NULL OR verified_severity IN ('low', 'medium', 'high', 'critical')),
    verified_at TIMESTAMPTZ,
    verified_by INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FIELD VISITS TABLE
CREATE TABLE IF NOT EXISTS field_visits (
    id VARCHAR(50) PRIMARY KEY,
    case_id VARCHAR(50) REFERENCES cases(id) ON DELETE SET NULL,
    farmer_id INT REFERENCES users(id) ON DELETE SET NULL,
    officer_id INT REFERENCES users(id) ON DELETE SET NULL,
    farmer_name VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    crop_type VARCHAR(100),
    scheduled_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    notes TEXT,
    observed_symptoms TEXT,
    confirmed_disease VARCHAR(150),
    verified_severity VARCHAR(20) CHECK (verified_severity IS NULL OR verified_severity IN ('low', 'medium', 'high', 'critical')),
    recommendation TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. OUTBREAKS TABLE (Geographic epidemiological clusters)
CREATE TABLE IF NOT EXISTS outbreaks (
    id SERIAL PRIMARY KEY,
    disease VARCHAR(150) NOT NULL,
    crop VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    center_lat NUMERIC(9,6) NOT NULL,
    center_lng NUMERIC(9,6) NOT NULL,
    radius_km NUMERIC(5,2) DEFAULT 10.0,
    active_cases INT DEFAULT 0,
    affected_farms INT DEFAULT 0,
    trend VARCHAR(20) DEFAULT 'stable' CHECK (trend IN ('rising', 'stable', 'falling')),
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) DEFAULT 'potential' CHECK (status IN ('potential', 'confirmed', 'contained', 'resolved')),
    confirmed_by INT REFERENCES users(id) ON DELETE SET NULL,
    confirmed_at TIMESTAMPTZ,
    last_updated DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ALERTS TABLE (Regional Broadcast Alerts)
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    province VARCHAR(100) NOT NULL,
    threat_level VARCHAR(50) NOT NULL CHECK (threat_level IN ('Critical', 'Elevated', 'Advisory', 'High', 'Moderate', 'Low')),
    crop_target VARCHAR(100),
    message TEXT NOT NULL,
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('alert', 'success', 'info', 'warning')),
    is_read BOOLEAN DEFAULT FALSE,
    link VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100),
    entity_id VARCHAR(100),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES for fast geospatial & operational querying
CREATE INDEX IF NOT EXISTS idx_cases_farmer_id ON cases(farmer_id);
CREATE INDEX IF NOT EXISTS idx_cases_farm_id ON cases(farm_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_disease ON cases(disease);
CREATE INDEX IF NOT EXISTS idx_cases_lat_lng ON cases(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON cases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_farms_farmer_id ON farms(farmer_id);
CREATE INDEX IF NOT EXISTS idx_farms_lat_lng ON farms(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_field_visits_scheduled_date ON field_visits(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_outbreaks_lat_lng ON outbreaks(center_lat, center_lng);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
