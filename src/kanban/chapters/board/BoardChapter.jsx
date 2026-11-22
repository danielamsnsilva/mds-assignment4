import { useRef } from 'react';
import { BOARD_TODAY } from '../../config/board.js';
import { GlossaryTerm } from '../../components/common/GlossaryTerm.jsx';
import { MessageBox } from '../../components/common/MessageBox.jsx';
import { Stat } from '../../components/common/StatGrid.jsx';
import { useFlowLab } from '../../state/FlowLabContext.jsx';
import { selectBoard, selectTeamData } from '../../state/selectors.js';
import { BoardColumn } from './BoardColumn.jsx';

export function BoardChapter() {
  const { state, actions } = useFlowLab();
  const draggedCardId = useRef(null);
  const board = selectBoard(state);
  // H10: ageing is judged against the team's P85 cycle time from the Metrics chapter.
  const p85 = selectTeamData(state).agingThreshold;
  const ages = board.agesInProgress(p85);
  const totalCards = board.cards.length;

  const handleDragCard = (cardId, event) => {
    draggedCardId.current = cardId;
    try {
      event.dataTransfer.setData('text/plain', String(cardId));
    } catch {
      // Some browsers refuse custom drag data; the ref is enough.
    }
  };

  return (
    <section className="chapter chapter--compact">
      <div className="board-intro">
        <p className="lead lead--board">
          <strong>Challenge:</strong> move all {totalCards} cards to Done. Drag a card to the next column, or use its
          arrows. Columns with a <GlossaryTerm term="wipLimit">WIP limit</GlossaryTerm> refuse new cards when full, and{' '}
          <GlossaryTerm term="blocked">blocked</GlossaryTerm> cards can't move until the team{' '}
          <GlossaryTerm term="swarm">swarms</GlossaryTerm> on them.
        </p>
        <div className="board-intro__stats">
          <Stat value={state.board.moves} label="moves" />
          <Stat value={state.board.wipLimitHits} label="WIP limit hits" />
          <Stat value={`${board.doneCount}/${totalCards}`} label="done" />
        </div>
      </div>

      <MessageBox highlighted={board.isCleared} className="message-box--tall">
        {state.board.message}
      </MessageBox>

      <p className="body-note board__age-note">
        <strong>
          <GlossaryTerm term="age">Work item age</GlossaryTerm>.
        </strong>{' '}
        Today is day {BOARD_TODAY} on this board. Cards in progress show how many days ago they started.{' '}
        {ages.filter((a) => a.isOld).length} of {ages.length} are older than the team's 85th percentile cycle time ({p85}{' '}
        days, from the Metrics chapter) and are highlighted: finish or unblock those first.
      </p>

      <div className="board-columns">
        {board.columns.map((column, columnIndex) => (
          <BoardColumn
            key={column.name}
            board={board}
            columnIndex={columnIndex}
            p85={p85}
            actions={actions}
            onDragCard={handleDragCard}
            onDropCard={(target) => actions.dropCard(draggedCardId.current, target)}
          />
        ))}
      </div>

      <div className="button-row">
        <button type="button" onClick={actions.resetBoard} className="btn btn-secondary">
          Reset board
        </button>
      </div>
    </section>
  );
}
