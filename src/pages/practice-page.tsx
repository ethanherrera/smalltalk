import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MultipleChoiceQuestion from '@/components/practice-page/multiple-choice-question';
import SpeakingPractice from '@/components/practice-page/speaking-practice';
import type { PracticeQuestionData } from '@/types/practice';

// Sample practice data - in a real app this would come from an API
const practiceData: PracticeQuestionData[] = [
  {
    type: "multipleChoice",
    question: "👩‍💻 Your Colleague: Estoy interesado en comprar un nuevo monitor de signos vitales para mi clínica, pero no estoy seguro si podemos obtener un descuento. ¿Cómo le responderías en español?",
    prompt: "Which response is correct?",
    options: [
      { id: "A", text: "Espero que podemos ofrecerle un buen precio para su clínica." },
      { id: "B", text: "Espero que podamos proporcionarle un descuento especial en el monitor de signos vitales.", correct: true },
      { id: "C", text: "Espero que damos una oferta en su equipo médico." },
    ],
    explanation: "Translation: Hope we can provide you special discount on vital signs monitor."
  },
  {
    type: "speaking",
    question: "🧑‍💼 Your Manager: Necesitamos programar la reunión para esta semana. ¿Cómo sugerirías que la organicemos en español?",
    prompt: "Record your response below:",
    instruction: "Suggest a meeting for Friday at 3 PM.\nMake sure to use smooth and natural sentence structure.",
    correctResponse: "Podemos coordinar la reunión para el viernes a las 3 PM.",
    feedback: ["✔️ Word Order", "✔️ Grammar Accuracy", "✔️ Pronunciation"]
  },
  {
    type: "multipleChoice",
    question: "👨‍⚕️ Your Patient: Me duele mucho la cabeza desde ayer y los medicamentos no me están ayudando. ¿Qué debería hacer?",
    prompt: "Which response is correct?",
    options: [
      { id: "A", text: "Debería visitar la sala de emergencias si el dolor es muy severo.", correct: true },
      { id: "B", text: "Deberías tomar más pastillas para el dolor." },
      { id: "C", text: "Debería esperando hasta mañana para ver si mejora." },
    ],
    explanation: "Translation: You should visit the emergency room if the pain is severe."
  }
];

const PracticePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>(Array(practiceData.length).fill(false));
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(practiceData.length).fill(''));

  const currentQuestion = practiceData[currentQuestionIndex];
  
  const handleNext = () => {
    if (currentQuestionIndex < practiceData.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setShowAnswer(false);
    } else {
      navigate('/practice-results', { 
        state: { 
          score: correctAnswers,
          total: practiceData.length
        }
      });
    }
  };

  const handleAnswerSelected = (isCorrect: boolean, answer?: string) => {
    setShowAnswer(true);
    const newCompleted = [...completed];
    newCompleted[currentQuestionIndex] = true;
    setCompleted(newCompleted);
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }

    if (answer) {
      const newAnswers = [...userAnswers];
      newAnswers[currentQuestionIndex] = answer;
      setUserAnswers(newAnswers);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-10 bg-background flex items-center justify-between py-2 px-10">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/home')}
            className="bg-black text-white hover:bg-gray-800 border border-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Practice</h1>
        </div>
        <Button
          variant="outline"
          className="text-sm bg-black text-white border-gray-700 hover:bg-gray-800"
          onClick={() => navigate('/feedback')}
        >
          View Feedback
        </Button>
      </div>
      
      {/* Progress indicator */}
      <div className="flex justify-between items-center px-10 py-4">
        <div className="text-lg font-semibold">
          {currentQuestionIndex + 1}/{practiceData.length}
        </div>
        <div className="flex gap-2">
          {practiceData.map((_, index) => (
            <div 
              key={index} 
              className={`h-2.5 w-2.5 rounded-full ${
                index < currentQuestionIndex 
                  ? 'bg-gray-700' 
                  : index === currentQuestionIndex 
                  ? 'bg-gray-500' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-1.5 w-full bg-black">
        <div 
          className="absolute h-full bg-gray-700 transition-all duration-300 ease-in-out"
          style={{ 
            width: `${((currentQuestionIndex / practiceData.length) * 100)}%`, 
            borderTopRightRadius: '5px', 
            borderBottomRightRadius: '5px' 
          }}
        />
      </div>

      <div className="flex-1 px-10 py-8">
        {currentQuestion.type === "multipleChoice" && (
          <MultipleChoiceQuestion 
            question={currentQuestion}
            onAnswerSelected={handleAnswerSelected}
            showAnswer={showAnswer}
            onNext={handleNext}
          />
        )}

        {currentQuestion.type === "speaking" && (
          <SpeakingPractice 
            question={currentQuestion}
            onComplete={handleAnswerSelected}
            showFeedback={showAnswer}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  );
};

export default PracticePage;