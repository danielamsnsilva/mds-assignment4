import { Blueprint } from '../../../shared/components/Blueprint.jsx';
import { LEARNING_PATHS } from '../../config/chapters.js';
import { HEADLINE_METRICS } from '../../config/content.js';
import { useFlowLab } from '../../state/FlowLabContext.jsx';

function PathCard({ path, selected, onChoose }) {
  return (
    <Blueprint as="button" type="button" onClick={onChoose} className={`path-card${selected ? ' is-selected' : ''}`}>
      <span className="path-card__kicker">{path.kicker}</span>
      <span className="path-card__name">{path.name}</span>
      <span className="path-card__description">{path.description}</span>
      <span className="path-card__cta">{path.cta}</span>
    </Blueprint>
  );
}

export function StartChapter() {
  const { state, actions } = useFlowLab();

  return (
    <section className="chapter chapter--spacious">
      <div className="start-hero">
        <div>
          <h6 className="kicker">Interactive field manual · Theme 2</h6>
          <h1 className="start-hero__title">Make work flow.</h1>
          <p className="start-hero__lead">
            Choose the path that fits your experience and learn to visualize, manage, and improve workflow.
          </p>
        </div>
        <Blueprint className="start-hero__metrics">
          {HEADLINE_METRICS.map((metric) => (
            <div key={metric.abbreviation}>
              <div className="start-hero__abbr">{metric.abbreviation}</div>
              <div className="caption">{metric.text}</div>
            </div>
          ))}
        </Blueprint>
      </div>

      <div>
        <h3>Choose your path</h3>
        <div className="path-grid">
          {Object.values(LEARNING_PATHS).map((path) => (
            <PathCard
              key={path.id}
              path={path}
              selected={state.path === path.id}
              onChoose={() => actions.choosePath(path.id)}
            />
          ))}
        </div>
        <p className="note start__storage-note">Progress and badges are saved in this browser.</p>
      </div>
    </section>
  );
}
