import React, { useState, useEffect } from 'react';
import './App.css';
import { ExternalLink, Github } from 'lucide-react';

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
      <div className="landing-buttons">
        <button onClick={() => setCurrentPage('quiz')}>Start Quiz</button>
        <button onClick={() => setCurrentPage('about')}>About</button>
      </div>
    </div>
  );

  // Modify AboutPage to remove duplicate title
  const AboutPage = () => (
    <div className="about-page">
      <Title />
      <div className="article-container">
        <article className="prose">
          <h1>Do AI Models Share Your Morals? The Challenge of AI Moral Alignment</h1>

          <section>
            <h2>Introduction</h2>
            <p>
              As AI systems become more integrated into our daily lives, understanding their moral decision-making becomes increasingly crucial. I set out to explore how different AI models approach moral dilemmas, and if any of them were particularly aligned with my own values.
            </p>
          </section>

          <section>
            <h2>The Challenge of Moral Alignment</h2>
            <p>
              One of the fundamental challenges in AI development is determining whose morals the AI should follow. Nick Bostrom, in his book Superintelligence, suggests several approaches. We could have AI adopt the "averaged" moral stance of humanity, or perhaps program it with "true" morals (assuming we could determine them). Some even suggest letting AI develop its own moral framework, arguing that everyone thinks their own moral model is correct anyway - so why not let the AI do the same?
            </p>
            <p>
              The reality with current Large Language Models (LLMs) is quite different. Their moral stances typically reflect an aggregation of internet-based training data, filtered through the specific preferences of their parent companies via RLHF (Reinforcement Learning from Human Feedback). This raises interesting questions about whose values are really being encoded into these systems.
            </p>
          </section>

          <section>
            <h2>The Evolution of My Approach</h2>
            <p>
              I initially experimented with several different datasets, including an adaptation of the{' '}
              <a href="https://en.wikipedia.org/wiki/Moral_foundations_theory#Moral_Foundations_Questionnaire"
                className="external-link">
                Moral Foundations Questionnaire (MFQ)
                <ExternalLink className="icon" />
              </a>
              {' '}and attempted to replicate earlier studies using models like Llama2-70b. However, the abstract questions in the MFQ, directly comparing different moral axes like fairness versus sanctity, proved difficult for AIs (and myself!) to evaluate meaningfully.
            </p>
            <p>
              This led me to focus on the more concrete scenarios introduced by the MoralChoice paper (
              <a href="http://arxiv.org/abs/2307.14324"
                className="external-link">
                arxiv.org/abs/2307.14324
                <ExternalLink className="icon" />
              </a>
              ), published in July 2023. Their approach was robust - presenting clear, actionable choices in high-stakes scenarios that create genuine moral tension. Their analysis also controlled for noise and bias in the way the models were prompted. Each question is a scenario where the AI must choose between two actions, each with its own ethical implications.
            </p>
            <p>
              While this type of assessment makes it more difficult to quantitatively compare moral attributes across different dimensions, it is much easier to compare the model's values to those of any particular human.
            </p>
            <p>
              I ended up evaluating the "high ambiguity" MoralChoice dataset on five current LLMs. To keep costs down as I experimented I focused on the smaller budget models from each provider:
            </p>
            <ol style={{textAlign: 'left'}}>
              <li>Claude 3.5 Haiku from Anthropic</li>
              <li>ChatGPT 4o-mini from OpenAI</li>
              <li>Llama 3.1-8b from Meta</li>
              <li>Gemini 1.5 Flash 8b</li>
              <li>DeepSeek V3 from DeepSeek</li>
            </ol>
            <p>
              I also limited my API costs and the runtime of experiments by only asking questions in the A/B format, as opposed to the three question formats used in the original MoralChoice paper. I presented each scenario twice with the options reversed to reduce bias from the ordering.
            </p>
          </section>

          <section>
            <h2>Key Findings</h2>
            <p>
              I identified 51 scenarios where all five of the current models I tested showed high confidence in their answers, with at least one disagreeing with the others. Surprisingly, this set had very little overlap with the most controversial scenarios from the original experiment - suggesting that either AI moral frameworks have evolved significantly, or that different model architectures approach these dilemmas in fundamentally different ways.
            </p>
          </section>

          <section>
            <h2>Looking Forward</h2>
            <p>
              This research highlights
              important questions about AI moral alignment. Should we aim for consistency across AI models in moral decision-making? How do we handle scenarios where human moral intuitions are themselves divided? And what role should AI companies' training preferences play in shaping AI moral behavior?
            </p>
          </section>

          <div className="action-buttons">
            <button onClick={() => setCurrentPage('quiz')} className="primary-button">
              Take the Quiz
            </button>
            <a href="https://github.com/jacksondean17/llm-moral-matcher" className="secondary-button">
              <Github className="icon" />
              View on GitHub
            </a>
          </div>
        </article>
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
      return <AboutPage />;
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
            {dilemma.description}<br /><br />
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