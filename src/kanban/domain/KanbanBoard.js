import { BOARD_COLUMNS, BOARD_TODAY, DEFAULT_START_DAYS } from '../config/board.js';
import { cycleTimeDays } from './statistics.js';

/**
 * Rules of the practice board: cards move one column at a time, blocked cards
 * can't move right, and a column refuses cards once it reaches its WIP limit.
 * Instances never change; every move returns new card objects.
 */
export class KanbanBoard {
  constructor(
    cards,
    { columns = BOARD_COLUMNS, today = BOARD_TODAY, defaultStartDays = DEFAULT_START_DAYS } = {},
  ) {
    this.cards = cards;
    this.columns = columns;
    this.today = today;
    this.defaultStartDays = defaultStartDays;
  }

  get lastColumnIndex() {
    return this.columns.length - 1;
  }

  findCard(cardId) {
    return this.cards.find((card) => card.id === cardId) ?? null;
  }

  cardsIn(columnIndex) {
    return this.cards.filter((card) => card.column === columnIndex);
  }

  isColumnFull(columnIndex) {
    const { wipLimit } = this.columns[columnIndex];
    return wipLimit > 0 && this.cardsIn(columnIndex).length >= wipLimit;
  }

  get doneCount() {
    return this.cardsIn(this.lastColumnIndex).length;
  }

  get isCleared() {
    return this.cards.length > 0 && this.doneCount === this.cards.length;
  }

  /** A column between the first and the last is "in progress". */
  isInProgressColumn(columnIndex) {
    return columnIndex > 0 && columnIndex < this.lastColumnIndex;
  }

  startDayOf(card) {
    return card.startDay !== undefined ? card.startDay : (this.defaultStartDays[card.id] ?? null);
  }

  /**
   * H10 work item age, for cards in progress only.
   * @returns {{ age: number, isOld: boolean } | null}
   */
  ageOf(card, p85CycleTime) {
    if (!this.isInProgressColumn(card.column)) return null;
    const startDay = this.startDayOf(card);
    const age = startDay == null ? 1 : cycleTimeDays(startDay, this.today);
    return { age, isOld: p85CycleTime > 0 && age > p85CycleTime };
  }

  /** Ages of every card in progress. */
  agesInProgress(p85CycleTime) {
    return this.cards.map((card) => this.ageOf(card, p85CycleTime)).filter(Boolean);
  }

  move(cardId, direction) {
    const card = this.findCard(cardId);
    if (!card) return { status: 'ignored' };
    return this.moveTo(cardId, card.column + direction);
  }

  /**
   * @returns {{ status: 'ignored' }
   *   | { status: 'rejected', message: string, wipLimitHit: boolean }
   *   | { status: 'moved', cards: object[], column: { name: string } }}
   */
  moveTo(cardId, targetColumn) {
    const card = this.findCard(cardId);
    if (!card || targetColumn < 0 || targetColumn > this.lastColumnIndex || targetColumn === card.column) {
      return { status: 'ignored' };
    }
    if (Math.abs(targetColumn - card.column) !== 1) {
      return rejected('Move one column at a time — every state in the workflow matters.');
    }
    if (card.blocked && targetColumn > card.column) {
      return rejected(`#${cardId} is blocked. Swarm on it before it can move.`);
    }

    const column = this.columns[targetColumn];
    const count = this.cardsIn(targetColumn).length;
    if (column.wipLimit && count >= column.wipLimit) {
      return rejected(
        `WIP limit reached in ${column.name} (${count}/${column.wipLimit}). Stop starting, start finishing: move something further right first.`,
        true,
      );
    }

    // Back to "To do" clears the start; leaving "To do" starts the clock today.
    const startDay = targetColumn === 0 ? null : card.column === 0 ? this.today : this.startDayOf(card);
    const cards = this.cards.map((c) => (c.id === cardId ? { ...c, column: targetColumn, startDay } : c));
    return { status: 'moved', cards, column };
  }

  unblock(cardId) {
    return this.cards.map((card) => (card.id === cardId ? { ...card, blocked: false } : card));
  }
}

function rejected(message, wipLimitHit = false) {
  return { status: 'rejected', message, wipLimitHit };
}
