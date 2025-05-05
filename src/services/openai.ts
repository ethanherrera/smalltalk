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
          content: 'You are a language assessment specialist. Analyze the learner\'s Spanish language skills in the following conversation. The learner is Person A. Provide specific feedback addressing the learner directly using "you" instead of "Person A". Your analysis should be constructive, educational and personalized. YOU MUST RESPOND ONLY WITH VALID JSON. do not respond with "as this is a written conversation", just look for transcription errors where they may have meant to say another word. For proncunciation for example if they may have meant to say "hola" based on the context, but the transcript is "hoal", then this is a pronunciation error. DO NOT RESPOND WITH "as this is a written conversation", just look for transcription errors where they may have meant to say another word.'
        },
        {
          role: 'user',
          content: `Please analyze the learner's Spanish language skills in this conversation. The learner is Person A. Focus on grammar, pronunciation (based on spelling/transcription errors), terminology, and fluency. 

Please phrase your feedback directly to the learner using "you" instead of "Person A".

Full conversation for context:
${fullConversation}

Provide your analysis in the following JSON format:
{
  "grammar": "detailed analysis of grammatical strengths and errors, using 'you' to address the learner",
  "pronunciation": "analysis of pronunciation based on transcription, using 'you' to address the learner",
  "terminology": "evaluation of vocabulary and terminology usage, using 'you' to address the learner",
  "fluency": "assessment of conversational flow and naturalness, using 'you' to address the learner",
  "overallFeedback": "summary of strengths and areas for improvement, using 'you' to address the learner",
  "score": numeric score from 1-10
}`
        }
      ],
      temperature: 0.2
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
    try {
      const analysisText = response.data.choices[0].message.content;
      console.log(`[OPENAI] Received response: ${analysisText.substring(0, 100)}...`);
      
      // Extract JSON from the response, which might include markdown formatting
      let jsonStr = analysisText;
      if (analysisText.includes('```json')) {
        jsonStr = analysisText.split('```json')[1].split('```')[0].trim();
      } else if (analysisText.includes('```')) {
        jsonStr = analysisText.split('```')[1].split('```')[0].trim();
      }
      
      const analysis = JSON.parse(jsonStr);
      
      return {
        grammar: analysis.grammar || 'No grammar analysis provided',
        pronunciation: analysis.pronunciation || 'No pronunciation analysis provided',
        terminology: analysis.terminology || 'No terminology analysis provided',
        fluency: analysis.fluency || 'No fluency analysis provided',
        overallFeedback: analysis.overallFeedback || 'No overall feedback provided',
        score: analysis.score || 5
      };
    } catch (parseError) {
      console.error(`[OPENAI ERROR] Failed to parse response: ${parseError}`);
      return {
        grammar: 'Error analyzing grammar',
        pronunciation: 'Error analyzing pronunciation',
        terminology: 'Error analyzing terminology',
        fluency: 'Error analyzing fluency',
        overallFeedback: 'There was an error analyzing the conversation',
        score: 0,
        error: `Failed to parse analysis: ${parseError}`
      };
    }
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