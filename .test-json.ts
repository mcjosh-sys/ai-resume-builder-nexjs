import { sanitizeAndParseJson } from './lib/utils';
const aiResponseArray = `[
  { "id": 1 },
  { "id": 2 }
]`;

try {
  console.log("Testing array response:");
  sanitizeAndParseJson(aiResponseArray);
  console.log("Success");
} catch (e) {
  console.error("Failed array:", e);
}

const aiResponseTextWrapped = `Here is your JSON:
[
  { "id": 1 },
  { "id": 2 }
]
Enjoy!`;

try {
  console.log("Testing wrapper text response:");
  sanitizeAndParseJson(aiResponseTextWrapped);
  console.log("Success");
} catch (e) {
  console.error("Failed wrapped:", e);
}
