export const mapStateToPayload = (state: any) => ({
    shiftModel: state.selectedShiftModel,
    shiftsPerWeek: state.shiftsPerNursePerWeek,
    restDays: state.restDaysPerNurse,
    maxConsecutiveShifts: state.maxConsecutiveShifts,
    minRestHours: state.minRestHours,
    maxNightShiftsPerPeriod: state.maxNightShiftsPerPeriod,
    selectedRestPattern: state.selectedRestPattern,
    scheduleLengthWeeks: state.scheduleLengthWeeks,
    dailyShiftSlots: state.dailyShiftSlots,
    departments: state.departments,
    nurses: state.nurses,
});