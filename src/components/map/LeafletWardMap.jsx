/**
 * LeafletWardMap.jsx — Leaflet.js interactive map for JeevanSetu
 *
 * Renders a real OpenStreetMap tile layer centered on Chamoli, Uttarakhand.
 * Overlays fictional ward polygons + risk color fills on top of real terrain.
 * Shows bridge, safe route, shelter markers dynamically.
 *
 * Coordinates: Chamoli district, Uttarakhand, India (~30.40°N, 79.33°E)
 */

// ✅ CORRECT: Static imports — Vite handles bundling + CSS injection
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';

// Fix Leaflet default marker icon broken by Vite's asset pipeline
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});


/* ── Fictional ward polygons anchored near Chamoli, Uttarakhand ──────────────
   These are small offsets from the Chamoli district centre (30.40, 79.33).
   They look like real village wards on the actual Himalayan terrain.
   ─────────────────────────────────────────────────────────────────────────── */
const WARD_POLYGONS = {
  W1: {
    id: 'W1', name: 'Ward 1 — Upper Devgaon',
    coords: [
      [30.425, 79.305], [30.438, 79.320], [30.432, 79.335],
      [30.418, 79.330], [30.412, 79.315],
    ],
    elevation: 1820, population: 312,
  },
  W2: {
    id: 'W2', name: 'Ward 2 — Jeevanpur North',
    coords: [
      [30.412, 79.315], [30.418, 79.330], [30.408, 79.348],
      [30.395, 79.342], [30.400, 79.322],
    ],
    elevation: 1540, population: 487,
  },
  W3: {
    id: 'W3', name: 'Ward 3 — Midstream',
    coords: [
      [30.400, 79.322], [30.395, 79.342], [30.380, 79.355],
      [30.372, 79.338], [30.385, 79.318],
    ],
    elevation: 1290, population: 623,
  },
  W4: {
    id: 'W4', name: 'Ward 4 — Riverside (Flood Zone)',
    coords: [
      [30.385, 79.318], [30.372, 79.338], [30.362, 79.328],
      [30.358, 79.310], [30.370, 79.298], [30.382, 79.302],
    ],
    elevation: 1050, population: 891,
  },
  W5: {
    id: 'W5', name: 'Ward 5 — Hilltop (Safe Zone)',
    coords: [
      [30.432, 79.335], [30.445, 79.350], [30.440, 79.368],
      [30.425, 79.360], [30.415, 79.345], [30.418, 79.330],
    ],
    elevation: 2100, population: 198,
  },
};


// Risk score → fill/color
function scoreToStyle(score, isCritical) {
  if (score >= 75) return { color: '#ef4444', fillColor: '#ef4444', fillOpacity: isCritical ? 0.55 : 0.45, weight: 2.5 };
  if (score >= 50) return { color: '#f97316', fillColor: '#f97316', fillOpacity: 0.40, weight: 2 };
  if (score >= 30) return { color: '#eab308', fillColor: '#eab308', fillOpacity: 0.30, weight: 1.5 };
  return { color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.22, weight: 1.5 };
}

// Ward risk scores per scenario
const WARD_RISK_SCORES = {
  NORMAL:   { W1: 10, W2: 14, W3: 16, W4: 18, W5: 6  },
  WATCH:    { W1: 22, W2: 31, W3: 35, W4: 39, W5: 12 },
  WARNING:  { W1: 38, W2: 51, W3: 58, W4: 64, W5: 20 },
  CRITICAL: { W1: 52, W2: 68, W3: 74, W4: 84, W5: 28 },
};

