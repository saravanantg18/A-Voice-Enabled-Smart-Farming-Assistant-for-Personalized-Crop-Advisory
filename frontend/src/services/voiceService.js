// Browser Malayalam Voice Recognition & Text-to-Speech Helper

export class VoiceAssistantService {
  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'ml-IN'; // Malayalam India
    } else {
      this.recognition = null;
    }

    this.synth = window.speechSynthesis || null;
  }

  isSupported() {
    return !!this.recognition;
  }

  startListening(onResult, onError, onEnd) {
    if (!this.recognition) {
      onError('Browser does not support direct voice recognition. Please use text input fallback.');
      return;
    }

    this.recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onResult(transcript, event.results[0].isFinal);
    };

    this.recognition.onerror = (event) => {
      let msg = 'Voice recognition error.';
      if (event.error === 'not-allowed') {
        msg = 'Microphone permission denied. Please allow microphone access in your browser settings.';
      } else if (event.error === 'no-speech') {
        msg = 'No speech detected. Please speak clearly into the microphone.';
      }
      onError(msg);
    };

    this.recognition.onend = () => {
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('Recognition start exception:', e);
    }
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn(e);
      }
    }
  }

  speakMalayalam(text, onEnd) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in browser');
      if (onEnd) onEnd();
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ml-IN';
    utterance.rate = 0.95; // Slightly slower pace for clarity in rural listening
    utterance.pitch = 1.0;

    // Find Malayalam voice if available
    const voices = this.synth.getVoices();
    const mlVoice = voices.find(v => v.lang.includes('ml') || v.lang.includes('hi') || v.lang.includes('IN'));
    if (mlVoice) {
      utterance.voice = mlVoice;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    utterance.onerror = (e) => {
      console.warn('TTS error:', e);
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const voiceService = new VoiceAssistantService();
