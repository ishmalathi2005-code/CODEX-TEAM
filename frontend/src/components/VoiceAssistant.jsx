import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Mic, MicOff, Radio, Sparkles, RefreshCw } from 'lucide-react';

/**
 * Custom Hook for Text-to-Speech (AI Interviewer Voice)
 */
export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
    }
  }, []);

  const speak = useCallback((text) => {
    if (!supported || !text) return;
    window.speechSynthesis.cancel(); // Stop any active speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick realistic natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel')));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [supported]);

  const stop = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [supported]);

  return { speak, stop, isSpeaking, supported };
};

/**
 * Custom Hook for Speech-to-Text (Candidate Voice Dictation)
 */
export const useSpeechToText = ({ onTranscriptChange } = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        if (onTranscriptChange) onTranscriptChange(currentTranscript);
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition error:', err.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [onTranscriptChange]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        setTranscript('');
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return { isListening, transcript, startListening, stopListening, toggleListening, supported };
};

/**
 * Interactive Voice Assistant Widget Component
 */
export const VoiceAssistantWidget = ({
  questionText,
  onDictatedAnswer,
  className = '',
}) => {
  const { speak, stop, isSpeaking, supported: ttsSupported } = useTextToSpeech();
  const { isListening, toggleListening, supported: sttSupported } = useSpeechToText({
    onTranscriptChange: (text) => {
      if (onDictatedAnswer) onDictatedAnswer(text);
    },
  });

  const handleSpeakQuestion = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(questionText);
    }
  };

  return (
    <div className={`p-4 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 shadow-xl backdrop-blur-md ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Voice Assistant Header */}
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Radio className={`w-5 h-5 ${isSpeaking || isListening ? 'animate-pulse text-blue-300' : ''}`} />
            {(isSpeaking || isListening) && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">AI Voice Assistant</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Live Speech Engine
              </span>
            </div>
            <p className="text-xs text-gray-300">
              {isSpeaking ? 'AI Interviewer is speaking the question...' : isListening ? 'Listening to candidate voice response...' : 'Hands-free voice mode active'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Read Question Aloud Button */}
          {ttsSupported && (
            <button
              type="button"
              onClick={handleSpeakQuestion}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-2 cursor-pointer ${
                isSpeaking
                  ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30 animate-pulse'
                  : 'bg-gray-800/80 border-gray-700 text-gray-200 hover:bg-gray-700'
              }`}
              title="Read Question Aloud"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
              <span>{isSpeaking ? 'Stop Voice' : 'Read Question'}</span>
            </button>
          )}

          {/* Candidate Voice Dictation Button */}
          {sttSupported && (
            <button
              type="button"
              onClick={toggleListening}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 cursor-pointer ${
                isListening
                  ? 'bg-red-600 border-red-400 text-white shadow-lg shadow-red-500/30 animate-bounce'
                  : 'bg-indigo-600/30 border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/50'
              }`}
              title="Dictate Answer using Microphone"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-indigo-400" />}
              <span>{isListening ? 'Listening...' : 'Voice Dictate'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Voice Animated Frequency Waves */}
      {(isSpeaking || isListening) && (
        <div className="mt-3 pt-3 border-t border-blue-500/20 flex items-center justify-center gap-1.5 h-6">
          <span className="w-1 bg-blue-400 rounded-full animate-[bounce_1s_infinite_100ms] h-4" />
          <span className="w-1 bg-blue-400 rounded-full animate-[bounce_1s_infinite_300ms] h-6" />
          <span className="w-1 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_200ms] h-3" />
          <span className="w-1 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_400ms] h-5" />
          <span className="w-1 bg-purple-400 rounded-full animate-[bounce_1s_infinite_150ms] h-6" />
          <span className="w-1 bg-purple-400 rounded-full animate-[bounce_1s_infinite_350ms] h-4" />
          <span className="text-[11px] text-blue-300 font-mono ml-2">
            {isSpeaking ? 'Audio Playback Active' : 'Capturing Speech Input'}
          </span>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistantWidget;
