import path from "path";
import { readFile } from "fs/promises";

type CsvRow = Record<string, string>;

const csvCache = new Map<string, Promise<CsvRow[]>>();

function getCsvDirectory(): string {
  return path.join(process.cwd(), "data");
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function parseCsv(content: string): CsvRow[] {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    return [];
  }

  const headers = parseCsvLine(lines[0]).map((header) => header.trim());

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: CsvRow = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    return row;
  });
}

export async function readCsvRows(fileName: string): Promise<CsvRow[]> {
  if (csvCache.has(fileName)) {
    return csvCache.get(fileName)!;
  }

  const loader = (async () => {
    const fullPath = path.join(getCsvDirectory(), fileName);
    const content = await readFile(fullPath, "utf-8");
    return parseCsv(content);
  })();

  csvCache.set(fileName, loader);
  return loader;
}
