import { createError, createWarning } from '../utils/issueBuilders.js';

/**
 * Validates department staffing requirements.
 * Ensures departments exist and have minimum staffing levels.
 *
 * @param {ExtractedConfig} config - Extracted configuration
 * @returns {{ issues: Issue[], totalNursesPerShift: number, totalDoctorsPerShift: number }}
 */
export const validateDepartmentStaffing = (config) => {
  const { departments } = config;
  const issues = [];
  let totalNursesPerShift = 0;
  let totalDoctorsPerShift = 0;

  if (departments.length === 0) {
    issues.push(
      createError(
        'departments',
        'No departments defined',
        'Add at least one department with staffing requirements'
      )
    );
    return { issues, totalNursesPerShift, totalDoctorsPerShift };
  }

  departments.forEach((dept, index) => {
    if (!dept.name || dept.name.trim() === '') {
      issues.push(
        createError(
          'departments',
          `Department at index ${index} has no name`,
          'Give each department a descriptive name'
        )
      );
    }

    const nurses = dept.nursesPerShift || 0;
    const doctors = dept.doctorsPerShift || 0;

    if (nurses < 1) {
      issues.push(
        createError(
          'departments',
          `${dept.name || 'Department ' + (index + 1)} needs at least 1 nurse per shift`,
          `Set nurses per shift to 1 or more for ${dept.name || 'this department'}`
        )
      );
    }

    if (doctors < 1) {
      issues.push(
        createError(
          'departments',
          `${dept.name || 'Department ' + (index + 1)} needs at least 1 doctor per shift`,
          `Set doctors per shift to 1 or more for ${dept.name || 'this department'}`
        )
      );
    }

    totalNursesPerShift += nurses;
    totalDoctorsPerShift += doctors;

    if (nurses > 5) {
      issues.push(
        createWarning(
          'workload',
          `${dept.name} has ${nurses} nurses per shift - ensure enough staff available`,
          'Consider splitting into multiple departments if staffing is challenging'
        )
      );
    }

    if (doctors > 3) {
      issues.push(
        createWarning(
          'workload',
          `${dept.name} has ${doctors} doctors per shift - ensure enough staff available`,
          'Consider if this many doctors are required'
        )
      );
    }
  });

  return { issues, totalNursesPerShift, totalDoctorsPerShift };
};
