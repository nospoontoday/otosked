import { createError } from '../utils/issueBuilders.js';

/**
 * Validates that time slots match the configured shift duration.
 *
 * @param {ExtractedConfig} config - Extracted configuration
 * @returns {Issue[]} Array of issues found
 */
export const validateShiftDuration = (config) => {
  const { shiftModel, timeSlots } = config;
  const issues = [];
  const shiftDuration = parseInt(shiftModel) || 12;

  timeSlots.forEach((slot) => {
    if (slot.duration && slot.duration !== shiftDuration) {
      issues.push(
        createError(
          'timeSlots',
          `Time slot "${slot.label}" has duration ${slot.duration}h but shift model is ${shiftDuration}h`,
          `Update time slots to match the ${shiftDuration}h shift model`
        )
      );
    }
  });

  return issues;
};
