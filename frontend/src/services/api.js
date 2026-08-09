import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('codex_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token expiration / unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('codex_token');
      localStorage.removeItem('codex_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Fallback Mock Data Generators when server is offline/unreachable
const isNetworkError = (error) => !error.response && error.code === 'ERR_NETWORK';

export const authAPI = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const resData = response.data.data || response.data;
      return {
        token: resData.accessToken || resData.token,
        user: resData.user || resData,
      };
    } catch (error) {
      if (isNetworkError(error)) {
        const mockUser = {
          id: 'user_' + Date.now(),
          name: userData.name || 'Demo Candidate',
          email: userData.email,
          education: userData.education || 'B.Tech Computer Science',
          skills: Array.isArray(userData.skills) ? userData.skills : (userData.skills ? userData.skills.split(',').map(s => s.trim()) : ['React', 'JavaScript', 'Node.js']),
          experience: userData.experience || '1-2 years'
        };
        const token = 'mock_jwt_token_' + Date.now();
        return { token, user: mockUser };
      }
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const resData = response.data.data || response.data;
      return {
        token: resData.accessToken || resData.token,
        user: resData.user || resData,
      };
    } catch (error) {
      if (isNetworkError(error)) {
        const mockUser = {
          id: 'user_101',
          name: credentials.email ? credentials.email.split('@')[0] : 'Alex Rivera',
          email: credentials.email || 'alex@codex.ai',
          education: 'B.S. Software Engineering',
          skills: ['React.js', 'Node.js', 'System Design', 'Algorithms', 'Tailwind CSS'],
          experience: '2 Years Full Stack Developer'
        };
        const token = 'mock_jwt_token_alex_101';
        return { token, user: mockUser };
      }
      throw error;
    }
  }
};

export const profileAPI = {
  getProfile: async () => {
    try {
      const response = await api.get('/profile/me');
      return response.data.data || response.data;
    } catch (error) {
      if (isNetworkError(error)) {
        const storedUser = localStorage.getItem('codex_user');
        if (storedUser) return JSON.parse(storedUser);
        return {
          id: 'user_101',
          name: 'Alex Rivera',
          email: 'alex@codex.ai',
          education: 'Bachelor of Technology in Computer Science',
          skills: ['React', 'JavaScript', 'Node.js', 'Data Structures', 'System Design'],
          experience: '2 years as Frontend Engineer'
        };
      }
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/profile/me', profileData);
      return response.data.data || response.data;
    } catch (error) {
      if (isNetworkError(error)) {
        const currentUser = JSON.parse(localStorage.getItem('codex_user') || '{}');
        const updated = { ...currentUser, ...profileData };
        localStorage.setItem('codex_user', JSON.stringify(updated));
        return updated;
      }
      throw error;
    }
  }
};

