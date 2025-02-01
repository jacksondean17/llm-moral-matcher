import React, { useState, useEffect } from 'react';
import './App.css'; // Optional styling


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

  // Add Landing Page component
  const LandingPage = () => (
    <div className="landing-page">
      <h1>What LLM Shares My Morals?</h1>
      <div className="landing-buttons">
        <button onClick={() => setCurrentPage('quiz')}>Start Quiz</button>
        <button onClick={() => setCurrentPage('about')}>About</button>
      </div>
    </div>
  );

  // Add About Page component
  const AboutPage = () => (
    <div className="about-page">
      <h1>About The Dilemma Lab</h1>
      <p>This quiz explores how different Language Learning Models (LLMs) approach moral dilemmas.
         By comparing your answers with those of various LLMs, we can see which AI model most closely
         aligns with your moral reasoning.</p>
      <button onClick={() => setCurrentPage('landing')}>Back</button>
    </div>
  );

  useEffect(() => {
    const fetchDilemmas = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/data/dilemmas.json`);
        
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
      return <AboutPage />;
    case 'quiz':
      return (
        <div className="App">
          <h1>The Dilemma Lab</h1>
          {showResults ? (
            <Results
              userAnswers={userAnswers}
              dilemmas={dilemmas}
              modelAgreementScores={modelScores}
              bestMatchModel={bestMatch}
              modelSummaries={modelSummaries}
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
      <h3>{currentDilemma.question}</h3>
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
      {modelAgreementScores && Object.entries(modelAgreementScores).map(([modelName, score]) => (
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