// Speech recognition and synthesis wrapper for Web Speech API

interface SpeechRecognitionEventLike extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal?: boolean;
    };
    length: number;
  };
}

interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

class SpeechService {
  private recognition: SpeechRecognitionLike | null = null;
  private isListening = false;
  private voiceEnabled = true;

  constructor() {
    const RecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (RecognitionClass) {
      this.recognition = new RecognitionClass();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'pt-BR';
    }
  }

  public isSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  public startListening(
    onResult: (text: string, isFinal: boolean) => void,
    onError?: (err: any) => void,
    onEnd?: () => void
  ): boolean {
    if (!this.recognition) return false;

    try {
      this.recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = 0; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        onResult(text, Boolean(finalTranscript));
      };

      this.recognition.onerror = (e) => {
        this.isListening = false;
        if (onError) onError(e);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (err) {
      console.error('Speech recognition error:', err);
      this.isListening = false;
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Could not stop recognition:', e);
      }
      this.isListening = false;
    }
  }

  public speak(text: string, onStart?: () => void, onEnd?: () => void): void {
    if (!('speechSynthesis' in window) || !this.voiceEnabled) return;

    // Clean markdown asterisks, code blocks, etc. for cleaner speech
    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'Bloco de código gerado na tela.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[*_#]/g, '')
      .replace(/https?:\/\/\S+/g, 'link anexo')
      .slice(0, 320); // Keep voice response crisp

    window.speechSynthesis.cancel(); // Stop prior speech
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Select natural PT voice if available
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.includes('pt-BR') || v.lang.includes('pt'));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public toggleVoice(enable: boolean) {
    this.voiceEnabled = enable;
    if (!enable) this.stopSpeaking();
  }

  public isVoiceActive(): boolean {
    return this.voiceEnabled;
  }
}

export const speechService = new SpeechService();
