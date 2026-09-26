# 🌊 JeevanSetu — SIH26192

> **Before the water reaches them, the warning should.**

Flash-Flood Early Warning & Safe Evacuation Support for Hilly Regions
**Smart India Hackathon 2026 — Problem Statement SIH26192**

---

## 🚀 Quick Start

```bash
git clone https://github.com/pavani0959/JeevanSetu.git
cd JeevanSetu
npm install
npm run dev
```

Open **http://localhost:5173**

---

## What is JeevanSetu?

JeevanSetu is a hyper-local flash-flood **decision-support system** for hilly regions. It combines rainfall intensity, soil saturation, terrain vulnerability, and stream levels to identify at-risk wards and recommend safe evacuation routes and shelters — converting raw sensor data into clear human action.

> Which ward is at risk → Why → Which road/bridge to avoid → Which shelter → Who needs help first

---

## 🗺️ Key Features

| Feature | Description |
|---------|-------------|
| **SVG Ward Map** | 5 wards coloured by risk (green→red), river, bridge status, safe route arrow |
| **Live Telemetry Bar** | Rainfall / Soil / Stream / Risk Score — updates every 3 sec with sensor jitter |
| **Risk Score Gauge** | 0–100 animated arc gauge with breakdown (Rainfall + Soil + Stream + Terrain) |
| **30-Min Sparklines** | Recharts area charts showing last 30 minutes of sensor data per scenario |
| **Evacuation Panel** | Unsafe infra list + step-by-step safe route card + ETA 18 min |
| **Shelter Status** | STANDBY → PREPARING → OPEN with animated capacity bar (87/120) |
| **Priority Assistance** | Vulnerable resident counts + school/health/anganwadi evacuation labels |
| **Bilingual Alerts** | English + Hindi (Noto Sans Devanagari) alert cards at WARNING/CRITICAL |
| **Alert Feed** | Cumulative acknowledgement timeline (volunteer → coordinator → district) |
| **Cloudburst Simulator** | 4 buttons + Auto-Play 3.5s cycle + Rainfall Slider 12–150 mm/hr |
| **Risk Propagation View** | Ward 1 → Ward 3 → Ward 4 upstream-to-downstream flow diagram |
| **Offline Mode** | Toggle — SVG map + cached data works with zero tile/API dependency |

---

## ⚙️ Risk Engine Formula

```
Ward Risk Score (0–100) =
  Rainfall Intensity       (max 40 pts)
+ Soil Saturation          (max 25 pts)
+ Stream Level Rise        (max 20 pts)
+ Terrain Vulnerability    (max 15 pts)
```

| Scenario | Rainfall | Soil | Stream | Risk Score (Ward 4) |
|----------|----------|------|--------|---------------------|
| NORMAL   | 12 mm/hr | 48%  | 1.1 m  | 18 / 100 |
| WATCH    | 42 mm/hr | 65%  | 1.8 m  | 39 / 100 |
| WARNING  | 78 mm/hr | 78%  | 2.7 m  | 64 / 100 |
| CRITICAL | 126 mm/hr | 91% | 3.8 m  | 84 / 100 |

---

## 🏙️ Simulated Location: Jeevanpur Valley

| Ward | Name | Elevation | Role |
|------|------|-----------|------|
| W1 | Upper Jeevanpur | 1240m | Cloudburst source (upstream) |
| W2 | Madhya Colony | 980m | Mid-slope |
| W3 | Riverside Block | 760m | Stream-adjacent |
| **W4** | **Nala Basin** | **620m** | **Primary flood risk** |
| W5 | Hilltop Ridge | 1380m | Safe zone / Shelter destination |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS v4 + Custom CSS Design System |
| Charts | Recharts (AreaChart sparklines) |
| Map | Custom SVG (offline-capable, no tile dependency) |
| State | Custom React hooks (`useScenario`, `useConnectivity`) |
| Data | Static JS files — no backend required |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── map/
│   │   └── WardMap.jsx              # SVG map with 5 wards, river, bridge, POIs
│   ├── panels/
│   │   ├── TelemetryBar.jsx         # Live sensor readings strip
│   │   ├── RiskScorePanel.jsx       # Arc gauge + 4 breakdown bars
│   │   ├── MicroTrendPanel.jsx      # 30-min Recharts sparklines
│   │   ├── WardInfoPanel.jsx        # Ward details on click
│   │   ├── EvacuationPanel.jsx      # Unsafe infra + safe route steps
│   │   ├── ShelterCard.jsx          # Shelter capacity + OPEN/PREPARING/STANDBY
│   │   ├── PriorityPanel.jsx        # Vulnerable residents + POI labels
│   │   ├── SimulatorPanel.jsx       # 4 buttons + Auto-Play + Slider + Offline
│   │   └── RiskPropagationView.jsx  # W1→W3→W4 flow diagram
│   ├── alerts/
│   │   ├── AlertPanel.jsx           # English/Hindi bilingual alert
│   │   └── AlertFeed.jsx            # Acknowledgement timeline
│   └── shared/
│       ├── NavBar.jsx               # Top bar with live clock + risk badge
│       ├── Badge.jsx                # Coloured risk state pill
│       ├── Card.jsx                 # Glassmorphism panel wrapper
│       ├── DemoModeBanner.jsx       # Always-visible demo strip
│       ├── OfflineBanner.jsx        # Offline mode indicator
│       └── RainCanvas.jsx           # Animated rain background
├── data/
│   ├── scenarios.js                 # 4 scenario telemetry objects
│   ├── wards.js                     # 5 ward definitions
│   ├── infrastructure.js            # Roads, bridges, shelters per scenario
│   ├── vulnerablePOI.js             # Schools, health, anganwadi
│   └── microTrend.js                # 30-min history per scenario
├── engine/
│   └── riskEngine.js                # Rule-based risk calculator (9 functions)
├── hooks/
│   ├── useScenario.js               # Central app state + live jitter
│   └── useConnectivity.js           # Online/offline detection
└── pages/
    └── Dashboard.jsx                # Main layout — all panels wired
```

---

## 📋 Implementation Status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Project Scaffold & Design System | ✅ Complete |
| 2 | Core Data Layer & Risk Engine | ✅ Complete |
| 3 | Map, Wards & Visual Risk Display | ✅ Complete |
| 4 | Evacuation, Alerts & Shelter System | ✅ Complete |
| 5 | Simulator, Polish & Offline Mode | ✅ Complete |

All **107 plan items** verified and implemented.

---

*JeevanSetu — Turning environmental risk into human decisions, one safer minute at a time.*
