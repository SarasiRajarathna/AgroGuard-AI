/**
 * AgroGuard-AI Complete Backend API Automated Test Suite
 */

const http = require('http');
const app = require('./src/server');

const TEST_PORT = 5055;
let server;

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log(' Starting AgroGuard-AI Backend Automated Test Suite ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Healthcheck
    console.log('[1] Healthcheck Probes');
    const health = await request('/api/health');
    assert(health.status === 200 && health.data.success === true, 'GET /api/health returned 200 OK');

    // 2. Auth: Valid Farmer Login
    console.log('\n[2] Authentication & Session Management');
    const farmerLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'ruwan@farm.lk', password: 'password123' },
    });
    assert(farmerLogin.status === 200, 'POST /api/auth/login with valid farmer credentials returned 200');
    assert(farmerLogin.data.token && farmerLogin.data.user.role === 'farmer', 'JWT token issued and role is farmer');
    const farmerToken = farmerLogin.data.token;

    // 3. Auth: Invalid Password
    const badLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'ruwan@farm.lk', password: 'wrongpassword' },
    });
    assert(badLogin.status === 401, 'POST /api/auth/login with wrong password correctly rejected with 401');

    // 4. Auth: Officer Login
    const officerLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'anura@agridept.gov.lk', password: 'password123' },
    });
    assert(officerLogin.status === 200 && officerLogin.data.user.role === 'officer', 'Officer login successful');
    const officerToken = officerLogin.data.token;

    // 5. Auth: Admin Login
    const adminLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@agroguard.gov.lk', password: 'password123' },
    });
    assert(adminLogin.status === 200 && adminLogin.data.user.role === 'admin', 'Admin login successful');
    const adminToken = adminLogin.data.token;

    // 6. Session Verification: GET /api/auth/me
    const meRes = await request('/api/auth/me', {
      headers: { Authorization: `Bearer ${farmerToken}` },
    });
    assert(meRes.status === 200 && meRes.data.user.email === 'ruwan@farm.lk', 'GET /api/auth/me verified Bearer token');

    // 7. Role-Based Access Control (RBAC)
    console.log('\n[3] Role-Based Access Control (RBAC)');
    const unauthorizedAccess = await request('/api/admin/users', {
      headers: { Authorization: `Bearer ${farmerToken}` },
    });
    assert(unauthorizedAccess.status === 403, 'Farmer accessing /api/admin/users rejected with 403 Forbidden');

    const authorizedAccess = await request('/api/admin/users', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(authorizedAccess.status === 200 && Array.isArray(authorizedAccess.data.data), 'Admin accessing /api/admin/users granted 200 OK');

    // 8. Cases API & AI Diagnosis
    console.log('\n[4] Cases API & AI Diagnosis Pipeline');
    const newCasePayload = {
      cropType: 'Paddy (Rice)',
      variety: 'Samba',
      location: 'Ampara, Eastern Province',
      fieldArea: '1.5 acres',
      cropStage: 'Tillering',
      symptoms: 'Spindle-shaped brown lesions with grayish center appearing on upper leaf blades',
    };
    const createCaseRes = await request('/api/cases', {
      method: 'POST',
      headers: { Authorization: `Bearer ${farmerToken}` },
      body: newCasePayload,
    });
    assert(createCaseRes.status === 201, 'POST /api/cases created diagnosis with 201');
    assert(createCaseRes.data.data.disease === 'Blast Disease', 'AI correctly diagnosed "Blast Disease"');
    assert(createCaseRes.data.data.confidence >= 85, 'AI confidence score generated (>85%)');
    assert(createCaseRes.data.data.spreadRisk > 0, 'Pathogen spread risk index calculated');
    assert(Array.isArray(createCaseRes.data.data.treatmentSteps), 'Tailored agronomic treatment steps included');
    const createdCaseId = createCaseRes.data.data.id;

    // 9. Case Retrieval & Escalation
    const getCaseRes = await request(`/api/cases/${createdCaseId}`, {
      headers: { Authorization: `Bearer ${farmerToken}` },
    });
    assert(getCaseRes.status === 200 && getCaseRes.data.data.id === createdCaseId, 'GET /api/cases/:id retrieved case');

    const escalateRes = await request(`/api/cases/${createdCaseId}/escalate`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${farmerToken}` },
      body: { reason: 'Lesions propagating fast towards neighboring plot' },
    });
    assert(escalateRes.status === 200 && escalateRes.data.data.status === 'escalated', 'PATCH /api/cases/:id/escalate updated status to escalated');

    // 10. Officer Verification & Review
    console.log('\n[5] Extension Officer Verification & Field Visits');
    const reviewRes = await request(`/api/cases/${createdCaseId}/review`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${officerToken}` },
      body: {
        decision: 'confirm',
        verifiedDisease: 'Blast Disease',
        officerNotes: 'Foliage matches Magnaporthe blast. Recommended Tricyclazole spray.',
        scheduleVisit: true,
        visitDate: '2026-09-18',
      },
    });
    assert(reviewRes.status === 200 && reviewRes.data.data.case.status === 'confirmed', 'Officer review confirmed case status');
    assert(reviewRes.data.data.visit !== null, 'Field inspection scheduled via officer review');

    // 11. Field Visits Management
    const visitsRes = await request('/api/visits', {
      headers: { Authorization: `Bearer ${officerToken}` },
    });
    assert(visitsRes.status === 200 && Array.isArray(visitsRes.data.data), 'GET /api/visits listed scheduled inspections');

    const completeVisitRes = await request('/api/visits/VISIT-001/status', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${officerToken}` },
      body: { status: 'completed' },
    });
    assert(completeVisitRes.status === 200 && completeVisitRes.data.data.status === 'completed', 'PATCH /api/visits/:id/status marked visit completed');

    // 12. Dashboard Aggregations
    console.log('\n[6] Dashboard Analytics & Telemetry');
    const farmerStats = await request('/api/dashboard/stats', {
      headers: { Authorization: `Bearer ${farmerToken}` },
    });
    assert(farmerStats.status === 200 && farmerStats.data.data.totalCases !== undefined, 'Farmer dashboard stats aggregated');

    const weatherRes = await request('/api/weather/current?location=Ampara', {
      headers: { Authorization: `Bearer ${farmerToken}` },
    });
    assert(weatherRes.status === 200 && weatherRes.data.data.current.humidity !== undefined, 'Live micro-climate weather telemetry fetched');

    // 13. Outbreaks & Surveillance
    const outbreaksRes = await request('/api/outbreaks', {
      headers: { Authorization: `Bearer ${officerToken}` },
    });
    assert(outbreaksRes.status === 200 && Array.isArray(outbreaksRes.data.data), 'Active outbreaks list retrieved');

    // 14. Admin Broadcast & Notifications
    console.log('\n[7] Regional Early Warning Broadcast');
    const broadcastRes = await request('/api/alerts/broadcast', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        province: 'Eastern Province',
        threatLevel: 'Critical',
        cropTarget: 'Paddy (Rice)',
        broadcastMessage: 'URGENT: Blast disease outbreak watch in Eastern Province. Inspect bunds immediately.',
      },
    });
    assert(broadcastRes.status === 201, 'POST /api/alerts/broadcast transmitted emergency alert');

    const notifRes = await request('/api/notifications', {
      headers: { Authorization: `Bearer ${farmerToken}` },
    });
    assert(notifRes.status === 200 && notifRes.data.data.length > 0, 'Farmer received broadcast notification in feed');

    console.log('\n====================================================');
    console.log(` Test Suite Completed: ${passed} Passed, ${failed} Failed`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('Fatal test runner exception:', err);
    failed++;
  } finally {
    server.close();
    process.exit(failed > 0 ? 1 : 0);
  }
}

server = app.listen(TEST_PORT, () => {
  runTests();
});
