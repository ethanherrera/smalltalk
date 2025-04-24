// Speech Recognition Service for SmallTalk App
// This service provides an interface to the Web Speech API for speech-to-text functionality

// Define TypeScript interfaces for our speech recognition implementation
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error?: string;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  readonly isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

// Define an interface for the custom SpeechRecognition class that browsers implement differently
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onstart: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

// Define window with SpeechRecognition property
declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

// Callback types for the service
type TranscriptCallback = (transcript: string, isFinal: boolean) => void;
type ErrorCallback = (error: string) => void;
type StatusCallback = (status: 'ready' | 'listening' | 'stopped' | 'not-supported') => void;

/**
 * SpeechRecognitionService class provides a convenient interface to use Web Speech API
 * for speech-to-text functionality in the application
 */
class SpeechRecognitionService {
  private recognition: ISpeechRecognition | null = null;
  private isListening: boolean = false;
  private transcript: string = '';
  private transcriptCallback: TranscriptCallback | null = null;
  private errorCallback: ErrorCallback | null = null;
  private statusCallback: StatusCallback | null = null;
  private supported: boolean = false;

  constructor() {
    this.initSpeechRecognition();
  }

  /**
   * Initialize the speech recognition service and check browser support
   */
  private initSpeechRecognition(): void {
    // Check if browser supports SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || 
                              window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      this.supported = false;
      if (this.statusCallback) {
        this.statusCallback('not-supported');
      }
      console.warn('Speech recognition is not supported in this browser.');
      return;
    }

    this.supported = true;
    console.log('Speech recognition is supported in this browser');

