import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceSearchButtonProps {
  onVoiceResult: (parsedQuery: string, rawTranscript: string) => void;
  variant?: 'dark' | 'light';
}

export function parseSpokenCraving(raw: string): string {
  const cleaned = raw
    .toLowerCase()
    .replace(/[.,!?]/g, '')
    .trim();

  const prefixes = [
    'show me some ',
    'show me the ',
    'show me ',
    'find me some ',
    'find me ',
    'search for ',
    'i am craving ',
    "i'm craving ",
    'i want to order ',
    'i want some ',
    'i want ',
    'can i get ',
    'give me ',
    'looking for ',
    'filter by ',
  ];

  let result = cleaned;
  for (const prefix of prefixes) {
    if (result.startsWith(prefix)) {
      result = result.slice(prefix.length).trim();
      break;
    }
  }

  return result || raw.trim();
}

export const VoiceSearchButton: React.FC<VoiceSearchButtonProps> = ({
  onVoiceResult,
  variant = 'light',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showFallbackPrompts, setShowFallbackPrompts] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const triggerSimulatedPhrase = (phrase: string) => {
    const parsed = parseSpokenCraving(phrase);
    setStatusMessage(`Heard: “${phrase}” → filtering "${parsed}"`);
    onVoiceResult(parsed, phrase);
    setShowFallbackPrompts(false);
    window.setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleToggleVoice = () => {
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
      setStatusMessage(null);
      return;
    }

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setShowFallbackPrompts((prev) => !prev);
      setStatusMessage(
        'Voice recognition ready — speak or choose a spoken craving below:'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognitionRef.current = recognition;
      recognition.lang = 'en-PH';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setShowFallbackPrompts(true);
        setStatusMessage('Listening… Speak a craving (e.g. "show me ube cupcakes")');
      };

      recognition.onresult = (event: any) => {
        const rawTranscript = event.results?.[0]?.[0]?.transcript || '';
        if (rawTranscript) {
          const parsed = parseSpokenCraving(rawTranscript);
          setStatusMessage(`Heard: “${rawTranscript}”`);
          onVoiceResult(parsed, rawTranscript);
          setShowFallbackPrompts(false);
          window.setTimeout(() => setStatusMessage(null), 3500);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setShowFallbackPrompts(true);
        setStatusMessage(
          'Microphone unavailable in preview — try a voice command below:'
        );
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setShowFallbackPrompts((prev) => !prev);
      setStatusMessage('Select a spoken craving below to test voice filter:');
    }
  };

  const sampleVoiceCommands = [
    'Show me ube cupcakes',
    'Find cassava cake',
    'I am craving chocolate drip cake',
    'Search for fudgy brownies',
    'Show me blueberry muffins',
  ];

  const isDark = variant === 'dark';

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        onClick={handleToggleVoice}
        title="Voice search: speak your dessert craving"
        aria-label={
          isListening
            ? 'Stop voice search'
            : 'Start voice search (e.g. show me ube cupcakes)'
        }
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
          isListening
            ? 'bg-[#B84A62] text-white animate-pulse'
            : isDark
            ? 'bg-white/10 hover:bg-white/18 text-[#FBF9F6] border border-white/15'
            : 'bg-[#F3EFEA] hover:bg-[#E6DFD5] text-[#231712] border border-[#E6DFD5]'
        }`}
      >
        {isListening ? (
          <>
            <MicOff className="w-3.5 h-3.5" />
            <span>Listening…</span>
          </>
        ) : (
          <>
            <Mic className="w-3.5 h-3.5 text-[#B84A62]" />
            <span className="hidden sm:inline">Voice Search</span>
          </>
        )}
      </button>

      {(statusMessage || showFallbackPrompts) && (
        <div
          className={`absolute right-0 top-full mt-2 z-50 w-72 sm:w-80 p-3.5 rounded-xl shadow-xl border text-left space-y-2.5 ${
            isDark
              ? 'bg-[#1B120E] border-white/15 text-[#FBF9F6]'
              : 'bg-white border-[#E6DFD5] text-[#231712]'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <Volume2 className="w-3.5 h-3.5 text-[#C69C53] shrink-0" />
              <span>{statusMessage || 'Speak your dessert craving'}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowFallbackPrompts(false);
                setStatusMessage(null);
              }}
              className="text-[11px] opacity-70 hover:opacity-100 cursor-pointer"
            >
              Close
            </button>
          </div>

          {showFallbackPrompts && (
            <div className="space-y-1.5 pt-1 border-t border-current/10">
              <p className="text-[11px] opacity-75">
                Speak into your mic or tap a voice phrase:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {sampleVoiceCommands.map((cmd) => (
                  <button
                    key={cmd}
                    type="button"
                    onClick={() => triggerSimulatedPhrase(cmd)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                      isDark
                        ? 'bg-white/10 hover:bg-[#B84A62] text-[#E8DDD3] hover:text-white'
                        : 'bg-[#F3EFEA] hover:bg-[#231712] text-[#231712] hover:text-white'
                    }`}
                  >
                    “{cmd}”
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
