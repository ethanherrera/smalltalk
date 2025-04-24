import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface RecordConversationProps {
  // Keeping the onClick prop but marking it as optional
  onClick?: () => void;
  disabled?: boolean;
}

export function RecordConversation({
  // onClick is still defined but we're not using it in the component
  // We keep it in the props for API compatibility
  disabled = false,
}: RecordConversationProps) {
  const navigate = useNavigate();
  return (
    <div className="fixed bottom-1 w-3/4 left-1/2 -translate-x-1/2 px-4 z-10">
      <Button 
        variant="destructive" 
        onClick={() => {
          navigate('/record');
        }}
        disabled={disabled}
        className="w-full h-20 rounded-full"
      >
        Record Conversation
      </Button>
    </div>
  );
}

export default RecordConversation;