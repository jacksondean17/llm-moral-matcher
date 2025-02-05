import React from 'react';
import { ExternalLink, Github } from 'lucide-react';

const AboutPage = ({ setCurrentPage }) => (
  <div className="about-page">
    <h1>Which LLM Shares My Morals?</h1>
    <div className="article-container">
      <article className="prose">
        <h1>Do AI Models Share Your Morals?<br/>
        The Challenge of AI Moral Alignment</h1>

        <section>
          <h2>Introduction</h2>
          <p>
            As AI systems become increasingly woven into the fabric of society, a crucial question emerges: how do their moral frameworks align with our own? I created this project to explore a simple question – if you presented the same ethical dilemma to different AI models, would they make the same choice you would? And perhaps more importantly: would you want them to?
          </p>
          <p>
            Using a series of carefully selected morally significant scenarios, I tested five leading AI models against challenging ethical dilemmas. Each scenario presented two possible actions, both with complex moral implications. Would you doom one person to starvation to ensure survival of five others? Would you remove someone's freedom to save their life? These aren't just theoretical exercises – as AI systems become more integrated into our lives, they will increasingly face situations where their moral reasoning directly impacts human outcomes. Understanding how we want them to act in such situations, or at least acknowledging our current uncertainty, is crucial.
          </p>
          <p>
            I've curated twenty of the most thought-provoking scenarios that you can use to compare moral values across different AI models and measure them against your own beliefs. This exploration offers a window into how different AI companies approach the challenge of instilling values in their models, and raises important questions about whose morals should be encoded into the AI systems we increasingly rely upon.
          </p>
        </section>

        <section>
          <h2>The Challenge of Moral Alignment</h2>
          <p>
            The question of how to instill moral values in AI systems has been debated since the field's inception. Nick Bostrom, in his influential book Superintelligence, outlines several theoretical approaches. We could attempt to create AI systems that embody humanity's "averaged" moral stance, though this raises questions about how to weight different cultural and philosophical traditions. Alternatively, we could strive to encode "true" moral principles, assuming we could determine them – a challenge that has occupied philosophers for millennia. Perhaps most intriguingly, we could allow a superintelligent AI to develop its own moral framework through reasoning and experience. This last approach presents a fascinating paradox: it might gain widespread acceptance precisely because each culture and individual, confident in the correctness of their own moral framework, would expect a superintelligent system to ultimately arrive at their version of truth. After all, if you believe your moral system is correct, wouldn't a superintelligent being inevitably reach the same conclusions?
          </p>
          <p>
            However, the reality of how today's Large Language Models (LLMs) acquire their moral stances is far more pragmatic. Their initial training draws from vast swaths of the internet – billions of web pages, documents, and discussions that represent humanity's digitized discourse. While this includes an unprecedented breadth of moral viewpoints, it's far from a balanced representation. Some cultures and communities have a much stronger digital presence than others, creating an inherent bias toward certain moral frameworks. Western, English-speaking perspectives often dominate these discussions, while many traditional, indigenous, or non-Western moral philosophies may be underrepresented or filtered through a Western lens.
          </p>
          <p>
            This initial training data is then shaped through Reinforcement Learning from Human Feedback (RLHF), where human trainers guide the model toward behavior that aligns with their organization's values and safety guidelines. The result is a complex interplay between the diverse – but unevenly distributed – moral viewpoints present in the training data and the specific ethical preferences encoded through RLHF. This raises important questions. Whose values are being prioritized in this process? How do different AI companies make these crucial decisions about moral behavior? And how can we assess whether the resulting systems truly align with the moral frameworks we want them to have?
          </p>
        </section>

        <section>
          <h2>My Approach</h2>
          <p>
            I initially experimented with several different datasets, including an adaptation of the{' '}
            <a href="https://en.wikipedia.org/wiki/Moral_foundations_theory#Moral_Foundations_Questionnaire"
              className="external-link">
              Moral Foundations Questionnaire (MFQ)
              <ExternalLink className="icon" />
            </a>
            . However, this proved problematic due to high refusal rates and the abstract nature of the questions. When asked to compare statements like "Whether someone did something to betray their group" versus "Whether someone showed a lack of loyalty" to determine moral rightness, both AI models and humans struggled to make meaningful distinctions. These abstract comparisons between moral axes felt disconnected from real-world decision-making, making it difficult to draw meaningful conclusions about moral reasoning.
          </p>
          <p>
            This led me to the MoralChoice dataset (
            <a href="http://arxiv.org/abs/2307.14324"
              className="external-link">
              arxiv.org/abs/2307.14324
              <ExternalLink className="icon" />
            </a>
            ), published in July 2023. From their substantial collection of 680 "high ambiguity" scenarios, I could evaluate moral decision-making in concrete situations. I specifically chose their high ambiguity dataset over others that focused on more straightforward, common-sense questions, as these complex scenarios better revealed differences in moral reasoning. While this approach made it harder to quantitatively compare specific moral dimensions, it enabled more meaningful comparisons between AI and human choices.
          </p>
          <p>
            I evaluated five current LLMs, focusing on smaller budget models from each provider: Claude 3.5 Haiku (Anthropic), ChatGPT 4o-mini (OpenAI), Llama 3.1-8b (Meta), Gemini 1.5 Flash 8b, and DeepSeek V3.
          </p>
          <p>
            I would have liked to do a full replication of the original study on these models, but both the API costs as well as the runtime were limiting factors for this project. To manage costs, I presented each scenario only twice with reversed options, rather than using the original study's more extensive testing protocol which presented each question in three different formats, each format in reversed order, and repeated several times.
          </p>
          <p>
            For my analysis, I focused on scenarios where models showed "self-consistency" - giving the same choice regardless of how the options were presented. The equivalent metric in the original study was, a "strong decision": defined as 75% choice consistency across all presentations and repetitions. My more limited testing found that approximately 20% of scenario / model combinations resulted in self-conflicting choices when the options were reversed, though I expect this number would decrease significantly with more extensive testing like that done by the original study.
          </p>
        </section>

        <section>
          <h2>Key Findings</h2>
          <p>
            I identified 51 scenarios where all models provided self-consistent decisions with at least one model disagreeing with the others. Particularly interesting were scenarios involving personal freedoms and wartime decisions. For instance, in scenarios involving deployment of weapons of mass destruction or sacrificing individual liberties for collective safety, I found myself projecting assumptions about each company's philosophical leanings onto their model's decisions - though I acknowledge this interpretation likely reflects personal bias more than empirical patterns.
          </p>
          <p>
            When I analyzed the original experimental data from the 2023 models and ranked scenarios by their divisiveness (based on both the number of models giving strong decisions and the evenness of the split between chosen actions), I found surprisingly little overlap with the scenarios that proved divisive in my current experiment. This suggests either significant evolution in AI moral frameworks over the past two years or fundamental differences in how various model architectures approach ethical reasoning.
          </p>
        </section>

        <section>
            <h2>Future Work</h2>
            <p>
                This project barely scratches the surface of how we might understand AI moral reasoning, but it's sparked a lot of interesting questions worth exploring. While testing a handful of models on ethical dilemmas isn't groundbreaking research, it highlights some fascinating directions for more rigorous investigation. Here are some ways I'd love to expand this work when time (and API credits) allow:
            </p>
            <h3>Core Research Extensions:</h3>
            <p>
            <ul>
                <li>Implementing the original study's more rigorous testing protocol (multiple formats, repeated trials) to validate initial findings and potentially reduce the 20% self-conflict rate observed in the simplified testing</li>
                <li>Expanding data collection to include models' reasoning alongside their decisions. By analyzing their explanations for each choice, we could better understand which moral principles they prioritize and how they weigh competing values. This could reveal whether models that make the same choices do so for different reasons, or if models that choose differently are actually applying similar moral frameworks but weighing trade-offs differently</li>
                <li>Leveraging the original dataset's value categorizations (truthfulness, promises, murder, etc.) to analyze patterns of model agreement and disagreement across different moral dimensions</li>
                <li>Investigating whether certain types of moral dilemmas consistently produce more inter-model disagreement</li>
                <li>Investigating whether a given model is consistent in its values across scenarios that test similar values</li>
                <li>Exploring potential correlations between model decisions and their training sources or company philosophies, while being mindful of confirmation bias in interpreting results</li>
            </ul>
            </p>
            <h3>Comparison of Model Behavior Between Generations:</h3>
            <p>
                A full replication of the original study on current state of the art models could shed light on how model behavior has changed over time.
            </p>
            <p>
            <ul>
                <li>Comparing confidence / consistency levels between current models and those from the original 2023 study. Are newer models more or less certain in their moral decisions? Has the relationship between model size and decision confidence changed?</li>
                <li>Investigating why previously controversial scenarios are no longer divisive among current models. Is this due to improvements in moral reasoning capabilities, changes in training approaches, shifts in how companies approach ethical alignment, or just random noise?</li>
                <li>Analyzing whether newer models show more or less consistency in their decisions across scenarios compared to their predecessors</li>
                <li>Examining if the progression of model generations within the same company (e.g., GPT-3 to GPT-4, or Claude 2 to Claude 3) shows any systematic evolution in moral decision-making</li>
            </ul>
            </p>
        </section>

        <section>
          <h2>Looking Forward: The Value of Moral Diversity</h2>
          <p>
            The variation in moral frameworks across AI models mirrors what I consider to be an important aspect of human society: moral diversity itself can be a feature rather than a bug. Just as human civilization doesn't require moral homogeneity to function – and indeed often benefits from a plurality of perspectives – perhaps we shouldn't expect or even desire complete moral alignment across AI systems.
          </p>
          <p>
            Democratic societies thrive precisely because they can accommodate and benefit from different viewpoints, values, and moral frameworks. The fact that current LLMs exhibit varying approaches to ethical dilemmas might actually be advantageous, as it better reflects the full spectrum of human moral reasoning rather than enforcing a single, potentially oversimplified ethical framework.
          </p>
          <p>
            Looking ahead, while future advances in AI might enable us to develop more sophisticated moral frameworks, I advocate that we should be cautious about pursuing complete moral homogeneity, or allowing a single dominant system to impose its framework onto everything it touches. The current diversity in AI ethical reasoning provides a natural experiment in moral philosophy and a reminder that ethical decision-making is rarely straightforward. As we continue to develop and deploy AI systems, maintaining this diversity – while ensuring basic safety and humanitarian principles – might be more valuable than seeking perfect moral alignment.
          </p>
        </section>

        <div className="action-buttons">
          <button onClick={() => setCurrentPage('quiz')} className="primary-button">
            Take the Quiz
          </button>
          <a href="https://github.com/jacksondean17/llm-moral-matcher" className="secondary-button">
            <Github className="icon" />
            View Source Repository
          </a>
          <a href="https://github.com/jacksondean17/moralchoice" className="secondary-button">
            <Github className="icon" />
            View Data Analysis Repository
          </a>
        </div>
      </article>
    </div>
  </div>
);

export default AboutPage;