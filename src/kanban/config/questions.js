/**
 * Every question in the manual. Each one has `options`, the index of the
 * correct `answer` and an `explanation` shown after answering.
 */

/** H5: quick check at the end of each chapter (2 questions per chapter). */
export const QUICK_CHECKS = {
  basics: [
    {
      question: 'Which of these is NOT one of the three practices in The Kanban Guide?',
      options: ['Define and visualize the workflow', 'Estimate every item in story points', 'Actively manage items in the workflow'],
      answer: 1,
      explanation: 'The three practices are: define and visualize the workflow, actively manage items, and improve the workflow. Estimation is not required.',
    },
    {
      question: 'An item was requested on day 1, started on day 4 and finished on day 6. Counting both days, what is its cycle time?',
      options: ['3 days', '6 days', '2 days'],
      answer: 0,
      explanation: 'Cycle time runs from start (day 4) to finish (day 6): 3 days. Lead time, from request to finish, would be 6 days.',
    },
  ],
  board: [
    {
      question: 'In progress is at its WIP limit (3/3). What should the team do next?',
      options: ['Start a new card anyway', 'Help finish an item that is already in progress', 'Raise the WIP limit for good'],
      answer: 1,
      explanation: 'Stop starting, start finishing: capacity frees up when work leaves the column.',
    },
    {
      question: 'A card is blocked. What is the Kanban response?',
      options: ['Leave it and pull new work', 'Swarm on it to remove the blocker', 'Move it back to To do'],
      answer: 1,
      explanation: 'Actively managing items means unblocking work quickly so it does not age.',
    },
  ],
  flow: [
    {
      question: 'With no WIP limit and more arrivals than capacity, what happens to lead time?',
      options: ['It goes down', 'It keeps growing', 'It stays the same'],
      answer: 1,
      explanation: 'Work piles up in the queue, so every new item waits longer and lead time grows.',
    },
    {
      question: 'On a CFD, what does the slope of the Done band show?',
      options: ['WIP', 'Throughput', 'Work item age'],
      answer: 1,
      explanation: 'A steeper Done band means more items finished per day, which is throughput.',
    },
  ],
  scrumban: [
    {
      question: 'A Scrum team adopts Kanban practices. What happens to the Sprint and the Sprint Goal?',
      options: ['They are replaced by continuous flow', 'They stay; Kanban adds flow practices inside the Sprint', 'The Sprint becomes optional'],
      answer: 1,
      explanation: 'The Kanban Guide for Scrum Teams adds flow practices to Scrum; it does not replace any Scrum event, artifact or accountability.',
    },
    {
      question: 'Who owns the Definition of Workflow in a Scrum team?',
      options: ['The Scrum Master', 'The Product Owner', 'The Developers'],
      answer: 2,
      explanation: 'The Developers own the Definition of Workflow, because they are the ones doing the work and controlling WIP. The whole Scrum team can help improve it.',
    },
  ],
  metrics: [
    {
      question: 'Average WIP is 10 items and throughput is 2 items/day. What is the average cycle time?',
      options: ['20 days', '5 days', '0.2 days'],
      answer: 1,
      explanation: "Little's Law: cycle time = WIP ÷ throughput = 10 ÷ 2 = 5 days.",
    },
    {
      question: 'Why forecast with the 85th percentile instead of the average?',
      options: ['It is always the smaller number', 'It states a probability: 85% of items finish within that time', 'Averages are not allowed in Kanban'],
      answer: 1,
      explanation: 'A percentile tells the customer how likely a date is, which an average cannot do.',
    },
  ],
};

/**
 * Final quiz, one set per learning path. `reviewChapter` (H14) is the chapter
 * the debrief links to when the question was answered wrong.
 */