export default function LeafletWardMap({ scenarioKey, selectedWardId, onWardClick }) {
  const mapRef      = useRef(null);
  const leafletRef  = useRef(null);  // L instance
  const layersRef   = useRef({});    // { wardPolygons, bridgeMarker, routeLine, shelterMarker }
  const [mapError, setMapError]  = useState(false);

  const bridgeClosed = scenarioKey === 'WARNING' || scenarioKey === 'CRITICAL';
  const showSafeRoute = scenarioKey === 'WARNING' || scenarioKey === 'CRITICAL';

  // ── Initialize map once ──────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || leafletRef.current) return;

    try {
      const map = L.map(mapRef.current, {
        center: [30.395, 79.328],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      leafletRef.current = { L, map };


        // ── OSM tile layer ─────────────────────────────────────────────────
        const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(map);

        // ── Historical Flood Hazard Zones (NRSC/ISRO Bhuvan proxy) ──────────
        // Fictional polygons representing historical inundation zones near
        // Ward 4 (riverside low-elevation area). In production, these would
        // come from NRSC Bhuvan flood hazard layers or NDMA flood maps.
        const floodHazardGeoJSON = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {
                name: 'Historical High-Risk Flood Zone (Ward 4 Riverside)',
                source: 'Proxy for NRSC/ISRO Bhuvan flood hazard layer',
                return_period: '10-year flood extent',
                last_event: '2013 Uttarakhand floods',
              },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [79.298, 30.360], [79.315, 30.358], [79.330, 30.363],
                  [79.338, 30.372], [79.325, 30.380], [79.308, 30.378],
                  [79.295, 30.370], [79.298, 30.360],
                ]],
              },
            },
            {
              type: 'Feature',
              properties: {
                name: 'Moderate Flood Hazard — Jeevan Stream Corridor',
                source: 'Proxy for NRSC/ISRO Bhuvan flood hazard layer',
                return_period: '25-year flood extent',
              },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [79.310, 30.380], [79.325, 30.380], [79.340, 30.395],
                  [79.350, 30.405], [79.335, 30.412], [79.318, 30.408],
                  [79.305, 30.395], [79.310, 30.380],
                ]],
              },
            },
          ],
        };

        const floodHazardLayer = L.geoJSON(floodHazardGeoJSON, {
          style: {
            color: '#38bdf8',
            fillColor: '#0ea5e9',
            fillOpacity: 0.18,
            weight: 1.5,
            dashArray: '5 4',
            opacity: 0.7,
          },
          onEachFeature: (feature, layer) => {
            layer.bindPopup(`
              <b>⚠️ ${feature.properties.name}</b><br>
              <small>${feature.properties.source}</small><br>
              Return period: ${feature.properties.return_period || 'Historical'}
            `);
          },
        }).addTo(map);
        layersRef.current.floodHazardLayer = floodHazardLayer;

        // ── Layer control ───────────────────────────────────────────────────
        L.control.layers(
          { 'OpenStreetMap': osmLayer },
          { '⚠️ Flood Hazard Zones (NRSC proxy)': floodHazardLayer },
          { position: 'topright', collapsed: false }
        ).addTo(map);


        // ── Shelter marker (Ward 5 hilltop) ────────────────────────────────
        const shelterIcon = L.divIcon({
          html: `<div style="
            background:#1d4ed8; border:2px solid #60a5fa; border-radius:6px;
            padding:3px 7px; font-size:10px; font-weight:900; color:#fff;
            white-space:nowrap; box-shadow:0 2px 8px rgba(0,0,0,0.4);">
            🏫 SHELTER
          </div>`,
          className: '',
          iconAnchor: [40, 10],
        });
        const shelterMarker = L.marker([30.438, 79.356], { icon: shelterIcon })
          .addTo(map)
          .bindPopup('<b>Hilltop Community School</b><br>Capacity: 120 · High-ground safe shelter');
        layersRef.current.shelterMarker = shelterMarker;

        // ── Ward polygons ──────────────────────────────────────────────────
        const wardPolygons = {};
        Object.values(WARD_POLYGONS).forEach(ward => {
          const score = WARD_RISK_SCORES[scenarioKey][ward.id];
          const style = scoreToStyle(score, scenarioKey === 'CRITICAL');
          const poly  = L.polygon(ward.coords, style).addTo(map);
          poly.bindPopup(`
            <b>${ward.name}</b><br>
            Risk Score: <b>${score}/100</b><br>
            Elevation: ${ward.elevation}m<br>
            Population: ${ward.population.toLocaleString()}
          `);
          poly.on('click', () => onWardClick && onWardClick(ward.id));
          wardPolygons[ward.id] = poly;
        });
        layersRef.current.wardPolygons = wardPolygons;

        // ── Ward label markers (stored for later update) ────────────────────
        const labelMarkers = {};
        Object.values(WARD_POLYGONS).forEach(ward => {
          const score = WARD_RISK_SCORES[scenarioKey][ward.id];
          const color = score >= 75 ? '#ef4444' : score >= 50 ? '#f97316' : score >= 30 ? '#eab308' : '#22c55e';
          const centroid = ward.coords.reduce((acc, c) => [acc[0]+c[0], acc[1]+c[1]], [0,0]).map(v => v/ward.coords.length);
          const labelIcon = L.divIcon({
            html: `<div style="
              background:rgba(7,10,25,0.88); border:1px solid ${color}55;
              border-radius:5px; padding:2px 6px; text-align:center;
              font-size:10px; font-weight:900; color:${color};
              white-space:nowrap; pointer-events:none;">
              ${ward.id}<br><span style="font-size:9px">${score}/100</span>
            </div>`,
            className: '',
            iconAnchor: [24, 14],
          });
          const marker = L.marker(centroid, { icon: labelIcon, interactive: false }).addTo(map);
          labelMarkers[ward.id] = { marker, centroid };
        });
        layersRef.current.labelMarkers = labelMarkers;

        // ── East Bridge marker ─────────────────────────────────────────────
        const bridgeIcon = L.divIcon({
          html: `<div style="
            background:${bridgeClosed ? 'rgba(239,68,68,0.9)' : 'rgba(34,197,94,0.9)'};
            border:2px solid ${bridgeClosed ? '#ef4444' : '#22c55e'};
            border-radius:4px; padding:2px 6px; font-size:9px; font-weight:900; color:#fff;
            white-space:nowrap;">
            ${bridgeClosed ? '🚫 BRIDGE CLOSED' : '✅ BRIDGE OPEN'}
          </div>`,
          className: '',
          iconAnchor: [55, 10],
        });
        const bridgeMarker = L.marker([30.375, 79.324], { icon: bridgeIcon })
          .addTo(map)
          .bindPopup('<b>East Bridge</b><br>' + (bridgeClosed ? '⚠️ CLOSED — Flash flood risk' : '✅ Open'));
        layersRef.current.bridgeMarker = bridgeMarker;

        // ── Safe route polyline ────────────────────────────────────────────
        if (showSafeRoute) {
          const routeCoords = [
            [30.362, 79.315], [30.372, 79.308], [30.385, 79.312],
            [30.400, 79.318], [30.412, 79.330], [30.428, 79.345], [30.438, 79.356],
          ];
          const routeLine = L.polyline(routeCoords, {
            color: '#22c55e',
            weight: 4,
            dashArray: '10 5',
            opacity: 0.9,
          }).addTo(map).bindPopup('<b>✅ Safe Evacuation Route</b><br>Ward 4 → Hilltop Shelter');
          layersRef.current.routeLine = routeLine;
        }

      } catch (err) {
        console.error('Leaflet init error:', err);
        setMapError(true);
      }

    return () => {
      if (leafletRef.current?.map) {
        leafletRef.current.map.remove();
        leafletRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Update ward polygon styles when scenario changes ──────────────────────
  useEffect(() => {
    const lRef = leafletRef.current;
    if (!lRef) return;
    const { wardPolygons, bridgeMarker, routeLine } = layersRef.current;
    const { L, map } = lRef;

    // Update ward polygon colors AND label markers
    if (wardPolygons) {
      Object.values(WARD_POLYGONS).forEach(ward => {
        const score = WARD_RISK_SCORES[scenarioKey][ward.id];
        const style = scoreToStyle(score, scenarioKey === 'CRITICAL');
        wardPolygons[ward.id]?.setStyle(style);
        // Update popup text
        wardPolygons[ward.id]?.bindPopup(`
          <b>${ward.name}</b><br>
          Risk Score: <b>${score}/100</b><br>
          Elevation: ${ward.elevation}m<br>
          Population: ${ward.population.toLocaleString()}
        `);
      });
    }

    // Update label marker icons
    const { labelMarkers } = layersRef.current;
    if (labelMarkers) {
      Object.values(WARD_POLYGONS).forEach(ward => {
        const score = WARD_RISK_SCORES[scenarioKey][ward.id];
        const color = score >= 75 ? '#ef4444' : score >= 50 ? '#f97316' : score >= 30 ? '#eab308' : '#22c55e';
        const newIcon = L.divIcon({
          html: `<div style="
            background:rgba(7,10,25,0.88); border:1px solid ${color}55;
            border-radius:5px; padding:2px 6px; text-align:center;
            font-size:10px; font-weight:900; color:${color};
            white-space:nowrap; pointer-events:none;">
            ${ward.id}<br><span style="font-size:9px">${score}/100</span>
          </div>`,
          className: '',
          iconAnchor: [24, 14],
        });
        labelMarkers[ward.id]?.marker.setIcon(newIcon);
      });
    }

    // Update bridge marker
    if (bridgeMarker) {
      const newIcon = L.divIcon({
        html: `<div style="
          background:${bridgeClosed ? 'rgba(239,68,68,0.9)' : 'rgba(34,197,94,0.9)'};
          border:2px solid ${bridgeClosed ? '#ef4444' : '#22c55e'};
          border-radius:4px; padding:2px 6px; font-size:9px; font-weight:900; color:#fff;
          white-space:nowrap;">
          ${bridgeClosed ? '🚫 BRIDGE CLOSED' : '✅ BRIDGE OPEN'}
        </div>`,
        className: '',
        iconAnchor: [55, 10],
      });
      bridgeMarker.setIcon(newIcon);
    }

    // Add/remove safe route
    if (showSafeRoute && !routeLine) {
      const routeCoords = [
        [30.362, 79.315], [30.372, 79.308], [30.385, 79.312],
        [30.400, 79.318], [30.412, 79.330], [30.428, 79.345], [30.438, 79.356],
      ];
      const newLine = L.polyline(routeCoords, {
        color: '#22c55e', weight: 4, dashArray: '10 5', opacity: 0.9,
      }).addTo(map).bindPopup('<b>✅ Safe Evacuation Route</b><br>Ward 4 → Hilltop Shelter');
      layersRef.current.routeLine = newLine;
    } else if (!showSafeRoute && routeLine) {
      map.removeLayer(routeLine);
      layersRef.current.routeLine = null;
    }

  }, [scenarioKey, bridgeClosed, showSafeRoute]);

  if (mapError) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#fbbf24', fontSize: 12 }}>
        ⚠️ Map failed to load. Showing SVG fallback instead.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 10 }}>
      {/* Live data badge */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 10, color: 'var(--color-muted-bright)',
      }}>
        <span style={{ color: '#60a5fa', fontWeight: 700 }}>
          📍 Chamoli, Uttarakhand — Real Himalayan Terrain (OpenStreetMap)
        </span>
        <span style={{
          background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
          color: '#22c55e', fontWeight: 800, padding: '1px 8px', borderRadius: 12, fontSize: 9,
        }}>
          🗺️ LIVE OSM TILES
        </span>
      </div>

      {/* Leaflet map container */}
      <div
        ref={mapRef}
        style={{
          width: '100%', flex: 1, minHeight: '440px', borderRadius: 10,
          overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)',
          marginBottom: 10,
        }}
      />

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', fontSize: 10 }}>
        {[
          { color: '#22c55e', label: 'Normal' },
          { color: '#eab308', label: 'Watch' },
          { color: '#f97316', label: 'Warning' },
          { color: '#ef4444', label: 'Critical' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#94a3b8' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: color, opacity: 0.85 }} />
            {label}
          </div>
        ))}
        {showSafeRoute && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#22c55e', fontWeight: 600 }}>
            <div style={{ width: 14, height: 3, background: '#22c55e', borderRadius: 2 }} />
            Safe Route
          </div>
        )}
        <div style={{ color: bridgeClosed ? '#ef4444' : '#22c55e', fontWeight: 700 }}>
          Bridge: {bridgeClosed ? 'CLOSED' : 'Open'}
        </div>
        <div style={{ fontSize: 9, color: '#64748b', marginLeft: 'auto' }}>
          © OpenStreetMap contributors · Wards fictional overlay
        </div>
      </div>
    </div>
  );
}
