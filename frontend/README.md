# RFP Analysis Tool

A modern web application for analyzing government RFPs (Request for Proposals) and checking compliance requirements.

## Features

- Upload and analyze RFP documents (PDF)
- Automated compliance checking
- Mandatory eligibility extraction
- Risk analysis
- Submission checklist generation

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Router
- Heroicons

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rfp-analysis-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

To create a production build:

```bash
npm run build
```

The build output will be in the `dist` directory.

## Project Structure

```
src/
  ├── pages/          # Page components
  │   ├── Home.tsx    # RFP upload page
  │   └── Analysis.tsx# Analysis workflow page
  ├── App.tsx         # Main app component
  ├── main.tsx        # Entry point
  └── index.css       # Global styles and Tailwind directives
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint 