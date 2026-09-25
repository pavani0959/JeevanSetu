# JeevanSetu — SIH26192
## Flash-Flood Early Warning & Safe Evacuation Support for Hilly Regions
### Phased Implementation Plan

> **Tagline:** Before the water reaches them, the warning should.

---

## Overview

This plan is divided into **5 phases**. Each phase is self-contained and produces a deliverable. Completing all phases results in a fully working prototype ready for SIH demo, PPT, and YouTube video submission.

```
Phase 1 → Project Scaffold & Design System       ✅ DONE
Phase 2 → Core Data Layer & Risk Engine           ✅ DONE
Phase 3 → Map, Wards & Visual Risk Display        🔲 TODO
Phase 4 → Evacuation, Alerts & Shelter System     🔲 TODO
Phase 5 → Simulator, Polish & Offline Mode        🔲 TODO
```

---

## Phase 1 — Project Scaffold & Design System ✅ DONE
**Goal:** Set up the React project with a polished design system before writing any feature code.

### 1.1 Project Initialisation
- [x] Create a new React + Vite project inside `sih/`
- [x] Install dependencies: `react`, `vite`, `tailwindcss`, `recharts`
- [x] Set up folder structure:
  ```
  sih/
  ├── public/
  ├── src/
  │   ├── assets/
  │   ├── components/
  │   │   ├── map/
  │   │   ├── panels/
  │   │   ├── alerts/
  │   │   └── shared/
  │   ├── data/
  │   ├── engine/
  │   ├── hooks/
  │   ├── pages/
  │   └── App.jsx
  ├── index.html
  └── package.json
  ```

### 1.2 Design System (CSS / Tailwind Tokens)
| Token | Colour | Usage |
|-------|--------|-------|
| `--color-bg` | `#07091a` | Dark navy background |
| `--color-surface` | `#111827` | Panel/card backgrounds |
| `--color-normal` | `#22c55e` | Safe / NORMAL state |
| `--color-watch` | `#eab308` | Elevated risk / WATCH |
| `--color-warning` | `#f97316` | Danger / WARNING |
| `--color-critical` | `#ef4444` | Immediate danger / CRITICAL |
| `--color-accent` | `#3b82f6` | UI highlights / rain blue |

- [x] Create `src/index.css` with CSS variables and global resets
- [x] Create `src/theme.js` exporting theme tokens for use in JS
- [x] Import **Google Fonts** — `Inter` for UI, `Noto Sans Devanagari` for Hindi alerts
- [x] Create reusable shared components:
  - [x] `<Badge status="CRITICAL" />` — coloured pill for risk states
  - [x] `<Card />` — glass-morphism panel wrapper
  - [x] `<Divider />` — subtle separator

### 1.3 App Shell
- [x] Create main layout: top nav bar + sidebar + main content area
- [x] Add persistent **DEMO MODE** banner: `DEMO MODE — Simulated Cloudburst Scenario`
- [x] Add persistent **offline indicator** component (initially hidden)
- [x] `<RainCanvas />` — animated rain background
- [x] `<NavBar />` — sticky header with logo, live clock, risk state badge
- [x] Ensure layout is responsive (desktop-first)

**Phase 1 Deliverable:** ✅ Running app at `localhost:5173` with correct colours, fonts, layout skeleton, and DEMO MODE banner.

---

## Phase 2 — Core Data Layer & Risk Engine ✅ DONE
**Goal:** Define all dummy data and the rule-based risk calculation engine.

### 2.1 Scenario Data
- [x] `src/data/scenarios.js` — 4 scenario objects (NORMAL/WATCH/WARNING/CRITICAL)
  - Exact values: NORMAL 12mm/48%/1.1m/18pts → CRITICAL 126mm/91%/3.8m/84pts
