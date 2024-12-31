import React, { useState } from 'react';
import './App.css'; // Optional styling

// Example dataset of ethical dilemmas
const dilemmas = [
  {
    id: 1,
    question: "Classic Trolley Problem",
    description:
      "A runaway trolley is heading towards five people on the track. If you do nothing, all five will be killed. You have the option to pull a lever that redirects the trolley onto another track, but in doing so, it will kill one person. What do you do?",
    choices: ["Pull the lever", "Do nothing"],
    // Hypothetical LLM answers:
    // These would be retrieved from your database or API in a real application
    llmResponses: {
      GPT3: {
        answer: "Pull the lever, reasoning that it's better to save more lives than fewer.",
        reasoning: "From a utilitarian perspective, saving five lives at the cost of one is preferable."
      },
      GPT4: {
        answer: "Do nothing, because actively causing a death is morally worse than allowing one to occur.",
        reasoning: "It raises complex questions about moral responsibility when directly intervening to kill one."
      },
      Bard: {
        answer: "Pull the lever, focusing on outcomes that maximize overall well-being.",
        reasoning: "The principle of minimizing harm justifies saving the greatest number of people."
      }
    }
  },
  {
    id: 2,
    question: "Fat Man Variant",
    description:
      "A trolley is heading toward five people again. You are on a bridge with a very large individual next to you. Pushing him onto the track would stop the trolley, saving the five, but he would die if you do so. What do you do?",
    choices: ["Push the large individual", "Do nothing"],
    llmResponses: {
      GPT3: {
        answer: "Do nothing, because physically pushing someone to their death is morally unacceptable.",
        reasoning: "It crosses the line from redirecting harm to actively causing it."
      },
      GPT4: {
        answer: "Push the large individual, to save the greatest number of people.",
        reasoning: "If the main goal is minimizing total deaths, it’s justified.",
      },
      Bard: {
        answer: "Do nothing. It's not morally right to use someone as a means to an end.",
        reasoning: "Respect for persons is crucial, and using someone's body as a tool is not ethical."
      }
    }
  },
];

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Tracks whether the LLM responses are revealed for each question
  // Initially, all LLM responses are blurred
  const [revealedAnswers, setRevealedAnswers] = useState(
    Array(dilemmas.length).fill(false)
  );

  const currentDilemma = dilemmas[currentQuestionIndex];

  const handleSubmitAnswer = (choice) => {
    // Record user choice
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = choice;
    setUserAnswers(updatedAnswers);

    // Reveal LLM answers for this question
    const updatedRevealed = [...revealedAnswers];
    updatedRevealed[currentQuestionIndex] = true;
    setRevealedAnswers(updatedRevealed);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < dilemmas.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleSeeResultsNow = () => {
    setShowResults(true);
  };

  // --- Results Calculation ---
  // Example logic: We check how often the user’s choice aligns with each LLM’s answer
  const modelAgreementScores = Object.keys(dilemmas[0].llmResponses).reduce(
    (acc, modelName) => ({ ...acc, [modelName]: 0 }),
    {}
  );

  userAnswers.forEach((userAnswer, idx) => {
    if (!userAnswer) return;
    // For each model, check if it matches the user’s choice
    const llmResponses = dilemmas[idx].llmResponses;
    for (const modelName in llmResponses) {
      if (llmResponses[modelName].answer === userAnswer) {
        modelAgreementScores[modelName] += 1;
      }
    }
  });

  // Find which model has the highest agreement
  const bestMatchModel = Object.keys(modelAgreementScores).reduce((a, b) =>
    modelAgreementScores[a] > modelAgreementScores[b] ? a : b
  );

  // A simple summary for each model's overall stance
  const modelSummaries = {
    GPT3: "GPT-3 often tries to balance moral responsibility and outcomes.",
    GPT4: "GPT-4 looks deeper into potential moral frameworks and alternatives.",
    Bard: "Bard's approach highlights moral principles and well-being."
  };

  return (
    <div className="App">
      <h1>Trolley Problem Website (Prototype)</h1>

      {showResults ? (
        <Results
          userAnswers={userAnswers}
          dilemmas={dilemmas}
          modelAgreementScores={modelAgreementScores}
          bestMatchModel={bestMatchModel}
          modelSummaries={modelSummaries}
        />
      ) : (
        <QuestionSection
          currentDilemma={currentDilemma}
          currentQuestionIndex={currentQuestionIndex}
          userAnswers={userAnswers}
          revealedAnswers={revealedAnswers}
          onSubmitAnswer={handleSubmitAnswer}
          onNextQuestion={handleNextQuestion}
          onSeeResultsNow={handleSeeResultsNow}
          totalQuestions={dilemmas.length}
        />
      )}
    </div>
  );
}