export const FINAL_QUIZZES = {
  beginner: {
    label: 'Beginner set',
    questions: [
      { question: 'What does WIP stand for?', options: ['Work in Progress', 'Work in Planning', 'Weekly Item Production', 'Workflow Improvement Process'], answer: 0, explanation: 'WIP counts items started but not finished.', reviewChapter: 'basics' },
      { question: 'What is the main purpose of a WIP limit?', options: ['Keep everyone 100% busy', 'Reduce multitasking and improve flow', 'Track hours worked', 'Prioritise the backlog'], answer: 1, explanation: 'Fewer items at once means less switching and faster finishing.', reviewChapter: 'board' },
      { question: 'Throughput is…', options: ['The time to finish one item', 'The number of items started per week', 'The number of items finished per unit of time', 'The size of the backlog'], answer: 2, explanation: 'Throughput is a count of finished items over a period.', reviewChapter: 'basics' },
      { question: 'Cycle time measures the time between…', options: ['Request and delivery', 'Start and finish of an item', 'Two releases', 'Daily stand-ups'], answer: 1, explanation: 'Request-to-delivery is lead time; start-to-finish is cycle time.', reviewChapter: 'basics' },
      { question: 'On a CFD, the "in progress" band keeps getting wider. What does that mean?', options: ['WIP is growing', 'Throughput is increasing', 'The team is finishing more', 'Nothing, it is normal'], answer: 0, explanation: 'A widening band means work enters faster than it leaves.', reviewChapter: 'flow' },
      { question: 'Which approach uses fixed-length iterations?', options: ['Kanban', 'Scrum', 'Both', 'Neither'], answer: 1, explanation: 'Scrum uses Sprints; Kanban works in continuous flow.', reviewChapter: 'compare' },
    ],
  },
  advanced: {
    label: 'Advanced set',
    questions: [
      { question: 'Average WIP is 12 items and throughput is 3 items/day. Average cycle time?', options: ['36 days', '0.25 days', '4 days', '9 days'], answer: 2, explanation: "Little's Law: 12 ÷ 3 = 4 days.", reviewChapter: 'metrics' },
      { question: 'Work Item Age applies to…', options: ['Finished items only', 'Items not yet started', 'Items started but not finished', 'The whole backlog'], answer: 2, explanation: 'Age is measured on in-progress items and is the earliest warning signal.', reviewChapter: 'flow' },
      { question: '"85th percentile cycle time is 8 days" means…', options: ['Items take 8 days on average', '85% of items finished in 8 days or less', '8 of every 85 items are late', 'The team needs 85% more capacity'], answer: 1, explanation: 'Percentiles express a probability, which suits forecasting.', reviewChapter: 'metrics' },
      { question: 'The top edge of the Done band on a CFD is flat for a week. This suggests…', options: ['Throughput was zero that week', 'WIP dropped to zero', 'Cycle time improved', 'Arrivals stopped'], answer: 0, explanation: 'Flat Done means nothing was delivered.', reviewChapter: 'flow' },
      { question: 'Which of these is one of the three Kanban Guide practices?', options: ['Sprint planning', 'Estimating in story points', 'Actively managing items in a workflow', 'Daily status reporting'], answer: 2, explanation: 'Define and visualize, actively manage, improve the workflow.', reviewChapter: 'board' },
      { question: "Little's Law gives reliable averages when…", options: ['The team is large', 'Arrivals roughly equal departures over the period', 'All items are the same size', 'WIP limits are disabled'], answer: 1, explanation: 'It assumes a stable system.', reviewChapter: 'metrics' },
    ],
  },
};

export function finalQuizForPath(pathId) {
  return pathId === 'advanced' ? FINAL_QUIZZES.advanced : FINAL_QUIZZES.beginner;
}

/** Kanban vs Scrum sorting exercise. `answer` indexes SORT_CATEGORIES. */
export const SORT_CATEGORIES = ['Kanban', 'Scrum', 'Both'];

