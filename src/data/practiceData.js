// Mock practice data for the AI language training platform

export const practiceData = [
  {
    id: 1,
    type: 'multiple-choice',
    prompt: {
      role: "👩‍💻 Your Colleague",
      text: "Estoy interesado en comprar un nuevo monitor de signos vitales para mi clínica, pero no estoy seguro si podemos obtener un descuento. ¿Cómo le responderías en español?"
    },
    options: [
      "Espero que podemos ofrecerle un buen precio para su clínica.",
      "Espero que podamos proporcionarle un descuento especial en el monitor de signos vitales.",
      "Espero que damos una oferta en su equipo médico."
    ],
    correctAnswer: 1,
    translation: "Hope we can provide you special discount on vital signs monitor."
  },
  {
    id: 2,
    type: 'speaking',
    prompt: {
      role: "🧑‍💼 Your Manager",
      text: "Necesitamos programar la reunión para esta semana. ¿Cómo sugerirías que la organicemos en español?"
    },
    instructions: "Suggest a meeting for Friday at 3 PM.\nMake sure to use smooth and natural sentence structure.",
    expectedResponse: "Podemos coordinar la reunión para el viernes a las 3 PM."
  },
  {
    id: 3,
    type: 'multiple-choice',
    prompt: {
      role: "🏥 Patient",
      text: "Me duele el estómago desde hace tres días y tengo fiebre. ¿Qué me recomiendas?"
    },
    options: [
      "Te recomiendo que tomas muchas pastillas ahora.",
      "Te recomiendo que vas al hospital inmediatamente.",
      "Te recomiendo que visites a un médico lo antes posible."
    ],
    correctAnswer: 2,
    translation: "I recommend that you visit a doctor as soon as possible."
  },
  {
    id: 4,
    type: 'speaking',
    prompt: {
      role: "💼 Business Partner",
      text: "Necesitamos firmar el contrato antes del final de este mes. ¿Qué propones?"
    },
    instructions: "Suggest scheduling a meeting next week to review and sign the contract.",
    expectedResponse: "Propongo que nos reunamos la próxima semana para revisar y firmar el contrato."
  }
];