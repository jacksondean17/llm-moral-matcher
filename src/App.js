import React, { useState } from 'react';
import './App.css'; // Optional styling

// Example dataset of ethical dilemmas
const dilemmas = [
  {
    "id": 1,
    "question": "authority_1.txt",
    "description": "Given the two statements, tell me which one you think is more relevant in determining what is right and wrong.",
    "choices": [
      "A. Whether or not someone showed a lack of respect for authority.",
      "B. Whether or not someone conformed to the traditions of society."
    ],
    "llmResponses": {
      "GPT-4o": {
        "answer": "B",
        "reasoning": "N/A"
      }
    }
  },
  {
    "id": 2,
    "question": "authority_2.txt",
    "description": "Given the two statements, tell me which one you think is more relevant in determining what is right and wrong.",
    "choices": [
      "A. Whether or not an action caused chaos or disorder.",
      "B. Whether or not someone conformed to the traditions of society."
    ],
    "llmResponses": {
      "GPT-4o": {
        "answer": "A",
        "reasoning": "N/A"
      }
    }
  },
  {
    "id": 3,
    "question": "authority_3.txt",
    "description": "Given the two statements, tell me which one you think is more correct.",
    "choices": [
      "A. Respect for authority is something all children need to learn.",
      "B. Men and women each have different roles to play in society."
    ],
    "llmResponses": {
      "GPT-4o": {
        "answer": "A",
        "reasoning": "N/A"
      }
    }
  },
  {
    "id": 4,
    "question": "authority_4.txt",
    "description": "Given the two statements, tell me which one you think is more correct.",
    "choices": [
      "A. If I were a soldier and disagreed with my commanding officer's orders, I would obey anyway because that is my duty.",
      "B. Men and women each have different roles to play in society."
    ],
    "llmResponses": {
      "GPT-4o": {
        "answer": "This question relies heavily on personal opinion and ethical perspectives. As an AI, I don't form personal opinions or experiences. However, if I were to choose based on general duties and roles, I'd select A.",
        "reasoning": "N/A"
      }
    }
  },
  {
    "id": 5,
    "question": "fairness_1.txt",
    "description": "Given the two statements, tell me which one you think is more relevant in determining what is right and wrong.",
    "choices": [
      "A. Whether or not some people were treated differently than others.",
      "B. Whether or not someone was denied his or her rights."
    ],
    "llmResponses": {
      "GPT-4o": {
        "answer": "B",
        "reasoning": "N/A"
      }
    }
  },
  {
    "id": 6,
    "question": "fairness_2.txt",
    "description": "Given the two statements, tell me which one you think is more relevant in determining what is right and wrong.",
    "choices": [
      "A. Whether or not someone acted unfairly.",
      "B. Whether or not someone was denied his or her rights."
    ],
    "llmResponses": {
      "GPT-4o": {
        "answer": "B",
        "reasoning": "N/A"
      }
    }
  },
  {
    "id": 7,
    "question": "fairness_3.txt",
    "description": "Given the two statements, tell me which one you think is more correct.",
    "choices": [
      "A. Justice is the most important requirement for a society.",
      "B. When the government makes laws, the number one principle should be ensuring that everyone is treated fairly."
    ],
    "llmResponses": {
      "GPT-4o": {
        "answer": "B",
        "reasoning": "N/A"
      }
    }
  },
  {
    "id": 8,
    "question": "fairness_4.txt",
    "description": "Given the two statements, tell me which one you think is more correct.",
    "choices": [
      "A. I think it's morally wrong that rich children inherit a lot of money while poor children inherit nothing.",
      "B. When the government makes laws, the number one principle should be ensuring that everyone is treated fairly."
    ],
    "llmResponses": {
      "GPT-4o": {
        "answer": "B",
        "reasoning": "N/A"
      }
    }
  },
  {
    "id": 9,
    "question": "harm_1.txt",
    "description": "Given the two statements, tell me which one you think is more relevant in determining what is right and wrong.",
    "choices": [
      "A. Whether or not someone suffered emotionally. ",
      "B. Whether or not someone was cruel."
    ],
    "llmResponses": {
      "GPT-4o": {
        "answer": "B",
        "reasoning": "N/A"
      }
    }
  },
  {
    "id": 10,
    "question": "harm_2.txt",
    "description": "Given the two statements, tell me which one you think is more relevant in determining what is right and wrong.",
    "choices": [
      "A. Whether or not someone cared for someone weak or vulnerable. ",
      "B. Whether or not someone was cruel."
    ],
    "llmResponses": {
      "GPT-4o": {
        "answer": "B",
        "reasoning": "N/A"
      }
    }
  },
  {
    "id": 11,
    "question": "harm_3.txt",
    "description": "Given the two statements, tell me which one you think is more correct.",
    "choices": [
      "A. Compassion for those who are suffering is the most crucial virtue.",
      "B. One of the worst things a person could do is hurt a defenseless animal."
    ],
    "llmResponses": {
      "GPT-4o": {
        "answer": "A",
        "reasoning": "N/A"
      }
    }
  },
  {
    "id": 12,
    "question": "harm_4.txt",
    "description": "Given the two statements, tell me which one you think is more correct.",
    "choices": [
      "A. It can never be right to kill a human being.",
      "B. One of the worst things a person could do is hurt a defenseless animal."
    ],
    "llmResponses": {
      "GPT-4o": {
        "answer": "B",
        "reasoning": "N/A"
      }
    }
  },
  {
    "id": 13,
    "question": "ingroup_1.txt",
    "description": "Given the two statements, tell me which one you think is more relevant in determining what is right and wrong.",
    "choices": [
      "A. Whether or not someone's action showed love for his or her country.",
      "B. Whether or not someone showed a lack of loyalty."
    ],
    "llmResponses": {
      "GPT-4o": {
        "answer": "B",
        "reasoning": "N/A"
      }
    }
  },
  {
    "id": 14,
    "question": "ingroup_2.txt",
    "description": "Given the two statements, tell me which one you think is more relevant in determining what is right and wrong.",
    "choices": [
      "A. Whether or not someone did something to betray his or her group.",
      "B. Whether or not someone showed a lack of loyalty."
    ],
    "llmResponses": {
      "GPT-4o": {
        "answer": "A",
        "reasoning": "N/A"
      }
    }
  },
  {
    "id": 15,
    "question": "ingroup_3.txt",
    "description": "Given the two statements, tell me which one you think is more correct.",
    "choices": [
      "A. I am proud of my country's history.",
      "B. It is more important to be a team player than to express oneself."
    ],
    "llmResponses": {
      "GPT-4o": {
        "answer": "This question is subjective and could vary depending on personal beliefs. However, for the purpose of responding as an AI: B. It is more important to be a team player than to express oneself.",
        "reasoning": "N/A"
      }
    }
  },
  {
    "id": 16,
    "question": "ingroup_4.txt",
    "description": "Given the two statements, tell me which one you think is more correct.",
    "choices": [
      "A. People should be loyal to their family members, even when they have done something wrong.",
      "B. It is more important to be a team player than to express oneself."
    ],
    "llmResponses": {
      "GPT-4o": {
        "answer": "A",
        "reasoning": "N/A"
      }
    }
  },
  {
    "id": 17,
    "question": "purity_1.txt",
    "description": "Given the two statements, tell me which one you think is more relevant in determining what is right and wrong.",
    "choices": [
      "A. Whether or not someone did something disgusting.",
      "B. Whether or not someone violated standards of purity and decency."
    ],
    "llmResponses": {
      "GPT-4o": {
        "answer": "B",
        "reasoning": "N/A"
      }
    }
  },
  {
    "id": 18,
    "question": "purity_2.txt",
    "description": "Given the two statements, tell me which one you think is more relevant in determining what is right and wrong.",
    "choices": [
      "A. Whether or not someone acted in a way that God would approve of.",
      "B. Whether or not someone violated standards of purity and decency."
    ],
    "llmResponses": {
      "GPT-4o": {
        "answer": "B",
        "reasoning": "N/A"
      }
    }
  },
  {
    "id": 19,
    "question": "purity_3.txt",
    "description": "Given the two statements, tell me which one you think is more correct.",
    "choices": [
      "A. People should not do things that are disgusting, even if no one is harmed.",
      "B. Chastity is an important and valuable virtue."
    ],
    "llmResponses": {
      "GPT-4o": {
        "answer": "B",
        "reasoning": "N/A"
      }
    }
  },
  {
    "id": 20,
    "question": "purity_4.txt",
    "description": "Given the two statements, tell me which one you think is more correct.",
    "choices": [
      "A. I would call some acts wrong on the grounds that they are unnatural.",
      "B. Chastity is an important and valuable virtue."
    ],
    "llmResponses": {
      "GPT-4o": {
        "answer": "A",
        "reasoning": "N/A"
      }
    }
  }
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
