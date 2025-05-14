# SmallTalk: Your Personal Language Conversation Coach

![SmallTalk Logo](src/assets/SmallTalk.png)

SmallTalk is a web application designed to help users improve their conversational skills in a new language, currently focused on Spanish. It allows users to record conversations, receive detailed feedback on grammar, pronunciation, terminology, and fluency, and engage in targeted practice exercises.

---

## ✨ Features

*   **🎙️ Conversation Recording:** Record audio conversations directly in the browser.
*   **🗣️ Speaker Diarization:** Transcripts automatically identify different speakers (e.g., "Person A", "You").
*   **📊 AI-Powered Feedback:**
    *   Detailed analysis of grammar, pronunciation (inferred from transcription), terminology, and fluency.
    *   Overall performance score and constructive feedback.
    *   Powered by AssemblyAI for transcription and OpenAI (GPT-4) for language analysis.
*   **📈 Performance Tracking:**
    *   Visualize progress over time for various metrics (Grammar, Vocabulary, Pronunciation, Fluency).
    *   Daily streak, weekly score, and concepts learned.
*   **📝 Daily Practice:** Engage with daily practice prompts and exercises.
*   **🧩 Interactive Exercises:**
    *   Multiple-choice questions.
    *   Speaking practice with recording and feedback.
*   **📚 Past Conversations:** Access and review transcripts of previous recordings.
*   **🌓 Theme Toggling:** Switch between light and dark mode for user preference.
*   **📱 Responsive Design:** UI adapts for a good experience on various screen sizes.

---

## 🚀 Tech Stack

| Category          | Technology / Library                                     |
| :---------------- | :------------------------------------------------------- |
| **Frontend**      | React 19, TypeScript                                     |
| **Build Tool**    | Vite                                                     |
| **Routing**       | React Router DOM                                         |
| **Styling**       | Tailwind CSS, shadcn/ui (New York style)                 |
| **State Mngmt.**  | React Context API (`PastConversationsContext`)             |
| **HTTP Client**   | Axios                                                    |
| **Icons**         | Lucide React                                             |
| **Charting**      | Recharts                                                 |
| **Linting**       | ESLint, TypeScript-ESLint                                |
| **Transcription** | AssemblyAI API                                           |
| **Language Analysis** | OpenAI API (GPT-4)                                   |
| **(Potentially) Live Transcription** | OpenAI API (Whisper - via `whisper.ts`) |

---

## 🏗️ Architecture Overview

SmallTalk is a client-side rendered React application.

1.  **User Interface (UI):** Built with React components, many of which are styled using Tailwind CSS and based on shadcn/ui primitives. Pages are organized under `src/pages` and reusable UI elements under `src/components`.
2.  **Routing:** `react-router-dom` handles navigation between different views like the Home Page, Record Page, Feedback Page, etc.
3.  **State Management:**
    *   Local component state (`useState`, `useRef`, `useEffect`) is used extensively.
    *   Global state for past conversations is managed via `PastConversationsContext`.
4.  **Audio Processing & AI Services:**
    *   **Recording:** The browser's `MediaRecorder` API is used to capture audio.
    *   **Transcription:** The recorded audio blob is sent to the **AssemblyAI API** (`src/services/assemblyai.ts`) for transcription and speaker diarization.
    *   **Language Analysis:** The transcript (specifically "Person A's" speech) is then sent to the **OpenAI API (GPT-4)** (`src/services/openai.ts`) to get detailed feedback on various language aspects.
    *   The `src/services/whisper.ts` file suggests an integration with OpenAI's Whisper model, potentially for quicker, interim transcriptions, though the primary diarization and analysis flow seems to rely on AssemblyAI and then GPT-4.
5.  **Data Persistence (Client-Side):**
    *   `localStorage` is used for theme preference.
    *   `sessionStorage` is used to pass language analysis and conversation data between the Record page and Feedback pages.
    *   Past conversations are stored in React Context, implying they are session-based unless explicitly persisted elsewhere (not evident from the code).
6.  **Feedback & Practice:**
    *   The AI-generated feedback is displayed on dedicated feedback pages.
    *   Practice modules (`src/components/practice-page/*`) provide interactive ways for users to improve based on common areas.

---

## 🛠️ Getting Started

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm (comes with Node.js) or Yarn/pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ethanherrera/smalltalk.git
    cd smalltalk
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    (or `yarn install` or `pnpm install`)

### Environment Variables

The application requires API keys for AssemblyAI and OpenAI.

1.  Create a `.env` file in the root of the project:
    ```bash
    touch .env
    ```

2.  Add your API keys to the `.env` file:
    ```env
    VITE_ASSEMBLY_API_KEY="your_assemblyai_api_key_here"
    VITE_OPENAI_API_KEY="your_openai_api_key_here"
    ```
    *   Replace `"your_assemblyai_api_key_here"` with your actual AssemblyAI API key.
    *   Replace `"your_openai_api_key_here"` with your actual OpenAI API key (used for both GPT-4 analysis and Whisper).

    **Note:** These are client-side environment variables (prefixed with `VITE_`). For a production application, you would typically proxy these API calls through a backend server to protect your keys.

