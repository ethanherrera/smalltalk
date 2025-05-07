import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { LanguageAnalysis } from "@/services/openai";

const FeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<LanguageAnalysis | null>(null);
  
  useEffect(() => {
    // Retrieve language analysis from session storage
    const storedAnalysis = sessionStorage.getItem('languageAnalysis');
    if (storedAnalysis) {
      try {
        const parsedAnalysis = JSON.parse(storedAnalysis);
        setAnalysis(parsedAnalysis);
      } catch (error) {
        console.error('Error parsing language analysis:', error);
      }
    }
  }, []);

  const handleSpecificFeedback = (feedback: string) => {
    navigate(`/specific-feedback/${feedback}`);
  };
  
  return (
    <div className="flex flex-col space-y-8 pb-32 px-4 min-h-screen">
      <div className="sticky top-0 z-10 bg-background flex items-center gap-2 py-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/record')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Feedback</h1>
      </div>
      <div className="flex flex-col gap-4 items-start">
        <h2 className="text-xl font-semibold">Summary</h2>
        <p className="text-sm text-muted-foreground text-left">
          Thank you for your conversation. We've analyzed the audio and provided
          feedback on your performance.
        </p>
        {analysis?.overallFeedback && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Overall Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-left">{analysis.overallFeedback}</p>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="flex flex-col gap-4 items-start">
        <h2 className="text-xl font-semibold">Assessment</h2>
        <div className="grid grid-cols-2 gap-4 w-full">
          <Card onClick={() => handleSpecificFeedback("Pronunciation")}>
            <CardHeader>
              <CardTitle>Pronunciation</CardTitle>
            </CardHeader>
            <CardContent>
              {analysis ? (
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold">{analysis.scores.pronunciation}</span>
                  <span className="text-sm text-muted-foreground">(out of 10)</span>
                </div>
              ) : (
                <span className="text-4xl font-bold">-</span>
              )}
            </CardContent>
          </Card>
          
          <Card onClick={() => handleSpecificFeedback("Grammar")}>
            <CardHeader>
              <CardTitle>Grammar</CardTitle>
            </CardHeader>
            <CardContent>
              {analysis ? (
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold">{analysis.scores.grammar}</span>
                  <span className="text-sm text-muted-foreground">(out of 10)</span>
                </div>
              ) : (
                <span className="text-4xl font-bold">-</span>
              )}
            </CardContent>
          </Card>
          
          <Card onClick={() => handleSpecificFeedback("Terminology")}>
            <CardHeader>
              <CardTitle>Terminology</CardTitle>
            </CardHeader>
            <CardContent>
              {analysis ? (
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold">{analysis.scores.terminology}</span>
                  <span className="text-sm text-muted-foreground">(out of 10)</span>
                </div>
              ) : (
                <span className="text-4xl font-bold">-</span>
              )}
            </CardContent>
          </Card>
          
          <Card onClick={() => handleSpecificFeedback("Fluency")}>
            <CardHeader>
              <CardTitle>Fluency</CardTitle>
            </CardHeader>
            <CardContent>
              {analysis ? (
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold">{analysis.scores.fluency}</span>
                  <span className="text-sm text-muted-foreground">(out of 10)</span>
                </div>
              ) : (
                <span className="text-4xl font-bold">-</span>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;