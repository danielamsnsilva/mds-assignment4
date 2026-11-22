/** Static learning content shown in the Basics, Metrics and Debrief chapters. */

export const KANBAN_PRACTICES = [
  {
    title: 'Define and visualize the workflow',
    text: 'Make work items, start and finish points, states, WIP control, policies, and a service level expectation (SLE) explicit.',
  },
  {
    title: 'Actively manage items',
    text: 'Control WIP, unblock work, and act on items that are ageing or approaching their SLE.',
  },
  {
    title: 'Improve the workflow',
    text: 'Use flow data to adapt how work is done and improve effectiveness, efficiency, and predictability.',
  },
];

export const FLOW_MEASURES = [
  { name: 'WIP · Work in Progress', text: 'The number of work items started but not yet finished.' },
  {
    name: 'Throughput',
    text: 'The exact count of work items finished per unit of time (for example, items per week).',
  },
  { name: 'Work Item Age', text: 'Elapsed time since an unfinished work item was started.' },
  { name: 'Cycle Time', text: 'Elapsed time between when a work item started and when it finished.' },
];

export const HEADLINE_METRICS = [
  { abbreviation: 'WIP', text: 'Work started, not finished' },
  { abbreviation: 'TH', text: 'Items finished per time period' },
  { abbreviation: 'CT', text: 'Time from start to finish' },
];

export const COMPARISON_ROWS = [
  {
    aspect: 'Cadence',
    kanban: 'Continuous flow; replenishment and delivery cadences are optional',
    scrum: 'Fixed-length Sprints of one month or less',
  },
  {
    aspect: 'Accountabilities',
    kanban: 'No prescribed roles',
    scrum: 'Product Owner, Scrum Master, and Developers',
  },
  {
    aspect: 'Work control',
    kanban: 'Explicit control of WIP across the workflow',
    scrum: 'Sprint Backlog selected to meet the Sprint Goal',
  },
  {
    aspect: 'Change',
    kanban: 'Items are selected when capacity is available, according to explicit policies',
    scrum: 'The Sprint Goal remains constant; scope may be clarified with the Product Owner',
  },
  {
    aspect: 'Measures',
    kanban: 'WIP, throughput, work item age, and cycle time',
    scrum: 'Progress toward goals; velocity may be used but is not prescribed',
  },
];

export const COMPARISON_SUMMARY =
  'A Scrum team can add Kanban practices while continuing to follow the Scrum Guide.';

/**
 * H15: elements of a Definition of Workflow, from The Kanban Guide for Scrum
 * Teams. The Developers own it and inspect and adapt it every Sprint.
 */
export const DEFINITION_OF_WORKFLOW = [
  {
    title: 'Start and finish points',
    text: 'Agree on when an item counts as started and when it counts as finished, so flow metrics mean the same thing to everyone.',
  },
  {
    title: 'Workflow states',
    text: 'Name the states an item passes through between started and finished, for example Develop, Review and Test.',
  },
  {
    title: 'Control of WIP',
    text: 'Limit how many items can be in progress, per state or for the whole workflow, so the team finishes before it starts.',
  },
  {
    title: 'Service Level Expectation',
    text: 'Forecast how long a single item should take from start to finish, for example "85% of items finish in 8 days or less".',
  },
  {
    title: 'Explicit pull policies',
    text: 'Write down how and when items are pulled from one state to the next, so decisions do not depend on who is asking.',
  },
];

/** H15: how a Scrum team uses flow in each Scrum event. */
export const SCRUM_EVENTS_FLOW = [
  {
    event: 'Sprint Planning',
    focus:
      'Use historical throughput to forecast how many items fit in the Sprint, instead of guessing. Check that the Definition of Workflow still fits the work.',
  },
  {
    event: 'Daily Scrum',
    focus:
      'Walk the board from right to left. Talk about blocked items, items whose age is close to the SLE, and states at their WIP limit, not just about what each person did.',
  },
  {
    event: 'Sprint Review',
    focus:
      'Show what was delivered and use flow metrics, such as throughput and cycle time, to discuss forecasts with stakeholders.',
  },
  {
    event: 'Sprint Retrospective',
    focus:
      'Inspect the flow metrics and adapt the Definition of Workflow: change a WIP limit, a pull policy or the SLE.',
  },
  {
    event: 'Product Backlog refinement',
    focus:
      'Right-size items: ask whether each item is small enough to finish within the SLE, and split it if it is not.',
  },
];

export const SCRUMBAN_SUMMARY =
  'Kanban does not replace Scrum. The Sprint, the Sprint Goal, the accountabilities and the events stay the same; flow practices make the work inside them more transparent.';

export const SOURCES = {
  kanbanGuide: 'https://kanbanguides.org/the-kanban-guide/2025.5/',
  kanbanGuideScrumTeams: 'https://www.scrum.org/resources/kanban-guide-scrum-teams',
  scrumGuide: 'https://scrumguides.org/scrum-guide.html',
};

export const REFERENCES = [
  { text: 'The Kanban Guide, version 2025.5 (May 2025).', link: { href: SOURCES.kanbanGuide, label: 'kanbanguides.org' } },
  {
    text: 'Vacanti, D. & Yeret, Y. The Kanban Guide for Scrum Teams. Scrum.org, 2021.',
    link: { href: SOURCES.kanbanGuideScrumTeams, label: 'scrum.org' },
  },
  { text: 'Vacanti, D. Actionable Agile Metrics for Predictability. 2015.' },
  { text: 'Anderson, D. J. Kanban: Successful Evolutionary Change for Your Technology Business. 2010.' },
  { text: 'Little, J. D. C. A Proof for the Queuing Formula L = λW. Operations Research, 1961.' },
  { text: 'Schwaber, K. & Sutherland, J. The Scrum Guide, 2020.', link: { href: SOURCES.scrumGuide, label: 'scrumguides.org' } },
];
