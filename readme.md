# 🌊 JeevanSetu — SIH26192

> **Before the water reaches them, the warning should.**

Flash-Flood Early Warning & Safe Evacuation Support for Hilly Regions  
**Smart India Hackathon 2026 — Problem Statement SIH26192**

---

## What is JeevanSetu?

JeevanSetu is a hyper-local flash-flood **decision-support system** for hilly regions. It combines rainfall intensity, soil saturation, terrain vulnerability, and stream levels to identify at-risk wards and recommend safe evacuation routes and shelters.

It doesn't just show weather. It converts risk into **action**:

```
Which ward is at risk → Why it is risky → Which road/bridge to avoid
→ Which shelter to move to → Who needs help first
```

---

## 🚀 Live Demo

```bash
git clone https://github.com/pavani0959/JeevanSetu.git
cd JeevanSetu
npm install
npm run dev
```

Open **http://localhost:5173**

---

## 🗺️ Key Features

| Feature | Description |
|---------|-------------|
| **SVG Ward Map** | 5 wards coloured by risk level (green → red), river, bridge status, safe route arrow |
| **Live Telemetry Bar** | Rainfall / Soil Saturation / Stream Level / Risk Score — updates every 3 seconds |
| **Risk Score Gauge** | 0–100 arc gauge with transparent breakdown (Rainfall + Soil + Stream + Terrain) |
| **30-Min Sparklines** | Recharts area charts showing the last 30 minutes of sensor data |
| **Evacuation Panel** | Unsafe infrastructure list + step-by-step safe route + ETA |
| **Shelter Status** | STANDBY → PREPARING → OPEN with animated capacity bar |
| **Priority Assistance** | Vulnerable resident counts + school/health/anganwadi evacuation labels |
| **Bilingual Alerts** | English + Hindi (Noto Sans Devanagari) alert cards at WARNING/CRITICAL |
| **Alert Feed** | Cumulative acknowledgement timeline (volunteers → coordinator → district team) |
| **Cloudburst Simulator** | 4 scenario buttons + Auto-Play (3.5s cycle) + Rainfall Slider (12–150 mm/hr) |
| **Risk Propagation View** | Ward 1 → Ward 3 → Ward 4 upstream-to-downstream flow diagram |
| **Offline Mode** | Toggle offline mode — SVG map works without any tile/API dependency |

---

## 🏙️ Simulated Location: Jeevanpur Valley (Fictional)

| Ward | Name | Elevation | Role |
|------|------|-----------|------|
| W1 | Upper Jeevanpur | 1240m | Cloudburst source (upstream) |
| W2 | Madhya Colony | 980m | Mid-slope |
| W3 | Riverside Block | 760m | Stream-adjacent |
| W4 | **Nala Basin** | **620m** | **Primary flood risk** |
| W5 | Hilltop Ridge | 1380m | **Safe zone / Shelter** |

---

## ⚙️ Risk Engine Formula

```
Ward Risk Score (0–100) =
  Rainfall Intensity       (max 40 pts)
+ Soil Saturation          (max 25 pts)
+ Stream Level Rise        (max 20 pts)
+ Terrain Vulnerability    (max 15 pts)
```

| Scenario | Rainfall | Soil | Stream | Risk Score |
|----------|----------|------|--------|------------|
| NORMAL   | 12 mm/hr | 48%  | 1.1 m  | 18/100     |
| WATCH    | 42 mm/hr | 65%  | 1.8 m  | 39/100     |
| WARNING  | 78 mm/hr | 78%  | 2.7 m  | 64/100     |
| CRITICAL | 126 mm/hr | 91% | 3.8 m  | 84/100     |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS v4 + Custom CSS Design System |
| Charts | Recharts (AreaChart sparklines) |
| Map | Custom SVG (no tile/API dependency — works offline) |
| State | Custom React hooks (`useScenario`, `useConnectivity`) |
| Data | Static JS data files (no backend required) |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── map/
│   │   └── WardMap.jsx           # SVG ward map with tooltips
│   ├── panels/
│   │   ├── TelemetryBar.jsx      # Live sensor readings
│   │   ├── RiskScorePanel.jsx    # Arc gauge + breakdown bars
│   │   ├── MicroTrendPanel.jsx   # 30-min sparklines
│   │   ├── WardInfoPanel.jsx     # Ward details on click
│   │   ├── EvacuationPanel.jsx   # Unsafe routes + safe route
│   │   ├── ShelterCard.jsx       # Shelter capacity + status
│   │   ├── PriorityPanel.jsx     # Vulnerable residents + POIs
│   │   ├── SimulatorPanel.jsx    # Scenario buttons + slider
│   │   └── RiskPropagationView.jsx  # W1→W3→W4 flow diagram
│   ├── alerts/
│   │   ├── AlertPanel.jsx        # English/Hindi bilingual alert
│   │   └── AlertFeed.jsx         # Acknowledgement timeline
│   └── shared/
│       ├── NavBar.jsx            # Top bar with live clock
│       ├── Badge.jsx             # Risk state pill badge
│       ├── Card.jsx              # Glassmorphism panel
│       ├── DemoModeBanner.jsx    # Always-visible demo strip
│       ├── OfflineBanner.jsx     # Offline mode indicator
│       └── RainCanvas.jsx        # Animated rain background
├── data/
│   ├── scenarios.js              # 4 scenario telemetry objects
│   ├── wards.js                  # 5 ward definitions
│   ├── infrastructure.js         # Roads, bridges, shelters
│   ├── vulnerablePOI.js          # Schools, health, anganwadi
│   └── microTrend.js             # 30-min history per scenario
├── engine/
│   └── riskEngine.js             # Rule-based risk calculator
├── hooks/
│   ├── useScenario.js            # Central app state + live jitter
│   └── useConnectivity.js        # Online/offline detection
└── pages/
    └── Dashboard.jsx             # Main layout assembly
```

---

## 📋 Implementation Phases

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Project Scaffold & Design System | ✅ Done |
| Phase 2 | Core Data Layer & Risk Engine | ✅ Done |
| Phase 3 | Map, Wards & Visual Risk Display | ✅ Done |
| Phase 4 | Evacuation, Alerts & Shelter System | ✅ Done |
| Phase 5 | Simulator, Polish & Offline Mode | ✅ Done |

---

## 👥 Team

**JeevanSetu** — SIH26192  
*Turning environmental risk into human decisions, one safer minute at a time.*
