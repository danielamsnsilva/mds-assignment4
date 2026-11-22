/**
 * The look of an answer button once the question has been answered:
 * the right answer is highlighted, a wrong pick is struck through and the
 * other options are dimmed.
 */
export function answerState({ answered, isCorrect, isPicked }) {
  if (!answered) return 'idle';
  if (isCorrect) return 'correct';
  if (isPicked) return 'wrong';
  return 'dimmed';
}

/**
 * @param {'grid' | 'compact' | 'stacked' | 'check'} variant layout and size of the button
 */
export function AnswerOption({ label, state, variant, onSelect, ...props }) {
  return (
    <button
      type="button"
      className={`answer-option answer-option--${variant} is-${state}`}
      onClick={onSelect}
      {...props}
    >
      {label}
    </button>
  );
}

/** One question with its options; picking is ignored once answered. */
export function AnswerOptions({ options, answer, pick, variant, onAnswer, withPressedState = false }) {
  const answered = pick != null;
  return options.map((label, index) => (
    <AnswerOption
      key={label}
      label={label}
      variant={variant}
      state={answerState({ answered, isCorrect: index === answer, isPicked: pick === index })}
      aria-pressed={withPressedState ? answered && pick === index : undefined}
      onSelect={() => {
        if (!answered) onAnswer(index);
      }}
    />
  ));
}

/** "Correct. …" / "Not quite. …" text shown after answering. */
export function answerFeedback(pick, answer, explanation) {
  if (pick == null) return '';
  return `${pick === answer ? 'Correct. ' : 'Not quite. '}${explanation}`;
}
