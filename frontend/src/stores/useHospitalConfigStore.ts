import { create } from 'zustand';
import { hospitalConfigService } from '../services/hospitalConfigService';
import { hospitalConfigApi } from '../services/hospitalConfigApi';
import { mapStateToPayload } from '../services/hospitalConfigMapper';

export const useHospitalConfigStore = create((set, get) => ({
  // state
  selectedShiftModel: null,
  selectedRestPattern: null,
  shiftsPerNursePerWeek: 3,
  scheduleLengthWeeks: 1,
  restDaysPerNurse: 4,

  dailyShiftSlots: [],
  availableShiftModels: [],

  maxConsecutiveShifts: 3,
  minRestHours: 12,
  maxNightShiftsPerPeriod: 4,

  saveConfig: async () => {
    const state = get();

    const payload = mapStateToPayload(state);

    await hospitalConfigApi.save(payload);
  },

  initializeFromProject: (project) => {
    const mapped = hospitalConfigService.mapProjectToState(project);
    set(mapped);
  },

  selectShiftModel: (shiftModel) => {
    const { availableShiftModels } = get();

    const defaults = hospitalConfigService.getShiftDefaults(
      shiftModel,
      availableShiftModels
    );

    set({
      selectedShiftModel: shiftModel,
      shiftsPerNursePerWeek: defaults.shiftsPerWeek,
      restDaysPerNurse: defaults.restDays,
      dailyShiftSlots: defaults.timeSlots,
      minRestHours: defaults.minRestHours,
      maxNightShiftsPerPeriod: defaults.maxNightShiftsPerPeriod,
      maxConsecutiveShifts: defaults.maxConsecutiveShifts,
    });
  },

  toggleRestDaysPerNurse: (withRest) => {
    if (!withRest) {
      set({
        restDaysPerNurse: 0,
        selectedRestPattern: null,
        maxConsecutiveShifts: 0,
        minRestHours: 0,
      });
      return;
    }

    const state = get();

    const computed = hospitalConfigService.computeRestSettings({
      shiftsPerWeek: state.shiftsPerNursePerWeek,
      selectedShiftModel: state.selectedShiftModel,
      availableShiftModels: state.availableShiftModels,
    });

    set({
      restDaysPerNurse: computed.restDays,
      maxConsecutiveShifts: computed.maxConsecutiveShifts,
      minRestHours: computed.minRestHours,
      maxNightShiftsPerPeriod: computed.maxNightShiftsPerPeriod,
      selectedRestPattern: 'spread',
    });
  },

  setScheduleLengthWeeks: (duration) =>
    set({ scheduleLengthWeeks: duration }),

  setDailyShiftSlots: (slots) =>
    set({ dailyShiftSlots: slots }),

  selectRestPattern: (pattern) =>
    set({ selectedRestPattern: pattern }),

  getStaffingMetrics: () => {
    const { shiftsPerNursePerWeek, dailyShiftSlots, restDaysPerNurse } = get();

    return {
      nursesNeeded: hospitalConfigService.calculateStaffing(
        shiftsPerNursePerWeek,
        dailyShiftSlots
      ),
      restDaysPerNurse,
    };
  },
}));