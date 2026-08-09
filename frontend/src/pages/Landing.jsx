import React from 'react';
import { Link } from 'react-router-dom';
import {
  Terminal,
  Cpu,
  UserCheck,
  Zap,
  BarChart3,
  Award,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import Button from '../components/Button';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Background Radial Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-blue-600/15 via-indigo-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-medium mb-8 animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen AI Technical & HR Interview Simulator</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.15]">
          Master Technical & HR Interviews with{' '}
          <span className="gradient-text">Real-Time AI Evaluation</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          CODEX generates dynamic adaptive coding problems and behavioral HR scenarios, evaluating your responses for correctness, relevance, and communication in seconds.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/register">
            <Button variant="primary" size="lg" icon={ArrowRight}>
              Start Free AI Practice
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">
              Existing Account Login
            </Button>
          </Link>
        </div>

        {/* Feature Pill Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-gray-800/80 text-left">
          <div className="p-4 rounded-xl bg-gray-900/40 border border-gray-800">
            <div className="text-2xl font-bold text-white font-mono">10,000+</div>
            <div className="text-xs text-gray-400 mt-1">Questions Generated</div>
          </div>
          <div className="p-4 rounded-xl bg-gray-900/40 border border-gray-800">
            <div className="text-2xl font-bold text-blue-400 font-mono">98.4%</div>
            <div className="text-xs text-gray-400 mt-1">Evaluation Accuracy</div>
          </div>
          <div className="p-4 rounded-xl bg-gray-900/40 border border-gray-800">
            <div className="text-2xl font-bold text-indigo-400 font-mono">15+</div>
            <div className="text-xs text-gray-400 mt-1">Tech Stacks Supported</div>
          </div>
          <div className="p-4 rounded-xl bg-gray-900/40 border border-gray-800">
            <div className="text-2xl font-bold text-emerald-400 font-mono">Instant</div>
            <div className="text-xs text-gray-400 mt-1">Feedback Reports</div>
          </div>
        </div>
      </section>

      {/* Dual Interview Modes: Technical & HR */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Comprehensive Dual Interview Engine</h2>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">Practice specialized rounds designed by industry engineering managers and HR directors.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Technical Round */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-[#111827] border border-blue-500/20 shadow-2xl relative overflow-hidden group hover:border-blue-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">1. Technical Coding & System Architecture</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Real-time questions tailored to React, Node.js, Python, Data Structures, Algorithms, and System Design. Practice writing clean code and explaining technical trade-offs under timed pressure.
            </p>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                Language & framework tailored questions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                Syntax, correctness & algorithm complexity scoring
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                Adaptive difficulty levels (Easy, Medium, Hard)
              </li>
            </ul>
          </div>

          {/* HR Round */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-[#111827] border border-purple-500/20 shadow-2xl relative overflow-hidden group hover:border-purple-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">2. HR & Behavioral Leadership Round</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Prepare for critical behavioral assessments, situational judgment tests, culture-fit questions, and soft-skill evaluations modeled around top tech company standards.
            </p>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                STAR technique response analysis
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                Communication clarity & tone assessment
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                Conflict resolution & leadership scenario prompts
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-900/30 rounded-3xl border border-gray-800/80 my-8">
        <div className="text-center mb-12">
          <span className="text-xs font-mono font-semibold text-blue-400 uppercase tracking-widest">Workflow</span>
          <h2 className="text-3xl font-bold text-white mt-1">How CODEX Works in 4 Simple Steps</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#111827] border border-gray-800 relative">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-mono font-bold text-sm mb-4">
              01
            </div>
            <h4 className="font-bold text-white text-base mb-2">Configure Session</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Choose Technical or HR round, target technology, difficulty tier, and question count.</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827] border border-gray-800 relative">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-sm mb-4">
              02
            </div>
            <h4 className="font-bold text-white text-base mb-2">AI Question Generation</h4>
            <p className="text-xs text-gray-400 leading-relaxed">CODEX generates realistic interview questions customized to your candidate profile.</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827] border border-gray-800 relative">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono font-bold text-sm mb-4">
              03
            </div>
            <h4 className="font-bold text-white text-base mb-2">Submit Responses</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Answer questions within the live countdown timer using code snippets or text descriptions.</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827] border border-gray-800 relative">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm mb-4">
              04
            </div>
            <h4 className="font-bold text-white text-base mb-2">Detailed AI Feedback</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Receive instant scores, weakness identification, skill gap analysis, and learning links.</p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-12 border-t border-gray-800/80 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to land your dream engineering job?</h3>
          <p className="text-gray-400 text-sm mb-6">Start practicing today with realistic AI-driven interview feedback.</p>
          <Link to="/register">
            <Button variant="primary" size="md">
              Create Your Free Account
            </Button>
          </Link>
          <p className="text-xs text-gray-600 mt-8 font-mono">
            © 2026 CODEX AI Interview Simulator. Built with React & Vite.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
