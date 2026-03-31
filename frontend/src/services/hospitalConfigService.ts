type ShiftConfig = {
  shiftModel: string;
  timeSlots: string[];
  nursesNeeded: number;
  maxConsecutiveShifts: number;
  minRestHours: number;
  maxNightShiftsPerPeriod: number;
};

export const hospitalConfigService = {
  getShiftDefaults(
    shiftModel: string,
    availableShiftModels: ShiftConfig[]
  ) {
    const config = availableShiftModels.find(c => c.shiftModel === shiftModel);

    const shiftsPerWeek = shiftModel === '8h' ? 5 : 3;
    const restDays = 7 - shiftsPerWeek;

    return {
      shiftsPerWeek,
      restDays,
      timeSlots: config?.timeSlots || [],
      minRestHours: config?.minRestHours ?? 12,
      maxNightShiftsPerPeriod: config?.maxNightShiftsPerPeriod ?? 4,
      maxConsecutiveShifts:
        config?.maxConsecutiveShifts ?? shiftsPerWeek,
    };
  },

  computeRestSettings(params: {
    shiftsPerWeek: number;
    selectedShiftModel: string | null;
    availableShiftModels: ShiftConfig[];
  }) {
    const { shiftsPerWeek, selectedShiftModel, availableShiftModels } = params;

    const config = availableShiftModels.find(
      c => c.shiftModel === selectedShiftModel
    );

    return {
      restDays: 7 - shiftsPerWeek,
      maxConsecutiveShifts:
        config?.maxConsecutiveShifts ?? shiftsPerWeek,
      minRestHours:
        config?.minRestHours ?? (shiftsPerWeek === 5 ? 12 : 24),
      maxNightShiftsPerPeriod:
        config?.maxNightShiftsPerPeriod ?? 4,
    };
  },

  calculateStaffing(shiftsPerWeek: number, slots: string[]) {
    const totalShifts = slots.length * 7;
    return Math.ceil(totalShifts / shiftsPerWeek);
  },

  mapProjectToState(project: any) {
    const shiftModel =
      project.shiftModel || project.template.defaultShiftModel;

    const restPattern =
      project.restPattern || project.template.restPattern;

    const config = project.template.shiftConfigs.find(
      (c: ShiftConfig) => c.shiftModel === shiftModel
    );

    return {
      selectedShiftModel: shiftModel,
      selectedRestPattern: restPattern,
      shiftsPerNursePerWeek: project.shiftPerWeek || 3,
      scheduleLengthWeeks: project.duration || project.template.duration || 1,
      dailyShiftSlots: project.timeSlots || config?.timeSlots || [],
      availableShiftModels: project.template.shiftConfigs,
    };
  },
};