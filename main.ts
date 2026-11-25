// Snooze Button Roast — one line roasting an alarm clock that rings at 6 AM on a Saturday.
// Writes the entry to /output/entry.txt. Gate: UTF-8 text, 1-200 chars, single line, non-blank.
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const ENTRY =
  "My alarm clock went off at 6 AM on Saturday, buzzing like a wasp with a timesheet and a grudge against weekends.";

const OUT_DIR = "/output";
const OUT_FILE = `${OUT_DIR}/entry.txt`;

// Fail-fast gate validation before writing anything.
if (ENTRY.length < 1 || ENTRY.length > 200) {
  throw new Error(`gate failed: entry is ${ENTRY.length} chars, must be 1-200`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("gate failed: entry is only whitespace");
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("gate failed: entry must be a single line");
}

// /output is a mounted directory: empty its CONTENTS only, never remove the dir itself.
mkdirSync(OUT_DIR, { recursive: true });
for (const name of readdirSync(OUT_DIR)) {
  rmSync(`${OUT_DIR}/${name}`, { recursive: true, force: true });
}

writeFileSync(OUT_FILE, ENTRY, "utf8");

// Post-write read-back verification: the file on disk must be byte-identical
// to the entry we validated, otherwise the run is not trustworthy.
const written = readFileSync(OUT_FILE, "utf8");
if (written !== ENTRY) {
  throw new Error("verification failed: /output/entry.txt does not match the entry");
}
console.log(`wrote ${OUT_FILE} (${ENTRY.length} chars)`);
