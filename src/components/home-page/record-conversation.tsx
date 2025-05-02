import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function RecordConversation({ onClick, disabled = false }) {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 w-11/12 left-1/2 -translate-x-1/2 px-4 z-10">
      <Button
        onClick={() => navigate("/record")}
        disabled={disabled}
        className="w-full h-20 rounded-full shadow-lg text-lg"
      >
        Record Conversation
      </Button>
    </div>
  );
}

export default RecordConversation;
