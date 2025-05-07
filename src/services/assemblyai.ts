import axios from 'axios';
import { analyzeLanguageSkills, LanguageAnalysis } from './openai';

const ASSEMBLYAI_API_URL = 'https://api.assemblyai.com/v2';
const ASSEMBLYAI_API_KEY = import.meta.env.VITE_ASSEMBLY_API_KEY;

interface Speaker {
  speaker: string;
  text: string;
}

interface TranscriptionResult {
  text: string;
  utterances?: Speaker[];
  error?: string;
  languageAnalysis?: LanguageAnalysis;
}

// Function to check if the API key is valid
const isValidApiKey = (key: string | undefined): boolean => {
  if (!key) return false;
  if (key === 'your_api_key_here') return false;
  return key.length > 10;
};

// Upload audio file to AssemblyAI
const uploadAudio = async (audioBlob: Blob): Promise<string> => {
  console.log(`[ASSEMBLYAI] Uploading audio: size=${audioBlob.size} bytes`);
  
  try {
    const response = await axios.post(`${ASSEMBLYAI_API_URL}/upload`, audioBlob, {
      headers: {
        'authorization': ASSEMBLYAI_API_KEY,
        'Content-Type': 'application/octet-stream',
      },
    });
    
    console.log(`[ASSEMBLYAI] Upload successful: ${response.data.upload_url}`);
    return response.data.upload_url;
  } catch (error: any) {
    console.error(`[ASSEMBLYAI] Upload error: ${error.message}`);
    throw new Error(`Failed to upload audio: ${error.message}`);
  }
};

// Submit transcription job with speaker diarization
const submitTranscriptionJob = async (audioUrl: string): Promise<string> => {
  try {
    const response = await axios.post(`${ASSEMBLYAI_API_URL}/transcript`, {
      audio_url: audioUrl,
      language_code: 'es', // Spanish language
      speaker_labels: true, // Enable speaker diarization
      speech_model: 'universal' // Use Slam-1 model for better performance
    }, {
      headers: {
        'authorization': ASSEMBLYAI_API_KEY,
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`[ASSEMBLYAI] Transcription job submitted: ${response.data.id}`);
    return response.data.id;
  } catch (error: any) {
    console.error(`[ASSEMBLYAI] Submit job error: ${error.message}`);
    throw new Error(`Failed to submit transcription job: ${error.message}`);
  }
};

// Check transcription status and get results
const checkTranscriptionStatus = async (transcriptId: string): Promise<TranscriptionResult> => {
  try {
    const response = await axios.get(`${ASSEMBLYAI_API_URL}/transcript/${transcriptId}`, {
      headers: {
        'authorization': ASSEMBLYAI_API_KEY,
      },
    });
    
    return {
      text: response.data.text,
      utterances: processUtterances(response.data.utterances || []),
    };
  } catch (error: any) {
    console.error(`[ASSEMBLYAI] Status check error: ${error.message}`);
    throw new Error(`Failed to check transcription status: ${error.message}`);
  }
};

// Process utterances to format them correctly for our UI
const processUtterances = (utterances: any[]): Speaker[] => {
  return utterances.map((utterance, index) => {
    // AssemblyAI provides speaker labels as "A", "B", etc.
    // We'll format them as "Person A", "Person B"
    return {
      speaker: `Person ${utterance.speaker}`,
      text: utterance.text
    };
  });
};

// Wait for transcription to complete
const waitForTranscription = async (transcriptId: string): Promise<TranscriptionResult> => {
  let result: TranscriptionResult;
  
  while (true) {
    try {
      const response = await axios.get(`${ASSEMBLYAI_API_URL}/transcript/${transcriptId}`, {
        headers: {
          'authorization': ASSEMBLYAI_API_KEY,
        },
      });
      
      const status = response.data.status;
      console.log(`[ASSEMBLYAI] Transcription status: ${status}`);
      
      if (status === 'completed') {
        result = {
          text: response.data.text,
          utterances: processUtterances(response.data.utterances || []),
        };
        break;
      } else if (status === 'error') {
        throw new Error(`Transcription failed: ${response.data.error}`);
      }
      
      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error: any) {
      console.error(`[ASSEMBLYAI] Waiting error: ${error.message}`);
      throw new Error(`Error while waiting for transcription: ${error.message}`);
    }
  }
  
  return result;
};

// Main function to transcribe audio with speaker diarization
export const transcribeAudioWithDiarization = async (audioBlob: Blob): Promise<TranscriptionResult> => {
  console.log(`[ASSEMBLYAI] Starting transcription with diarization`);
  
  if (!isValidApiKey(ASSEMBLYAI_API_KEY)) {
    const errorMsg = `[ASSEMBLYAI ERROR] Invalid API key: ${ASSEMBLYAI_API_KEY ? 'Provided but invalid' : 'Not provided'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  
  try {
    // 1. Upload the audio file
    const audioUrl = await uploadAudio(audioBlob);
    
    // 2. Submit a transcription job with speaker diarization
    const transcriptId = await submitTranscriptionJob(audioUrl);
    
    // 3. Wait for the transcription to complete
    const result = await waitForTranscription(transcriptId);
    
    console.log(`[ASSEMBLYAI] Transcription completed successfully`);
    return result;
  } catch (error: any) {
    console.error(`[ASSEMBLYAI ERROR] ${error.message}`);
    return {
      text: "",
      error: error.message
    };
  }
};

// Function to transcribe and then analyze language skills
export const transcribeAndAnalyzeLanguage = async (audioBlob: Blob): Promise<TranscriptionResult> => {
  console.log(`[ASSEMBLYAI] Starting transcription with diarization and language analysis`);
  
  try {
    // First get the transcription
    const transcriptionResult = await transcribeAudioWithDiarization(audioBlob);
    
    // Check if transcription was successful and has utterances
    if (transcriptionResult.error || !transcriptionResult.utterances || transcriptionResult.utterances.length === 0) {
      console.error(`[ASSEMBLYAI] Cannot perform language analysis: ${transcriptionResult.error || 'No utterances found'}`);
      return transcriptionResult;
    }
    
    // Perform language analysis on the transcription
    console.log(`[ASSEMBLYAI] Starting language analysis for Person A`);
    const languageAnalysis = await analyzeLanguageSkills(transcriptionResult.utterances);
    
    // Return combined result
    return {
      ...transcriptionResult,
      languageAnalysis
    };
  } catch (error: any) {
    console.error(`[ASSEMBLYAI ERROR] ${error.message}`);
    return {
      text: "",
      error: error.message
    };
  }
}; 