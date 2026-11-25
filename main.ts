import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_ENTRY_CHARS = 199;
const JOKE: string =
  "My boss said I do the work of two people, which sounded like a raise until he asked why both of us missed the deadline.";

function validateEntry(text: string): void {
  if (text.length < 1 || text.length > MAX_ENTRY_CHARS) {
    throw new Error(`Entry length ${text.length} outside 1..${MAX_ENTRY_CHARS}`);
  }
  if (text.trim().length === 0 || /[\r\n]/.test(text)) {
    throw new Error("Entry must be a single non-blank line");
  }
}

function writeEntry(): void {
  validateEntry(JOKE);
  const envDir: string | undefined = process.env.MAKEFUN_OUTPUT_DIR?.trim();
  const outputDir: string = envDir && envDir.length > 0 ? envDir : "/output";
  const outputPath: string = join(outputDir, "entry.txt");

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputPath, JOKE, { encoding: "utf8", mode: 0o644 });
  chmodSync(outputPath, 0o644);
}

try {
  writeEntry();
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Failed to write entry.txt: ${message}\n`);
  process.exit(1);
}
