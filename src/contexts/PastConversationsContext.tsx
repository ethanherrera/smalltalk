import React, { createContext, useContext, ReactNode } from 'react';

interface PastConversationItem {
  title?: string;
  time?: number;
  concepts?: number;
  lines?: number;
  date?: string;
  transcript?: string;
}

interface PastConversationsContextType {
  pastConversations: PastConversationItem[];
  setPastConversations: (conversations: PastConversationItem[]) => void;
}

const PastConversationsContext = createContext<PastConversationsContextType | undefined>(undefined);

export function usePastConversations() {
  const context = useContext(PastConversationsContext);
  if (context === undefined) {
    throw new Error('usePastConversations must be used within a PastConversationsProvider');
  }
  return context;
}

interface PastConversationsProviderProps {
  children: ReactNode;
}

export function PastConversationsProvider({ children }: PastConversationsProviderProps) {
  const [pastConversations, setPastConversations] = React.useState<PastConversationItem[]>([]);

  return (
    <PastConversationsContext.Provider value={{ pastConversations, setPastConversations }}>
      {children}
    </PastConversationsContext.Provider>
  );
} 