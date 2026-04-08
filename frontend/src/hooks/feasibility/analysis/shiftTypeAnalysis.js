/**
 * Categorizes time slots into shift types based on start time.
 *
 * Day shift: starts between 6am-12pm (hour 6-17)
 * Night shift: starts between 6pm-12am (hour 18-23)
 *
 * @param {TimeSlot[]} timeSlots - Array of time slots
 * @returns {Object.<string, {type: string, timeLabel: string, slots: TimeSlot[]}>}
 */
export const categorizeShiftsByType = (timeSlots) => {
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

  return shiftTypes;
};
