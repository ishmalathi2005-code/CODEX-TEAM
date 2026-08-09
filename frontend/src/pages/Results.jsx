import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { analyticsAPI } from '../services/api';
import ScoreCard from '../components/ScoreCard';
import FeedbackCard from '../components/FeedbackCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import {
  Award,
  Cpu,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  BookOpen
} from 'lucide-react';

const Results = () => {
  const { interviewId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await analyticsAPI.getResults(interviewId);
        setResults(data);
      } catch (err) {
        console.error('Failed to load evaluation results', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [interviewId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner text="Computing AI Evaluation & Performance Metrics..." size="large" />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-white">Results report not found.</h2>
        <p className="text-sm text-gray-400 mt-2">The requested evaluation ID could not be loaded.</p>
        <Link to="/dashboard" className="inline-block mt-4">
          <Button variant="primary" size="sm">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-[#111827] border border-blue-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Assessment Completed</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Interview Evaluation Report</h1>
          <p className="text-sm text-gray-400 mt-1">
            {results.technology} ({results.difficulty}) • Evaluated on {results.date}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/setup">
            <Button variant="primary" size="md" icon={RotateCcw}>
              Start New Round
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Score Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ScoreCard
          title="Overall Composite Score"
          score={results.overallScore}
          subtitle="AI Weighted Performance Index"
          icon={Award}
          color="blue"
        />
        <ScoreCard
          title="Technical Competency"
          score={results.technicalScore}
          subtitle="Code structure & correctness"
          icon={Cpu}
          color="emerald"
        />
        <ScoreCard
          title="HR & Communication"
          score={results.hrScore}
          subtitle="Relevance & clarity of expression"
          icon={UserCheck}
          color="purple"
        />
      </div>

      {/* Sub-Metric Score Pills */}
      <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl bg-[#111827] border border-gray-800 text-center">
        <div>
          <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Correctness</span>
          <span className="text-2xl font-bold text-emerald-400">{results.breakdown?.correctness || 88}%</span>
        </div>
        <div className="border-x border-gray-800">
          <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Relevance</span>
          <span className="text-2xl font-bold text-blue-400">{results.breakdown?.relevance || 90}%</span>
        </div>
        <div>
          <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Communication</span>
          <span className="text-2xl font-bold text-indigo-400">{results.breakdown?.communication || 82}%</span>
        </div>
      </div>

      {/* Strengths & Weaknesses Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <FeedbackCard
          title="Identified Strengths"
          items={results.strengths}
          type="strength"
        />
        <FeedbackCard
          title="Weaknesses & Gap Areas"
          items={results.weaknesses}
          type="weakness"
        />
      </div>

      {/* AI Qualitative Feedback Note */}
      <FeedbackCard
        title="AI Chief Evaluator Feedback"
        aiNote={results.aiFeedback}
        type="aiSummary"
      />

      {/* Question-by-Question Breakdown */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Question-wise Granular Analysis</h3>
        <div className="space-y-3">
          {results.questionWise?.map((q, idx) => {
            const isExpanded = expandedQuestion === idx;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#111827] border border-gray-800 transition-all hover:border-gray-700"
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                >
                  <div className="flex items-center gap-3 pr-4">
                    <span className="w-8 h-8 rounded-xl bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-300 shrink-0">
                      Q{q.id || idx + 1}
                    </span>
                    <h4 className="font-semibold text-white text-sm line-clamp-1">{q.question}</h4>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold rounded-lg">
                      Score: {q.score}%
                    </span>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-800 text-sm space-y-3 animate-fadeIn">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="p-3 bg-gray-900/60 rounded-xl">
                        <span className="text-gray-400 block mb-1">Correctness Rating</span>
                        <span className="font-bold text-emerald-400 text-base">{q.correctness}%</span>
                      </div>
                      <div className="p-3 bg-gray-900/60 rounded-xl">
                        <span className="text-gray-400 block mb-1">Relevance Rating</span>
                        <span className="font-bold text-blue-400 text-base">{q.relevance}%</span>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed bg-gray-900/40 p-3 rounded-xl border border-gray-800/60">
                      <strong className="text-blue-400">AI Evaluation Feedback: </strong>
                      {q.feedback}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations & Action Plan */}
      <div className="p-6 rounded-3xl bg-[#111827] border border-gray-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Recommended Action Plan for Skill Mastery</h3>
        </div>

        <ul className="grid sm:grid-cols-2 gap-3">
          {results.suggestions?.map((item, idx) => (
            <li key={idx} className="p-3 bg-gray-900/60 rounded-xl border border-gray-800 text-xs text-gray-300 flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Results;
