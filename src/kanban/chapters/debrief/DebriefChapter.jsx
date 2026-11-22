import { Blueprint } from '../../../shared/components/Blueprint.jsx';
import { getLearningPath } from '../../config/chapters.js';
import { REFERENCES } from '../../config/content.js';
import { ReviewPlanner } from '../../domain/ReviewPlanner.js';
import { useFlowLab } from '../../state/FlowLabContext.jsx';
import { selectCurrentChapter, selectProgress } from '../../state/selectors.js';
import { BadgeGrid } from './BadgeGrid.jsx';
import { CertificateForm } from './CertificateForm.jsx';
import { ReviewList } from './ReviewList.jsx';

function References() {
  return (
    <div>
      <h4>References</h4>
      <ol className="references">
        {REFERENCES.map((reference) => (
          <li key={reference.text}>
            {reference.text}
            {reference.link && (
              <>
                {' '}
                <a href={reference.link.href} target="_blank" rel="noopener noreferrer">
                  {reference.link.label}
                </a>
              </>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function DebriefChapter() {
  const { state, actions } = useFlowLab();
  const progress = selectProgress(state);
  const { keys } = selectCurrentChapter(state);
  const reviewPlan = new ReviewPlanner({
    pathId: state.path,
    quickChecks: state.quickChecks,
    sortAnswers: state.sortAnswers,
    lawAnswer: state.lawAnswer,
    quiz: state.quiz,
    xpLedger: state.xp,
  }).plan(keys);

  const downloadCertificate = (name) =>
    actions.downloadCertificate({
      name,
      xp: progress.xp,
      level: progress.level,
      rank: progress.rank,
      badges: progress.earnedBadges.map((badge) => badge.name),
      pathLabel: getLearningPath(state.path).label,
    });

  return (
    <section className="chapter chapter--debrief">
      <div className="debrief-summary">
        <div>
          <div className="debrief-summary__xp">{progress.xp} XP</div>
          <div className="debrief-summary__level">
            Level {progress.level} · {progress.rank}
          </div>
        </div>
        <p className="debrief-summary__takeaways">
          Three ideas to take back to your team: limit WIP to shorten cycle time, read the CFD to spot growing queues,
          and forecast with percentiles instead of averages.
        </p>
      </div>

      <BadgeGrid badges={progress.badges} />
      <ReviewList plan={reviewPlan} onGoToChapter={actions.goToChapter} onOpenGlossary={actions.openGlossary} />
      <CertificateForm
        name={state.ui.certificateName}
        onNameChange={actions.setCertificateName}
        onDownload={downloadCertificate}
      />

      <div className="button-row">
        <Blueprint as="button" type="button" onClick={actions.openChat} className="btn btn-primary btn-tall btn-wide">
          Ask FlowBot a question
        </Blueprint>
        <button type="button" onClick={actions.restart} className="btn btn-secondary btn-tall">
          Start over
        </button>
      </div>

      <References />
    </section>
  );
}
