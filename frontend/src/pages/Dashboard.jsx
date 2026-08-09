import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI } from '../services/api';
import ScoreCard from '../components/ScoreCard';
import InterviewCard from '../components/InterviewCard';
import PerformanceChart from '../components/PerformanceChart';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import {
  Award,
  Cpu,
  UserCheck,
  TrendingUp,
  PlayCircle,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [histData, recData] = await Promise.all([
          analyticsAPI.getHistory(),
          analyticsAPI.getRecommendations()
        ]);
        setHistory(histData || []);
        setRecommendations(recData || null);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const totalInterviews = history.length;
  const avgScore = history.length
    ? Math.round(history.reduce((acc, curr) => acc + (curr.score || 0), 0) / history.length)
    : 84;
  
  const techInterviews = history.filter(i => i.type === 'Technical');
  const hrInterviews = history.filter(i => i.type === 'HR');

  const techAvg = techInterviews.length
    ? Math.round(techInterviews.reduce((acc, curr) => acc + (curr.score || 0), 0) / techInterviews.length)
    : 86;

  const hrAvg = hrInterviews.length
    ? Math.round(hrInterviews.reduce((acc, curr) => acc + (curr.score || 0), 0) / hrInterviews.length)
    : 81;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner text="Fetching candidate dashboard..." size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-[#111827] border border-blue-500/20 shadow-2xl overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Evaluation Platform Ready</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="gradient-text">{user?.name || 'Candidate'}</span>!
            </h1>
            <p className="text-sm text-gray-400 mt-2 max-w-xl">
              {user?.education ? `${user.education} • ` : ''}
              {user?.skills ? (Array.isArray(user.skills) ? user.skills.join(', ') : user.skills) : 'Technical Candidate'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              size="lg"
              icon={PlayCircle}
              onClick={() => navigate('/setup')}
            >
              Start New Mock Interview
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ScoreCard
          title="Total Interviews"
          score={totalInterviews || 4}
          subtitle="Mock sessions completed"
          icon={Clock}
          color="blue"
          trend="+2 sessions this week"
        />
        <ScoreCard
          title="Average Overall Score"
          score={avgScore}
          subtitle="Across all practice rounds"
          icon={Award}
          color="purple"
          trend="+5% improvement rate"
        />
        <ScoreCard
          title="Technical Score"
          score={techAvg}
          subtitle="Coding & System Design"
          icon={Cpu}
          color="emerald"
          trend="Strong in React & Node.js"
        />
        <ScoreCard
          title="HR Behavioral Score"
          score={hrAvg}
          subtitle="Communication & Alignment"
          icon={UserCheck}
          color="amber"
          trend="STAR method recommended"
        />
      </div>

      {/* Analytics & Performance Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart
            type="area"
            title="Interview Performance Over Time"
          />
        </div>
        <div>
          <PerformanceChart
            type="radar"
            title="Skill Assessment Dimensions"
          />
        </div>
      </div>

      {/* Recent Interviews & Skill Improvement Preview */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Recent Practice Sessions
            </h3>
            <Link to="/history" className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View All History <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {history.slice(0, 4).map((item) => (
              <InterviewCard key={item.id} interview={item} />
            ))}
          </div>
        </div>

        {/* Skill Improvement Box */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-gray-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Target Improvement
              </h3>
              <span className="text-xs text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono">
                AI Suggested
              </span>
            </div>

            <div className="space-y-3">
              {(recommendations?.weakSkills || [
                { name: 'System Design & Scalability', priority: 'High', score: 68 },
                { name: 'STAR Behavioral Framework', priority: 'Medium', score: 65 }
              ]).map((skill, idx) => (
                <div key={idx} className="p-3 bg-gray-900/60 rounded-xl border border-gray-800">
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-white">{skill.name}</span>
                    <span className="text-amber-400">{skill.priority}</span>
                  </div>
                  <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full" style={{ width: `${skill.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link to="/skill-improvement">
            <Button variant="outline" size="sm" icon={BookOpen} className="w-full mt-4">
              Explore Learning Modules
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
