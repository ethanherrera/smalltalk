import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const SpecificFeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { feedback } = useParams();
  
  return (
    <div className="flex flex-col gap-4 pb-32 p-10">
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
    </div>
  );
};

export default SpecificFeedbackPage;