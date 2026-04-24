/**
 * Runtime validation for LLM outputs.
 * Validates that required string fields are present and non-empty.
 * Throws a descriptive error on failure so callers can show user feedback.
 */

/**
 * Assert that `output` is a non-null object with all `requiredFields` as non-empty strings.
 * @param {unknown} output - The raw LLM response
 * @param {string[]} requiredFields - Field names that must exist and be non-empty strings
 * @param {string} context - Label shown in error messages (e.g. "Listing Generator")
 * @returns {object} The validated output (typed as object for safe destructuring)
 */
export function validateLLMOutput(output, requiredFields, context = "AI") {
  if (!output || typeof output !== "object" || Array.isArray(output)) {
    throw new Error(`${context}: received an unexpected response format. Please try again.`);
  }

  const missing = requiredFields.filter(
    (field) => typeof output[field] !== "string" || output[field].trim() === ""
  );

  if (missing.length > 0) {
    throw new Error(
      `${context}: the AI response was incomplete (missing: ${missing.join(", ")}). Please try again.`
    );
  }

  return output;
}