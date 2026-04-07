import { createWarning } from '../utils/issueBuilders.js';

/**
 * Validates rest and consecutive shift constraints.
 * These are soft constraints that may generate warnings.
 *
 * @param {ExtractedConfig} config - Extracted configuration
 * @returns {Issue[]} Array of issues found
 */
export const validateRestConstraints = (config) => {
  const { maxConsec, minRest, shiftPerWeek } = config;
  const issues = [];

  if (maxConsec && maxConsec > shiftPerWeek) {
    issues.push(
      createWarning(
        'constraints',
        `Max consecutive shifts (${maxConsec}) exceeds shifts per week (${shiftPerWeek})`,
        'This constraint will never be triggered'
      )
    );
  }

  if (minRest && minRest > 24) {
    issues.push(
      createWarning(
        'constraints',
        `Minimum rest hours (${minRest}h) is more than 24h - shifts may not be possible`,
        'Consider reducing minimum rest hours'
      )
    );
  }

  return issues;
};