- [x] `src/data/wards.js` — 5 ward definitions for **Jeevanpur Valley**
  - Ward 1: Upper Jeevanpur (upstream, 1240m)
  - Ward 2: Madhya Colony (mid-slope, 980m)
  - Ward 3: Riverside Block (stream-adjacent, 760m)
  - Ward 4: Nala Basin (lowest, 620m — primary risk)
  - Ward 5: Hilltop Ridge (safe zone / shelter, 1380m)
- [x] `src/data/infrastructure.js` — roads, bridges, shelters + explicit shelter state per scenario:
  - NORMAL → STANDBY | WATCH → STANDBY (volunteer notified) | WARNING → PREPARING | CRITICAL → OPEN
- [x] `src/data/vulnerablePOI.js` — schools, health centres, anganwadi:
  - Jeevanpur Primary School (Ward 3, HIGH priority)
  - Nala Basin Health Sub-Centre (Ward 4, HIGH priority)
  - Anganwadi Centre (Ward 2, MODERATE)
- [x] `src/data/microTrend.js` — 30-min history arrays per scenario with ↑↑/↑/→ labels

### 2.2 Risk Engine (`src/engine/riskEngine.js`)
```
Ward Risk Score (0–100) =
  Rainfall Risk         (max 40 pts)
+ Soil Saturation Risk  (max 25 pts)
+ Stream Level Risk     (max 20 pts)
+ Terrain Vulnerability (max 15 pts)
```
- [x] `calculateRainfallRisk(mmPerHr)` → 0–40
- [x] `calculateSoilRisk(pct)` → 0–25
- [x] `calculateStreamRisk(meters)` → 0–20
- [x] `calculateTerrainRisk(vulnerabilityIndex)` → 0–15
- [x] `calculateWardRiskScore(inputs)` → total + breakdown + pct + state
- [x] `getRiskState(score)` → `'NORMAL' | 'WATCH' | 'WARNING' | 'CRITICAL'`
- [x] `getUnsafeInfrastructure(riskState)`
- [x] `getSafeRoute(riskState)`
- [x] `getActiveShelter(riskState)`
- [x] `runSelfTest()` — verifies all 4 scenarios in browser console

### 2.3 App State Hooks
- [x] `src/hooks/useScenario.js`:
  - Current scenario key + `setScenario(key)`
  - Live ±jitter every 3 seconds (real sensor feel)
  - Derived: riskResult, microTrend, unsafeInfra, safeRoute, shelter, poiActions, alertFeed
  - Auto-play mode (cycles all 4 states every 3.5s)
  - Rainfall slider override
  - Cumulative alert feed per scenario (WATCH → WARNING → CRITICAL entries)
- [x] `src/hooks/useConnectivity.js` — online/offline + demo toggle

**Phase 2 Deliverable:** ✅ All data and logic working. Risk engine self-test passes in console. Live telemetry with jitter visible in dashboard.

---

## Phase 3 — Map, Wards & Visual Risk Display
**Goal:** Build the central visual — the ward-level risk map and monitoring panels.

### 3.1 SVG Ward Map (`src/components/map/WardMap.jsx`)
- [ ] Design SVG showing:
  - Contour-style hill outlines in background
  - 5 ward polygons, each coloured by risk state (green → red)
  - River/stream path flowing from Ward 1 → Ward 4
  - East Bridge marker (turns red ⚠ at WARNING+)
  - Safe route arrow (North Road, appears at WARNING+)
  - Shelter icon at Ward 5
  - Ward labels with population counts
  - **School icon** at Ward 3 (Jeevanpur Primary School) — priority POI
  - **Health centre icon** at Ward 4 (Nala Basin Health Sub-Centre) — priority POI
  - **Anganwadi icon** at Ward 2 — moderate priority POI
  - POI icons pulse/highlight at WARNING+
