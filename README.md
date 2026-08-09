# 🚀 CODEX AI Interview Simulator

> An end-to-end AI-powered mock interview simulator featuring **Google Gemini AI 2.5 Flash**, **Resume Analysis & Question Tailoring**, **Interactive Voice Assistant (TTS & STT)**, and **Real-Time Analytics**.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)
![React](https://img.shields.io/badge/React-18.3-blue?logo=react)
![Express](https://img.shields.io/badge/Express-4.19-lightgrey?logo=express)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-emerald?logo=supabase)
![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini%20AI-2.5%20Flash-orange?logo=googlegemini)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwindcss)

---

## 📋 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Running the Application](#running-the-application)
- [API Documentation](#-api-documentation)
- [Voice Assistant & Resume Analysis](#-voice-assistant--resume-analysis)
- [Database & Resilience](#-database--resilience)
- [Testing](#-testing)
- [License](#-license)

---

## 🌟 Overview

**CODEX AI Interview Simulator** is a fullstack web platform engineered to help software developers practice and excel in technical and behavioral job interviews. Using Google's Gemini AI 2.5 Flash engine, CODEX simulates realistic interview scenarios, evaluates candidate responses across technical depth, communication clarity, and problem-solving abilities, and delivers actionable feedback.

---

## ✨ Key Features

- 🧠 **AI-Powered Question Generation**: Context-aware questions for Technical (React, Node, System Design, Python, etc.) and HR/Behavioral rounds.
- 📄 **Resume Analysis Module**: Upload or paste resume text to automatically extract candidate skills and generate personalized interview questions.
- 🎙️ **Interactive AI Voice Assistant**:
  - **Text-to-Speech (TTS)**: AI interviewer reads questions aloud in real-time.
  - **Speech-to-Text (STT)**: Candidates dictate answers via microphone with real-time transcription.
- 📊 **Detailed Evaluation & Performance Analytics**: Automated scoring (0-100), letter grading (`A+` to `F`), strengths/improvements breakdown, and historical tracking.
- 🔐 **Real-Time Authentication**: Secure JWT-based registration, login, profile management, and session recovery.
- 🗄️ **Zero-Downtime Hybrid Database**: Seamless integration with **Supabase Cloud PostgreSQL** featuring an active local in-memory fallback for offline/development environments.

---

## 🏗️ System Architecture

```mermaid
sequenceDiagram
    autonumber
    actor Candidate
    participant React UI as React Frontend (Vite)
    participant Express API as Express Backend (Node.js)
    participant Gemini AI as Google Gemini AI SDK
    participant Database as Supabase Cloud / In-Memory DB

    Candidate->>React UI: Register / Login & Start Interview
    React UI->>Express API: POST /api/auth/login or /api/interviews
    Express API->>Database: Query/Persist Candidate Record
    React UI->>Express API: POST /api/resume/analyze or /api/questions/generate
    Express API->>Gemini AI: Request Gemini 2.5 Flash Model
    Gemini AI-->>Express API: Return Tailored Questions & Extracted Skills
    Express API-->>React UI: Render Interactive Question Card
    React UI->>Candidate: Voice Assistant Reads Question (TTS)
    Candidate->>React UI: Speak Answer (STT Dictation) or Type Code
    React UI->>Express API: POST /api/answers & /api/evaluations/:id
    Express API->>Gemini AI: Evaluate Answers & Technical Depth
    Gemini AI-->>Express API: Return Scores, Feedback & Grade
    Express API->>Database: Store Results & Grade Distribution
    Express API-->>React UI: Render Performance Analytics Report
```

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 18 (Vite)
- **Styling**: Vanilla CSS3 + TailwindCSS
- **Icons**: Lucide React
- **Voice APIs**: Web Speech API (`SpeechSynthesis` & `SpeechRecognition`)
- **HTTP Client**: Axios

### **Backend**
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Validation**: Express-Validator
- **Security**: Helmet, CORS, Rate Limiting, Bcrypt.js, JWT Authentication

### **AI & Data Layer**
- **AI SDK**: `@google/genai` (Google Gemini 2.5 Flash Model)
- **Database**: Supabase Cloud PostgreSQL / Prisma Client
- **ORM / Client**: `@supabase/supabase-js`

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Git**: Installed on your operating system

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ishmalathi2005-code/CODEX-TEAM.git
   cd CODEX-TEAM
   git checkout feature/AI
   ```

2. **Install Root Backend Dependencies**:
   ```bash
   npm install
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

---

### Environment Setup

#### **1. Root Backend Environment (`.env`)**
Create or edit `.env` in the root directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (Supabase Cloud / PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/postgres"
SUPABASE_URL=https://bdpqgizcwoawmsexqvfy.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# JWT Authentication
JWT_SECRET=codex_jwt_s3cr3t_k3y_2024_!@#$xyzABC
JWT_REFRESH_SECRET=codex_refresh_s3cr3t_k3y_2024_!@#$xyzDEF
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:5173
```

#### **2. Frontend Environment (`frontend/.env`)**
Create or edit `.env` in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### Running the Application

To launch both the **Express Backend** (`http://localhost:5000`) and the **Vite Frontend** (`http://localhost:5173`) concurrently:

```bash
npm run dev:all
```

Alternative individual commands:
- **Backend Only**: `npm run dev`
- **Frontend Only**: `npm run dev:frontend`

---

## 📡 API Documentation

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new candidate account | No |
| `POST` | `/api/auth/login` | Authenticate candidate & issue JWT | No |
| `GET` | `/api/profile/me` | Fetch active candidate profile | Yes |
| `PUT` | `/api/profile/me` | Update candidate education, skills & bio | Yes |
| `POST` | `/api/interviews` | Create a new interview session | Yes |
| `GET` | `/api/interviews` | List candidate interviews | Yes |
| `POST` | `/api/questions/generate` | Generate AI interview questions | Yes |
| `POST` | `/api/answers` | Submit candidate answer for a question | Yes |
| `POST` | `/api/evaluations/:interviewId` | Trigger AI evaluation for completed round | Yes |
| `GET` | `/api/results/:interviewId` | Retrieve score, grade & feedback report | Yes |
| `POST` | `/api/resume/analyze` | Parse resume text & generate tailored questions | Yes |
| `GET` | `/api/history` | Fetch past interview session history | Yes |

---

## 🎙️ Voice Assistant & Resume Analysis

### **Resume Analysis Module**
Candidates can paste or upload resume text during session setup (`InterviewSetup.jsx`). The backend invokes Gemini AI (`POST /api/resume/analyze`) to extract technical keywords and generate customized interview questions targeting the candidate's actual experience.

### **Interactive AI Voice Assistant**
- **Speaker Icon**: Narrates interview questions aloud using browser `SpeechSynthesis`.
- **Microphone Icon**: Dictates candidate verbal answers into the answer box using `SpeechRecognition` with live audio spectrum indicator animations.

---

## 🗄️ Database & Resilience

CODEX features a dual-mode database engine:
1. **Supabase Cloud Sync**: When valid `SUPABASE_URL` and `SUPABASE_ANON_KEY` credentials are provided, records sync directly to Supabase Cloud PostgreSQL.
2. **Local Fallback Engine**: If cloud credentials are not supplied or network issues occur, operations automatically route to a smart in-memory builder, guaranteeing zero-downtime execution for local development.

---

## 🧪 Testing

Run fullstack automated integration tests to verify API endpoints:

```bash
# Test fullstack endpoints (Auth, Interviews, Answers, Evaluations, Results)
node test_fullstack.js

# Test Resume Analysis & Question Tailoring Endpoint
node test_resume_voice.js
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE). Developed by Team CODEX.
