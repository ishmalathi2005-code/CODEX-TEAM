import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI, questionAPI, resumeAPI } from '../services/api';
import Select from '../components/Select';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { Cpu, UserCheck, Play, Layers, HelpCircle, Sparkles, FileText, Upload, CheckCircle2, Mic } from 'lucide-react';

const InterviewSetup = () => {
  const navigate = useNavigate();

  const [setup, setSetup] = useState({
    type: 'Technical', // 'Technical', 'HR', 'Resume'
    technology: 'React.js',
    difficulty: 'Medium',
    questionCount: 5,
    resumeText: '',
  });

  const [analyzingResume, setAnalyzingResume] = useState(false);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
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

  const handleAnalyzeResume = async () => {
    if (!setup.resumeText.trim()) {
      setErrorMsg('Please paste or upload your resume text first.');
      return;
    }
    setErrorMsg('');
    setAnalyzingResume(true);
    try {
      const res = await resumeAPI.analyzeResume({
        resumeText: setup.resumeText,
        difficulty: setup.difficulty,
        questionCount: setup.questionCount,
      });
      setResumeAnalysis(res);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to analyze resume. Please try again.');
    } finally {
      setAnalyzingResume(false);
    }
  };

  const handleStart = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      let questionsData = [];

      if (setup.type === 'Resume') {
        if (!resumeAnalysis || !resumeAnalysis.questions?.length) {
          if (!setup.resumeText.trim()) {
            setErrorMsg('Please enter your resume text to generate tailored questions.');
            setLoading(false);
            return;
          }
          const res = await resumeAPI.analyzeResume({
            resumeText: setup.resumeText,
            difficulty: setup.difficulty,
            questionCount: setup.questionCount,
          });
          questionsData = res.questions;
        } else {
          questionsData = resumeAnalysis.questions;
        }
      }

      // 1. Create interview record
      const title = `${setup.technology || 'Technical'} ${setup.type} Practice Session`;
      const newInterview = await interviewAPI.createInterview({
        ...setup,
        title,
        type: setup.type === 'Resume' ? 'technical' : setup.type,
      });
      const interviewId = newInterview.id || 'int_' + Date.now();

      // 2. Pre-generate questions if not resume-based
      if (setup.type !== 'Resume') {
        questionsData = await questionAPI.generateQuestions({
          interviewId,
          technology: setup.technology,
          type: setup.type,
          difficulty: setup.difficulty,
          count: setup.questionCount,
        });
      }

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
      const msg = err.response?.data?.message || err.message || 'Failed to initialize interview session. Please try again.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold rounded-full mb-3 shadow-lg">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Interactive AI & Voice Simulation Setup</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Configure Your Practice Session</h1>
        <p className="text-gray-400 text-sm mt-2">
          Select target domain, technology stack, resume analysis, or AI Voice Assistant mode.
        </p>
      </div>

      <ErrorMessage message={errorMsg} onClose={() => setErrorMsg('')} />

      <form onSubmit={handleStart} className="p-8 rounded-3xl bg-[#111827] border border-gray-800 shadow-2xl space-y-6">
        {/* Round Type Selection Pills */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Select Interview Round Mode</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setSetup((prev) => ({ ...prev, type: 'Technical', technology: 'React.js' }))}
              className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                setup.type === 'Technical'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-lg'
                  : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:bg-gray-800'
              }`}
            >
              <Cpu className="w-5 h-5" />
              <span className="font-bold text-xs text-white">Technical Round</span>
              <span className="text-[10px] text-gray-400 text-center">Coding & Architecture</span>
            </button>

            <button
              type="button"
              onClick={() => setSetup((prev) => ({ ...prev, type: 'HR', technology: 'Behavioral & Culture Fit' }))}
              className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                setup.type === 'HR'
                  ? 'bg-purple-600/20 border-purple-500 text-purple-400 shadow-lg'
                  : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:bg-gray-800'
              }`}
            >
              <UserCheck className="w-5 h-5" />
              <span className="font-bold text-xs text-white">HR Behavioral</span>
              <span className="text-[10px] text-gray-400 text-center">Leadership & Culture</span>
            </button>

            <button
              type="button"
              onClick={() => setSetup((prev) => ({ ...prev, type: 'Resume', technology: 'Resume Customized' }))}
              className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                setup.type === 'Resume'
                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-lg'
                  : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:bg-gray-800'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="font-bold text-xs text-white">Resume Analysis</span>
              <span className="text-[10px] text-gray-400 text-center">AI Tailored Questions</span>
            </button>
          </div>
        </div>

        {/* Resume Analysis Input Panel */}
        {setup.type === 'Resume' ? (
          <div className="space-y-4 p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Paste Resume Text / Project Experience
              </label>
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                AI Skill Extractor
              </span>
            </div>
            <textarea
              name="resumeText"
              rows={4}
              value={setup.resumeText}
              onChange={handleChange}
              placeholder="Paste your resume text here (e.g. Worked with React.js, Express, Microservices, MongoDB for 3 years at TechCorp...)"
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <Button
              type="button"
              onClick={handleAnalyzeResume}
              isLoading={analyzingResume}
              variant="secondary"
              size="sm"
              icon={Sparkles}
              className="w-full text-xs bg-emerald-600/20 hover:bg-emerald-600/30 border-emerald-500/40 text-emerald-300"
            >
              Analyze Resume & Tailor Questions
            </Button>

            {resumeAnalysis && (
              <div className="p-3 rounded-xl bg-gray-900/80 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Resume Analysis Complete</span>
                </div>
                <p className="text-[11px] text-gray-300">{resumeAnalysis.summary}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {resumeAnalysis.extractedSkills?.map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-[10px] bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-full font-mono">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Technology Stack / Category Selection */
          <Select
            label={setup.type === 'Technical' ? 'Target Technology Stack' : 'Category'}
            name="technology"
            value={setup.technology}
            onChange={handleChange}
            options={setup.type === 'Technical' ? techOptions : hrOptions}
            icon={Layers}
            required
          />
        )}

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

        {/* Voice Mode Feature Badge */}
        <div className="p-3 rounded-xl bg-blue-900/20 border border-blue-500/30 flex items-center justify-between text-xs text-blue-300">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-blue-400 animate-pulse" />
            <span>Interactive AI Voice Assistant enabled during session</span>
          </div>
          <span className="text-[10px] text-gray-400">TTS & STT Active</span>
        </div>

        <div className="pt-2">
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