- [ ] Animate ward colour transitions: `transition: fill 0.6s ease`
- [ ] Add pulsing animation on CRITICAL wards
- [ ] Add tooltip on ward hover: name, risk score, risk state badge
- [ ] Add tooltip on POI hover: name, type, estimated occupants, priority level
- [ ] Add map legend: Normal / Watch / Warning / Critical / Unsafe / Safe Route / Priority POI

### 3.2 Live Telemetry Bar (`src/components/panels/TelemetryBar.jsx`)
- [ ] Animated number counters (tick smoothly on scenario change)
- [ ] Colour each reading by severity (green/yellow/orange/red)
- [ ] Small trend arrows: `↑↑` (fast rise), `↑` (slow rise), `→` (stable)

### 3.3 Risk Score Panel (`src/components/panels/RiskScorePanel.jsx`)
- [ ] Large circular arc gauge showing `84 / 100`
- [ ] Animated fill on scenario change
- [ ] Risk state badge
- [ ] Explainable breakdown bars (Rainfall 34/40, Soil 22/25, Stream 17/20, Terrain 11/15)
- [ ] Each bar animates smoothly

### 3.4 Micro-Trend Panel (`src/components/panels/MicroTrendPanel.jsx`)
- [ ] Three sparklines (`recharts`): Rainfall | Soil Saturation | Stream Level
- [ ] Direction indicators: `↑↑ Rapidly Rising`, `↑ Rising`, `→ Stable`
- [ ] Sparkline colour matches current risk state
- [ ] Title: **"Last 30 Minutes — Rate of Change"**

### 3.5 Ward Info Sidebar (`src/components/panels/WardInfoPanel.jsx`)
- [ ] Ward name, elevation, population
- [ ] Risk state badge
- [ ] Vulnerable resident counts: `Elderly: 12 | Children: 8 | Mobility Needs: 6`
- [ ] Click any ward on map → sidebar updates to that ward

**Phase 3 Deliverable:** Full interactive dashboard with map, risk score panel, micro-trend sparklines, and telemetry bar — all updating correctly per scenario.

---

## Phase 4 — Evacuation, Alerts & Shelter System
**Goal:** Build the action layer — converting risk into human decisions.

### 4.1 Evacuation Route Panel (`src/components/panels/EvacuationPanel.jsx`)
- [ ] "Unsafe Infrastructure" list (East Bridge CLOSED at WARNING+)
- [ ] "Recommended Safe Route" with step-by-step mini card
- [ ] Animate route arrow on the SVG map simultaneously
- [ ] Mocked ETA: `~18 minutes`

### 4.2 Shelter Status Card (`src/components/panels/ShelterCard.jsx`)
- [ ] Animated capacity bar: `87 / 120 spaces available`
- [ ] Status badge: `OPEN` | `PREPARING` | `STANDBY` — changes by scenario
- [ ] Mocked contact info

### 4.3 Priority Assistance Panel (`src/components/panels/PriorityPanel.jsx`)
- [ ] Anonymous resident counts (elderly 12 + children 8 + pregnant 3 + mobility 3 = 26 total)
- [ ] Special Location Priority section (school + health centre + anganwadi)
- [ ] Schools/health centres highlighted with EVACUATE FIRST at WARNING+
- [ ] Amber border at WARNING+, red border at CRITICAL

### 4.4 Alert Panel (`src/components/alerts/AlertPanel.jsx`)
- [ ] Alert card at WARNING and CRITICAL
- [ ] English version + Hindi toggle (`हिंदी में देखें`)
- [ ] Hindi uses `Noto Sans Devanagari` font
- [ ] Slide-down + flash animation on CRITICAL

### 4.5 Alert Acknowledgement Feed (`src/components/alerts/AlertFeed.jsx`)
- [ ] Cumulative timeline entries per scenario (WATCH → WARNING → CRITICAL)
- [ ] WATCH: volunteer notification sent + acknowledged
- [ ] WARNING: shelter preparing + coordinator ack
- [ ] CRITICAL: full chain + priority evacuation flagged
- [ ] Status colour: Sent (blue), Acknowledged (green), Action (amber)

