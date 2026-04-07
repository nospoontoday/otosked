/**
 * Calculates total shift demand based on departments and schedule configuration.
 * This determines how many shifts need to be filled across the schedule period.
 *
 * @param {Object} params - Calculation parameters
 * @param {number} params.totalNursesPerShift - Required nurses per shift
 * @param {number} params.totalDoctorsPerShift - Required doctors per shift
 * @param {number} params.totalShiftsPerWeek - Total shifts per week (slots * 7 days)
 * @param {number} params.duration - Schedule duration in weeks
 * @returns {{ totalNurseShiftsNeeded: number, totalDoctorShiftsNeeded: number }}
 */
export const calculateDemand = ({
  totalNursesPerShift,
  totalDoctorsPerShift,
  totalShiftsPerWeek,
  duration,
}) => {
  return {
    totalNurseShiftsNeeded: totalNursesPerShift * totalShiftsPerWeek * duration,
    totalDoctorShiftsNeeded: totalDoctorsPerShift * totalShiftsPerWeek * duration,
  };
};

/**
 * Calculates how many nurses/doctors are needed based on total demand and shifts per person.
 *
 * @param {Object} params - Calculation parameters
 * @param {number} params.totalNurseShiftsNeeded - Total nurse shifts required
 * @param {number} params.totalDoctorShiftsNeeded - Total doctor shifts required
 * @param {number} params.shiftPerWeek - Shifts each person works per week
 * @returns {{ totalNursesNeeded: number, totalDoctorsNeeded: number }}
 */
export const calculateStaffNeeded = ({
  totalNurseShiftsNeeded,
  totalDoctorShiftsNeeded,
  shiftPerWeek,
}) => {
  return {
    totalNursesNeeded: Math.ceil(totalNurseShiftsNeeded / shiftPerWeek),
    totalDoctorsNeeded: Math.ceil(totalDoctorShiftsNeeded / shiftPerWeek),
  };
};
