import { Blueprint } from '../../../shared/components/Blueprint.jsx';
import { RangeField } from '../../components/common/RangeField.jsx';
import { BOTTLENECK_CHALLENGE, STAGES, peopleAssigned } from '../../domain/StageFlowSimulation.js';

const { teamSize, minPeoplePerStage, defaultStaffing } = BOTTLENECK_CHALLENGE;
const maxPerStage = teamSize - minPeoplePerStage * (STAGES.length - 1);
const describeStaffing = (staffing) => STAGES.map((stage) => staffing[stage.key]).join(' / ');

/** People per stage (fixed team size) and the run buttons. */
export function StageControls({ staffing, running, actions }) {
  const assigned = peopleAssigned(staffing);

  return (
    <Blueprint className="simulator-controls">
      {STAGES.map((stage) => (
        <RangeField
          key={stage.key}
          label={`People in ${stage.name}`}
          value={staffing[stage.key]}
          min={String(minPeoplePerStage)}
          max={String(maxPerStage)}
          step="1"
          onChange={(value) => actions.staffStage(stage.key, value)}
        />
      ))}
      <p className="caption simulator-controls__hint" aria-live="polite">
        People assigned: {assigned} / {teamSize}.{' '}
        {assigned >= teamSize
          ? 'The team is fully assigned: to add someone to a stage, take a person from another stage first.'
          : `${teamSize - assigned} free.`}{' '}
        Each person does 1 effort unit per day; each item needs 0.5–1.5 units in every stage.
      </p>
      <div className="button-row button-row--tight">
        <Blueprint
          as="button"
          type="button"
          onClick={actions.toggleStageSimulationRun}
          className="btn btn-primary btn-medium"
        >
          {running ? 'Pause' : 'Run 30 days'}
        </Blueprint>
        <button type="button" onClick={actions.stepStageSimulation} className="btn btn-secondary btn-medium">
          +1 day
        </button>
        <button type="button" onClick={actions.resetStageSimulation} className="btn btn-secondary btn-medium">
          Reset
        </button>
      </div>
      <button type="button" onClick={actions.restoreStaffing} className="btn btn-secondary btn-medium">
        Starting staffing ({describeStaffing(defaultStaffing)})
      </button>
    </Blueprint>
  );
}