**Phase 4 Deliverable:** Full action layer — unsafe routes, safe route, shelter, English/Hindi alert, acknowledgement feed.

---

## Phase 5 — Simulator, Polish & Offline Mode
**Goal:** Simulator, final polish, offline mode, demo-ready.

### 5.1 Cloudburst Simulator (`src/components/panels/SimulatorPanel.jsx`)
- [ ] Four large scenario buttons with subtitles
- [ ] Active button glow border
- [ ] **Auto-Play Scenario** toggle (cycles every 3.5s)
- [ ] **Rainfall Slider** (12–150 mm/hr) for dynamic recalculation

### 5.2 Risk Propagation View
- [ ] Upstream → downstream flow diagram (Ward 1 → Ward 3 → Ward 4)
- [ ] Wards highlight in propagation order at CRITICAL
- [ ] Annotation: `"Upstream cloudburst → downstream flood risk"`

### 5.3 Offline Mode
- [ ] `useConnectivity.js` already built (Phase 2)
- [ ] Sticky offline banner
- [ ] **"Simulate Offline"** toggle in simulator panel

### 5.4 Final UI Polish
- [ ] Glassmorphism panels: `backdrop-filter: blur(12px)`
- [ ] Animated rain background (already done — increase intensity at CRITICAL)
- [ ] Micro-animations: ward pulse, score roll, alert flash, capacity bar fill
- [ ] Review spacing, readability, visual consistency

### 5.5 Demo Readiness Checklist
- [ ] All four scenarios transition without errors
- [ ] Map ward colours update
- [ ] Risk score breakdown visible and accurate
- [ ] Micro-trend sparklines update
- [ ] East Bridge unsafe at WARNING+
- [ ] Safe route appears at WARNING+
- [ ] Shelter activates at WARNING+
- [ ] Alert fires in English and Hindi at WARNING+
- [ ] Acknowledgement feed shows realistic timeline
- [ ] Priority evacuation counts visible at WARNING+
- [ ] Offline mode banner toggles on
- [ ] Auto-play works smoothly (for video recording)
- [ ] DEMO MODE banner always visible
- [ ] App runs cleanly at 1080p full-screen

---

## Full Feature → Phase Mapping

| Feature | Phase | Status |
|---------|-------|--------|
| Project scaffold & design system | 1 | ✅ |
| Colour tokens, typography, layout shell | 1 | ✅ |
| DEMO MODE banner | 1 | ✅ |
| Scenario dummy data (4 states) | 2 | ✅ |
| Ward & infrastructure data | 2 | ✅ |
| Shelter state mapping per scenario (STANDBY/PREPARING/OPEN) | 2 | ✅ |
| Schools & health centres as priority POI data | 2 | ✅ |
| Micro-trend history data | 2 | ✅ |
| Rule-based risk engine | 2 | ✅ |
| App state hook (`useScenario`) | 2 | ✅ |
| WATCH-state volunteer notification in feed | 2 | ✅ |
| SVG ward map with risk colours | 3 | 🔲 |
| POI markers on SVG map (school, health, anganwadi) | 3 | 🔲 |
| Live telemetry bar | 3 | 🔲 |
| Risk score gauge + breakdown bars | 3 | 🔲 |
| Micro-trend sparklines (30 min) | 3 | 🔲 |
| Ward info sidebar | 3 | 🔲 |
| Unsafe route panel | 4 | 🔲 |
| Safe evacuation route display | 4 | 🔲 |
| Shelter status card | 4 | 🔲 |
| Priority assistance panel | 4 | 🔲 |
| POI priority section in Priority Assistance Panel | 4 | 🔲 |
| English + Hindi alert card | 4 | 🔲 |
| Alert acknowledgement feed | 4 | 🔲 |
| Cloudburst simulator buttons | 5 | 🔲 |
| Rainfall slider | 5 | 🔲 |
| Auto-play demo mode | 5 | 🔲 |
| Risk propagation view | 5 | 🔲 |
| Offline mode indicator & toggle | 5 | 🔲 |
| Final animations & glassmorphism | 5 | 🔲 |
| Demo readiness check | 5 | 🔲 |

