import axios from 'axios';

const WHISPER_API_URL = 'https://api.openai.com/v1/audio/transcriptions';
const WHISPER_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Function to check if the API key is valid
const isValidApiKey = (key: string | undefined): boolean => {
  if (!key) return false;
  if (key === 'your_api_key_here') return false;
  return key.startsWith('sk-') && key.length > 20;
};

export const transcribeAudio = async (audioBlob: Blob, interim: boolean = false): Promise<string> => {
  console.log(`[WHISPER] Transcribing audio: size=${audioBlob.size} bytes, interim=${interim}`);
  
  if (!isValidApiKey(WHISPER_API_KEY)) {
    const errorMsg = `[WHISPER ERROR] Invalid API key: ${WHISPER_API_KEY ? 'Provided but invalid' : 'Not provided'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  
  // Log the first few bytes for debugging
  const arrayBuffer = await audioBlob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const byteString = Array.from(bytes.slice(0, 20)).map(b => b.toString(16).padStart(2, '0')).join(' ');
  console.log(`[WHISPER] Audio blob first 20 bytes: ${byteString}...`);
  
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', 'whisper-1');
  formData.append('response_format', 'text');
  
  // For interim results, we set a lower temperature for quicker responses
  if (interim) {
    formData.append('temperature', '0.0');
  }

  console.log(`[WHISPER] Headers: Authorization Bearer ${WHISPER_API_KEY ? WHISPER_API_KEY.substring(0, 5) + '...' : 'MISSING'}`);
  console.log(`[WHISPER] Request details: model=whisper-1, response_format=text${interim ? ', temperature=0.0' : ''}`);

  try {
    console.log(`[WHISPER] Sending request to Whisper API: ${WHISPER_API_URL}`);
    const startTime = Date.now();
    
    const response = await axios.post(WHISPER_API_URL, formData, {
      headers: {
        'Authorization': `Bearer ${WHISPER_API_KEY}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const endTime = Date.now();
    console.log(`[WHISPER] Response received in ${endTime - startTime}ms with status ${response.status}`);
    
    if (typeof response.data === 'string') {
      console.log(`[WHISPER] Response text: "${response.data.substring(0, 50)}${response.data.length > 50 ? '...' : ''}"`);
    } else {
      console.log(`[WHISPER] Response (non-text): ${JSON.stringify(response.data).substring(0, 100)}`);
    }
    
    return response.data;
  } catch (error: any) {
    console.error(`[WHISPER ERROR] ${error.message}`);
    if (error.response) {
      console.error(`[WHISPER ERROR] Status: ${error.response.status}`);
      console.error(`[WHISPER ERROR] Data: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}; 