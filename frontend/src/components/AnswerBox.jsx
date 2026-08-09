import React from 'react';
import { Code, MessageSquare, CornerDownLeft, Mic, MicOff } from 'lucide-react';
import Button from './Button';
import { useSpeechToText } from './VoiceAssistant';

const AnswerBox = ({
  value,
  onChange,
  onSubmit,
  isLastQuestion = false,
  isSubmitting = false,
  placeholder = 'Type your answer here in detail... Include code examples or structured logic if relevant.',
  mode = 'text' // 'text' or 'code'
}) => {
  const charCount = value ? value.length : 0;
  const { isListening, toggleListening, supported } = useSpeechToText({
    onTranscriptChange: (text) => {
      onChange(text);
    }
  });

  return (
    <div className="w-full bg-[#111827] border border-gray-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-3 text-xs text-gray-400">
        <span className="flex items-center gap-1.5 font-medium">
          {mode === 'code' ? <Code className="w-4 h-4 text-blue-400" /> : <MessageSquare className="w-4 h-4 text-indigo-400" />}
          {mode === 'code' ? 'Code / Technical Response' : 'Detailed Explanation Response'}
        </span>

        <div className="flex items-center gap-3">
          {supported && (
            <button
              type="button"
              onClick={toggleListening}
              className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isListening
                  ? 'bg-red-600 border-red-400 text-white shadow-lg shadow-red-500/20 animate-bounce'
                  : 'bg-gray-800 hover:bg-gray-700 text-indigo-400 border-gray-700'
              }`}
              title="Dictate response with Microphone"
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-indigo-400" />}
              <span className="font-semibold text-[11px]">{isListening ? 'Listening...' : 'Voice Dictate'}</span>
            </button>
          )}
          <span>{charCount} characters</span>
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={7}
        className="w-full p-4 bg-[#0B0F19] text-gray-100 placeholder-gray-500 rounded-xl border border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none text-sm font-mono leading-relaxed transition-all resize-y"
      />

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800/80">
        <p className="text-xs text-gray-500 hidden sm:block">
          Press <kbd className="px-1.5 py-0.5 bg-gray-800 text-gray-300 rounded text-[10px] font-mono">Submit</kbd> to record your response.
        </p>

        <Button
          onClick={onSubmit}
          isLoading={isSubmitting}
          isDisabled={!value || value.trim().length === 0}
          icon={CornerDownLeft}
          variant="primary"
          size="md"
        >
          {isLastQuestion ? 'Complete Interview & Evaluate' : 'Submit & Next Question'}
        </Button>
      </div>
    </div>
  );
};

export default AnswerBox;
