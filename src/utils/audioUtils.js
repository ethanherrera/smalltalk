// Audio processing utility functions

/**
 * Converts audio blob to base64 string
 * @param {Blob} blob - The audio blob to convert
 * @returns {Promise<string>} - Base64 encoded audio string
 */
export const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result
        .replace('data:', '')
        .replace(/^.+,/, '');
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Processes audio data through speech recognition
 * @param {Blob} audioBlob - The audio data to process
 * @returns {Promise<string>} - Transcribed text
 */
export const processAudio = async (audioBlob) => {
  // This is a mock function - in a real application, this would connect to a speech recognition API
  // For demonstration purposes, this returns a promise that resolves with mock text
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("This is a simulated transcription of the recorded audio.");
    }, 1000);
  });
};

/**
 * Analyze audio for pronunciation, grammar, terminology, and fluency
 * @param {Blob} audioBlob - The audio data to analyze
 * @param {string} transcript - The transcribed text
 * @returns {Promise<Object>} - Analysis results
 */
export const analyzeAudio = async (audioBlob, transcript) => {
  // This would typically call an AI service for analysis
  // For demonstration, return mock feedback
  return {
    summary: "Your conversation demonstrated strong fluency, with accurate use of common medical phrases; however, minor grammar errors were detected in verb conjugation and article usage.",
    scores: {
      pronunciation: 2,
      grammar: 3,
      terminology: 3,
      fluency: 4
    },
    grammarFeedback: [
      {
        id: 1,
        title: "Verb Conjugation",
        description: "Try using the subjunctive for expressing uncertainty—'Espero que podamos reunirnos' instead of 'Espero que podemos reunirnos'.",
        audioTime: "0:12/0:34"
      },
      {
        id: 2,
        title: "Preposition Usage",
        description: "In Spanish, 'en' is used for locations rather than 'a'. Instead of 'Nos vemos a la oficina', say 'Nos vemos en la oficina'.",
        audioTime: "0:20/0:34"
      }
    ]
  };
};