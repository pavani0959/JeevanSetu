# JeevanSetu — Flash-Flood Early Warning & Safe Evacuation System
**Smart India Hackathon (SIH) 2026 — Problem Statement: SIH26192**

> **Tagline:** Before the water reaches them, the warning should.

JeevanSetu is a hyper-local, AI-driven flash-flood decision-support system designed specifically for the unique terrain and challenges of hilly regions. It bridges the gap between broad meteorological alerts and actionable, ward-level evacuation guidance.

---

## 🏔️ The Problem
Hilly regions face devastating flash floods, landslides, and rapidly rising streams during intense rainfall (cloudbursts). The primary issue is **not just a lack of weather data, but the lack of an actionable, local decision layer.** 
When a broad district warning is issued, local residents and first responders don't know:
1. *Which specific ward is at highest risk right now?*
2. *Which evacuation route is currently safe (e.g., are bridges flooded)?*
3. *Which emergency shelter has capacity?*
4. *Who needs priority assistance?*

## 🚀 The JeevanSetu Solution
JeevanSetu is not just another weather dashboard. It converts risk into immediate action. By combining rainfall, soil saturation, terrain vulnerability, and river stream levels, it tells disaster management authorities exactly what to do.

### Key Features
- **🤖 Random Forest ML Engine:** A backend ML model (FastAPI + scikit-learn) trained on 4,500+ synthetic anchor points to classify flood risk with 98.3% accuracy into 4 stages: NORMAL, WATCH, WARNING, CRITICAL.
- **🗺️ Live Interactive Topo-Map (Leaflet + OSM):** Real OpenStreetMap tiles of Chamoli, Uttarakhand overlaid with fictional ward boundaries, historical flood hazard zones (NRSC Bhuvan proxy), and dynamic bridge/safe-route indicators.
- **🌐 Real-Time Telemetry:** Integrates with the **Open-Meteo API** to pull live weather data for Chamoli, while simulating IoT stream and soil sensors.
- **🎭 Role-Based Dashboard:** Tailored UI perspectives for **SDMA Admins** (full command center), **First Responders** (field-focused), and **Village Volunteers** (simplified action alerts).
- **🗣️ Bilingual Support (English / Hindi):** Crucial for rural usability and rapid communication with on-ground volunteers.
- **📊 Priority Evacuation Matrix:** Automatically identifies and tallies vulnerable populations (elderly, pregnant, mobility-assisted) per ward.

---

## 🛠️ Technology Stack
- **Frontend:** React, Vite, CSS (Glassmorphism & responsive grid), Leaflet (Maps)
- **Backend:** Python, FastAPI, Uvicorn, scikit-learn, Pandas
- **Data Integration:** Open-Meteo API (Live Weather)

---

## شف System Architecture & Data Transparency
JeevanSetu was built to be a highly realistic Minimum Viable Product (MVP). We are completely transparent about our data sources:
- **🟢 LIVE:** Open-Meteo API (Weather), Random Forest ML Classification Engine
- **🟡 FUTURE:** IMD District/Basin Forecasts, CWC Stream Gauge Telemetry
- **🟠 SIMULATED:** NRSC/ISRO Bhuvan Historical Flood Inundation Zones, GSI Landslide Inventory, Census Ward Data

*Production deployment would involve official API integration with IMD/CWC and calibration with NDMA/SDMA authorities.*

---

## ⚙️ How to Run Locally

**1. Clone the repository**
```bash
git clone https://github.com/your-username/jeevansetu.git
cd jeevansetu
```

**2. Start the FastAPI Backend (ML Engine)**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```
*The backend must be running on port 8000 for the frontend to receive ML predictions and live weather.*

**3. Start the React Frontend**
Open a new terminal window:
```bash
cd jeevansetu
npm install
npm run dev
```
Navigate to `http://localhost:5173` to view the command center.

*(Alternatively, you can use the provided `./start.sh` script to launch both automatically on macOS/Linux).*

---

## 🏆 SIH Judging Criteria Addressed
- **Innovation:** Moving beyond static alerts to a dynamic, explainable decision-support workflow.
- **Feasibility:** Built using open-source tools (React, FastAPI, Leaflet) and standard ML models.
- **Usability:** 3-click scenario testing, bilingual support, and role-based views.
- **Impact:** Directly addresses the critical "last-mile" communication gap during Himalayan cloudbursts.

---
*Built with ❤️ for SIH26192.*
