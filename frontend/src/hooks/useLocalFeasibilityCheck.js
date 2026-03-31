import { useHospitalConfigStore } from '../stores/useHospitalConfigStore';

const checkFeasibilityLocally = (store) => {
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

  const issues = [];
  const warnings = [];
  const info = [];

  const shiftModel = selectedShiftModel || '12h';
  const shiftPerWeek = shiftsPerNursePerWeek || 3;
  const restDays = restDaysPerNurse || 4;
  const duration = scheduleLengthWeeks || 1;
  const timeSlots = dailyShiftSlots || [];

  const departments = store.departments || [
    { name: 'ICU', nursesPerShift: 1, doctorsPerShift: 1 },
    { name: 'ER', nursesPerShift: 2, doctorsPerShift: 1 },
    { name: 'General Ward', nursesPerShift: 3, doctorsPerShift: 1 },
  ];

  // 1. Basic Configuration Validity
  if (shiftPerWeek + restDays > 7) {
    issues.push({
      type: 'error',
      category: 'schedule',
      message: `Total schedule exceeds 7 days (${shiftPerWeek} shifts + ${restDays} rest days = ${shiftPerWeek + restDays})`,
      suggestion: `Reduce shifts per week or rest days to fit within 7 days`,
    });
  }

  if (shiftPerWeek < 1) {
    issues.push({
      type: 'error',
      category: 'schedule',
      message: `Invalid shifts per week: ${shiftPerWeek}`,
      suggestion: `Set shifts per week to at least 1`,
    });
  }

  if (restDays < 0) {
    issues.push({
      type: 'error',
      category: 'schedule',
      message: `Invalid rest days: ${restDays}`,
      suggestion: `Set rest days to 0 or more`,
    });
  }

  // 2. Department Staffing Validity
  if (departments.length === 0) {
    issues.push({
      type: 'error',
      category: 'departments',
      message: 'No departments defined',
      suggestion: 'Add at least one department with staffing requirements',
    });
  }

  let totalNursesPerShift = 0;
  let totalDoctorsPerShift = 0;

  departments.forEach((dept, index) => {
    if (!dept.name || dept.name.trim() === '') {
      issues.push({
        type: 'error',
        category: 'departments',
        message: `Department at index ${index} has no name`,
        suggestion: 'Give each department a descriptive name',
      });
    }

    const nurses = dept.nursesPerShift || 0;
    const doctors = dept.doctorsPerShift || 0;

    if (nurses < 1) {
      issues.push({
        type: 'error',
        category: 'departments',
        message: `${dept.name || 'Department ' + (index + 1)} needs at least 1 nurse per shift`,
        suggestion: `Set nurses per shift to 1 or more for ${dept.name || 'this department'}`,
      });
    }

    if (doctors < 1) {
      issues.push({
        type: 'error',
        category: 'departments',
        message: `${dept.name || 'Department ' + (index + 1)} needs at least 1 doctor per shift`,
        suggestion: `Set doctors per shift to 1 or more for ${dept.name || 'this department'}`,
      });
    }

    totalNursesPerShift += nurses;
    totalDoctorsPerShift += doctors;

    // Warnings for high workload
    if (nurses > 5) {
      warnings.push({
        type: 'warning',
        category: 'workload',
        message: `${dept.name} has ${nurses} nurses per shift - ensure enough staff available`,
        suggestion: 'Consider splitting into multiple departments if staffing is challenging',
      });
    }

    if (doctors > 3) {
      warnings.push({
        type: 'warning',
        category: 'workload',
        message: `${dept.name} has ${doctors} doctors per shift - ensure enough staff available`,
        suggestion: 'Consider if this many doctors are required',
      });
    }
  });

  // 3. Shift Duration Match
  const shiftDuration = parseInt(shiftModel) || 12;
  timeSlots.forEach((slot) => {
    if (slot.duration && slot.duration !== shiftDuration) {
      issues.push({
        type: 'error',
        category: 'timeSlots',
        message: `Time slot "${slot.label}" has duration ${slot.duration}h but shift model is ${shiftDuration}h`,
        suggestion: `Update time slots to match the ${shiftDuration}h shift model`,
      });
    }
  });

  // 4. Calculate Total Demand
  const totalNurseShiftsNeeded = totalNursesPerShift * shiftPerWeek * duration;
  const totalDoctorShiftsNeeded = totalDoctorsPerShift * shiftPerWeek * duration;
  const totalShiftsPerWeek = shiftPerWeek;

  // 5. Rest and Consecutive Shift Checks
  const maxConsec = maxConsecutiveShifts ?? 3;
  const minRest = minRestHours ?? 12;

  if (maxConsec && maxConsec > shiftPerWeek) {
    warnings.push({
      type: 'warning',
      category: 'constraints',
      message: `Max consecutive shifts (${maxConsec}) exceeds shifts per week (${shiftPerWeek})`,
      suggestion: 'This constraint will never be triggered',
    });
  }

  if (minRest && minRest > 24) {
    warnings.push({
      type: 'warning',
      category: 'constraints',
      message: `Minimum rest hours (${minRest}h) is more than 24h - shifts may not be possible`,
      suggestion: 'Consider reducing minimum rest hours',
    });
  }

  // Summary calculations
  const totalNursesNeeded = Math.ceil(
    totalNurseShiftsNeeded / (shiftDuration / 12 * 3)
  );
  const totalDoctorsNeeded = Math.ceil(
    totalDoctorShiftsNeeded / (shiftDuration / 12 * 3)
  );

  info.push({
    type: 'info',
    category: 'summary',
    message: `Weekly requirement: ${totalNurseShiftsNeeded} nurse-shifts and ${totalDoctorShiftsNeeded} doctor-shifts`,
    suggestion: `Plan to have approximately ${totalNursesNeeded} nurses and ${totalDoctorsNeeded} doctors (assuming 3 shifts/week each)`,
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

  // Determine overall status
  const isFeasible = issues.length === 0;

  return {
    isFeasible,
    issues,
    warnings,
    info,
    summary: {
      totalDepartments: departments.length,
      totalNursesPerShift,
      totalDoctorsPerShift,
      totalNurseShiftsNeeded,
      totalDoctorShiftsNeeded,
      totalShiftsPerWeek,
      shiftModel,
      shiftPerWeek,
      restDays,
      duration,
      estimatedNursesNeeded: totalNursesNeeded,
      estimatedDoctorsNeeded: totalDoctorsNeeded,
    },
  };
};

export const useLocalFeasibilityCheck = () => {
  const selectedShiftModel = useHospitalConfigStore((state) => state.selectedShiftModel);
  const shiftsPerNursePerWeek = useHospitalConfigStore((state) => state.shiftsPerNursePerWeek);
  const restDaysPerNurse = useHospitalConfigStore((state) => state.restDaysPerNurse);
  const scheduleLengthWeeks = useHospitalConfigStore((state) => state.scheduleLengthWeeks);
  const dailyShiftSlots = useHospitalConfigStore((state) => state.dailyShiftSlots);
  const maxConsecutiveShifts = useHospitalConfigStore((state) => state.maxConsecutiveShifts);
  const minRestHours = useHospitalConfigStore((state) => state.minRestHours);
  const selectedRestPattern = useHospitalConfigStore((state) => state.selectedRestPattern);
  const departments = useHospitalConfigStore((state) => state.departments);

  console.log('useLocalFeasibilityCheck values:', {
    selectedShiftModel,
    shiftsPerNursePerWeek,
    restDaysPerNurse,
    scheduleLengthWeeks,
    dailyShiftSlots,
    maxConsecutiveShifts,
    minRestHours,
    selectedRestPattern,
    departments,
  });

  const result = checkFeasibilityLocally({
    selectedShiftModel,
    shiftsPerNursePerWeek,
    restDaysPerNurse,
    scheduleLengthWeeks,
    dailyShiftSlots,
    maxConsecutiveShifts,
    minRestHours,
    selectedRestPattern,
    departments,
  });

  return result;
};
