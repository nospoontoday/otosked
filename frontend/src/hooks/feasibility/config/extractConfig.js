/**
 * Default departments used when none are configured.
 * @type {Department[]}
 */
const DEFAULT_DEPARTMENTS = [
  { name: 'ICU', nursesPerShift: 1, doctorsPerShift: 1 },
  { name: 'ER', nursesPerShift: 2, doctorsPerShift: 1 },
  { name: 'General Ward', nursesPerShift: 3, doctorsPerShift: 1 },
];

/**
 * Extracts configuration from store with sensible defaults.
 * Centralizes all default value handling in one place.
 *
 * @param {FeasibilityConfig} store - Raw config from store
 * @returns {ExtractedConfig} - Config with defaults applied
 */
export const extractConfig = (store) => {
  const {
    selectedShiftModel,
    shiftsPerNursePerWeek,
    restDaysPerNurse,
    scheduleLengthWeeks,
    dailyShiftSlots,
    maxConsecutiveShifts,
    minRestHours,
    selectedRestPattern,
  } = store;

  return {
    shiftModel: selectedShiftModel || '12h',
    shiftPerWeek: shiftsPerNursePerWeek || 3,
    restDays: restDaysPerNurse || 4,
    duration: scheduleLengthWeeks || 1,
    timeSlots: dailyShiftSlots || [],
    departments: store.departments || DEFAULT_DEPARTMENTS,
    nurses: store.nurses || [],
    maxConsec: maxConsecutiveShifts ?? 3,
    minRest: minRestHours ?? 12,
    selectedRestPattern: selectedRestPattern || null,
  };
};
