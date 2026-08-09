import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionAPI } from '../services/api';
import QuestionCard from '../components/QuestionCard';
import AnswerBox from '../components/AnswerBox';
import Timer from '../components/Timer';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { UserCheck } from 'lucide-react';

const HRInterview = () => {
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const raw = sessionStorage.getItem('codex_active_interview');
    if (!raw) {
      navigate('/setup');
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setSession(parsed);
    } catch (e) {
      navigate('/setup');
    }
  }, [navigate]);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner text="Initializing HR Interview Engine..." size="large" />
      </div>
    );
  }

  const { questions, currentIndex, setup, interviewId, answers } = session;
  const currentQuestion = questions[currentIndex] || { text: 'Loading HR question...' };
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleNext = async () => {
    if (!currentAnswer.trim()) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const answerPayload = {
        interviewId,
        questionId: currentQuestion.id || `q_${currentIndex + 1}`,
        questionText: currentQuestion.text,
        userAnswer: currentAnswer,
        timeSpentSeconds: 120,
      };

      await questionAPI.submitAnswer(answerPayload);

      const updatedAnswers = [...(answers || []), answerPayload];

      if (isLastQuestion) {
        await questionAPI.submitEvaluation({
          interviewId,
          answers: updatedAnswers,
        });
        sessionStorage.removeItem('codex_active_interview');
        navigate(`/results/${interviewId}`);
      } else {
        const updatedSession = {
          ...session,
          currentIndex: currentIndex + 1,
          answers: updatedAnswers,
        };
        sessionStorage.setItem('codex_active_interview', JSON.stringify(updatedSession));
        setSession(updatedSession);
        setCurrentAnswer('');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to submit response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeUp = () => {
    if (!currentAnswer.trim()) {
      setCurrentAnswer('Candidate did not provide an answer before the timer expired.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Session Status Bar */}
      <div className="p-4 rounded-2xl bg-[#111827] border border-gray-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">HR Behavioral Round</h3>
            <span className="text-xs text-gray-400">{setup?.technology} • {setup?.difficulty} Tier</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Timer initialSeconds={180} onTimeUp={handleTimeUp} key={currentIndex} />
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar current={currentIndex + 1} total={questions.length} label="HR Round Progress" />

      <ErrorMessage message={errorMsg} onClose={() => setErrorMsg('')} />

      {/* AI Question Prompt */}
      <QuestionCard
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        questionText={currentQuestion.text}
        technology={setup?.technology}
        difficulty={setup?.difficulty}
        type="HR Behavioral"
      />

      {/* Answer Area */}
      <AnswerBox
        value={currentAnswer}
        onChange={setCurrentAnswer}
        onSubmit={handleNext}
        isLastQuestion={isLastQuestion}
        isSubmitting={isSubmitting}
        mode="text"
        placeholder="Structure your answer using the STAR method (Situation, Task, Action, Result)..."
      />
    </div>
  );
};

export default HRInterview;