---

## Final File Structure

```
sih/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── map/
│   │   │   ├── WardMap.jsx           ← SVG map with ward polygons  [Phase 3]
│   │   │   └── MapLegend.jsx         [Phase 3]
│   │   ├── panels/
│   │   │   ├── TelemetryBar.jsx      ← Live rain/soil/stream       [Phase 3]
│   │   │   ├── RiskScorePanel.jsx    ← Score gauge + breakdown     [Phase 3]
│   │   │   ├── MicroTrendPanel.jsx   ← 30-min sparklines           [Phase 3]
│   │   │   ├── WardInfoPanel.jsx     ← Ward details sidebar        [Phase 3]
│   │   │   ├── EvacuationPanel.jsx   ← Unsafe/safe routes          [Phase 4]
│   │   │   ├── ShelterCard.jsx       ← Shelter status              [Phase 4]
│   │   │   ├── PriorityPanel.jsx     ← Vulnerable residents        [Phase 4]
│   │   │   └── SimulatorPanel.jsx    ← Scenario buttons + slider   [Phase 5]
│   │   ├── alerts/
│   │   │   ├── AlertPanel.jsx        ← English/Hindi alert card    [Phase 4]
│   │   │   └── AlertFeed.jsx         ← Acknowledgement timeline    [Phase 4]
│   │   └── shared/
│   │       ├── Badge.jsx             ✅ Done
│   │       ├── Card.jsx              ✅ Done
│   │       ├── Divider.jsx           ✅ Done
│   │       ├── DemoModeBanner.jsx    ✅ Done
│   │       ├── OfflineBanner.jsx     ✅ Done
│   │       ├── RainCanvas.jsx        ✅ Done
│   │       └── NavBar.jsx            ✅ Done
│   ├── data/
│   │   ├── scenarios.js              ✅ Done
│   │   ├── wards.js                  ✅ Done
│   │   ├── infrastructure.js         ✅ Done
│   │   ├── vulnerablePOI.js          ✅ Done
│   │   └── microTrend.js             ✅ Done
│   ├── engine/
│   │   └── riskEngine.js             ✅ Done
│   ├── hooks/
│   │   ├── useScenario.js            ✅ Done
│   │   └── useConnectivity.js        ✅ Done
│   ├── pages/
│   │   └── Dashboard.jsx             ✅ Done (shell — panels added per phase)
│   ├── App.jsx                       ✅ Done
│   ├── main.jsx                      ✅ Done
│   └── index.css                     ✅ Done
├── index.html                        ✅ Done
├── package.json                      ✅ Done
├── vite.config.js                    ✅ Done
└── IMPLEMENTATION_PLAN.md            ✅ This file
```

---

## Estimated Build Timeline

| Phase | Effort | Status |
|-------|--------|--------|
| Phase 1 — Scaffold & Design | 2–3 hrs | ✅ Complete |
| Phase 2 — Data & Risk Engine | 2–3 hrs | ✅ Complete |
| Phase 3 — Map & Monitoring UI | 4–6 hrs | 🔲 Next |
| Phase 4 — Action Layer & Alerts | 3–5 hrs | 🔲 Pending |
| Phase 5 — Simulator & Polish | 3–4 hrs | 🔲 Pending |
| **Total** | **~14–21 hrs** | **2/5 phases done** |

---

> **Note:** All data is dummy/simulated. No real government API calls in MVP. No backend or login system required. SVG map avoids tile-service dependency — works fully offline.

*JeevanSetu — Turning environmental risk into human decisions, one safer minute at a time.*
