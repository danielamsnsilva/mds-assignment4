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

export const SOURCES = {
  kanbanGuide: 'https://kanbanguides.org/the-kanban-guide/2025.5/',
  scrumGuide: 'https://scrumguides.org/scrum-guide.html',
};

export const REFERENCES = [
  { text: 'The Kanban Guide, version 2025.5 (May 2025).', link: { href: SOURCES.kanbanGuide, label: 'kanbanguides.org' } },
  { text: 'Vacanti, D. Actionable Agile Metrics for Predictability. 2015.' },
  { text: 'Anderson, D. J. Kanban: Successful Evolutionary Change for Your Technology Business. 2010.' },
  { text: 'Little, J. D. C. A Proof for the Queuing Formula L = λW. Operations Research, 1961.' },
  { text: 'Schwaber, K. & Sutherland, J. The Scrum Guide, 2020.', link: { href: SOURCES.scrumGuide, label: 'scrumguides.org' } },
];
