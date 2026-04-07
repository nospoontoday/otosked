import { createError } from '../utils/issueBuilders.js';

/**
 * Validates basic schedule configuration parameters.
 * Checks that shifts per week and rest days are logically consistent.
 *
 * @param {ExtractedConfig} config - Extracted configuration
 * @returns {Issue[]} Array of issues found
 */
export const validateScheduleConfig = (config) => {
  const { shiftPerWeek, restDays } = config;
  const issues = [];

  if (shiftPerWeek + restDays > 7) {
    issues.push(
      createError(
        'schedule',
        `Total schedule exceeds 7 days (${shiftPerWeek} shifts + ${restDays} rest days = ${shiftPerWeek + restDays})`,
        `Reduce shifts per week or rest days to fit within 7 days`
      )
    );
  }

  if (shiftPerWeek < 1) {
    issues.push(
      createError(
        'schedule',
        `Invalid shifts per week: ${shiftPerWeek}`,
        `Set shifts per week to at least 1`
      )
    );
  }

  if (restDays < 0) {
    issues.push(
      createError(
        'schedule',
        `Invalid rest days: ${restDays}`,
        `Set rest days to 0 or more`
      )
    );
  }

  return issues;
};
