import React, { useEffect, useRef } from 'react';

/**
 * RegionalMap Component
 * Interactive Leaflet/OpenStreetMap rendering:
 * - Green (<40 risk), Yellow (40-70 risk), Orange/Red (>70 risk) case markers
 * - Circular 10km outbreak containment zone polygons
 * - Registered farm locations with popup metadata
 */
export default function RegionalMap({
  cases = [],
  farms = [],
  outbreaks = [],
  center = [7.2906, 80.6337], // Default Sri Lanka center (Kandy/Ampara regional view)
  zoom = 8,
  height = '500px',
  selectedCaseId = null,
  onCaseSelect = null,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  useEffect(() => {
    // Wait until Leaflet is loaded from window
    if (!window.L || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = window.L.map(mapContainerRef.current).setView(center, zoom);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | AgroGuard AI',
        maxZoom: 18,
      }).addTo(map);

      layerGroupRef.current = window.L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const L = window.L;
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;

    // Clear previous markers/circles
    layerGroup.clearLayers();

    // 1. Plot Registered Farms (Blue home markers)
    farms.forEach((f) => {
      if (!f.latitude || !f.longitude) return;

      const farmIcon = L.divIcon({
        className: 'custom-farm-marker',
        html: `
          <div style="
            background-color: #0284c7;
            color: white;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            font-size: 14px;
          ">
            🏡
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([f.latitude, f.longitude], { icon: farmIcon });
      marker.bindPopup(`
        <div style="font-family: Inter, sans-serif; min-width: 180px;">
          <h4 style="margin: 0 0 4px; font-weight: bold; color: #0f172a;">${f.name}</h4>
          <div style="font-size: 12px; color: #475569;"><strong>Owner:</strong> ${f.ownerName || 'Farmer'}</div>
          <div style="font-size: 12px; color: #475569;"><strong>Crop:</strong> ${f.cropType || 'Mixed'} (${f.acreage || 1} ac)</div>
          <div style="font-size: 12px; color: #475569;"><strong>Location:</strong> ${f.location}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">GPS: ${f.latitude}, ${f.longitude}</div>
        </div>
      `);
      layerGroup.addLayer(marker);
    });

    // 2. Plot Outbreak Clusters & Containment Radii (Red dashed circles)
    outbreaks.forEach((outbreak) => {
      if (!outbreak.latitude || !outbreak.longitude) return;

      const radiusMeters = (outbreak.radiusKm || 10) * 1000;

      // Circle representing containment zone
      const circle = L.circle([outbreak.latitude, outbreak.longitude], {
        color: '#dc2626',
        fillColor: '#ef4444',
        fillOpacity: 0.15,
        weight: 2,
        dashArray: '6, 6',
        radius: radiusMeters,
      });

      circle.bindPopup(`
        <div style="font-family: Inter, sans-serif; min-width: 200px;">
          <div style="background: #fee2e2; color: #991b1b; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold; display: inline-block; margin-bottom: 6px;">
            BIOSECURITY CONTAINMENT ZONE (${outbreak.radiusKm || 10} km)
          </div>
          <h4 style="margin: 0 0 4px; font-weight: bold; color: #991b1b;">${outbreak.disease} Outbreak</h4>
          <div style="font-size: 12px; color: #374151;"><strong>District:</strong> ${outbreak.location}</div>
          <div style="font-size: 12px; color: #374151;"><strong>Cluster Cases:</strong> ${outbreak.caseCount || outbreak.activeCases || 3} verified</div>
          <div style="font-size: 12px; color: #374151;"><strong>Status:</strong> ${outbreak.status || 'Active'}</div>
        </div>
      `);
      layerGroup.addLayer(circle);

      // Centroid Outbreak Marker
      const outbreakIcon = L.divIcon({
        className: 'custom-outbreak-marker',
        html: `
          <div style="
            background-color: #dc2626;
            color: white;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid white;
            box-shadow: 0 0 10px rgba(220, 38, 38, 0.7);
            font-size: 15px;
            animation: pulse 2s infinite;
          ">
            ☣️
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const centerMarker = L.marker([outbreak.latitude, outbreak.longitude], { icon: outbreakIcon });
      centerMarker.bindPopup(`<strong>Cluster Centroid:</strong> ${outbreak.disease} (${outbreak.location})`);
      layerGroup.addLayer(centerMarker);
    });

    // 3. Plot Cases by Risk Level (Green < 40, Yellow 40-70, Orange/Red > 70)
    cases.forEach((c) => {
      if (!c.latitude || !c.longitude) return;

      const risk = Number(c.spreadRisk) || 50;
      let color = '#22c55e'; // green
      let label = 'Low Risk';

      if (risk >= 75 || c.severity === 'critical') {
        color = '#ef4444'; // red
        label = 'Critical / Severe';
      } else if (risk >= 60) {
        color = '#f97316'; // orange
        label = 'High Risk';
      } else if (risk >= 40) {
        color = '#eab308'; // yellow
        label = 'Moderate Risk';
      }

      const isSelected = selectedCaseId && String(selectedCaseId) === String(c.id);

      const caseIcon = L.divIcon({
        className: 'custom-case-marker',
        html: `
          <div style="
            background-color: ${color};
            color: white;
            border-radius: 50%;
            width: ${isSelected ? '28px' : '22px'};
            height: ${isSelected ? '28px' : '22px'};
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            font-weight: bold;
            font-size: 10px;
          ">
            ${c.id}
          </div>
        `,
        iconSize: isSelected ? [28, 28] : [22, 22],
        iconAnchor: isSelected ? [14, 14] : [11, 11],
      });

      const marker = L.marker([c.latitude, c.longitude], { icon: caseIcon });

      marker.bindPopup(`
        <div style="font-family: Inter, sans-serif; min-width: 220px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <strong style="color: #0f172a; font-size: 14px;">Case #${c.id}</strong>
            <span style="background: ${color}; color: white; padding: 2px 6px; border-radius: 10px; font-size: 10px; font-weight: bold;">
              Risk: ${risk}/100
            </span>
          </div>
          <div style="font-size: 12px; margin-bottom: 2px;"><strong>Disease:</strong> ${c.disease || 'Pending'}</div>
          <div style="font-size: 12px; margin-bottom: 2px;"><strong>Crop:</strong> ${c.cropType || 'Crop'}</div>
          <div style="font-size: 12px; margin-bottom: 2px;"><strong>Location:</strong> ${c.location || 'Unknown'}</div>
          <div style="font-size: 12px; margin-bottom: 2px;"><strong>Severity:</strong> <span style="text-transform: capitalize;">${c.severity || 'medium'}</span></div>
          <div style="font-size: 12px; margin-bottom: 4px;"><strong>Status:</strong> <span style="text-transform: capitalize;">${c.status || 'pending'}</span></div>
          ${c.officerVerified ? '<div style="color: #15803d; font-size: 11px; font-weight: bold;">✓ Officer Verified</div>' : ''}
          ${onCaseSelect ? `<button onclick="window.__selectAgroCase && window.__selectAgroCase('${c.id}')" style="margin-top: 6px; width: 100%; background: #15803d; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer;">View Details</button>` : ''}
        </div>
      `);

      layerGroup.addLayer(marker);
    });

    // Expose select callback if needed
    if (onCaseSelect) {
      window.__selectAgroCase = onCaseSelect;
    }
  }, [cases, farms, outbreaks, selectedCaseId, center, zoom]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-md border border-gray-200">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />

      {/* Map Interactive Legend Overlay */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-200 z-[1000] text-xs space-y-1.5 pointer-events-auto">
        <div className="font-bold text-gray-900 mb-1 flex items-center justify-between gap-3">
          <span>Map Intelligence</span>
          <span className="text-[10px] text-gray-500 font-normal">Sri Lanka Regional</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 border border-white" />
          <span className="text-gray-700">High / Critical Risk (&gt;70)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500 border border-white" />
          <span className="text-gray-700">Moderate Risk (40 - 70)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500 border border-white" />
          <span className="text-gray-700">Low Risk (&lt;40)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">🏡</span>
          <span className="text-gray-700">Registered Farm</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 border border-red-500 border-dashed rounded-full bg-red-100" />
          <span className="text-gray-700">10 km Outbreak Radius</span>
        </div>
      </div>
    </div>
  );
}
