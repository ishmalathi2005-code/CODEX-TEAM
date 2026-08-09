import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI, questionAPI } from '../services/api';
import Select from '../components/Select';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { Cpu, UserCheck, Play, Layers, HelpCircle, Sparkles } from 'lucide-react';

const InterviewSetup = () => {
  const navigate = useNavigate();

  const [setup, setSetup] = useState({
    type: 'Technical',
    technology: 'React.js',
    difficulty: 'Medium',
    questionCount: 5,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSetup((prev) => ({
      ...prev,
      [name]: name === 'questionCount' ? Number(value) : value,
    }));
  };

  const techOptions = [
    'React.js',
    'JavaScript (ES6+)',
    'Node.js & Express',
    'Python & Backend',
    'Java & Spring Boot',
    'System Design & Architecture',
    'Data Structures & Algorithms',
    'SQL & Database Design',
  ];

  const hrOptions = [
    'General Behavioral & HR',
    'Leadership & Teamwork',
    'Conflict Resolution',
    'Situational Judgment',
  ];

  const handleStart = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // 1. Create interview record
      const newInterview = await interviewAPI.createInterview(setup);
      const interviewId = newInterview.id || 'int_' + Date.now();

      // 2. Pre-generate questions
      const questionsData = await questionAPI.generateQuestions({
        interviewId,
        technology: setup.technology,
        type: setup.type,
        difficulty: setup.difficulty,
        count: setup.questionCount,
      });

      // 3. Store session state in sessionStorage for active interview
      const sessionData = {
        interviewId,
        setup,
        questions: questionsData,
        currentIndex: 0,
        answers: [],
        startTime: Date.now(),
      };
      sessionStorage.setItem('codex_active_interview', JSON.stringify(sessionData));

      // 4. Navigate to appropriate round
      if (setup.type === 'HR') {
        navigate('/interview/hr');
      } else {
        navigate('/interview/technical');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to initialize interview session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Simulation Setup</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Configure Your Practice Session</h1>
        <p className="text-gray-400 text-sm mt-2">
          Select target domain, technology stack, difficulty, and question depth.
        </p>
      </div>

      <ErrorMessage message={errorMsg} onClose={() => setErrorMsg('')} />

      <form onSubmit={handleStart} className="p-8 rounded-3xl bg-[#111827] border border-gray-800 shadow-2xl space-y-6">
        {/* Round Type Selection Pills */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Select Interview Round</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSetup((prev) => ({ ...prev, type: 'Technical', technology: 'React.js' }))}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                setup.type === 'Technical'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-lg'
                  : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:bg-gray-800'
              }`}
            >
              <Cpu className="w-6 h-6" />
              <span className="font-bold text-sm text-white">Technical Round</span>
              <span className="text-[11px] text-gray-400 text-center">Coding, Algorithms & System Architecture</span>
            </button>

            <button
              type="button"
              onClick={() => setSetup((prev) => ({ ...prev, type: 'HR', technology: 'Behavioral & Culture Fit' }))}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                setup.type === 'HR'
                  ? 'bg-purple-600/20 border-purple-500 text-purple-400 shadow-lg'
                  : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:bg-gray-800'
              }`}
            >
              <UserCheck className="w-6 h-6" />
              <span className="font-bold text-sm text-white">HR Behavioral Round</span>
              <span className="text-[11px] text-gray-400 text-center">Leadership, Adaptability & Culture Fit</span>
            </button>
          </div>
        </div>

        {/* Technology Stack / Category */}
        <Select
          label={setup.type === 'Technical' ? 'Target Technology Stack' : 'Category'}
          name="technology"
          value={setup.technology}
          onChange={handleChange}
          options={setup.type === 'Technical' ? techOptions : hrOptions}
          icon={Layers}
          required
        />

        {/* Difficulty */}
        <Select
          label="Difficulty Tier"
          name="difficulty"
          value={setup.difficulty}
          onChange={handleChange}
          options={['Easy', 'Medium', 'Hard']}
          icon={HelpCircle}
          required
        />

        {/* Question Count */}
        <Select
          label="Number of Questions"
          name="questionCount"
          value={setup.questionCount}
          onChange={handleChange}
          options={[
            { label: '3 Questions (Quick Sprint)', value: 3 },
            { label: '5 Questions (Standard Session)', value: 5 },
            { label: '10 Questions (Deep Dive)', value: 10 },
          ]}
          icon={HelpCircle}
          required
        />

        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            icon={Play}
            className="w-full shadow-xl"
          >
            Start {setup.type} Interview Session
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InterviewSetup;