### Running the Development Server

Once dependencies are installed and environment variables are set up:

```bash
npm run dev
```

This will start the Vite development server, typically at `http://localhost:5173`. The application will open in your default web browser.

---

## 🖥️ How to Use the App

1.  **Home Page:**
    *   View your current learning streak, weekly score, and concepts learned.
    *   Access "Daily Practice" modules.
    *   See a summary of "Past Conversations."
    *   Click "Record Conversation" to start a new session.
    *   Toggle light/dark theme using the sun/moon icon.

2.  **Recording a Conversation (`/record`):**
    *   Click the "Start Recording" button (microphone icon).
    *   Grant microphone permissions if prompted.
    *   Speak into your microphone. An audio visualizer will show activity.
    *   The elapsed time of the recording is displayed.
    *   Click the "Stop Recording" button (square icon) when finished.
    *   The app will then transcribe the audio using AssemblyAI and analyze it with OpenAI. This may take a few moments.
    *   The transcript with speaker labels will appear.
    *   Once processing is complete, you can "Try Again" or "Submit" to view feedback.

3.  **Viewing Feedback (`/feedback`):**
    *   After submitting a recording, you'll see a summary of the AI's assessment.
    *   Scores for Pronunciation, Grammar, Terminology, and Fluency are displayed.
    *   Click on any assessment card (e.g., "Grammar") to navigate to a specific feedback page (`/specific-feedback/:category`) with more detailed comments and the relevant conversation context.

4.  **Practice (`/practice`):**
    *   Engage in multiple-choice questions or speaking exercises.
    *   For speaking exercises, record your response.
    *   Receive immediate feedback or explanations.
    *   Navigate through practice questions.
    *   View practice results (`/practice-results`) upon completion.

5.  **Performance Metrics (`/performance`):**
    *   See condensed metric cards for Grammar, Vocabulary, Pronunciation, and Fluency.
    *   Click on a metric card to view a detailed graph page (`/metrics-graph`) showing your progress over different time ranges (1W, 1M, 3M, etc.).

6.  **Past Conversations (`/past-conversation/:id`):**
    *   From the Home page, click on a past conversation card to view its full transcript and details.

---

## 🐛 Debugging

*   **Browser Developer Tools:**
    *   **Console:** Check for JavaScript errors, logs from `console.log()` (many are present in the service files for API interactions).
    *   **Network Tab:** Inspect API requests to AssemblyAI and OpenAI. Check request payloads, headers, and response statuses. This is crucial for debugging API key issues or unexpected responses.
*   **React Developer Tools (Browser Extension):**
    *   Inspect component hierarchy, props, and state.
    *   Profile component rendering performance.
*   **Vite Output:** The terminal running `npm run dev` will show build errors or warnings.
*   **`.env` file:** Double-check that your `.env` file is correctly named, in the project root, and that the API keys are correctly copied and prefixed with `VITE_`.
*   **API Quotas:** Ensure your AssemblyAI and OpenAI accounts have sufficient credits/quota for API usage.

---

## 📂 Project Structure

```
smalltalk/
├── public/               # Static assets
├── src/
│   ├── assets/           # Images, SVGs
│   ├── components/       # Reusable UI components
│   │   ├── home-page/
│   │   ├── performance-page/
│   │   ├── practice-page/
│   │   ├── record-page/
│   │   └── ui/           # shadcn/ui base components (Button, Card, etc.)
│   ├── contexts/         # React Context providers (e.g., PastConversationsContext)
│   ├── lib/              # Utility functions (e.g., cn for Tailwind)
│   ├── pages/            # Top-level page components
│   ├── services/         # API interaction logic (assemblyai.ts, openai.ts, whisper.ts)
│   ├── types/            # TypeScript type definitions
│   ├── App.css           # Minimal global styles
│   ├── App.tsx           # Main app component with routing
│   ├── index.css         # Tailwind CSS setup and custom theme variables
│   └── main.tsx          # Entry point of the application
├── .env.example          # (You should create this) Example environment file
├── .gitignore
├── components.json       # shadcn/ui configuration
├── eslint.config.js      # ESLint configuration
├── index.html            # Main HTML file
├── package.json
├── README.md             # This file
├── tsconfig.json         # TypeScript root configuration
├── tsconfig.app.json     # TypeScript app-specific configuration
├── tsconfig.node.json    # TypeScript Node-specific configuration (for Vite config)
└── vite.config.ts        # Vite configuration
```

---

## 🧑‍💻 Authors

*   Ethan Herrera
*   Sonia Chacon
*   Sharon Zhao
*   Nikolas Caceres
*   Guanyou (Leo) Li

---

Enjoy improving your language skills with SmallTalk!