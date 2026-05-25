# AI Resume Ranking System - Frontend

React-based frontend for an intelligent resume screening and ranking application using Vite.

## Prerequisites

- Node.js 16+ 
- pnpm (or npm)

## Installation

1. **Navigate to the frontend folder:**
   ```bash
   cd resumescreener
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

## Running the Development Server

Start the development server:
```bash
pnpm dev
```

The frontend will be available at: **http://localhost:5173**

## Building for Production

```bash
pnpm build
```

The optimized build will be in the `build/` directory.

## Features

- Upload multiple resume files (PDF, DOCX, etc.)
- Specify mandatory skills (comma-separated)
- Provide job description
- Get ranked resumes with:
  - Cosine similarity scores
  - Skill match scores
  - Final composite scores
  - Matching skills highlighted
  - Smart recommendations (Strong/Moderate/Low match)

## Project Structure

```
resume-ranker-backend/
│
├── app/
│   ├── main.py               # FastAPI entry point
│   ├── config.py             # Settings
│   │
│   ├── api/
│   │   ├── routes.py         # API endpoints
│   │
│   ├── services/
│   │   ├── parser.py         # PDF/DOCX text extraction
│   │   ├── preprocess.py     # Text cleaning
│   │   ├── tfidf.py          # Manual TF-IDF
│   │   ├── similarity.py     # Cosine similarity
│   │   ├── scoring.py        # Weighted scoring
│   │
│   ├── models/
│   │   ├── schema.py         # Pydantic schemas
│   │
│   ├── utils/
│   │   ├── skills.py         # Skill dictionary
│   │
│   └── db/
│       └── database.py       # SQLite connection
│
├── requirements.txt
└── README.md

```

## API Integration

The frontend communicates with the backend API at http://localhost:8000/api/rank-resumes

**Make sure the backend is running before using the frontend!**