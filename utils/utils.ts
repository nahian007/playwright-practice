import fs from 'fs';
import { parse } from 'csv-parse/sync';

export function readCSV(filePath: string) {
  const fileContent = fs.readFileSync(filePath);
  const dataRecords = parse(fileContent, {
    columns: true, // Uses header row as keys
    skip_empty_lines: true,
  });
  return dataRecords;
}