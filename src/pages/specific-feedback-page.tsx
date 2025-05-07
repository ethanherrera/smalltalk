import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { LanguageAnalysis } from "@/services/openai";
import { Card, CardContent } from "@/components/ui/card";

interface Message {
  speaker: string;
  text: string;
}

const SpecificFeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { feedback } = useParams<{ feedback: string }>();
  const [analysis, setAnalysis] = useState<LanguageAnalysis | null>(null);
  const [conversation, setConversation] = useState<Message[]>([]);
  
  useEffect(() => {
    // Retrieve language analysis from session storage
    const storedAnalysis = sessionStorage.getItem('languageAnalysis');
    const storedConversation = sessionStorage.getItem('conversation');
    
    if (storedAnalysis) {
      try {
        const parsedAnalysis = JSON.parse(storedAnalysis);
        setAnalysis(parsedAnalysis);
      } catch (error) {
        console.error('Error parsing language analysis:', error);
      }
    }
    
    if (storedConversation) {
      try {
        const parsedConversation = JSON.parse(storedConversation);
        setConversation(parsedConversation);
      } catch (error) {
        console.error('Error parsing conversation:', error);
      }
    }
  }, []);
  
  const getFeedbackContent = () => {
    if (!analysis) return "Analysis not available";
    
    switch (feedback) {
      case "Grammar":
        return analysis.grammar;
      case "Pronunciation":
        return analysis.pronunciation;
      case "Terminology":
        return analysis.terminology;
      case "Fluency":
        return analysis.fluency;
      default:
        return "No specific feedback available for this category";
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen px-4">
      <div className="sticky top-0 z-10 bg-background flex items-center gap-2 py-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/feedback')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{feedback} Feedback</h1>
      </div>
      
      <div className="flex flex-col gap-4">
        <Card className="w-full">
          <CardContent className="text-left">
            <p className="text-sm whitespace-pre-line">{getFeedbackContent()}</p>
          </CardContent>
        </Card>
        
        <h2 className="text-xl font-semibold mt-4">Conversation</h2>
        <Card className="w-full">
          <CardContent className="text-left">
            <div className="flex flex-col gap-4">
              {conversation.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    message.speaker === "Person A" 
                      ? "bg-purple-200 ml-auto max-w-[80%] border border-purple-300" 
                      : "bg-gray-200 mr-auto max-w-[80%] border border-gray-300"
                  }`}
                >
                  <div className="font-semibold text-xs text-gray-700">
                    {message.speaker === "Person A" ? "You" : message.speaker}
                  </div>
                  <div className="text-sm mt-1 text-gray-900">{message.text}</div>
                </div>
              ))}
              {conversation.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No conversation data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpecificFeedbackPage;