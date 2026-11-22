import { LAW_CHALLENGE, QUICK_CHECKS, SORT_STATEMENTS, SPRINT_SCENARIOS, finalQuizForPath } from '../config/questions.js';
import { REWARDS } from '../config/rewards.js';

/**
 * H14: collects every question the learner answered wrong and groups them by
 * the chapter that teaches the topic, ordered as the chapters appear in the path.
 */
export class ReviewPlanner {
  /**
   * @param {object} answers
   * @param {string|null} answers.pathId
   * @param {object} answers.quickChecks  `{ "chapter:index": optionIndex }`
   * @param {object} answers.sortAnswers  `{ statementIndex: optionIndex }`
   * @param {object} [answers.scrumbanAnswers] `{ scenarioIndex: optionIndex }` (H15)
   * @param {number|null} answers.lawAnswer
   * @param {object} answers.quiz          `{ index, pick, done }`
   * @param {object} answers.xpLedger      used to tell which final-quiz answers were right
   */
  constructor({ pathId, quickChecks, sortAnswers, scrumbanAnswers = {}, lawAnswer, quiz, xpLedger }) {
    this.pathId = pathId;
    this.quickChecks = quickChecks;
    this.sortAnswers = sortAnswers;
    this.scrumbanAnswers = scrumbanAnswers;
    this.lawAnswer = lawAnswer;
    this.quiz = quiz;
    this.xpLedger = xpLedger;
  }

  /** @returns {{ answeredCount: number, missed: { chapter: string, source: string, text: string }[] }} */
  collect() {
    const missed = [];
    let answeredCount = 0;
    const record = (isCorrect, entry) => {
      answeredCount++;
      if (!isCorrect) missed.push(entry);
    };

    Object.entries(QUICK_CHECKS).forEach(([chapter, questions]) =>
      questions.forEach((question, index) => {
        const pick = this.quickChecks[`${chapter}:${index}`];
        if (pick == null) return;
        record(pick === question.answer, { chapter, source: 'Quick check', text: question.question });
      }),
    );

    SORT_STATEMENTS.forEach((statement, index) => {
      const pick = this.sortAnswers[index];
      if (pick == null) return;
      record(pick === statement.answer, { chapter: 'compare', source: 'Kanban vs Scrum', text: statement.statement });
    });

    SPRINT_SCENARIOS.forEach((scenario, index) => {
      const pick = this.scrumbanAnswers[index];
      if (pick == null) return;
      record(pick === scenario.answer, {
        chapter: 'scrumban',
        source: 'Sprint flow challenge',
        text: `${scenario.event}: ${scenario.scenario}`,
      });
    });

    if (this.lawAnswer != null) {
      record(this.lawAnswer === LAW_CHALLENGE.answer, {
        chapter: 'metrics',
        source: "Little's Law challenge",
        text: LAW_CHALLENGE.reviewText,
      });
    }

    if (this.pathId) {
      const { questions } = finalQuizForPath(this.pathId);
      const answeredQuestions = this.quiz.done ? questions.length : this.quiz.index + (this.quiz.pick != null ? 1 : 0);
      for (let i = 0; i < answeredQuestions; i++) {
        const { key } = REWARDS.quizQuestionCorrect(this.pathId, i);
        record(this.xpLedger[key] != null, {
          chapter: questions[i].reviewChapter || 'metrics',
          source: 'Final quiz',
          text: questions[i].question,
        });
      }
    }

    return { answeredCount, missed };
  }

  /**
   * @param {string[]} chapterOrder chapters of the current path
   * @returns {{ answeredCount: number, missedCount: number,
   *   groups: { chapter: string, chapterIndex: number, items: { source: string, text: string }[] }[] }}
   *   `chapterIndex` is -1 when the chapter is not part of the current path.
   */
  plan(chapterOrder) {
    const { answeredCount, missed } = this.collect();
    const chapters = [...new Set(missed.map((entry) => entry.chapter))];
    const groups = chapters
      .map((chapter) => ({
        chapter,
        chapterIndex: chapterOrder.indexOf(chapter),
        items: missed.filter((entry) => entry.chapter === chapter).map(({ source, text }) => ({ source, text })),
      }))
      .sort((a, b) => sortOrder(a.chapterIndex) - sortOrder(b.chapterIndex));
    return { answeredCount, missedCount: missed.length, groups };
  }
}

const sortOrder = (chapterIndex) => (chapterIndex < 0 ? 99 : chapterIndex);
