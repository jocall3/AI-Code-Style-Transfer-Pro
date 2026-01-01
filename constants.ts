
export const MAX_CODE_LENGTH = 1_000_000;
export const MAX_STYLE_GUIDE_LENGTH = 100_000;
export const MAX_CONCURRENT_REQUESTS_PER_USER = 5;
export const AI_RESPONSE_TIMEOUT_MS = 120_000;
export const DEFAULT_AI_TEMPERATURE = 0.7;
export const DEFAULT_AI_TOP_P = 0.9;
export const DEFAULT_AI_MAX_TOKENS = 4096;

export const exampleCode = `function calculateSum(a, b) {
  var result = a + b;
  console.log("Adding " + a + " and " + b);
  return result;
}

const list = [1, 2, 3];
list.forEach(function(item) {
  processItem(item);
});

function processItem(i) {
  if(i == 5) {
     eval("alert('unsafe')");
  }
  return i * 2;
}`;

export const exampleStyleGuide = `- Use 'const' and 'let' instead of 'var'.
- Use arrow functions for callbacks.
- Use strict equality (===).
- Prefer template literals for string concatenation.
- Remove console.log statements.
- Avoid using 'eval' for security.
- Add JSDoc comments to functions.
- Use 2-space indentation.`;
