import { KanbanCard } from './KanbanCard.jsx';

/** A workflow column and its cards. Accepts cards dropped from the next column over. */
export function BoardColumn({ board, columnIndex, p85, actions, onDragCard, onDropCard }) {
  const column = board.columns[columnIndex];
  const cards = board.cardsIn(columnIndex);
  const limitLabel = column.wipLimit ? `WIP ${cards.length}/${column.wipLimit}` : `${cards.length}`;

  return (
    <div
      className="board-column"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onDropCard(columnIndex);
      }}
    >
      <div className={`board-column__header${board.isColumnFull(columnIndex) ? ' is-full' : ''}`}>
        <span className="board-column__name">{column.name}</span>
        <span className="board-column__limit">{limitLabel}</span>
      </div>
      <div className="board-column__cards">
        {cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            age={board.ageOf(card, p85)}
            canMoveLeft={columnIndex > 0}
            canMoveRight={columnIndex < board.lastColumnIndex}
            onMove={(direction) => actions.moveCard(card.id, direction)}
            onUnblock={() => actions.unblockCard(card.id)}
            onDragStart={(event) => onDragCard(card.id, event)}
          />
        ))}
      </div>
    </div>
  );
}