    try {
      this.recognition = new SpeechRecognition();
      console.log('Speech recognition instance created successfully');

      // Configure recognition with careful error handling
      try {
        this.recognition.continuous = true;       // Don't stop after the user stops speaking
        this.recognition.interimResults = true;   // Get interim results as the user speaks
        this.recognition.lang = 'es-ES';          // Default language Spanish (Spain)
        this.recognition.maxAlternatives = 1;     // Number of alternative transcriptions to return
        console.log('Speech recognition configured with language:', this.recognition.lang);
      } catch (configError) {
        console.warn('Error configuring speech recognition properties:', configError);
        // Continue anyway, as some browsers might throw errors on property assignment
      }
      
      // Test if we can access the properties we just set (sanity check)
      try {
        const testLang = this.recognition.lang;
        console.log('Confirmed language setting:', testLang);
      } catch (testError) {
        console.warn('Could not read back configuration properties:', testError);
      }
      
      // Set up event handlers
      this.setupEventListeners();

      if (this.statusCallback) {
        this.statusCallback('ready');
      }
    } catch (error) {
      this.supported = false;
      console.error('Error initializing speech recognition:', error);
      
      if (this.errorCallback) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        this.errorCallback(`Failed to initialize speech recognition: ${errorMsg}`);
      }
    }
  }

  /**
   * Set up event listeners for speech recognition events
   */
  private setupEventListeners(): void {
    if (!this.recognition) return;

    // Handle results as they come in
    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Update the full transcript
      if (finalTranscript) {
        this.transcript += finalTranscript + ' ';
      }

      // Send callback with current transcript
      if (this.transcriptCallback) {
        const currentTranscript = this.transcript + interimTranscript;
        this.transcriptCallback(currentTranscript, event.results[event.results.length - 1].isFinal);
      }
    };

    // Handle starting of speech recognition
    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.statusCallback) {
        this.statusCallback('listening');
      }
    };

    // Handle speech recognition ending
    this.recognition.onend = () => {
      // If we're still supposed to be listening, restart
      if (this.isListening) {
        try {
          this.recognition!.start();
        } catch (error) {
          console.error('Error restarting speech recognition:', error);
          this.isListening = false;
          if (this.statusCallback) {
            this.statusCallback('stopped');
          }
        }
      } else {
        if (this.statusCallback) {
          this.statusCallback('stopped');
        }
      }
    };

    // Handle errors
    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      
      if (this.errorCallback) {
        let errorMessage = 'Speech recognition error';
        
        if (event.error === 'not-allowed') {
          errorMessage = 'Microphone access denied. Please enable microphone permissions.';
        } else if (event.error === 'no-speech') {
          errorMessage = 'No speech was detected. Please try again.';
        } else if (event.error === 'network') {
          errorMessage = 'Network error occurred. Please check your connection.';
        } else if (event.error === 'aborted') {
          errorMessage = 'Speech recognition was aborted. This may be due to a browser issue.';
        } else if (event.error === 'language-not-supported') {
          const fallbackLang = 'es-ES';
          errorMessage = `The selected Spanish dialect is not supported. Automatically switching to Spanish (Spain) as fallback.`;
          console.log('Language not supported, switching to fallback:', fallbackLang);
          
          // Try to switch to Spanish (Spain) if the selected language isn't supported
          try {
            if (this.recognition) {
              this.recognition.lang = fallbackLang;
              // Store the fallback language in localStorage to avoid future errors
              localStorage.setItem('fallbackLanguage', 'true');
              localStorage.setItem('preferredLanguage', fallbackLang);
            }
          } catch (langError) {
            console.error('Error setting fallback language:', langError);
          }
        }
        
        this.errorCallback(errorMessage);
        console.log('Speech recognition error details:', errorMessage);
      }

      // For certain errors, we might want to stop listening
      if (event.error && ['not-allowed', 'audio-capture', 'service-not-allowed', 'language-not-supported'].includes(event.error)) {
        this.stopListening();
      }
    };
  }

  /**
   * Set a callback function to receive transcription updates
   * @param callback Function to call with transcript updates
   */
  public onTranscript(callback: TranscriptCallback): void {
    this.transcriptCallback = callback;
  }

  /**
   * Set a callback function to receive error messages
   * @param callback Function to call with error messages
   */
  public onError(callback: ErrorCallback): void {
    this.errorCallback = callback;
  }

  /**
   * Set a callback function to receive status updates
   * @param callback Function to call with status updates
   */
  public onStatusChange(callback: StatusCallback): void {
    this.statusCallback = callback;
    
    // Immediately report current status
    if (this.statusCallback) {
      if (!this.supported) {
        this.statusCallback('not-supported');
      } else if (this.isListening) {
        this.statusCallback('listening');
      } else {
        this.statusCallback('ready');
      }
    }
  }

  /**
   * Start listening for speech input
   * @returns boolean indicating if successfully started
   */
  public startListening(): boolean {
    console.log('Starting speech recognition service...');
    
    if (!this.supported) {
      console.warn('Speech recognition not supported in this browser');
      if (this.errorCallback) {
        this.errorCallback('Speech recognition is not supported in this browser.');
      }
      return false;
    }

    if (!this.recognition) {
      console.log('Recognition not initialized, initializing now');
      this.initSpeechRecognition();
    }

    if (this.recognition && !this.isListening) {
      try {
        console.log('Starting speech recognition with language:', this.recognition.lang);
        this.transcript = ''; // Reset transcript when starting a new session
        this.recognition.start();
        console.log('Speech recognition started successfully');
        this.isListening = true;
        return true;
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        if (this.errorCallback) {
          const errorMsg = error instanceof Error ? error.message : 'Failed to start speech recognition';
          this.errorCallback(`Failed to start speech recognition: ${errorMsg}`);
        }
        return false;
      }
    } else if (this.isListening) {
      console.warn('Speech recognition is already running');
    }

    return false;
  }

  /**
   * Stop listening for speech input
   */
  public stopListening(): void {
    this.isListening = false;
    
    if (this.recognition) {
      try {
        console.log('Stopping speech recognition service');
        this.recognition.stop();
        console.log('Speech recognition stopped successfully');
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
    
    if (this.statusCallback) {
      this.statusCallback('stopped');
    }
  }

  /**
   * Change the recognition language
   * @param langCode Language code (e.g., 'en-US', 'es-ES', etc.)
   */
  public setLanguage(langCode: string): void {
    if (this.recognition) {
      // Check if we previously had issues with this language
      if (localStorage.getItem('fallbackLanguage') === 'true' && localStorage.getItem('preferredLanguage') !== langCode) {
        console.log('Using language that previously failed, proceeding with caution:', langCode);
      }
      
      // Language must be set while not listening
      const wasListening = this.isListening;
      
      if (wasListening) {
        this.stopListening();
      }
      
      try {
        // Get current language setting
        console.log('Previous language setting:', this.recognition.lang);
        
        // Try to set the new language
        this.recognition.lang = langCode;
        
        // Log success
        console.log('Language changed successfully to:', langCode);
        
        // Clear any previous fallback flags if we successfully set a new language
        if (langCode === 'es-ES' || langCode === 'es-MX') {
          localStorage.removeItem('fallbackLanguage');
        }
      } catch (error) {
        console.error('Failed to set language:', error);
        
        // Notify about the error
        if (this.errorCallback) {
          this.errorCallback(`Failed to set language to ${langCode}. Using previous language setting.`);
        }
      }
      
      if (wasListening) {
        this.startListening();
      }
    }
  }

  /**
   * Check if speech recognition is supported in the current browser
   * @returns boolean indicating if speech recognition is supported
   */
  public isSupported(): boolean {
    return this.supported;
  }

  /**
   * Get the current transcript text
   * @returns Current transcript as a string
   */
  public getTranscript(): string {
    return this.transcript;
  }

  /**
   * Reset the current transcript
   */
  public resetTranscript(): void {
    this.transcript = '';
    
    // Notify about the change
    if (this.transcriptCallback) {
      this.transcriptCallback('', true);
    }
  }
}

// Export a singleton instance to be used throughout the app
export default new SpeechRecognitionService();