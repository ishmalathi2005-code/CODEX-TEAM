import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar
} from 'recharts';

const defaultTimelineData = [
  { date: 'Session 1', score: 68, technical: 70, hr: 66 },
  { date: 'Session 2', score: 74, technical: 76, hr: 72 },
  { date: 'Session 3', score: 79, technical: 82, hr: 76 },
  { date: 'Session 4', score: 84, technical: 88, hr: 80 },
  { date: 'Session 5', score: 88, technical: 90, hr: 86 },
];

const defaultRadarData = [
  { subject: 'Correctness', A: 88, fullMark: 100 },
  { subject: 'Relevance', A: 92, fullMark: 100 },
  { subject: 'Communication', A: 80, fullMark: 100 },
  { subject: 'Problem Solving', A: 90, fullMark: 100 },
  { subject: 'Code Quality', A: 85, fullMark: 100 },
];

const PerformanceChart = ({ type = 'area', data, title = 'Performance Trend' }) => {
  const chartData = data || (type === 'radar' ? defaultRadarData : defaultTimelineData);

  return (
    <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 shadow-xl h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-white text-base">{title}</h4>
        <span className="text-xs text-gray-400 bg-gray-800 px-2.5 py-1 rounded-lg">Last 5 Sessions</span>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'radar' ? (
            <RadarChart data={chartData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="subject" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <Radar name="Candidate Skill" dataKey="A" stroke="#6366F1" fill="#6366F1" fillOpacity={0.4} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '0.75rem', color: '#F3F4F6' }} />
            </RadarChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis dataKey="date" stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis stroke="#6B7280" domain={[0, 100]} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  borderColor: '#374151',
                  borderRadius: '0.75rem',
                  color: '#F3F4F6'
                }}
              />
              <Area type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#scoreGradient)" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;
