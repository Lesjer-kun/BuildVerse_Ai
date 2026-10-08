# BuildVerse AI

BuildVerse AI is a premium React + TypeScript dashboard for institutional wealth management, cross-border asset allocation, and blockchain-style compliance operations. Designed as a polished financial control center, the app helps teams monitor spending, manage digital allocations, review transactions, and bridge treasury flows between trusted institutions.

This project is centered around a fictional wealth and compliance workflow for real-world asset (RWA) tokenization, with interactive dashboards and mock institutional ledger data.

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License" />
</p>

## Overview

BuildVerse AI combines portfolio visibility, budget oversight, and compliance orchestration into a single interface. It enables users to:

- Review institutional performance and portfolio overview
- Create and manage spending allocations across regions and time horizons
- Track transaction history with manual ledger updates
- Simulate cross-border bridge transfers with compliance validation
- Monitor bank verification and sanctions compliance through a registry

The project is built for a modern, visually rich dashboard experience and uses a mocked financial infrastructure layer to demonstrate workflow logic without requiring a live backend.

## Key Features

### Dashboard Overview
- Executive view of assets, spending, and bank performance
- Institution switching between multiple trusted financial nodes
- High-contrast analytics layout with a premium UI

### Budget Management
- Add, update, and remove digital asset allocations
- Set limits and track usage by category or institution
- Automatic status flags such as On Track, Healthy, Untouched, or Over Limit

### Transactions
- View transaction history across spending categories
- Add manual transactions directly from the dashboard
- Simulate transactions tied to asset/budget behavior

### Bridge Transfers
- Transfer assets between institution nodes
- Validate destination addresses against a compliance registry
- Enforce rules to block unverified or non-compliant counterparties

### Compliance Registry
- Toggle verification on financial institutions
- Add new nodes to the compliance ledger
- Show sanctions and governance logic in a user-friendly interface

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Gemini AI integration support via Google GenAI SDK
- Express support for app/server-side integration scenarios

## Project Structure

```text
.
├── public/
├── src/
│   ├── components/
│   ├── services/
│   ├── utils/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── package-lock.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A Gemini API key if you want to use the app's AI-connected features

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and update it with your values:

```bash
cp .env.example .env.local
```

Then set:

```env
GEMINI_API_KEY="your_api_key_here"
APP_URL="http://localhost:3000"
```

### 3. Run the app locally

```bash
npm run dev
```

The app will be available at:

```text
http://localhost:3000
```

### 4. Build for production

```bash
npm run build
```

You can then preview the production build with:

```bash
npm run preview
```

## Available Scripts

```bash
npm run dev      # Start the app in development mode
npm run build    # Build the project for production
npm run preview  # Preview the built app locally
npm run lint     # Type-check the project with TypeScript
npm run clean    # Remove build artifacts
```

## Environment Notes

This repository includes a sample environment file at `.env.example` and is structured for use with AI Studio / Google Gemini runtime settings. The app is designed to support secure runtime configuration and demo-friendly AI integrations.

## License

This project is distributed under the MIT license unless otherwise noted.

## Contributing

Contributions are welcome. If you want to improve the interface, add new workflow logic, or extend the compliance model:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request with a clear description

## Author

Built and maintained by Lesjer-kun.

## Note

This repository currently uses mock institutional and blockchain data in the frontend. It is ideal for demonstrating dashboard UX, financial operations logic, compliance workflows, and AI-assisted finance tooling in a prototype environment.
