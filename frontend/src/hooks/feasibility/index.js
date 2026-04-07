/**
 * @fileoverview Main orchestrator for feasibility checking.
 * Combines all validators and analyzers to produce a complete feasibility report.
 *
 * Logic flow:
 * 1. Extract config with defaults
 * 2. Run all validators (collects issues, warnings)
 * 3. Calculate staffing totals
 * 4. Generate informational messages
 * 5. Return structured result
 */

import { extractConfig } from './config/extractConfig.js';
import { validateScheduleConfig } from './validators/scheduleConfig.js';
import { validateDepartmentStaffing } from './validators/departmentStaffing.js';
import { validateShiftDuration } from './validators/shiftDuration.js';
import { validateRestConstraints } from './validators/restConstraints.js';
import {
  validateNurseAvailability,
  calculateDailyNurseAvailability,
} from './validators/nurseAvailability.js';
import { validateDailyCoverage } from './validators/dailyCoverage.js';
import { calculateStaffNeeded } from './analysis/demandCalculator.js';
import {
  calculateTotalCapacity,
  calculateAvailableCapacity,
  calculateShiftPreferences,
  calculateNursesPerShiftType,
} from './analysis/capacityCalculator.js';

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * Main feasibility check function.
 * Validates schedule configuration and produces a feasibility report.
 *
 * @param {FeasibilityConfig} store - Raw configuration from store
 * @returns {FeasibilityResult}
 */
