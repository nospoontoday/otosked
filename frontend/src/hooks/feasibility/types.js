/**
 * @typedef {'error' | 'warning' | 'info'} IssueType
 * @typedef {'schedule' | 'departments' | 'timeSlots' | 'constraints' | 'nurses' | 'staffing' | 'workload' | 'rest' | 'summary'} IssueCategory
 *
 * @typedef {Object} Issue
 * @property {IssueType} type
 * @property {IssueCategory} category
 * @property {string} message
 * @property {string} suggestion
 *
 * @typedef {Object} Department
 * @property {string} name
 * @property {number} nursesPerShift
 * @property {number} doctorsPerShift
 *
 * @typedef {Object} Nurse
 * @property {string} name
 * @property {string[]} availableDays
 * @property {string} [availableStartTime]
 * @property {string} [availableEndTime]
 * @property {number} [maxShiftsPerWeek]
 * @property {'day' | 'night'} [shiftPreference]
 *
 * @typedef {Object} TimeSlot
 * @property {string} label
 * @property {number} duration
 * @property {string} start
 * @property {string} end
 *
 * @typedef {Object} FeasibilityConfig
 * @property {string} selectedShiftModel
 * @property {number} shiftsPerNursePerWeek
 * @property {number} restDaysPerNurse
 * @property {number} scheduleLengthWeeks
 * @property {TimeSlot[]} dailyShiftSlots
 * @property {number} [maxConsecutiveShifts]
 * @property {number} [minRestHours]
 * @property {string} [selectedRestPattern]
 * @property {Department[]} departments
 * @property {Nurse[]} nurses
 *
 * @typedef {Object} ExtractedConfig
 * @property {string} shiftModel
 * @property {number} shiftPerWeek
 * @property {number} restDays
 * @property {number} duration
 * @property {TimeSlot[]} timeSlots
 * @property {Department[]} departments
 * @property {Nurse[]} nurses
 * @property {number} maxConsec
 * @property {number} minRest
 *
 * @typedef {Object} StaffingTotals
 * @property {number} totalNursesPerShift
 * @property {number} totalDoctorsPerShift
 * @property {number} totalNurseShiftsNeeded
 * @property {number} totalDoctorShiftsNeeded
 * @property {number} totalShiftsAvailableFromNurses
 * @property {number} totalNursesNeeded
 * @property {number} totalDoctorsNeeded
 * @property {number} nursesPreferringDay
 * @property {number} nursesPreferringNight
 * @property {number} shiftsPerDay
 * @property {number} totalShiftsPerWeek
 * @property {number} totalShiftCapacityAllNurses
 *
 * @typedef {Object} ShiftTypeInfo
 * @property {string} type
 * @property {string} timeLabel
 * @property {number} shiftCapacity
 * @property {number} nurseCount
 * @property {string[]} nurseNames
 *
 * @typedef {Object} DaySummary
 * @property {number} nurseCount
 * @property {number} shiftCapacity
 *
 * @typedef {Object} FeasibilitySummary
 * @property {number} totalDepartments
 * @property {number} totalNursesAvailable
 * @property {number} totalNursesPerShift
 * @property {number} totalDoctorsPerShift
 * @property {number} totalNurseShiftsNeeded
 * @property {number} totalDoctorShiftsNeeded
 * @property {number} totalShiftsAvailableFromNurses
 * @property {number} nursesPreferringDay
 * @property {number} nursesPreferringNight
 * @property {number} shiftsPerDay
 * @property {number} totalShiftsPerWeek
 * @property {number} shiftsPerNursePerWeek
 * @property {string} shiftModel
 * @property {number} restDays
 * @property {number} duration
 * @property {number} estimatedNursesNeeded
 * @property {number} estimatedDoctorsNeeded
 * @property {Object.<string, DaySummary>} nursesPerDay
 * @property {Object.<string, ShiftTypeInfo>} nursesPerShift
 *
 * @typedef {Object} FeasibilityResult
 * @property {boolean} isFeasible
 * @property {Issue[]} issues
 * @property {Issue[]} warnings
 * @property {Issue[]} info
 * @property {FeasibilitySummary} summary
 */

export {};
