import { createError, createWarning } from '../utils/issueBuilders.js';

/**
 * Parses a time string like "07:00" into an integer like 700.
 * @param {string} timeStr - Time string in HH:MM format
 * @returns {number}
 */
const parseTime = (timeStr) => parseInt(timeStr.replace(':', ''));

/**
 * Checks if a time slot falls within a nurse's availability window.
 * Handles overnight shifts (where end time is less than start time).
 *
 * @param {string} slotStart - Slot start time
 * @param {string} slotEnd - Slot end time
 * @param {string} nurseStart - Nurse availability start
 * @param {string} nurseEnd - Nurse availability end
 * @returns {boolean}
 */
const slotOverlapsAvailability = (slotStart, slotEnd, nurseStart, nurseEnd) => {
  let sStart = parseTime(slotStart);
  let sEnd = parseTime(slotEnd);
  const nStart = parseTime(nurseStart);
  const nEnd = parseTime(nurseEnd);

  if (sEnd < sStart) sEnd += 2400;
  if (nEnd < nStart) return false;

  return sStart >= nStart && sEnd <= nEnd;
};

/**
 * Validates individual nurse availability settings.
 * Checks for missing days and partial time windows.
 *
 * @param {Nurse[]} nurses - Array of nurses
 * @param {TimeSlot[]} timeSlots - Available time slots
 * @returns {{ issues: Issue[], warnings: Issue[] }}
 */
export const validateNurseAvailability = (nurses, timeSlots) => {
  const issues = [];
  const warnings = [];

  if (nurses.length === 0) {
    issues.push(
      createError('nurses', 'No nurses defined', 'Add at least one nurse to the project')
    );
    return { issues, warnings };
  }

  nurses.forEach((nurse, index) => {
    const nurseName = nurse.name || `Nurse ${index + 1}`;
    const availableDays = nurse.availableDays || [];

    if (availableDays.length === 0) {
      issues.push(
        createError(
          'nurses',
          `${nurseName} has no available days set`,
          `Set available days for ${nurseName} or use all days`
        )
      );
    }

    if (nurse.availableStartTime || nurse.availableEndTime) {
      if (!nurse.availableStartTime || !nurse.availableEndTime) {
        warnings.push(
          createWarning(
            'nurses',
            `${nurseName} has partial time availability set (only start or end time)`,
            `Set both start and end time for ${nurseName} or leave both empty`
          )
        );
      }
    }

    if (nurse.availableStartTime && nurse.availableEndTime) {
      timeSlots.forEach((slot) => {
        if (!slot.start || !slot.end) return;

        if (
          !slotOverlapsAvailability(
            slot.start,
            slot.end,
            nurse.availableStartTime,
            nurse.availableEndTime
          )
        ) {
          warnings.push(
            createWarning(
              'nurses',
              `Nurse "${nurse.name}" availability (${nurse.availableStartTime}-${nurse.availableEndTime}) may not cover "${slot.label}"`,
              `Adjust hours for ${nurse.name} or the shift time`
            )
          );
        }
      });
    }
  });

  return { issues, warnings };
};
