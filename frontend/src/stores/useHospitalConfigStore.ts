import { create } from 'zustand';
import { hospitalConfigService } from '../services/hospitalConfigService';
import { hospitalConfigApi } from '../services/hospitalConfigApi';
import { mapStateToPayload } from '../services/hospitalConfigMapper';
import { updateProject } from '../api/projects';

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

  departments: [
    { name: "ICU", nursesPerShift: 1, doctorsPerShift: 1 },
    { name: "ER", nursesPerShift: 2, doctorsPerShift: 1 },
    { name: "General Ward", nursesPerShift: 3, doctorsPerShift: 1 },
  ],

  nurses: [
    { name: "Nurse 1", maxShiftsPerWeek: 3, shiftPreference: "day" },
    { name: "Nurse 2", maxShiftsPerWeek: 3, shiftPreference: "day" },
    { name: "Nurse 3", maxShiftsPerWeek: 3, shiftPreference: "day" },
  ],

  addDepartment: () =>
    set((state) => ({
      departments: [
        ...state.departments,
        { name: "", nursesPerShift: 1, doctorsPerShift: 1 },
      ],
    })),

  removeDepartment: (index) =>
    set((state) => ({
      departments: state.departments.filter((_, i) => i !== index),
    })),

  updateDepartment: (index, field, value) =>
    set((state) => ({
      departments: state.departments.map((dept, i) =>
        i === index ? { ...dept, [field]: value } : dept
      ),
    })),

  addNurse: () =>
    set((state) => ({
      nurses: [
        ...state.nurses,
        { name: "", maxShiftsPerWeek: 3, shiftPreference: "day" },
      ],
    })),

  removeNurse: (index) =>
    set((state) => ({
      nurses: state.nurses.filter((_, i) => i !== index),
    })),

  updateNurse: (index, field, value) =>
    set((state) => ({
      nurses: state.nurses.map((nurse, i) =>
        i === index ? { ...nurse, [field]: value } : nurse
      ),
    })),

  saveConfig: async () => {
    const state = get();

    const payload = mapStateToPayload(state);

    if (!state.projectId) {
      throw new Error('projectId is required to save config');
    }

    await updateProject(state.projectId, payload);
  },

  initializeFromProject: (project) => {
    const mapped = hospitalConfigService.mapProjectToState(project);
    set({
      ...mapped,
      projectId: project._id || project.id,
      departments: project.departments && project.departments.length > 0
        ? project.departments
        : [
            { name: "ICU", nursesPerShift: 1, doctorsPerShift: 1 },
            { name: "ER", nursesPerShift: 2, doctorsPerShift: 1 },
            { name: "General Ward", nursesPerShift: 3, doctorsPerShift: 1 },
          ],
      nurses: project.nurses && project.nurses.length > 0
        ? project.nurses
        : [
            { name: "Nurse 1", maxShiftsPerWeek: 3, shiftPreference: "day" },
            { name: "Nurse 2", maxShiftsPerWeek: 3, shiftPreference: "day" },
            { name: "Nurse 3", maxShiftsPerWeek: 3, shiftPreference: "day" },
          ],
    });
  },

  selectShiftModel: (shiftModel) => {
    const { availableShiftModels } = get();

    const defaults = hospitalConfigService.getShiftDefaults(
      shiftModel,
      availableShiftModels
    );

    const defaultShiftsPerWeek = defaults.shiftsPerWeek;

    set({
      selectedShiftModel: shiftModel,
      shiftsPerNursePerWeek: defaultShiftsPerWeek,
      restDaysPerNurse: defaults.restDays,
      dailyShiftSlots: defaults.timeSlots,
      minRestHours: defaults.minRestHours,
      maxNightShiftsPerPeriod: defaults.maxNightShiftsPerPeriod,
      maxConsecutiveShifts: defaults.maxConsecutiveShifts,
      nurses: get().nurses.map(nurse => ({ ...nurse, maxShiftsPerWeek: defaultShiftsPerWeek })),
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

  setShiftsPerNursePerWeek: (shifts) => {
    const state = get();

    const computed = hospitalConfigService.computeRestSettings({
      shiftsPerWeek: shifts,
      selectedShiftModel: state.selectedShiftModel,
      availableShiftModels: state.availableShiftModels,
    });

    set({
      shiftsPerNursePerWeek: shifts,
      restDaysPerNurse: computed.restDays,
      maxConsecutiveShifts: computed.maxConsecutiveShifts,
      minRestHours: computed.minRestHours,
      maxNightShiftsPerPeriod: computed.maxNightShiftsPerPeriod,
      nurses: state.nurses.map(nurse => ({ ...nurse, maxShiftsPerWeek: shifts })),
    });
  },

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