export const checkFeasibilityLocally = (store) => {
  const issues = [];
  const warnings = [];
  const info = [];

  const config = extractConfig(store);
  const {
    shiftModel,
    shiftPerWeek,
    restDays,
    duration,
    timeSlots,
    departments,
    nurses,
    selectedRestPattern,
  } = config;

  // Run validators and collect results
  issues.push(...validateScheduleConfig(config));
  const deptResult = validateDepartmentStaffing(config);
  issues.push(...deptResult.issues);
  warnings.push(...deptResult.warnings);

  let { totalNursesPerShift, totalDoctorsPerShift } = deptResult;

  issues.push(...validateShiftDuration(config));
  warnings.push(...validateRestConstraints(config));

  // Calculate derived values
  const shiftsPerDay = timeSlots.length || 2;
  const totalShiftsPerWeek = shiftsPerDay * 7;

  // Calculate staffing totals
  const { totalNursesNeeded, totalDoctorsNeeded } = calculateStaffNeeded({
    totalNurseShiftsNeeded: totalNursesPerShift * totalShiftsPerWeek * duration,
    totalDoctorShiftsNeeded: totalDoctorsPerShift * totalShiftsPerWeek * duration,
    shiftPerWeek,
  });

  const totalShiftsAvailableFromNurses = calculateTotalCapacity(nurses);
  const { nursesPreferringDay, nursesPreferringNight } = calculateShiftPreferences(nurses);

  // Generate summary info
  const totalNurseShiftsNeeded = totalNursesPerShift * totalShiftsPerWeek * duration;

  info.push({
    type: 'info',
    category: 'summary',
    message: `Weekly requirement: ${totalNurseShiftsNeeded} nurse-shifts (${totalShiftsPerWeek} shifts needed)`,
    suggestion: `With ${shiftPerWeek} shifts per person per week, you need approximately ${totalNursesNeeded} nurses`,
  });

  info.push({
    type: 'info',
    category: 'schedule',
    message: `Schedule: ${shiftPerWeek} shifts/week with ${restDays} rest days over ${duration} week(s)`,
    suggestion: `Each staff member works ${shiftPerWeek} ${shiftModel} shifts per week`,
  });

  if (selectedRestPattern) {
    const patternLabel =
      selectedRestPattern === 'spread'
        ? 'Scattered (spread out)'
        : 'Fixed Together (consecutive)';
    info.push({
      type: 'info',
      category: 'rest',
      message: `Rest pattern: ${patternLabel}`,
      suggestion:
        selectedRestPattern === 'spread'
          ? 'Staff will have rest days spread throughout the week'
          : 'Staff will have rest days scheduled consecutively',
    });
  }

  // Validate nurse availability
  const nurseAvailResult = validateNurseAvailability(nurses, timeSlots);
  issues.push(...nurseAvailResult.issues);
  warnings.push(...nurseAvailResult.warnings);

  // Check staffing levels
  if (nurses.length > 0 && nurses.length < totalNursesNeeded) {
    warnings.push({
      type: 'warning',
      category: 'staffing',
      message: `Not enough nurses: you have ${nurses.length} but need approximately ${totalNursesNeeded} for full coverage`,
      suggestion: 'Add more nurses to your Nurses section or increase shifts per week',
    });
  }

  if (nurses.length > 0 && totalShiftsAvailableFromNurses < totalNurseShiftsNeeded) {
    warnings.push({
      type: 'warning',
      category: 'staffing',
      message: `Not enough nurse shifts available: nurses can work ${totalShiftsAvailableFromNurses} shifts/week but need ${totalNurseShiftsNeeded}`,
      suggestion: 'Increase max shifts per week for existing nurses or add more nurses',
    });
  }

  // Daily coverage validation
  const { nursesPerDay, shiftsAvailablePerDay } = calculateDailyNurseAvailability(nurses);

  const dailyCoverageResult = validateDailyCoverage({
    nurses,
    totalNursesPerShift,
    shiftsPerDay,
    nursesPerDay,
    shiftsAvailablePerDay,
  });
  issues.push(...dailyCoverageResult.issues);
  warnings.push(...dailyCoverageResult.warnings);

  // Summary of nurse capacity
  const totalShiftCapacityAllNurses = calculateAvailableCapacity(nurses);
  const maxPossibleShifts = totalShiftCapacityAllNurses;

  if (maxPossibleShifts < totalNurseShiftsNeeded && totalNursesPerShift > 0) {
    issues.push({
      type: 'error',
      category: 'nurses',
      message: `Insufficient total nurse availability: can cover ${maxPossibleShifts} shifts but need ${totalNurseShiftsNeeded}`,
      suggestion: 'Add more nurses or expand their available days',
    });
  } else if (totalNursesPerShift > 0) {
    info.push({
      type: 'info',
      category: 'nurses',
      message: `Nurse availability: ${nurses.length} nurse(s) with combined capacity of ${maxPossibleShifts} shifts/week`,
      suggestion: `Capacity is sufficient for ${totalNurseShiftsNeeded} required shifts`,
    });
  }

  // Calculate nurses per shift type
  const nursesPerShift = calculateNursesPerShiftType({ nurses, timeSlots });

  // Build nurses per day summary
  const nursesPerDaySummary = {};
  ALL_DAYS.forEach((day) => {
    nursesPerDaySummary[day] = {
      nurseCount: nursesPerDay[day],
      shiftCapacity: shiftsAvailablePerDay[day],
    };
  });

  const isFeasible = issues.length === 0;

  return {
    isFeasible,
    issues,
    warnings,
    info,
    summary: {
      totalDepartments: departments.length,
      totalNursesAvailable: totalShiftCapacityAllNurses,
      totalNursesPerShift,
      totalDoctorsPerShift,
      totalNurseShiftsNeeded,
      totalDoctorShiftsNeeded: totalDoctorsPerShift * totalShiftsPerWeek * duration,
      totalShiftsAvailableFromNurses,
      nursesPreferringDay,
      nursesPreferringNight,
      shiftsPerDay,
      totalShiftsPerWeek,
      shiftsPerNursePerWeek: shiftPerWeek,
      shiftModel,
      restDays,
      duration,
      estimatedNursesNeeded: totalNursesNeeded,
      estimatedDoctorsNeeded: totalDoctorsNeeded,
      nursesPerDay: nursesPerDaySummary,
      nursesPerShift,
    },
  };
};
