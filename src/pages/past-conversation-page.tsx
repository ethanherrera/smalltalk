import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import TranscriptBox from '@/components/record-page/transcript-box';
import { usePastConversations } from '@/contexts/PastConversationsContext';

const PastConversationPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { pastConversations } = usePastConversations();

  // Find the conversation by its index
  const conversation = pastConversations[Number(id)];

  // Convert the transcript string back to Message array format
  const messages = conversation && conversation.transcript ? 
    conversation.transcript.split('\n').map(line => {
      const [speaker, ...textParts] = line.split(': ');
      return {
        speaker,
        text: textParts.join(': ') // Rejoin in case there were colons in the text
      };
    }) : [];

  if (!conversation) {
    return (
      <div className="flex flex-col gap-4 pb-32">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/home')}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">Conversation Not Found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-32">
      <div className="sticky top-0 z-10 bg-background flex items-center gap-2 py-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/home')}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{conversation.title}</h1>
          <p className="text-sm text-muted-foreground">
            {conversation.date} • {conversation.time} minutes • {conversation.concepts} concepts • {conversation.lines} lines
          </p>
        </div>
      </div>

      <TranscriptBox 
        isRecording={false}
        transcript=""
        liveTranscript=""
        liveMessages={messages}
      />
    </div>
  );
};

export default PastConversationPage; 