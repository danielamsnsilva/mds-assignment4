import { CHAPTERS } from '../../config/chapters.js';
import { useFlowLab } from '../../state/FlowLabContext.jsx';
import { selectCurrentChapter } from '../../state/selectors.js';
import { chapterNumber } from './ChapterNav.jsx';

export function ChapterHeading() {
  const { state } = useFlowLab();
  const { key, index, total } = selectCurrentChapter(state);

  return (
    <div className="chapter-heading">
      <h6 className="kicker">
        Chapter {chapterNumber(index)} / {chapterNumber(total - 1)}
      </h6>
      <h2 className="chapter-heading__title">{CHAPTERS[key].title}</h2>
    </div>
  );
}
