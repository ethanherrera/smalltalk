import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const FeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Generate random scores between 1-5
  const randomScore = () => Math.floor(Math.random() * 5) + 1;

  const handleSpecificFeedback = (feedback: string) => {
    navigate(`/specific-feedback/${feedback}`);
  };
  
  return (
    <div className="flex flex-col gap-4 pb-32 p-10">
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
      </div>
      <div className="flex flex-col gap-4 items-start">
        <h2 className="text-xl font-semibold">Mistakes</h2>
        <div className="grid grid-cols-2 gap-4 w-full">
          <Card onClick={() => handleSpecificFeedback("Pronunciation")}>
            <CardHeader>
              <CardTitle>Pronunciation</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-4xl font-bold">{randomScore()}</span>
            </CardContent>
          </Card>
          
          <Card onClick={() => handleSpecificFeedback("Grammar")}>
            <CardHeader>
              <CardTitle>Grammar</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-4xl font-bold">{randomScore()}</span>
            </CardContent>
          </Card>
          
          <Card onClick={() => handleSpecificFeedback("Terminology")}>
            <CardHeader>
              <CardTitle>Terminology</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-4xl font-bold">{randomScore()}</span>
            </CardContent>
          </Card>
          
          <Card onClick={() => handleSpecificFeedback("Fluency")}>
            <CardHeader>
              <CardTitle>Fluency</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-4xl font-bold">{randomScore()}</span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;