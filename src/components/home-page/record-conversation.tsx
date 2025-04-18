import { Button } from "@/components/ui/button";

interface RecordConversationProps {
  onClick?: () => void;
  disabled?: boolean;
}

export function RecordConversation({
  onClick,
  disabled = false,
}: RecordConversationProps) {
  return (
    <div className="fixed bottom-1 w-3/4 left-1/2 -translate-x-1/2 px-4 z-10">
      <Button 
        variant="destructive" 
        onClick={onClick}
        disabled={disabled}
        className="w-full h-20 rounded-full"
      >
        Record Conversation
      </Button>
    </div>
  );
}

export default RecordConversation;
