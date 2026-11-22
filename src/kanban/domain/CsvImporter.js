const MS_PER_DAY = 86400000;
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/** Header names (normalised) accepted for each column, in English and Portuguese. */
export const DEFAULT_HEADER_ALIASES = {
  id: ['key', 'issue key', 'id', 'issue id', 'work item', 'work item id', 'item', 'summary', 'title', 'task', 'tarefa', 'chave'],
  start: ['start', 'start date', 'started', 'started date', 'date started', 'cycle start', 'cycle start date', 'in progress date', 'data inicio', 'data de inicio', 'inicio'],
  finish: ['end', 'end date', 'finish', 'finish date', 'finished', 'finished date', 'date finished', 'cycle end', 'cycle end date', 'resolved', 'resolution date', 'completed', 'completion date', 'data fim', 'data de conclusao', 'fim'],
};

/**
 * H12: imports work items from a CSV export (Jira, GitHub, spreadsheets).
 * Detects the delimiter, finds the id/start/finish columns and turns dates
 * into day numbers counted from the first start date.
 */
export class CsvImporter {
  constructor({ headerAliases = DEFAULT_HEADER_ALIASES } = {}) {
    this.headerAliases = headerAliases;
  }

  /** Lower-case, accent-free, single-spaced header name. */
  static normalizeHeader(value) {
    return String(value || '')
      .trim()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  /** Picks the delimiter (comma, semicolon or tab) used most often in the header row. */
  static detectDelimiter(firstLine) {
    let delimiter = ',';
    let best = -1;
    [',', ';', '\t'].forEach((candidate) => {
      let count = 0;
      let quoted = false;
      for (let i = 0; i < firstLine.length; i++) {
        if (firstLine[i] === '"' && firstLine[i + 1] === '"') {
          i++;
          continue;
        }
        if (firstLine[i] === '"') quoted = !quoted;
        else if (firstLine[i] === candidate && !quoted) count++;
      }
      if (count > best) {
        best = count;
        delimiter = candidate;
      }
    });
    return delimiter;
  }

  /** RFC 4180-style parser: quoted fields, escaped quotes, CRLF or LF. Skips blank rows. */
  parseTable(text) {
    const source = String(text || '').replace(/^﻿/, '');
    const delimiter = CsvImporter.detectDelimiter(source.split(/\r?\n/, 1)[0] || '');
    const rows = [];
    let row = [];
    let cell = '';
    let quoted = false;

    for (let i = 0; i < source.length; i++) {
      const ch = source[i];
      if (quoted) {
        if (ch === '"' && source[i + 1] === '"') {
          cell += '"';
          i++;
        } else if (ch === '"') quoted = false;
        else cell += ch;
      } else if (ch === '"' && cell.length === 0) quoted = true;
      else if (ch === delimiter) {
        row.push(cell);
        cell = '';
      } else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && source[i + 1] === '\n') i++;
        row.push(cell);
        rows.push(row);
        row = [];
        cell = '';
      } else cell += ch;
    }
    if (quoted) throw new Error('CSV has an unclosed quoted field.');
    if (cell.length || row.length) {
      row.push(cell);
      rows.push(row);
    }
    return rows.filter((r) => r.some((value) => String(value).trim() !== ''));
  }

  /**
   * Accepts day numbers, ISO dates, DD/MM/YYYY, Jira dates (12/Nov/26) and
   * anything Date.parse understands.
   * @returns {{ kind: 'number' | 'date', day: number } | null}
   */
  parseDate(value) {
    const raw = String(value || '').trim();
    if (!raw) return null;

    if (/^\d+$/.test(raw)) {
      const day = Number(raw);
      return Number.isSafeInteger(day) ? { kind: 'number', day } : null;
    }

    const iso = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:$|[T\s])/);
    if (iso) return calendarDay(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));

    const dayMonthYear = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (dayMonthYear) {
      return calendarDay(Number(dayMonthYear[3]), Number(dayMonthYear[2]) - 1, Number(dayMonthYear[1]));
    }

    const jira = raw.match(/^(\d{1,2})[\s/-]+([A-Za-z]{3})[\s/-]+(\d{2,4})/);
    if (jira) {
      const month = MONTHS.indexOf(jira[2].toLowerCase());
      let year = Number(jira[3]);
      if (year < 100) year += year < 50 ? 2000 : 1900;
      if (month < 0) return null;
      return calendarDay(year, month, Number(jira[1]));
    }

    const parsed = Date.parse(raw);
    return Number.isFinite(parsed) ? { kind: 'date', day: Math.floor(parsed / MS_PER_DAY) } : null;
  }

  /**
   * @returns {{ rows: { id: string, start: number, finish: number }[], skipped: number, sourceLabel: string }}
   * @throws {Error} with a message that can be shown to the user
   */
  import(text) {
    const table = this.parseTable(text);
    if (table.length < 2) throw new Error('CSV must include a header and at least one work item.');

    const headers = table[0].map(CsvImporter.normalizeHeader);
    const findColumn = (aliases) => headers.findIndex((header) => aliases.includes(header));
    const idIndex = findColumn(this.headerAliases.id);
    const startIndex = findColumn(this.headerAliases.start);
    const finishIndex = findColumn(this.headerAliases.finish);
    if (idIndex < 0) {
      throw new Error('Could not find a work-item column. Add a header such as "Key", "ID" or "Summary".');
    }
    if (startIndex < 0 || finishIndex < 0) {
      throw new Error('Could not find start and finish date columns. Add headers such as "Start date" and "Finish date".');
    }

    const parsed = [];
    let skipped = 0;
    let kind = null;
    for (let i = 1; i < table.length; i++) {
      const record = table[i];
      const startText = record[startIndex] || '';
      const finishText = record[finishIndex] || '';
      if (!String(startText).trim() || !String(finishText).trim()) {
        skipped++;
        continue;
      }
      const start = this.parseDate(startText);
      const finish = this.parseDate(finishText);
      if (!start || !finish) throw new Error(`Invalid start or finish date on CSV row ${i + 1}.`);
      if (start.kind !== finish.kind || (kind && kind !== start.kind)) {
        throw new Error('Use either calendar dates or numeric day values consistently in the CSV.');
      }
      kind = start.kind;
      if (start.day < 0 || finish.day < start.day) {
        throw new Error(`Finish date must be on or after the start date on CSV row ${i + 1}.`);
      }
      const id = String(record[idIndex] || '').trim() || `Item ${i}`;
      parsed.push({ id, start: start.day, finish: finish.day });
    }
    if (!parsed.length) throw new Error('No work items with both start and finish dates were found.');

    const origin = kind === 'date' ? Math.min(...parsed.map((row) => row.start)) : 0;
    const rows = parsed.map((row) => ({ id: row.id, start: row.start - origin + 1, finish: row.finish - origin + 1 }));
    const originLabel = kind === 'date' ? new Date(origin * MS_PER_DAY).toISOString().slice(0, 10) : 'day values';
    return { rows, skipped, sourceLabel: `${parsed.length} items · days from ${originLabel}` };
  }
}

/** Validates a calendar date (rejects 31 February) and converts it to a UTC day number. */
function calendarDay(year, monthIndex, day) {
  const date = new Date(Date.UTC(year, monthIndex, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== monthIndex || date.getUTCDate() !== day) {
    return null;
  }
  return { kind: 'date', day: Math.floor(date.getTime() / MS_PER_DAY) };
}
