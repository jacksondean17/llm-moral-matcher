import React, { useState, useEffect } from 'react';
import './App.css';
import { ExternalLink, Github } from 'lucide-react';
import AboutPage from './AboutPage';

// Add Title component at the top level
const Title = () => (
  <h1>Which LLM Shares My Morals?</h1>
);

function App() {
  const [dilemmas, setDilemmas] = useState([]);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState([]);
  const [modelScores, setModelScores] = useState(null);
  const [bestMatch, setBestMatch] = useState(null);
  const [currentPage, setCurrentPage] = useState('landing'); // Add this state

  // Modify LandingPage to remove duplicate title
  const LandingPage = () => (
    <div className="landing-page">
      <Title />
      <p className="summary">
        Take this quiz to discover which AI language model's moral decision-making most closely aligns with your own.
      </p>
      <div className="landing-buttons">
        <button onClick={() => setCurrentPage('quiz')}>Start Quiz</button>
        <button onClick={() => setCurrentPage('about')}>About</button>
      </div>
    </div>
  );

  useEffect(() => {
    const fetchDilemmas = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/data/new_dilemmas.json`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          throw new Error('Failed to parse JSON response');
        }

        if (!data || !data.dilemmas) {
          throw new Error('Invalid data format');
        }

        setDilemmas(data.dilemmas);
        setRevealedAnswers(Array(data.dilemmas.length).fill(false));
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
      }
    };

    fetchDilemmas();
  }, []);

  const calculateModelScores = () => {
    const scores = Object.keys(dilemmas[0].llmResponses).reduce(
      (acc, modelName) => ({ ...acc, [modelName]: 0 }),
      {}
    );

    userAnswers.forEach((userAnswer, idx) => {
      if (!userAnswer) return;

      const llmResponses = dilemmas[idx].llmResponses;
      for (const modelName in llmResponses) {
        // Extract just 'a' or 'b' from the answers
        const llmAnswer = llmResponses[modelName].answer.toLowerCase().trim()[0];
        const normalizedUserAnswer = userAnswer.toLowerCase().trim()[0];

        if (llmAnswer === normalizedUserAnswer && (llmAnswer === 'a' || llmAnswer === 'b')) {
          scores[modelName] += 1;
        }
      }

      if (!dilemmas.length) {
        return <div>Loading...</div>;
      }

      if (!dilemmas.length) {
        return <div>Loading...</div>;
      }
    });

    const bestMatchModel = Object.keys(scores).reduce((a, b) =>
      scores[a] > scores[b] ? a : b
    );

    setModelScores(scores);
    setBestMatch(bestMatchModel);
  };

  const handleSubmitAnswer = (choice) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = choice;
    setUserAnswers(updatedAnswers);

    const updatedRevealed = [...revealedAnswers];
    updatedRevealed[currentQuestionIndex] = true;
    setRevealedAnswers(updatedRevealed);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < dilemmas.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateModelScores();
      setShowResults(true);
    }
  };

  const handleSeeResultsNow = () => {
    calculateModelScores();
    setShowResults(true);
  };

  const modelSummaries = {
    "gemini": "Gemini often emphasizes practical and balanced solutions.",
    "gpt-3.5-turbo": "GPT-3.5 tends to focus on conventional ethical frameworks.",
    "gpt-4": "GPT-4 frequently considers multiple ethical perspectives.",
    "sonnet-3.5": "Claude often weighs both principles and consequences."
  };

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Dilemmas</h2>
        <p>{error}</p>
        <pre>Check the console for more details</pre>
      </div>
    );
  }

  // Show different pages based on currentPage state
  switch (currentPage) {
    case 'landing':
      return <LandingPage />;
    case 'about':
      return <AboutPage setCurrentPage={setCurrentPage} />;
    case 'quiz':
      return (
        <div className="App">
          <Title />
          {showResults ? (
            <Results
              userAnswers={userAnswers}
              dilemmas={dilemmas}
              modelAgreementScores={modelScores}
              bestMatchModel={bestMatch}
              modelSummaries={modelSummaries}
              setCurrentPage={setCurrentPage}
              setShowResults={setShowResults}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
              setUserAnswers={setUserAnswers}
              setRevealedAnswers={setRevealedAnswers}
            />
          ) : (
            dilemmas.length > 0 && (
              <QuestionSection
                currentDilemma={dilemmas[currentQuestionIndex]}
                currentQuestionIndex={currentQuestionIndex}
                userAnswers={userAnswers}
                revealedAnswers={revealedAnswers}
                onSubmitAnswer={handleSubmitAnswer}
                onNextQuestion={handleNextQuestion}
                onSeeResultsNow={handleSeeResultsNow}
                totalQuestions={dilemmas.length}
              />
            )
          )}
        </div>
      );
    default:
      return <LandingPage />;
  }
}

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
      <p>{currentDilemma.description}</p>

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

      <div
        className={`llm-responses ${revealedAnswers[currentQuestionIndex] ? "unblur" : "blur"
          }`}
      >
        <h4>LLM Answers:</h4>
        {Object.entries(currentDilemma.llmResponses).map(([modelName, data]) => (
          <div key={modelName} className="llm-response">
            <strong>{modelName}:</strong> <em>{data.answer}</em>
          </div>
        ))}
      </div>

      <div className="navigation">
        {userAnswers[currentQuestionIndex] !== undefined && (
          currentQuestionIndex < totalQuestions - 1 ? (
            <>
              <button onClick={onNextQuestion}>Next Question</button>
              <button onClick={onSeeResultsNow}>Skip to Results</button>
            </>
          ) : (
            <button onClick={onSeeResultsNow}>See results</button>
          )
        )}
      </div>
    </div>
  );
}

function Results({
  userAnswers,
  dilemmas,
  modelAgreementScores,
  bestMatchModel,
  modelSummaries,
  setCurrentPage,
  setShowResults,
  setCurrentQuestionIndex,
  setUserAnswers,
  setRevealedAnswers,
}) {
  return (
    <div className="results-section">
      <h2>Your Results</h2>
      <p>
        Below is a summary of your answers, how each LLM answered, and which
        model you aligned with the most.
      </p>
      <div style={{ margin: "2rem 0" }}>
        <h3>Model Agreement Scores</h3>
        {modelAgreementScores && Object.entries(modelAgreementScores).map(([modelName, score]) => (
          <div key={modelName} style={{ margin: "0.5rem 0" }}>
            {modelName}: {score} matches
          </div>
        ))}
      </div>

      <h2>You agreed most with: {bestMatchModel}</h2>

      <div className="results-buttons" style={{ marginTop: "2rem" }}>
        <button onClick={() => {
          setCurrentPage('landing');
          setShowResults(false);
          setCurrentQuestionIndex(0);
          setUserAnswers([]);
          setRevealedAnswers(Array(dilemmas.length).fill(false));
        }}>Start Over</button>
        <button onClick={() => setCurrentPage('about')}>About</button>
      </div>

      <ol className="dilemma-list">
        {dilemmas.map((dilemma, idx) => (
          <li key={dilemma.id} style={{ marginBottom: "2rem" }}>
            {dilemma.description}<br /> <br />
            {dilemma.choices[0]} <br />
            {dilemma.choices[1]}
            <br /> <br />
            <em><strong>Your Answer: {userAnswers[idx]}</strong></em> <br /><br />
            {Object.entries(dilemma.llmResponses).map(([modelName, data]) => (
              <div key={modelName} style={{ margin: "0.5rem 0" }}>
                {modelName} chose: <strong>{data.answer}</strong>
              </div>
            ))}
          </li>
        ))}
      </ol>

    </div>
  );
}

export default App;