import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Types for language analysis
export interface LanguageAnalysis {
  grammar: string;
  pronunciation: string;
  terminology: string;
  fluency: string;
  overallFeedback: string;
  score: number; // 1-10 scale
  error?: string;
}

// Function to check if the API key is valid
const isValidApiKey = (key: string | undefined): boolean => {
  if (!key) return false;
  if (key === 'your_api_key_here') return false;
  return key.startsWith('sk-') && key.length > 20;
};

// Extract Person A's speech from conversation
const extractPersonASpeech = (utterances: { speaker: string; text: string }[]): string[] => {
  return utterances
    .filter(utterance => utterance.speaker === 'Person A')
    .map(utterance => utterance.text);
};

// Format conversation for context
const formatConversation = (utterances: { speaker: string; text: string }[]): string => {
  return utterances
    .map(utterance => `${utterance.speaker}: ${utterance.text}`)
    .join('\n\n');
};

// Analyze language skills using OpenAI
export const analyzeLanguageSkills = async (
  utterances: { speaker: string; text: string }[]
): Promise<LanguageAnalysis> => {
  console.log('[OPENAI] Starting language skills analysis');
  
  if (!isValidApiKey(OPENAI_API_KEY)) {
    const errorMsg = `[OPENAI ERROR] Invalid API key: ${OPENAI_API_KEY ? 'Provided but invalid' : 'Not provided'}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  
  if (!utterances || utterances.length === 0) {
    return {
      grammar: 'No data to analyze',
      pronunciation: 'No data to analyze',
      terminology: 'No data to analyze',
      fluency: 'No data to analyze',
      overallFeedback: 'No conversation data was provided',
      score: 0,
      error: 'No conversation data was provided'
    };
  }
  
  try {
    const personASpeech = extractPersonASpeech(utterances);
    
    if (personASpeech.length === 0) {
      return {
        grammar: 'No data to analyze',
        pronunciation: 'No data to analyze',
        terminology: 'No data to analyze',
        fluency: 'No data to analyze',
        overallFeedback: 'No speech from Person A was found in the conversation',
        score: 0,
        error: 'No speech from Person A was found'
      };
    }
    
    // Prepare the full conversation for context
    const fullConversation = formatConversation(utterances);
    
    const prompt = {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a language assessment specialist. Analyze Person A\'s Spanish language skills in the following conversation. Assume the learner is Person A. Provide specific feedback about grammar, pronunciation indications, terminology usage, and fluency. Your analysis should be constructive and educational.'
        },
        {
          role: 'user',
          content: `Please analyze Person A's Spanish language skills in this conversation. Focus on grammar, pronunciation (based on spelling/transcription errors), terminology, and fluency. 

Full conversation for context:
${fullConversation}

Provide your analysis in the following JSON format:
{
  "grammar": "detailed analysis of grammatical strengths and errors",
  "pronunciation": "analysis of pronunciation based on transcription",
  "terminology": "evaluation of vocabulary and terminology usage",
  "fluency": "assessment of conversational flow and naturalness",
  "overallFeedback": "summary of strengths and areas for improvement",
  "score": numeric score from 1-10
}`
        }
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' }
    };

    console.log(`[OPENAI] Sending request to analyze language skills`);
    const startTime = Date.now();
    
    const response = await axios.post(OPENAI_API_URL, prompt, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    const endTime = Date.now();
    console.log(`[OPENAI] Response received in ${endTime - startTime}ms with status ${response.status}`);
    
    // Parse the JSON response
    const analysis = JSON.parse(response.data.choices[0].message.content);
    
    return {
      grammar: analysis.grammar,
      pronunciation: analysis.pronunciation,
      terminology: analysis.terminology,
      fluency: analysis.fluency,
      overallFeedback: analysis.overallFeedback,
      score: analysis.score
    };
  } catch (error: any) {
    console.error(`[OPENAI ERROR] ${error.message}`);
    if (error.response) {
      console.error(`[OPENAI ERROR] Status: ${error.response.status}`);
      console.error(`[OPENAI ERROR] Data: ${JSON.stringify(error.response.data)}`);
    }
    
    return {
      grammar: '',
      pronunciation: '',
      terminology: '',
      fluency: '',
      overallFeedback: '',
      score: 0,
      error: error.message
    };
  }
}; 