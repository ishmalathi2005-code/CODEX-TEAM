# CODEX – AI Interview Simulator Frontend

A modern, responsive, and state-of-the-art React application built with **Vite**, **Tailwind CSS**, **React Router DOM**, **Axios**, **Recharts**, and **Lucide React**. CODEX allows students and developers to practice real-time Technical and HR interviews with AI-assisted evaluation and skill tracking.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Setup Commands

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🔑 Environment Variables

Create a `.env` file in the root of the `frontend/` directory (or copy from `.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```

This points the centralized Axios instance (`src/services/api.js`) to your Node.js + Express backend.

---

## 📁 Project Architecture

```
frontend/
├── src/
│   ├── components/
│   │   ├── AnswerBox.jsx          # Code/text candidate response component
│   │   ├── Button.jsx             # Multi-variant button component
│   │   ├── ErrorMessage.jsx       # Error banner alert component
│   │   ├── FeedbackCard.jsx       # AI strength/weakness breakdown card
│   │   ├── Input.jsx              # Form input with password toggle & validation
│   │   ├── InterviewCard.jsx      # Summary card for past sessions
│   │   ├── LoadingSpinner.jsx     # Global & inline loader
│   │   ├── Modal.jsx              # Reusable modal overlay dialog
│   │   ├── Navbar.jsx             # Header with branding & user actions
│   │   ├── PerformanceChart.jsx   # Recharts visualization (Area & Radar)
│   │   ├── ProgressBar.jsx        # Question step progress indicator
│   │   ├── ProtectedRoute.jsx     # Route guard for authenticated pages
│   │   ├── QuestionCard.jsx       # AI interview prompt display card
│   │   ├── ScoreCard.jsx          # Statistics metric score card
│   │   ├── Select.jsx             # Custom dropdown select input
│   │   ├── Sidebar.jsx            # Responsive navigation drawer
│   │   ├── SkillCard.jsx          # Weak skills & learning resource card
│   │   └── Timer.jsx              # Question countdown timer
│   │
│   ├── pages/
│   │   ├── Landing.jsx            # Marketing home & feature intro
│   │   ├── Login.jsx              # JWT user authentication
│   │   ├── Register.jsx           # Candidate profile registration
│   │   ├── Dashboard.jsx          # Candidate analytics overview
│   │   ├── Profile.jsx            # Edit skills, education & experience
│   │   ├── InterviewSetup.jsx     # Session configuration (Type/Tech/Tier)
│   │   ├── TechnicalInterview.jsx # Live technical coding round
│   │   ├── HRInterview.jsx        # Behavioral HR round
│   │   ├── Results.jsx            # AI evaluation report & scores
│   │   ├── InterviewHistory.jsx   # Filterable past interview logs
│   │   └── SkillImprovement.jsx   # Tailored learning recommendations
│   │
│   ├── services/
│   │   └── api.js                 # Centralized Axios client & mock fallbacks
│   ├── context/
│   │   └── AuthContext.jsx        # JWT & user state context provider
│   ├── App.jsx                    # Route mapping & main layout wrapper
│   ├── main.jsx                   # Application mounting script
│   └── index.css                  # Modern glassmorphism & Tailwind design system
├── .env
├── .env.example
├── package.json
└── README.md
```

---

## 🛠 Connected API Endpoints

All requests automatically attach JWT headers via Axios interceptors:

- **Authentication**:
  - `POST /auth/register`
  - `POST /auth/login`
- **Profile**:
  - `GET /profile`
  - `PUT /profile`
- **Interviews & Questions**:
  - `POST /interviews`
  - `GET /interviews`
  - `GET /interviews/:id`
  - `POST /questions/generate`
  - `POST /answers`
  - `POST /evaluation`
- **Analytics & History**:
  - `GET /results/:interviewId`
  - `GET /history`
  - `GET /recommendations`

---

## 🖥 Available Pages

1. **Landing Page (`/`)**: Product introduction, dual round features, workflow steps.
2. **Register (`/register`)**: Detailed registration form (Name, Email, Password, Education, Skills, Experience).
3. **Login (`/login`)**: Secure authentication with password visibility toggle.
4. **Dashboard (`/dashboard`)**: Summary metrics, average score charts, recent sessions, quick start.
5. **Profile (`/profile`)**: Candidate details editor.
6. **Interview Setup (`/setup`)**: Select Technical/HR, technology stack, difficulty, and question count.
7. **Technical Interview (`/interview/technical`)**: Live coding/architecture question interface with timer and progress.
8. **HR Interview (`/interview/hr`)**: Behavioral STAR-format response interface with timer.
9. **Results (`/results/:interviewId`)**: Composite scoring, correctness, relevance, communication, AI feedback, strengths, and weaknesses.
10. **Interview History (`/history`)**: Filterable session list with detail links.
11. **Skill Improvement (`/skill-improvement`)**: Weak skill identification, recommended study topics, and official resources.
