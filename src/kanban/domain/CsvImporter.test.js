import { describe, expect, it } from 'vitest';
import { MDS26_CSV } from '../config/teamData.js';
import { CsvImporter } from './CsvImporter.js';

const importer = new CsvImporter();

describe('CsvImporter', () => {
  it('imports the MDS26 sample as day numbers from the first start date', () => {
    const result = importer.import(MDS26_CSV);
    expect(result.rows).toEqual([
      { id: 'PR-1', start: 1, finish: 3 },
      { id: 'PR-2', start: 3, finish: 3 },
    ]);
    expect(result.sourceLabel).toBe('2 items · days from 2026-11-14');
  });

  it('detects semicolons, quoted fields and Portuguese headers', () => {
    const csv = 'Tarefa;Data de início;Data fim\n"A; with semicolon";1;4\nB;2;2';
    // Numeric day values are shifted by +1, as in the original implementation.
    expect(importer.import(csv).rows).toEqual([
      { id: 'A; with semicolon', start: 2, finish: 5 },
      { id: 'B', start: 3, finish: 3 },
    ]);
  });

  it('skips items without both dates', () => {
    const result = importer.import('Key,Start date,Finish date\nA,1,3\nB,2,');
    expect(result.skipped).toBe(1);
    expect(result.rows).toHaveLength(1);
  });

  it('parses Jira and day-first dates and rejects impossible ones', () => {
    expect(importer.parseDate('12/Nov/26 10:00 AM')).toEqual(importer.parseDate('2026-11-12'));
    expect(importer.parseDate('12/11/2026')).toEqual(importer.parseDate('2026-11-12'));
    expect(importer.parseDate('2026-02-31')).toBeNull();
  });

  it('explains what is wrong with an invalid file', () => {
    expect(() => importer.import('Name,Other\nA,B')).toThrow(/work-item column/);
    expect(() => importer.import('Key,Start,Finish\nA,5,2')).toThrow(/on or after the start date on CSV row 2/);
    expect(() => importer.import('Key,Start,Finish\nA,1,2026-01-01')).toThrow(/consistently/);
    expect(() => importer.import('Key,Start,Finish\n"A,1,2')).toThrow(/unclosed quoted field/);
  });
});
