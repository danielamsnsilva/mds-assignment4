import { useFlowLab } from '../../state/FlowLabContext.jsx';
import { selectTeamData } from '../../state/selectors.js';
import { LittlesLawCalculator } from './LittlesLawCalculator.jsx';
import { LittlesLawChallenge } from './LittlesLawChallenge.jsx';
import { TeamDataPanel } from './TeamDataPanel.jsx';

export function MetricsChapter() {
  const { state, actions } = useFlowLab();

  return (
    <section className="chapter chapter--spacious">
      <div className="metrics-cards">
        <LittlesLawCalculator law={state.littlesLaw} onChange={actions.changeLittlesLaw} />
        <LittlesLawChallenge pick={state.lawAnswer} onAnswer={actions.answerLawChallenge} />
      </div>
      <TeamDataPanel
        teamData={state.teamData}
        metrics={selectTeamData(state)}
        isAdvanced={state.path === 'advanced'}
        actions={actions}
      />
    </section>
  );
}
