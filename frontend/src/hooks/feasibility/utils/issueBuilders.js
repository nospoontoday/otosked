/**
 * Creates an error issue object.
 * @param {string} category - The issue category
 * @param {string} message - The issue message
 * @param {string} suggestion - How to fix the issue
 * @returns {Issue}
 */
export const createError = (category, message, suggestion) => ({
  type: 'error',
  category,
  message,
  suggestion,
});

/**
 * Creates a warning issue object.
 * @param {string} category - The issue category
 * @param {string} message - The warning message
 * @param {string} suggestion - How to address the warning
 * @returns {Issue}
 */
export const createWarning = (category, message, suggestion) => ({
  type: 'warning',
  category,
  message,
  suggestion,
});

/**
 * Creates an info issue object.
 * @param {string} category - The issue category
 * @param {string} message - The informational message
 * @param {string} suggestion - Additional context or tip
 * @returns {Issue}
 */
export const createInfo = (category, message, suggestion) => ({
  type: 'info',
  category,
  message,
  suggestion,
});
