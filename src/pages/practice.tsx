import { useParams, useNavigate } from 'react-router-dom';
import { PracticeQuestion } from '../components/PracticeQuestion';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';

const sampleQuestions = [
  {
    id: 1,
    colleague: "Your Colleague",
    question: "Estoy interesado en comprar un nuevo monitor de signos vitales para mi clínica, pero no estoy seguro si podemos obtener un descuento. ¿Cómo le responderías en español?",
    answers: [
      {
        text: "Espero que podemos ofrecerle un buen precio para su clínica.",
        isCorrect: false,
        translation: "Hope we can offer you a good price for your clinic."
      },
      {
        text: "Espero que podamos proporcionarle un descuento especial en el monitor de signos vitales.",
        isCorrect: true,
        translation: "Hope we can provide you special discount on vital signs monitor."
      },
      {
        text: "Espero que damos una oferta en su equipo médico.",
        isCorrect: false,
        translation: "Hope we give an offer on your medical equipment."
      }
    ]
  },
  {
    id: 2,
    colleague: "Your Colleague",
    question: "Necesito programar una cita con el doctor para la próxima semana. ¿Cuándo está disponible?",
    answers: [
      {
        text: "El doctor tiene disponibilidad el martes a las 2 de la tarde.",
        isCorrect: true,
        translation: "The doctor has availability on Tuesday at 2 PM."
      },
      {
        text: "El doctor no trabaja la próxima semana.",
        isCorrect: false,
        translation: "The doctor is not working next week."
      },
      {
        text: "Puede venir cuando quiera.",
        isCorrect: false,
        translation: "You can come whenever you want."
      }
    ]
  },
  {
    id: 3,
    colleague: "Your Colleague",
    question: "¿Cuál es el procedimiento para solicitar un reembolso por los servicios médicos?",
    answers: [
      {
        text: "No hacemos reembolsos.",
        isCorrect: false,
        translation: "We don't do refunds."
      },
      {
        text: "Debe esperar un mes para el reembolso.",
        isCorrect: false,
        translation: "You must wait one month for the refund."
      },
      {
        text: "Por favor, complete el formulario de reembolso y adjunte los recibos originales.",
        isCorrect: true,
        translation: "Please complete the refund form and attach the original receipts."
      }
    ]
  },
  {
    id: 4,
    colleague: "Your Colleague",
    question: "¿Tienen servicio de ambulancia disponible las 24 horas?",
    answers: [
      {
        text: "Sí, nuestro servicio de ambulancia está disponible las 24 horas del día, los 7 días de la semana.",
        isCorrect: true,
        translation: "Yes, our ambulance service is available 24 hours a day, 7 days a week."
      },
      {
        text: "Solo durante el día.",
        isCorrect: false,
        translation: "Only during the day."
      },
      {
        text: "Necesita llamar con anticipación.",
        isCorrect: false,
        translation: "You need to call in advance."
      }
    ]
  },
  {
    id: 5,
    colleague: "Your Colleague",
    question: "¿Cuánto tiempo tarda en llegar los resultados de los análisis de sangre?",
    answers: [
      {
        text: "Los resultados están listos inmediatamente.",
        isCorrect: false,
        translation: "The results are ready immediately."
      },
      {
        text: "Los resultados de los análisis de sangre suelen estar disponibles en 48-72 horas.",
        isCorrect: true,
        translation: "Blood test results are usually available within 48-72 hours."
      },
      {
        text: "Toma un mes para procesar.",
        isCorrect: false,
        translation: "It takes a month to process."
      }
    ]
  }
];

export default function Practice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const practiceId = id ? parseInt(id) : undefined;

  const handleNext = () => {
    navigate('/home')
    // if (currentQuestionIndex < sampleQuestions.length - 1) {
    //   setCurrentQuestionIndex(currentQuestionIndex + 1);
    // } else {
    //   // Navigate back to practice list when all questions are completed
    //   navigate('/practice');
    // }
  };

  const BackButton = () => (
    <Button
      variant="ghost"
      size="icon"
      className="absolute left-4 top-4"
      onClick={() => navigate('/home')}
      aria-label="Back"
    >
      <ChevronLeft className="h-6 w-6" />
    </Button>
  );
  
  // If we have an ID, show the specific practice question
  if (practiceId) {
    const question = sampleQuestions.find(q => q.id === practiceId);
    if (!question) {
      return (
        <div className="container mx-auto max-w-3xl py-8 relative">
          <BackButton />
          <div>Practice not found</div>
        </div>
      );
    }
    return (
      <div className="container mx-auto max-w-3xl py-8 relative">
        <BackButton />
        <h1 className="text-2xl font-bold mb-6">Practice {practiceId}</h1>
        <PracticeQuestion
          colleague={question.colleague}
          question={question.question}
          answers={question.answers}
          onAnswerSelected={(isCorrect) => {
            console.log('Answer selected:', isCorrect ? 'Correct!' : 'Incorrect');
          }}
          onNext={handleNext}
        />
      </div>
    );
  }

  // Otherwise show the list of all practices
  return (
    <div className="container mx-auto max-w-3xl py-8 relative">
      <BackButton />
      <h1 className="text-2xl font-bold mb-6">All Practices</h1>
      <div className="space-y-4">
        {sampleQuestions.map((question) => (
          <PracticeQuestion
            key={question.id}
            colleague={question.colleague}
            question={question.question}
            answers={question.answers}
            onAnswerSelected={(isCorrect) => {
              console.log('Answer selected:', isCorrect ? 'Correct!' : 'Incorrect');
            }}
            onNext={handleNext}
          />
        ))}
      </div>
    </div>
  );
} 