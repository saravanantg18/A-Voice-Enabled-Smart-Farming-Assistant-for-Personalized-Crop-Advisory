import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import { voiceService } from '../services/voiceService';
import { Mic, MicOff, Send, Volume2, VolumeX, Sparkles, User, Bot, AlertCircle, RefreshCw } from 'lucide-react';

const SAMPLE_QUESTIONS = [
  { ml: 'എന്റെ മണ്ണിന് ഏത് വിളയാണ് അനുയോജ്യം?', en: 'Which crop is suitable for my soil?' },
  { ml: 'ഇന്ന് മഴ പെയ്യുമോ?', en: 'Will it rain today?' },
  { ml: 'നെല്ലിന് എത്ര വെള്ളം വേണം?', en: 'How much water is needed for paddy?' },
  { ml: 'എന്റെ വിളയ്ക്ക് എന്ത് വളം ഉപയോഗിക്കണം?', en: 'What fertilizer should I apply for my crop?' },
  { ml: 'ഇപ്പോൾ ഏത് വിള കൃഷി ചെയ്യുന്നതാണ് നല്ലത്?', en: 'Which crop is best to cultivate now?' },
];

const VoiceAssistant = () => {
  const { language } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text_en: 'Hello! I am your Voice Smart Farming Assistant. Press the microphone button and ask your question in Malayalam, or type below.',
      text_ml: 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ വോയ്‌സ് കർഷക സഹായി ആണ്. ബട്ടൺ അമർത്തി മലയാളത്തിൽ ചോദ്യം ചോദിക്കൂ.',
      intent: 'greeting',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isListening]);

  const handleStartListening = () => {
    setVoiceError('');
    setTranscript('');
    setIsListening(true);

    voiceService.startListening(
      (text, isFinal) => {
        setTranscript(text);
        setTextInput(text);
        if (isFinal) {
          handleSendQuery(text);
        }
      },
      (err) => {
        setVoiceError(err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const handleStopListening = () => {
    voiceService.stopListening();
    setIsListening(false);
  };

  const handleSendQuery = async (queryText) => {
    const textToSend = queryText || textInput;
    if (!textToSend.trim()) return;

    handleStopListening();
    setTextInput('');
    setTranscript('');

    const userMsg = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const res = await chatAPI.query({
        query: textToSend,
        language: 'ml',
        is_voice: true
      });

      const data = res.data;
      const botMsg = {
        sender: 'bot',
        text_en: data.response_text,
        text_ml: data.response_text_ml,
        intent: data.intent,
        recommendations: data.recommendations,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);

      // Auto-speak response in Malayalam
      playAudio(data.response_text_ml);
    } catch (e) {
      console.error('Failed to query chatbot:', e);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text_en: 'Sorry, I faced a network error processing your question. Please try again.',
        text_ml: 'ക്ഷമിക്കണം, ചോദ്യം പ്രോസസ്സ് ചെയ്യുന്നതിൽ തടസ്സം നേരിട്ടു. വീണ്ടും ശ്രമിക്കുക.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudio = (textMl) => {
    setIsPlayingAudio(true);
    voiceService.speakMalayalam(textMl, () => {
      setIsPlayingAudio(false);
    });
  };

  const stopAudio = () => {
    voiceService.stopSpeaking();
    setIsPlayingAudio(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Page Title & Voice Control Hero Card */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-800 rounded-3xl p-6 text-white text-center shadow-xl relative overflow-hidden space-y-6">
        
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-950/80 px-4 py-1.5 rounded-full text-xs font-bold text-amber-300 border border-emerald-500/30">
            <Sparkles className="w-4 h-4" />
            <span>{language === 'ml' ? 'ശബ്ദ സംഭാഷണ സംവിധാനം' : 'Malayalam Speech Recognition Engine'}</span>
          </div>
          <h2 className="text-3xl font-black">
            {language === 'ml' ? 'നിങ്ങളുടെ കൃഷി അസിസ്റ്റന്റോട് സംസാരിക്കൂ' : 'Malayalam Voice Assistant'}
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-lg mx-auto font-medium">
            {language === 'ml' 
              ? 'മൈക്രോഫോൺ ബട്ടൺ അമർത്തി മലയാളത്തിൽ ചോദിക്കൂ' 
              : 'Press the microphone button and speak in Malayalam for instant agricultural advice'}
          </p>
        </div>

        {/* Large Central Microphone Button with Pulse Animation */}
        <div className="py-2 flex flex-col items-center justify-center space-y-4">
          <button
            onClick={isListening ? handleStopListening : handleStartListening}
            className={`w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 transform active:scale-90 cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse-mic ring-8 ring-rose-300/60'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 hover:scale-105 ring-4 ring-amber-300/40'
            }`}
          >
            {isListening ? (
              <MicOff className="w-14 h-14" />
            ) : (
              <Mic className="w-14 h-14" />
            )}
            <span className="text-xs font-black uppercase mt-1">
              {isListening ? (language === 'ml' ? 'കേൾക്കുന്നു...' : 'Listening...') : (language === 'ml' ? 'സംസാരിക്കൂ' : 'Tap to Speak')}
            </span>
          </button>

          {/* Audio Wave Visualizer when listening */}
          {isListening && (
            <div className="flex items-center gap-1.5 h-8">
              <span className="w-1.5 bg-amber-300 rounded-full wave-bar" style={{ animationDelay: '0s' }}></span>
              <span className="w-1.5 bg-amber-300 rounded-full wave-bar" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1.5 bg-amber-300 rounded-full wave-bar" style={{ animationDelay: '0.4s' }}></span>
              <span className="w-1.5 bg-amber-300 rounded-full wave-bar" style={{ animationDelay: '0.6s' }}></span>
              <span className="w-1.5 bg-amber-300 rounded-full wave-bar" style={{ animationDelay: '0.8s' }}></span>
            </div>
          )}

          {transcript && (
            <div className="bg-emerald-950/90 border border-emerald-400/40 px-4 py-2 rounded-2xl text-amber-300 font-bold text-sm max-w-md animate-fade-in">
              “{transcript}”
            </div>
          )}
        </div>

        {voiceError && (
          <div className="bg-rose-900/80 border border-rose-400/40 text-rose-200 p-3 rounded-2xl text-xs flex items-center justify-center gap-2 max-w-md mx-auto">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{voiceError}</span>
          </div>
        )}

      </div>

      {/* Quick Malayalam Sample Questions Chips */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          {language === 'ml' ? 'ഉദാഹരണ ചോദ്യങ്ങൾ (തൊട്ടു ചോദിക്കൂ):' : 'Sample Questions (Tap to ask):'}
        </label>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(q.ml)}
              className="bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-2xs hover:scale-102"
            >
              🎤 {language === 'ml' ? q.ml : q.en}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Chat Window */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[480px]">
        
        {/* Chat Header */}
        <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-700 text-white rounded-xl flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                {language === 'ml' ? 'കർഷക സഹായ ചാറ്റ്' : 'Farming Assistant Stream'}
              </h3>
              <p className="text-[10px] text-slate-500 font-semibold">Malayalam Voice Enabled</p>
            </div>
          </div>

          {isPlayingAudio && (
            <button
              onClick={stopAudio}
              className="flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full animate-pulse"
            >
              <VolumeX className="w-4 h-4 text-amber-700" />
              <span>{language === 'ml' ? 'ശബ്ദം നിർത്തൂ' : 'Stop Audio'}</span>
            </button>
          )}
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                m.sender === 'user' ? 'bg-amber-500' : 'bg-emerald-700'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded-2xl text-sm space-y-2 ${
                m.sender === 'user' 
                  ? 'bg-amber-400 text-slate-950 font-bold rounded-tr-none' 
                  : 'bg-slate-100 text-slate-900 rounded-tl-none border border-slate-200'
              }`}>
                <p className="leading-relaxed whitespace-pre-wrap">
                  {m.sender === 'user' ? m.text : (language === 'ml' ? m.text_ml : m.text_en)}
                </p>

                {m.sender === 'bot' && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                    <button
                      onClick={() => playAudio(m.text_ml)}
                      className="flex items-center gap-1 text-emerald-800 font-bold hover:underline"
                    >
                      <Volume2 className="w-4 h-4 text-emerald-600" />
                      <span>{language === 'ml' ? 'ശബ്ദം കേൾക്കൂ' : 'Play Audio'}</span>
                    </button>
                    <span className="text-[10px] text-slate-400">{m.time}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-100 p-4 rounded-2xl text-slate-500 text-xs font-semibold">
                {language === 'ml' ? 'ഉത്തരം തയ്യാറാക്കുന്നു...' : 'Analyzing farm & weather data...'}
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Text Input Fallback Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={language === 'ml' ? 'ഇവിടെ ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ മൈക്രോഫോൺ അമർത്തുക...' : 'Type your question here or press mic above...'}
              className="flex-1 bg-white border border-slate-300 focus:border-emerald-600 px-4 py-3 rounded-2xl text-sm outline-none"
            />
            <button
              type="submit"
              disabled={!textInput.trim() || isProcessing}
              className="farmer-btn bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white p-3 rounded-2xl"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default VoiceAssistant;