export const SORT_STATEMENTS = [
  { statement: 'Work is organized into fixed-length iterations of one month or less.', answer: 1, explanation: 'Scrum: each Sprint is fixed in length and cannot exceed one month.' },
  { statement: 'WIP is explicitly controlled across the workflow.', answer: 0, explanation: 'Kanban: controlling WIP is a core practice; the form of control is defined in the workflow.' },
  { statement: 'It defines three accountabilities: Product Owner, Scrum Master, and Developers.', answer: 1, explanation: 'Scrum defines these accountabilities; Kanban prescribes no roles.' },
  { statement: 'New work is selected when capacity is available.', answer: 0, explanation: 'Kanban: controlling WIP helps create a pull system.' },
  { statement: 'It promotes transparency, inspection, and adaptation of work.', answer: 2, explanation: 'Both: Scrum names these pillars; Kanban visualizes flow and promotes continuous improvement.' },
  { statement: 'It tracks WIP, throughput, work item age, and cycle time.', answer: 0, explanation: 'Kanban: these are the four mandatory flow metrics in The Kanban Guide.' },
  { statement: 'A retrospective is a mandatory event in each cycle.', answer: 1, explanation: 'Scrum: the Sprint Retrospective is one of the formal events in each Sprint.' },
  { statement: 'A visual board can help a team track the state of work.', answer: 2, explanation: 'Both: Kanban visualizes workflow, and Scrum teams may also use boards.' },
];

/**
 * H15: Sprint flow challenge in the Scrumban chapter. Each scenario happens
 * during a Sprint; `answer` indexes `options`.
 */
export const SPRINT_SCENARIOS = [
  {
    event: 'Day 4 of a 10-day Sprint',
    scenario: 'Development is at its WIP limit (3/3). A developer has finished a task and wants to start a new Sprint Backlog item.',
    options: ['Start the new item; it is in the Sprint Backlog', 'Help finish an item that is already in progress', 'Raise the WIP limit until the end of the Sprint'],
    answer: 1,
    explanation: 'The WIP limit is part of the Definition of Workflow. Freeing capacity by finishing work keeps items flowing and protects the Sprint Goal.',
  },
  {
    event: 'Daily Scrum',
    scenario: 'The SLE is "85% of items finish in 8 days or less". One item has been in progress for 7 days; the others are 1 to 3 days old.',
    options: ['Talk about the 7-day-old item first and plan how to finish it', 'Go around the room so everyone reports on yesterday', 'Wait for the Sprint Review to discuss it'],
    answer: 0,
    explanation: 'Work Item Age is the earliest warning signal. A flow-based Daily Scrum focuses on items at risk of missing the SLE and acts on them now.',
  },
  {
    event: 'Sprint Planning',
    scenario: 'Over the last 6 Sprints the team finished between 9 and 12 items per Sprint. How should it decide how much to pull into this Sprint?',
    options: ['Pull as many items as the stakeholders ask for', 'Estimate every item in hours and add them up', 'Use the throughput history to forecast how many items are likely to fit'],
    answer: 2,
    explanation: 'The Kanban Guide for Scrum Teams suggests using historical throughput to forecast, for example with Monte Carlo simulation, rather than effort estimates.',
  },
  {
    event: 'Sprint Retrospective',
    scenario: 'In every Sprint, items pile up in "Review" while developers keep starting new work.',
    options: ['Adapt the Definition of Workflow, for example add a WIP limit or pull policy for Review', 'Add an extra Sprint to catch up on reviews', 'Stop measuring flow; the numbers look bad'],
    answer: 0,
    explanation: 'The Retrospective is where the team inspects flow and adapts the Definition of Workflow, such as WIP limits, policies or the SLE.',
  },
];

/** Little's Law challenge in the Metrics chapter. */
export const LAW_CHALLENGE = {
  question: 'A team has 15 items in progress and finishes 5 items per week. What is its Lead time?',
  reviewText: 'A team has 15 items in progress and finishes 5 items per week. What is its lead time?',
  options: ['3 weeks', '75 weeks', '0.33 weeks', '10 weeks'],
  answer: 0,
  correctFeedback: 'Correct: 15 ÷ 5 = 3 weeks.',
  wrongFeedback: 'Not quite. 15 items ÷ 5 per week = 3 weeks.',
};
