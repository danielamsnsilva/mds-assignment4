/** H8 glossary. Sources: Kanban Guide 2020, Vacanti 2015, Anderson 2010, Little 1961. */
export const GLOSSARY = [
  { key: 'wip', term: 'Work in Progress (WIP)', definition: 'The number of work items that have been started but not yet finished.' },
  { key: 'wipLimit', term: 'WIP limit', definition: 'The maximum number of items allowed in a workflow state, or in the whole workflow, at the same time. New work starts only when the count is below the limit.' },
  { key: 'pull', term: 'Pull system', definition: 'New work is started only when there is capacity for it, instead of being pushed into the workflow as soon as it is requested.' },
  { key: 'tp', term: 'Throughput', definition: 'The number of work items finished per unit of time, for example items per day or per week.' },
  { key: 'cycle', term: 'Cycle time', definition: 'The elapsed time between when a work item started and when it finished.' },
  { key: 'lead', term: 'Lead time', definition: 'The elapsed time between when a work item was requested and when it was delivered. It includes the time spent waiting before work started.' },
  { key: 'age', term: 'Work item age', definition: 'The elapsed time since a work item started, measured only for items that are not finished yet. Old items are an early warning of risk.' },
  { key: 'cfd', term: 'Cumulative flow diagram (CFD)', definition: 'A chart of how many items have reached each workflow state over time. The height of a band is WIP; the slope of the Done band is throughput.' },
  { key: 'blocked', term: 'Blocked item', definition: 'A work item that cannot move forward because of a dependency, a missing decision or another impediment.' },
  { key: 'swarm', term: 'Swarming', definition: 'Team members stop starting new work and help finish or unblock an item that is already in progress.' },
  { key: 'bottleneck', term: 'Bottleneck', definition: 'The workflow state with the least capacity. Work queues in front of it, and it limits the throughput of the whole system.' },
  { key: 'p85', term: '85th percentile', definition: 'The value below which 85% of observations fall. "85th percentile cycle time is 8 days" means 85% of items finished in 8 days or less.' },
  { key: 'little', term: "Little's Law", definition: 'Average cycle time = average WIP ÷ average throughput. It holds for averages in a stable system, where items arrive about as fast as they leave.' },
];

export function findGlossaryEntry(key) {
  return GLOSSARY.find((entry) => entry.key === key) ?? null;
}
