// src/pages/feedback-page.tsx
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const FeedbackPage: React.FC = () => {
  const navigate = useNavigate();

  const randomScore = () => Math.floor(Math.random() * 5) + 1;

  const handleSpecificFeedback = (feedback: string) => {
    if (feedback === "Grammar") {
      navigate(`/grammar-feedback`);
    } else {
      navigate(`/specific-feedback/${feedback}`);
    }
  };

  const handleStartPractice = () => {
    navigate('/practice');
  };

  return (
    <div className="flex flex-col space-y-8 pb-32 px-4 min-h-screen">
      
      {/* Header */}
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

      {/* Summary */}
      <div className="flex flex-col gap-4 items-start">
        <h2 className="text-xl font-semibold">Summary</h2>
        <p className="text-sm text-muted-foreground text-left">
          Your conversation demonstrated strong fluency, with accurate use of common medical phrases; however, minor grammar errors were detected in verb conjugation and article usage.
        </p>
      </div>

      {/* Mistakes grid with taller boxes */}
      <div className="flex flex-col gap-4 items-start">
        <h2 className="text-xl font-semibold">Mistakes</h2>
        <div className="grid grid-cols-2 gap-4 w-full">
          <Card
            onClick={() => handleSpecificFeedback("Pronunciation")}
            className="h-36 flex flex-col gap-6"
          >
            <CardHeader>
              <CardTitle>Pronunciation</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <span className="text-4xl font-bold">{randomScore()}</span>
            </CardContent>
          </Card>
          
          <Card
            onClick={() => handleSpecificFeedback("Grammar")}
            className="h-36 flex flex-col gap-6"
          >
            <CardHeader>
              <CardTitle>Grammar</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <span className="text-4xl font-bold">{randomScore()}</span>
            </CardContent>
          </Card>
          
          <Card
            onClick={() => handleSpecificFeedback("Terminology")}
            className="h-36 flex flex-col gap-6"
          >
            <CardHeader>
              <CardTitle>Terminology</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <span className="text-4xl font-bold">{randomScore()}</span>
            </CardContent>
          </Card>
          
          <Card
            onClick={() => handleSpecificFeedback("Fluency")}
            className="h-36 flex flex-col justify-between"
          >
            <CardHeader>
              <CardTitle>Fluency</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <span className="text-4xl font-bold">{randomScore()}</span>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Annotated transcript link */}
      <p className="self-start font-bold underline text-left">
        View Annotated Transcript
      </p>

      {/* Start Practice fixed bottom */}
      <div className="fixed bottom-6 w-11/12 left-1/2 -translate-x-1/2 px-4 z-10">
        <Button
          className="py-10 w-full text-lg font-bold rounded-full bg-primary text-white shadow-md"
          onClick={handleStartPractice}
        >
          Start Practice
        </Button>
      </div>
    </div>
  );
};

export default FeedbackPage;
