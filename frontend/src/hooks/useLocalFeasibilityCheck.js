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

  const nurses = store.nurses || [];

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

  // 4. Calculate Total Demand (will be recalculated with actual shifts)

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

  // Summary calculations - dailyShiftSlots is shifts per day, multiply by 7 for weekly
  const shiftsPerDay = timeSlots.length || 2;
  const shiftsPerWeekConfigured = shiftsPerDay * 7; // 7 days in a week
  
  // Total shifts needed = nurses per shift × actual shifts per week (not shifts per person)
  const totalNurseShiftsNeeded = totalNursesPerShift * shiftsPerWeekConfigured * duration;
  const totalDoctorShiftsNeeded = totalDoctorsPerShift * shiftsPerWeekConfigured * duration;

  // Calculate total shifts available from nurses (sum of maxShiftsPerWeek)
  const totalShiftsAvailableFromNurses = nurses.reduce((sum, n) => sum + (n.maxShiftsPerWeek || 3), 0);

  // Calculate nurses' shift preferences
  const nursesPreferringDay = nurses.filter(n => n.shiftPreference === 'day').length;
  const nursesPreferringNight = nurses.filter(n => n.shiftPreference === 'night').length;

  const totalNursesNeeded = Math.ceil(
    totalNurseShiftsNeeded / shiftPerWeek
  );
  const totalDoctorsNeeded = Math.ceil(
    totalDoctorShiftsNeeded / shiftPerWeek
  );

  info.push({
    type: 'info',
    category: 'summary',
    message: `Weekly requirement: ${totalNurseShiftsNeeded} nurse-shifts (${shiftsPerWeekConfigured} shifts needed)`,
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

  // Check if enough nurses available (based on count)
  if (nurses.length > 0 && nurses.length < totalNursesNeeded) {
    warnings.push({
      type: 'warning',
      category: 'staffing',
      message: `Not enough nurses: you have ${nurses.length} but need approximately ${totalNursesNeeded} for full coverage`,
      suggestion: 'Add more nurses to your Nurses section or increase shifts per week',
    });
  }

  // Check if enough total shifts available from nurses
  if (nurses.length > 0 && totalShiftsAvailableFromNurses < totalNurseShiftsNeeded) {
    warnings.push({
      type: 'warning',
      category: 'staffing',
      message: `Not enough nurse shifts available: nurses can work ${totalShiftsAvailableFromNurses} shifts/week but need ${totalNurseShiftsNeeded}`,
      suggestion: 'Increase max shifts per week for existing nurses or add more nurses',
    });
  }

  // Shift preferences are soft constraints - GA will prioritize preferences but can assign nurses to any shift

  // 6. Nurse Availability Checks (days and hours)
  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Calculate available nurses per day (factoring in maxShiftsPerWeek) - available even if no nurses
  const nursesPerDay = {};
  const shiftsAvailablePerDay = {};
  
  allDays.forEach(day => {
    const availableNurses = nurses.filter(nurse => {
      const days = nurse.availableDays || [];
      return days.includes(day);
    });
    nursesPerDay[day] = availableNurses.length;
    shiftsAvailablePerDay[day] = availableNurses.reduce((sum, n) => sum + (n.maxShiftsPerWeek || 3), 0);
  });

  if (nurses.length === 0) {
    issues.push({
      type: 'error',
      category: 'nurses',
      message: 'No nurses defined',
      suggestion: 'Add at least one nurse to the project',
    });
  } else {
    // Check each nurse's availability
    nurses.forEach((nurse, index) => {
      const nurseName = nurse.name || `Nurse ${index + 1}`;
      
      // Check available days
      const availableDays = nurse.availableDays || [];
      if (availableDays.length === 0) {
        issues.push({
          type: 'error',
          category: 'nurses',
          message: `${nurseName} has no available days set`,
          suggestion: `Set available days for ${nurseName} or use all days`,
        });
      }
      
      // Check if nurse has any time restrictions
      if (nurse.availableStartTime || nurse.availableEndTime) {
        if (!nurse.availableStartTime || !nurse.availableEndTime) {
          warnings.push({
            type: 'warning',
            category: 'nurses',
            message: `${nurseName} has partial time availability set (only start or end time)`,
            suggestion: `Set both start and end time for ${nurseName} or leave both empty`,
          });
        }
      }
    });

    // Hours availability feasibility check
    nurses.forEach((nurse) => {
      if (nurse.availableStartTime && nurse.availableEndTime) {
        const nurseTimeStart = parseInt(nurse.availableStartTime.replace(':', ''));
        const nurseTimeEnd = parseInt(nurse.availableEndTime.replace(':', ''));
        
        timeSlots.forEach(slot => {
          if (!slot.start || !slot.end) return;
          
          let slotStart = parseInt(slot.start.replace(':', ''));
          let slotEnd = parseInt(slot.end.replace(':', ''));
          
          // Handle overnight shifts (e.g., 19:00 to 07:00)
          if (slotEnd < slotStart) {
            slotEnd += 2400;
          }
          if (nurseTimeEnd < nurseTimeStart) {
            // nurse overnight availability not supported well, skip
            return;
          }
          
          const slotOverlaps = slotStart >= nurseTimeStart && slotEnd <= nurseTimeEnd;
          
          if (!slotOverlaps) {
            warnings.push({
              type: 'warning',
              category: 'nurses',
              message: `Nurse "${nurse.name}" availability (${nurse.availableStartTime}-${nurse.availableEndTime}) may not cover "${slot.label}"`,
              suggestion: `Adjust hours for ${nurse.name} or the shift time`,
            });
          }
        });
      }
    });

    // Check if we have enough nurses for each day (using pre-calculated values above)
    const minNursesNeeded = totalNursesPerShift;
    const minShiftsPerDay = totalNursesPerShift * shiftsPerDay;
    
    allDays.forEach(day => {
      const availableCount = nursesPerDay[day];
      const shiftsCount = shiftsAvailablePerDay[day];
      
      if (availableCount < minNursesNeeded) {
        issues.push({
          type: 'error',
          category: 'nurses',
          message: `Only ${availableCount} nurse(s) available on ${day} (need ${minNursesNeeded})`,
          suggestion: `Add more nurses with ${day} in their availability or reduce staffing requirements`,
        });
      } else if (shiftsCount < minShiftsPerDay) {
        issues.push({
          type: 'error',
          category: 'nurses',
          message: `Available shifts (${shiftsCount}) on ${day} less than needed (${minShiftsPerDay})`,
          suggestion: `Nurses available on ${day} can't cover all shifts`,
        });
      } else if (availableCount < minNursesNeeded + 2) {
        warnings.push({
          type: 'warning',
          category: 'nurses',
          message: `Only ${availableCount} nurse(s) available on ${day} - tight staffing`,
          suggestion: 'Consider adding more nurses for flexibility',
        });
      }
    });

    // Summary of nurse availability
    const totalNurseCapacity = nurses.reduce((sum, n) => {
      const maxShifts = n.maxShiftsPerWeek || 3;
      return sum + maxShifts;
    }, 0);
    
    const maxPossibleShifts = totalNurseCapacity;
    
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
  }

  // Determine overall status
  const isFeasible = issues.length === 0;

  // Group shifts by type (Day vs Night) based on start time
  // Day shift: starts between 6am-12pm, Night shift: starts between 6pm-12am
  const shiftTypes = {};
  
  timeSlots.forEach(slot => {
    if (!slot.start || !slot.end) return;
    
    const startHour = parseInt(slot.start.split(':')[0]);
    const isDayShift = startHour >= 6 && startHour < 18;
    const shiftType = isDayShift ? 'Day' : 'Night';
    const timeLabel = `${slot.start} - ${slot.end}`;
    
    if (!shiftTypes[shiftType]) {
      shiftTypes[shiftType] = {
        type: shiftType,
        timeLabel: timeLabel,
        slots: []
      };
    }
    shiftTypes[shiftType].slots.push(slot);
  });

  // Calculate nurses available for each shift type (considering time availability)
  const nursesPerShiftType = {};
  
  Object.entries(shiftTypes).forEach(([shiftType, config]) => {
    const { timeLabel, slots } = config;
    
    // Count nurses available for ANY slot of this shift type
    // A nurse is available for Day shift if they can work at least one Day slot
    const availableNurses = nurses.filter(nurse => {
      // Must have at least one day available
      if (!nurse.availableDays || nurse.availableDays.length === 0) return false;
      
      // If no time restriction, nurse is available anytime
      if (!nurse.availableStartTime && !nurse.availableEndTime) return true;
      if (!nurse.availableStartTime || !nurse.availableEndTime) return false;
      
      // Check if nurse's time availability covers the shift type
      const nurseStart = parseInt(nurse.availableStartTime.replace(':', ''));
      const nurseEnd = parseInt(nurse.availableEndTime.replace(':', ''));
      
      // Check against each slot of this shift type
      for (const slot of slots) {
        if (!slot.start || !slot.end) continue;
        
        let slotStart = parseInt(slot.start.replace(':', ''));
        let slotEnd = parseInt(slot.end.replace(':', ''));
        
        // For a nurse to be available for a shift, their hours must FULLY cover the shift
        // This ensures the nurse can work the entire shift duration
        const nurseCoversShift = nurseStart <= slotStart && nurseEnd >= slotEnd;
        
        if (nurseCoversShift) {
          return true; // Nurse can work at least one slot of this type
        }
      }
      
      return false;
    });
    
    // Calculate shift capacity: sum of maxShiftsPerWeek for all available nurses
    const shiftCapacity = availableNurses.reduce((sum, n) => sum + (n.maxShiftsPerWeek || 3), 0);
    
    nursesPerShiftType[shiftType] = {
      type: shiftType,
      timeLabel,
      shiftCapacity,
      nurseCount: availableNurses.length,
      nurseNames: availableNurses.map(n => n.name || 'Unnamed')
    };
  });

  // Calculate total shift capacity from all nurses (regardless of shift type availability)
  const totalShiftCapacityAllNurses = nurses.reduce((sum, n) => {
    const days = n.availableDays || [];
    return sum + (days.length > 0 ? (n.maxShiftsPerWeek || 3) : 0);
  }, 0);

  const nursesPerDaySummary = {};
  allDays.forEach(day => {
    nursesPerDaySummary[day] = {
      nurseCount: nursesPerDay[day],
      shiftCapacity: shiftsAvailablePerDay[day]
    };
  });

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
      totalDoctorShiftsNeeded,
      totalShiftsAvailableFromNurses,
      nursesPreferringDay,
      nursesPreferringNight,
      shiftsPerDay: shiftsPerDay,
      totalShiftsPerWeek: shiftsPerWeekConfigured,
      shiftsPerNursePerWeek: shiftPerWeek,
      shiftModel,
      restDays,
      duration,
      estimatedNursesNeeded: totalNursesNeeded,
      estimatedDoctorsNeeded: totalDoctorsNeeded,
      nursesPerDay: nursesPerDaySummary,
      nursesPerShift: nursesPerShiftType,
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
  const nurses = useHospitalConfigStore((state) => state.nurses);

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
    nurses,
  });

  return result;
};