export const interviewAPI = {
  createInterview: async (setupData) => {
    try {
      const response = await api.post('/interviews', setupData);
      return response.data.data || response.data;
    } catch (error) {
      if (isNetworkError(error)) {
        return {
          id: 'int_' + Date.now(),
          type: setupData.type || 'Technical',
          technology: setupData.technology || 'React.js',
          difficulty: setupData.difficulty || 'Medium',
          questionCount: setupData.questionCount || 5,
          createdAt: new Date().toISOString(),
          status: 'in_progress'
        };
      }
      throw error;
    }
  },

  getInterviews: async () => {
    try {
      const response = await api.get('/interviews');
      return response.data.data || response.data;
    } catch (error) {
      if (isNetworkError(error)) {
        return getMockHistory();
      }
      throw error;
    }
  },

  getInterviewById: async (id) => {
    try {
      const response = await api.get(`/interviews/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      if (isNetworkError(error)) {
        return {
          id,
          type: 'Technical',
          technology: 'React.js',
          difficulty: 'Medium',
          questionCount: 5,
          status: 'completed',
          score: 84
        };
      }
      throw error;
    }
  }
};

export const questionAPI = {
  generateQuestions: async (payload) => {
    try {
      const response = await api.post('/questions/generate', payload);
      return response.data.data || response.data;
    } catch (error) {
      if (isNetworkError(error)) {
        return getMockQuestions(payload.technology || 'React.js', payload.type || 'Technical', payload.count || 5);
      }
      throw error;
    }
  },

  submitAnswer: async (answerPayload) => {
    try {
      const response = await api.post('/answers', answerPayload);
      return response.data.data || response.data;
    } catch (error) {
      if (isNetworkError(error)) {
        return {
          status: 'success',
          answerId: 'ans_' + Date.now(),
          message: 'Answer saved successfully'
        };
      }
      throw error;
    }
  },

  submitEvaluation: async (evaluationPayload) => {
    try {
      const response = await api.post('/evaluation', evaluationPayload);
      return response.data.data || response.data;
    } catch (error) {
      if (isNetworkError(error)) {
        return {
          interviewId: evaluationPayload.interviewId,
          overallScore: 86,
          technicalScore: 88,
          hrScore: 82,
          status: 'evaluated'
        };
      }
      throw error;
    }
  }
};

export const analyticsAPI = {
  getResults: async (interviewId) => {
    try {
      const response = await api.get(`/results/${interviewId}`);
      return response.data.data || response.data;
    } catch (error) {
      if (isNetworkError(error)) {
        return getMockResults(interviewId);
      }
      throw error;
    }
  },

  getHistory: async () => {
    try {
      const response = await api.get('/history');
      return response.data.data || response.data;
    } catch (error) {
      if (isNetworkError(error)) {
        return getMockHistory();
      }
      throw error;
    }
  },

  getRecommendations: async () => {
    try {
      const response = await api.get('/recommendations');
      return response.data.data || response.data;
    } catch (error) {
      if (isNetworkError(error)) {
        return getMockRecommendations();
      }
      throw error;
    }
  }
};

export const resumeAPI = {
  analyzeResume: async (payload) => {
    try {
      const response = await api.post('/resume/analyze', payload);
      return response.data.data || response.data;
    } catch (error) {
      if (isNetworkError(error)) {
        return {
          extractedSkills: ['React.js', 'Node.js', 'System Architecture', 'PostgreSQL'],
          summary: 'Extracted 4 key technical domains targeting Full Stack Engineer based on uploaded resume.',
          questions: [
            { id: 'res_1', text: 'Walk me through how you designed state management and component breakdown in your recent projects.', type: 'technical', category: 'React.js', difficulty: payload.difficulty || 'Medium' },
            { id: 'res_2', text: 'Your resume mentions microservices and API gateways. How do you handle authentication across services?', type: 'technical', category: 'Node.js', difficulty: payload.difficulty || 'Medium' },
            { id: 'res_3', text: 'Describe a challenging technical debt problem you resolved on a project mentioned in your work history.', type: 'behavioral', category: 'Problem Solving', difficulty: payload.difficulty || 'Medium' },
          ]
        };
      }
      throw error;
    }
  }
};


// Internal Mock Helper Data for Demo/Offline Mode
function getMockQuestions(tech, type, count) {
  const isHR = type === 'HR';
  if (isHR) {
    return [
      { id: 'q1', text: 'Tell me about a challenging project you worked on and how you resolved team conflict during tight deadlines.' },
      { id: 'q2', text: 'Where do you see yourself professionally in the next three years, and how does this role align with your goals?' },
      { id: 'q3', text: 'Describe a situation where you had to quickly adapt to a sudden change in requirements or project scope.' },
      { id: 'q4', text: 'How do you handle constructive criticism and code reviews from senior team members?' },
      { id: 'q5', text: 'Why are you interested in joining CODEX, and what unique perspective or skills do you bring?' }
    ].slice(0, count);
  }
  return [
    { id: 'q1', text: `Explain the Virtual DOM in ${tech} and how the reconciliation process optimizes re-renders.` },
    { id: 'q2', text: `What are the key differences between state management strategies in modern ${tech} applications?` },
    { id: 'q3', text: `How would you handle asynchronous data fetching, error boundaries, and race conditions in ${tech}?` },
    { id: 'q4', text: `Explain how memory leaks can occur in client-side code and how you profile/prevent them.` },
    { id: 'q5', text: `Design a scalable architecture for a real-time collaborative dashboard using ${tech}.` }
  ].slice(0, count);
}

function getMockHistory() {
  return [
    { id: 'int_101', date: '2026-08-05', type: 'Technical', technology: 'React.js', difficulty: 'Hard', score: 88, status: 'Completed' },
    { id: 'int_102', date: '2026-08-02', type: 'HR', technology: 'Behavioral', difficulty: 'Medium', score: 82, status: 'Completed' },
    { id: 'int_103', date: '2026-07-28', type: 'Technical', technology: 'Node.js', difficulty: 'Medium', score: 79, status: 'Completed' },
    { id: 'int_104', date: '2026-07-20', type: 'Technical', technology: 'System Design', difficulty: 'Hard', score: 92, status: 'Completed' }
  ];
}

function getMockResults(id) {
  return {
    interviewId: id || 'int_101',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    type: 'Technical Interview',
    technology: 'React.js',
    difficulty: 'Hard',
    overallScore: 86,
    technicalScore: 89,
    hrScore: 82,
    breakdown: {
      correctness: 88,
      relevance: 90,
      communication: 80,
    },
    questionWise: [
      { id: 1, question: 'Explain the Virtual DOM and Reconciliation process.', score: 90, correctness: 92, relevance: 95, feedback: 'Excellent technical depth and clear distinction between fiber reconciliation and standard diffing.' },
      { id: 2, question: 'How do you prevent memory leaks in useEffect listeners?', score: 85, correctness: 85, relevance: 88, feedback: 'Solid explanation of cleanup functions and event unbinding.' },
      { id: 3, question: 'Describe race conditions in async React operations.', score: 82, correctness: 80, relevance: 85, feedback: 'Good conceptual understanding. Mentioning AbortController added extra points.' },
    ],
    strengths: [
      'Strong grasp of core JavaScript event loop and async patterns',
      'Articulate explanation of React component lifecycles',
      'Proactive focus on performance optimization and memoization'
    ],
    weaknesses: [
      'Could elaborate more on error boundary recovery strategies',
      'HR/behavioral responses need more structured STAR format examples'
    ],
    aiFeedback: 'The candidate demonstrated advanced proficiency in frontend software engineering. Answers were concise, technically accurate, and demonstrated real-world practical experience.',
    skillGaps: ['React Suspense / Concurrent Features', 'Micro-Frontend Architectures', 'STAR Method Communication'],
    suggestions: [
      'Practice framing problem-solving responses using the Situation, Task, Action, Result framework.',
      'Deep dive into React 19 server components and useActionState patterns.',
      'Review memory heap profiling tools in Chrome DevTools.'
    ]
  };
}

function getMockRecommendations() {
  return {
    overallMastery: 78,
    weakSkills: [
      { name: 'System Design & Scalability', level: 'Intermediate', priority: 'High', score: 68 },
      { name: 'Async Patterns & Race Conditions', level: 'Intermediate', priority: 'Medium', score: 72 },
      { name: 'STAR Behavioral Framework', level: 'Beginner', priority: 'High', score: 65 },
    ],
    recommendedTopics: [
      { title: 'Designing High-Throughput REST & GraphQL Gateways', time: '45 mins', category: 'System Architecture' },
      { title: 'Advanced React Fiber Reconciliation Deep-Dive', time: '30 mins', category: 'Frontend Tech' },
      { title: 'Mastering the Behavioral Interview for Senior Devs', time: '40 mins', category: 'HR Preparation' }
    ],
    resources: [
      { id: 1, title: 'React Documentation: State & Lifecycle Best Practices', type: 'Official Docs', url: 'https://react.dev' },
      { id: 2, title: 'System Design Primer: Microservices & Caching', type: 'Guide', url: 'https://github.com' },
      { id: 3, title: 'Mock Interview Practice: System Design Scenarios', type: 'Interactive Module', url: '#' }
    ]
  };
}

export default api;