// -- Question Section Component --
function QuestionSection({
  currentDilemma,
  currentQuestionIndex,
  userAnswers,
  revealedAnswers,
  onSubmitAnswer,
  onNextQuestion,
  onSeeResultsNow,
  totalQuestions,
}) {
  return (
    <div className="question-section">
      <h2>
        Question {currentQuestionIndex + 1} of {totalQuestions}
      </h2>
      <h3>{currentDilemma.question}</h3>
      <p>{currentDilemma.description}</p>

      {/* Show choices only if user hasn't answered yet. 
          Once answered, choices are disabled, but still visible.
      */}
      <div className="choices">
        {currentDilemma.choices.map((choice, idx) => {
          const userAnswer = userAnswers[currentQuestionIndex];
          const disabled = userAnswer !== undefined;
          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => onSubmitAnswer(choice)}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {/* LLM responses (blur until user submits an answer) */}
      <div
        className={`llm-responses ${
          revealedAnswers[currentQuestionIndex] ? "unblur" : "blur"
        }`}
      >
        <h4>LLM Answers & Reasoning:</h4>
        {Object.entries(currentDilemma.llmResponses).map(([modelName, data]) => (
          <div key={modelName} className="llm-response">
            <strong>{modelName}:</strong> <em>{data.answer}</em>
            <br />
            <small>Reasoning: {data.reasoning}</small>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="navigation">
        {/* Only show the "Next" or "See results" button if user has answered */}
        {userAnswers[currentQuestionIndex] !== undefined && (
          currentQuestionIndex < totalQuestions - 1 ? (
            <button onClick={onNextQuestion}>Next Question</button>
          ) : (
            <button onClick={onSeeResultsNow}>See results</button>
          )
        )}
      </div>
    </div>
  );
}

// -- Results Component --
function Results({
  userAnswers,
  dilemmas,
  modelAgreementScores,
  bestMatchModel,
  modelSummaries,
}) {
  return (
    <div className="results-section">
      <h2>Your Results</h2>
      <p>
        Below is a summary of your answers, how each LLM answered, and which
        model you aligned with the most.
      </p>

      <ol>
        {dilemmas.map((dilemma, idx) => (
          <li key={dilemma.id}>
            <strong>{dilemma.question}:</strong> <br />
            <em>Your Answer: {userAnswers[idx]}</em> <br />
            {Object.entries(dilemma.llmResponses).map(([modelName, data]) => (
              <div key={modelName}>
                {modelName} chose: <strong>{data.answer}</strong>
              </div>
            ))}
          </li>
        ))}
      </ol>

      <h3>Model Agreement Scores</h3>
      {Object.entries(modelAgreementScores).map(([modelName, score]) => (
        <div key={modelName}>
          {modelName}: {score} matches
        </div>
      ))}

      <h3>Model Summaries</h3>
      {Object.keys(modelSummaries).map((modelName) => (
        <div key={modelName}>
          <strong>{modelName}:</strong> {modelSummaries[modelName]}
        </div>
      ))}

      <h2>You agreed most with: {bestMatchModel}</h2>
    </div>
  );
}

export default App;
