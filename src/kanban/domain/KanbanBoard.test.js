import { describe, expect, it } from 'vitest';
import { createInitialCards } from '../config/board.js';
import { KanbanBoard } from './KanbanBoard.js';

const board = () => new KanbanBoard(createInitialCards());

describe('KanbanBoard', () => {
  it('only moves cards one column at a time', () => {
    expect(board().moveTo(105, 2)).toMatchObject({ status: 'rejected', wipLimitHit: false });
  });

  it('refuses to move a blocked card right, but allows it left', () => {
    expect(board().move(101, 1).message).toBe('#101 is blocked. Swarm on it before it can move.');
    expect(board().move(101, -1).status).toBe('moved');
  });

  it('enforces the WIP limit of the target column', () => {
    const outcome = board().move(105, 1);
    expect(outcome).toMatchObject({ status: 'rejected', wipLimitHit: true });
    expect(outcome.message).toContain('In progress (3/3)');
  });

  it('ignores moves past the board edges and unknown cards', () => {
    expect(board().move(105, -1).status).toBe('ignored');
    expect(board().move(999, 1).status).toBe('ignored');
  });

  it('starts the clock when a card leaves To do and clears it when it goes back', () => {
    const b = new KanbanBoard(board().unblock(101));
    const moved = new KanbanBoard(b.move(104, 1).cards); // Review → Done frees Review
    const toReview = new KanbanBoard(moved.move(102, 1).cards); // In progress → Review keeps start
    expect(toReview.findCard(102).startDay).toBe(6);
    const pulled = new KanbanBoard(toReview.move(105, 1).cards);
    expect(pulled.findCard(105).startDay).toBe(10);
    expect(new KanbanBoard(pulled.move(105, -1).cards).findCard(105).startDay).toBeNull();
  });

  it('computes work item age for cards in progress only', () => {
    const b = board();
    expect(b.ageOf(b.findCard(101), 5)).toEqual({ age: 9, isOld: true });
    expect(b.ageOf(b.findCard(103), 5)).toEqual({ age: 3, isOld: false });
    expect(b.ageOf(b.findCard(105), 5)).toBeNull();
  });

  it('is cleared when every card is done', () => {
    const cards = createInitialCards().map((c) => ({ ...c, column: 3 }));
    expect(new KanbanBoard(cards).isCleared).toBe(true);
    expect(board().isCleared).toBe(false);
  });
});
