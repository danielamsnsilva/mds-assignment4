import { Blueprint } from '../../../shared/components/Blueprint.jsx';
import { RangeField } from '../../components/common/RangeField.jsx';
import { NO_WIP_LIMIT } from '../../domain/FlowSimulation.js';

export function SimulatorControls({ config, running, actions }) {
  return (
    <Blueprint className="simulator-controls">
      <RangeField
        label="Arrivals per day (avg)"
        value={config.arrivalRate}
        min="1"
        max="4"
        step="0.5"
        onChange={(value) => actions.configureSimulation('arrivalRate', value)}
      />
      <RangeField
        label="Team capacity (effort/day)"
        value={config.capacity}
        min="2"
        max="8"
        step="1"
        onChange={(value) => actions.configureSimulation('capacity', value)}
      />
      <RangeField
        label="WIP limit"
        value={config.wipLimit}
        displayValue={config.wipLimit >= NO_WIP_LIMIT ? 'No limit' : config.wipLimit}
        min="1"
        max={String(NO_WIP_LIMIT)}
        step="1"
        onChange={(value) => actions.configureSimulation('wipLimit', value)}
      />
      <p className="caption simulator-controls__hint">
        Set the slider to {NO_WIP_LIMIT} to remove the WIP limit. Items need 1–3 effort units each.
      </p>
      <div className="button-row button-row--tight">
        <Blueprint as="button" type="button" onClick={actions.toggleSimulationRun} className="btn btn-primary btn-medium">
          {running ? 'Pause' : 'Run 30 days'}
        </Blueprint>
        <button type="button" onClick={actions.stepSimulation} className="btn btn-secondary btn-medium">
          +1 day
        </button>
        <button type="button" onClick={actions.resetSimulation} className="btn btn-secondary btn-medium">
          Reset
        </button>
      </div>
    </Blueprint>
  );
}
