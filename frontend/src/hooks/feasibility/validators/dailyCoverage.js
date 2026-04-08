import { createError, createWarning } from '../utils/issueBuilders.js';

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * Calculates how many nurses are available and their total shift capacity for each day.
 *
 * @param {Nurse[]} nurses - Array of nurses
 * @returns {{ nursesPerDay: Object.<string, {nurseCount: number, shiftCapacity: number}>, shiftsAvailablePerDay: Object.<string, number> }}
 */
export const calculateDailyNurseAvailability = (nurses) => {
  const nursesPerDay = {};
  const shiftsAvailablePerDay = {};

  ALL_DAYS.forEach((day) => {
    const availableNurses = nurses.filter((nurse) => {
      const days = nurse.availableDays || [];
      return days.includes(day);
    });
    nursesPerDay[day] = availableNurses.length;
    shiftsAvailablePerDay[day] = availableNurses.reduce(
      (sum, n) => sum + (n.maxShiftsPerWeek || 3),
      0
    );
  });

  return { nursesPerDay, shiftsAvailablePerDay };
};

/**
 * Validates that there are enough nurses available each day to meet staffing requirements.
 * Generates errors when coverage is insufficient and warnings for tight staffing.
 *
 * @param {Object} params - Validation parameters
 * @param {Nurse[]} params.nurses - Array of nurses
 * @param {number} params.totalNursesPerShift - Required nurses per shift
 * @param {number} params.shiftsPerDay - Number of shifts per day
 * @param {number} params.nursesPerDay - Available nurses per day map
 * @param {number} params.shiftsAvailablePerDay - Available shifts per day map
 * @returns {{ issues: Issue[], warnings: Issue[] }}
 */
export const validateDailyCoverage = ({
  nurses,
  totalNursesPerShift,
  shiftsPerDay,
  nursesPerDay,
  shiftsAvailablePerDay,
}) => {
  const issues = [];
  const warnings = [];

  if (nurses.length === 0) {
    return { issues, warnings };
  }

  const minNursesNeeded = totalNursesPerShift;
  const minShiftsPerDay = totalNursesPerShift * shiftsPerDay;

  ALL_DAYS.forEach((day) => {
    const availableCount = nursesPerDay[day];
    const shiftsCount = shiftsAvailablePerDay[day];

    if (availableCount < minNursesNeeded) {
      issues.push(
        createError(
          'nurses',
          `Only ${availableCount} nurse(s) available on ${day} (need ${minNursesNeeded})`,
          `Add more nurses with ${day} in their availability or reduce staffing requirements`
        )
      );
    } else if (shiftsCount < minShiftsPerDay) {
      issues.push(
        createError(
          'nurses',
          `Available shifts (${shiftsCount}) on ${day} less than needed (${minShiftsPerDay})`,
          `Nurses available on ${day} can't cover all shifts`
        )
      );
    } else if (availableCount < minNursesNeeded + 2) {
      warnings.push(
        createWarning(
          'nurses',
          `Only ${availableCount} nurse(s) available on ${day} - tight staffing`,
          'Consider adding more nurses for flexibility'
        )
      );
    }
  });

  return { issues, warnings };
};
