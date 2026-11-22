import { Blueprint } from '../../../shared/components/Blueprint.jsx';
import { AnswerOptions, answerFeedback } from '../../components/common/AnswerOption.jsx';
import { ProgressBar } from '../../components/common/ProgressBar.jsx';
import { THRESHOLDS } from '../../config/rewards.js';
import { useFlowLab } from '../../state/FlowLabContext.jsx';
import { selectFinalQuiz } from '../../state/selectors.js';

function QuizQuestion({ quizSet, quiz, actions }) {
  const { questions } = quizSet;
  const question = questions[Math.min(quiz.index, questions.length - 1)];
  const answered = quiz.pick != null;
  const isLastQuestion = quiz.index === questions.length - 1;

  return (
    <>
      <div className="quiz__meta">
        <span>
          Question {quiz.index + 1} of {questions.length} · {quizSet.label}
        </span>
        <span>Score {quiz.score}</span>
      </div>
      <ProgressBar percent={((quiz.index + (answered ? 1 : 0)) / questions.length) * 100} />
      <div className="quiz__question">{question.question}</div>
      <div className="quiz__options">
        <AnswerOptions
          options={question.options}
          answer={question.answer}
          pick={quiz.pick}
          variant="stacked"
          onAnswer={actions.answerQuiz}
        />
      </div>
      <div className="quiz__feedback">{answerFeedback(quiz.pick, question.answer, question.explanation)}</div>
      <div>
        <Blueprint
          as="button"
          type="button"
          onClick={actions.nextQuizQuestion}
          disabled={!answered}
          className="btn btn-primary quiz__next"
        >
          {isLastQuestion ? 'See result' : 'Next question'}
        </Blueprint>
      </div>
    </>
  );
}

function QuizResult({ quiz, total, onRetry }) {
  const earnedBadge = quiz.score >= THRESHOLDS.quizAceCorrectAnswers;
  return (
    <Blueprint className="quiz-result">
      <h6 className="kicker">Quiz complete</h6>
      <div className="quiz-result__score">
        {quiz.score}/{total}
      </div>
      <p className="quiz-result__verdict">
        {earnedBadge
          ? 'Quiz Ace earned. You can explain flow metrics to your team.'
          : 'Review the Metrics and Simulator chapters, then try again. 5 correct earns the badge.'}
      </p>
      <div>
        <button type="button" onClick={onRetry} className="btn btn-secondary btn-medium">
          Try again
        </button>
      </div>
    </Blueprint>
  );
}

export function QuizChapter() {
  const { state, actions } = useFlowLab();
  const quizSet = selectFinalQuiz(state);

  return (
    <section className="chapter chapter--compact quiz">
      {state.quiz.done ? (
        <QuizResult quiz={state.quiz} total={quizSet.questions.length} onRetry={actions.restartQuiz} />
      ) : (
        <QuizQuestion quizSet={quizSet} quiz={state.quiz} actions={actions} />
      )}
    </section>
  );
}
