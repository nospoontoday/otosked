/**
 * Parses a time string "HH:MM" to minutes since midnight.
 * @param {string} timeStr - Time string in HH:MM format
 * @returns {number} Minutes since midnight
 */
const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Checks if a nurse's availability window fully covers a shift.
 * Handles overnight shifts (end time < start time means crosses midnight).
 * @param {Nurse} nurse - Nurse with availability
 * @param {TimeSlot} slot - Shift slot with start and end times
 * @returns {boolean} True if nurse fully covers the shift
 */
const shiftFullyCovered = (nurse, slot) => {
  if (!nurse.availableStartTime && !nurse.availableEndTime) return true;
  if (!nurse.availableStartTime || !nurse.availableEndTime) return false;

  const nurseStart = parseTimeToMinutes(nurse.availableStartTime);
  const nurseEnd = parseTimeToMinutes(nurse.availableEndTime);
  const slotStart = parseTimeToMinutes(slot.start);
  const slotEnd = parseTimeToMinutes(slot.end);

  return nurseStart <= slotStart && nurseEnd >= slotEnd;
};

/**
 * Counts valid shifts a nurse can work based on day and hour availability.
 * Only counts shifts where the nurse's availability fully covers the shift.
 *
 * @param {Nurse} nurse - Nurse object
 * @param {TimeSlot[]} timeSlots - Available shift time slots
 * @returns {number} Number of shifts nurse can work per week
 */
const countValidShiftsPerNurse = (nurse, timeSlots) => {
  const availableDays = nurse.availableDays || [];
  if (availableDays.length === 0) return 0;
  if (!timeSlots || timeSlots.length === 0) return 0;

  if (!nurse.availableStartTime && !nurse.availableEndTime) {
    return availableDays.length * timeSlots.length;
  }

  const validShiftsPerDay = timeSlots.filter(
    (slot) => slot.start && slot.end && shiftFullyCovered(nurse, slot)
  ).length;
  return availableDays.length * validShiftsPerDay;
};

/**
 * Calculates total available shift capacity from all nurses.
 * Each nurse's capacity is limited by their available days and hour coverage.
 *
 * @param {Nurse[]} nurses - Array of nurses
 * @param {TimeSlot[]} timeSlots - Available shift time slots
 * @returns {number} Total weekly shift capacity
 */
export const calculateTotalCapacity = (nurses, timeSlots = []) => {
  return nurses.reduce((sum, n) => {
    const validShifts = countValidShiftsPerNurse(n, timeSlots);
    const capacityPerNurse = Math.min(n.maxShiftsPerWeek || 3, validShifts);
    return sum + Math.max(0, capacityPerNurse);
  }, 0);
};

/**
 * Calculates total shift capacity considering day and hour availability.
 * Each nurse's capacity is limited by their available days and hour coverage.
 *
 * @param {Nurse[]} nurses - Array of nurses
 * @param {TimeSlot[]} timeSlots - Available shift time slots
 * @returns {number} Total shift capacity from nurses with availability
 */
export const calculateAvailableCapacity = (nurses, timeSlots = []) => {
  return nurses.reduce((sum, n) => {
    const validShifts = countValidShiftsPerNurse(n, timeSlots);
    const capacityPerNurse = Math.min(n.maxShiftsPerWeek || 3, validShifts);
    return sum + Math.max(0, capacityPerNurse);
  }, 0);
};

/**
 * Counts nurses grouped by their shift preference.
 *
 * @param {Nurse[]} nurses - Array of nurses
 * @returns {{ nursesPreferringDay: number, nursesPreferringNight: number }}
 */
export const calculateShiftPreferences = (nurses) => {
  return {
    nursesPreferringDay: nurses.filter((n) => n.shiftPreference === 'day').length,
    nursesPreferringNight: nurses.filter((n) => n.shiftPreference === 'night').length,
  };
};

/**
 * Calculates nurse availability per shift type (Day vs Night).
 * Groups shifts by type based on start time:
 * - Day: starts 6am-12pm (hour 6-17)
 * - Night: starts 6pm-12am (hour 18-23)
 *
 * @param {Object} params - Parameters
 * @param {Nurse[]} params.nurses - Array of nurses
 * @param {TimeSlot[]} params.timeSlots - Available time slots
 * @returns {Object.<string, ShiftTypeInfo>}
 */
export const calculateNursesPerShiftType = ({ nurses, timeSlots }) => {
  const shiftTypes = {};

  timeSlots.forEach((slot) => {
    if (!slot.start || !slot.end) return;

    const startHour = parseInt(slot.start.split(':')[0]);
    const isDayShift = startHour >= 6 && startHour < 18;
    const shiftType = isDayShift ? 'Day' : 'Night';
    const timeLabel = `${slot.start} - ${slot.end}`;

    if (!shiftTypes[shiftType]) {
      shiftTypes[shiftType] = {
        type: shiftType,
        timeLabel,
        slots: [],
      };
    }
    shiftTypes[shiftType].slots.push(slot);
  });

  const nursesPerShiftType = {};

  Object.entries(shiftTypes).forEach(([shiftType, config]) => {
    const { timeLabel, slots } = config;

    const availableNurses = nurses.filter((nurse) => {
      if (!nurse.availableDays || nurse.availableDays.length === 0) return false;

      if (!nurse.availableStartTime && !nurse.availableEndTime) return true;
      if (!nurse.availableStartTime || !nurse.availableEndTime) return false;

      const nurseStart = parseInt(nurse.availableStartTime.replace(':', ''));
      const nurseEnd = parseInt(nurse.availableEndTime.replace(':', ''));

      for (const slot of slots) {
        if (!slot.start || !slot.end) continue;

        let slotStart = parseInt(slot.start.replace(':', ''));
        let slotEnd = parseInt(slot.end.replace(':', ''));

        const nurseCoversShift = nurseStart <= slotStart && nurseEnd >= slotEnd;

        if (nurseCoversShift) return true;
      }

      return false;
    });

    const shiftCapacity = availableNurses.reduce((sum, n) => {
      const validShifts = countValidShiftsPerNurse(n, slots);
      const capacityPerNurse = Math.min(n.maxShiftsPerWeek || 3, validShifts);
      return sum + Math.max(0, capacityPerNurse);
    }, 0);

    nursesPerShiftType[shiftType] = {
      type: shiftType,
      timeLabel,
      shiftCapacity,
      nurseCount: availableNurses.length,
      nurseNames: availableNurses.map((n) => n.name || 'Unnamed'),
    };
  });

  return nursesPerShiftType;
};
