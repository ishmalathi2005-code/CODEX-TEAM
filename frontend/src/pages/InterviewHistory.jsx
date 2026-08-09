import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import InterviewCard from '../components/InterviewCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import { History, Search, Filter, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InterviewHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await analyticsAPI.getHistory();
        setHistory(data || []);
      } catch (err) {
        console.error('Failed to load history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter((item) => {
    const techStr = String(item?.technology || item?.domain || '').toLowerCase();
    const diffStr = String(item?.difficulty || '').toLowerCase();
    const queryStr = searchQuery.toLowerCase();
    const itemType = String(item?.type || '').toLowerCase();

    const matchesType = selectedType === 'All' || itemType === selectedType.toLowerCase();
    const matchesSearch = techStr.includes(queryStr) || diffStr.includes(queryStr);
    return matchesType && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner text="Fetching interview records..." size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <History className="w-7 h-7 text-blue-400" />
            Interview History
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Review past mock interview sessions, question scores, and AI feedback breakdowns.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={PlayCircle}
          onClick={() => navigate('/setup')}
        >
          New Practice Session
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#111827] border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search technology or difficulty..."
            className="w-full pl-10 pr-4 py-2 bg-[#0B0F19] text-white text-sm rounded-xl border border-gray-800 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          {['All', 'Technical', 'HR'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedType === type
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {type} Rounds
            </button>
          ))}
        </div>
      </div>

      {/* Grid of History Cards */}
      {filteredHistory.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((item) => (
            <InterviewCard key={item.id} interview={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 p-8 rounded-3xl bg-[#111827] border border-gray-800">
          <History className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No interview records found</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            No past sessions match your search filters. Try clearing filters or starting a new session.
          </p>
        </div>
      )}
    </div>
  );
};

export default InterviewHistory;
