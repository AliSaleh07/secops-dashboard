# SecOps Dashboard: Cybersecurity Operations & Vulnerability Triage Interface

[![SecOps Dashboard CI](https://github.com/AliSaleh07/secops-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/AliSaleh07/secops-dashboard/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/Live_Demo-dashboard.salehsec.dev-00f5ff?style=flat&logo=react)](https://dashboard.salehsec.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**SecOps Dashboard** is a responsive, dark-mode cybersecurity operations and vulnerability management frontend built with **React**, **TypeScript**, and **Vite**. Engineered for security analysts, incident responders, and DevSecOps teams, it surfaces findings from automated scanning tools (NetProbe, Secret Sentry, Compose Scout, OpenAPI Smoke) with deep triage capabilities and real-time filtering.

## Live Deployment

- **Production URL**: [https://dashboard.salehsec.dev/](https://dashboard.salehsec.dev/)
- **Backend API**: [https://sentinel.salehsec.dev/](https://sentinel.salehsec.dev/)

```
                  +----------------------------------------------+
                  |         SecOps Dashboard Interface           |
                  +----------------------+-----------------------+
                                         |
                  +----------------------+-----------------------+
                  |                                              |
      [ Metrics & Distribution ]                     [ Vulnerability Explorer ]
     +--------------------------+                   +--------------------------+
     | - Total Findings KPI     |                   | - Search & Subnet Filter |
     | - Critical Severity Dial |                   | - Severity Pill Filter   |
     | - Resolution Rate %      |                   | - Status Transition Bar  |
     | - Multi-Segment SVG Dist |                   | - Paginated Findings Grid|
     +------------+-------------+                   +------------+-------------+
                  |                                              |
                  +----------------------+-----------------------+
                                         |
                       +-----------------v-----------------+
                       |    Deep Technical Finding Modal   |
                       |  - CVE & CVSS v3 Impact Breakdown |
                       |  - Target Asset & Source Detector |
                       |  - Actionable Remediation Guide   |
                       |  - Raw Inspection Trace / Payload |
                       +-----------------+-----------------+
                                         |
                       +-----------------v-----------------+
                       |     In-Memory Auth & Security     |
                       |  - Interactive Login Modal        |
                       |  - Volatile Token Storage Only    |
                       |  - Zero Persistent Storage / Web  |
                       |  - Explicit Offline Sample Mode   |
                       +-----------------------------------+
```

---

## Technical Features

- **Cybersecurity Dark Aesthetic**: Optimized for security operation center (SOC) environments with high-contrast cyan (`#00f5ff`), alert red (`#ef4444`), and deep slate background tones.
- **In-Memory Zero-Persistence Authentication**: Access tokens are held exclusively in volatile application memory. No tokens or credentials are ever written to `localStorage`, `sessionStorage`, or cookies.
- **No Embedded Credentials**: Production builds contain zero hardcoded secrets or credentials. Users authenticate interactively through the Sentinel API login flow.
- **Explicit Sample Dataset Mode**: Visitors can explore offline demonstration data without authenticating. If authentication fails, the application displays explicit error feedback and never disguises mock data as live API intelligence.
- **Zero-Dependency SVG Visualizations**: Implements performant, lightweight SVG distributions for CVSS severity breakdowns without bloated third-party charting libraries.
- **Deep Technical Inspection Drawer**: Detailed modal reveals CVE IDs, CVSS scores, remediation recommendations, affected target files/IPs, and raw reproduction traces.
- **Interactive Triage Workflow**: Enables security analysts to toggle findings between `OPEN` and `RESOLVED` with instant state reactivity.

---

## Project Structure

```
secops-dashboard/
├── public/                # Static brand assets and security icons
├── src/
│   ├── components/        # React functional components
│   │   ├── Header.tsx             # Navbar with connectivity status pill & auth controls
│   │   ├── LoginModal.tsx         # Sentinel API analyst login modal
│   │   ├── MetricsCards.tsx       # KPI summary cards (Total, Critical, Rate)
│   │   ├── SeverityChart.tsx      # SVG severity distribution bar
│   │   ├── FindingsTable.tsx      # Filterable data grid with search
│   │   └── FindingDetailModal.tsx # Vulnerability inspection overlay
│   ├── services/          # API client and sample data layer
│   │   ├── apiClient.ts           # In-memory auth and Sentinel fetch client
│   │   └── mockData.ts            # Realistic security findings dataset
│   ├── types/             # TypeScript contracts and enum definitions
│   ├── App.tsx            # Main layout controller
│   ├── index.css          # Cyber theme stylesheet
│   └── main.tsx           # Application bootstrap
├── tests/                 # Vitest & React Testing Library test suites
├── vite.config.ts         # Vite build and test configuration
└── tsconfig.json          # Strict TypeScript compiler options
```

---

## Installation & Setup

### Prerequisites
- Node.js 20 LTS or Node.js 22 LTS
- npm 10+

### Development Server
```bash
# Clone the repository
git clone https://github.com/AliSaleh07/secops-dashboard.git
cd secops-dashboard

# Install dependencies
npm ci

# Configure environment (optional, defaults to production API)
cp .env.example .env

# Launch development server
npm run dev
```

The application will be accessible at `http://localhost:5173`.

### Automated Testing
```bash
npm test
```

### Production Build
```bash
npm run build
```
The optimized bundle is written to the `dist/` directory.
