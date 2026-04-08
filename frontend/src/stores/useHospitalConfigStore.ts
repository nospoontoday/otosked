import { create } from 'zustand';
import { hospitalConfigService } from '../services/hospitalConfigService';
import { updateProject } from '../api/projects';
import {
  DEFAULT_DEPARTMENTS,
  DEFAULT_NURSES,
  createNurse,
  type Department,
  type Nurse,
  type Project,
  type ShiftConfig,
} from '../constants/hospitalConfigDefaults';

const updateArrayItem = <T>(
  array: T[],
  index: number,
  update: Partial<T>
): T[] =>
  array.map((item, i) => (i === index ? { ...item, ...update } : item));

const filterArrayItem = <T>(array: T[], index: number): T[] =>
  array.filter((_, i) => i !== index);

export const useHospitalConfigStore = create((set, get) => ({
  projectId: null as string | null,

  selectedShiftModel: null as string | null,
  selectedRestPattern: null as string | null,
  shiftsPerNursePerWeek: 3,
  scheduleLengthWeeks: 1,
  restDaysPerNurse: 4,

  dailyShiftSlots: [] as string[],
  availableShiftModels: [] as ShiftConfig[],

  maxConsecutiveShifts: 3,
  minRestHours: 12,
  maxNightShiftsPerPeriod: 4,

  departments: [...DEFAULT_DEPARTMENTS] as Department[],
  nurses: [...DEFAULT_NURSES] as Nurse[],

  addDepartment: () =>
    set((state) => ({
      departments: [
        ...state.departments,
        { name: "", nursesPerShift: 1, doctorsPerShift: 1 },
      ],
    })),

  removeDepartment: (index: number) =>
    set((state) => ({
      departments: filterArrayItem(state.departments, index),
    })),

  updateDepartment: (index: number, field: keyof Department, value: Department[keyof Department]) =>
    set((state) => ({
      departments: updateArrayItem(state.departments, index, { [field]: value }),
    })),

  addNurse: () =>
    set((state) => ({
      nurses: [...state.nurses, createNurse(`Nurse ${state.nurses.length + 1}`)],
    })),

  removeNurse: (index: number) =>
    set((state) => ({
      nurses: filterArrayItem(state.nurses, index),
    })),

  updateNurse: (index: number, field: keyof Nurse, value: Nurse[keyof Nurse]) =>
    set((state) => ({
      nurses: updateArrayItem(state.nurses, index, { [field]: value }),
    })),

  saveConfig: async () => {
    const state = get();

    if (!state.projectId) {
      throw new Error('projectId is required to save config');
    }

    await updateProject(state.projectId, {
      selectedShiftModel: state.selectedShiftModel,
      shiftsPerNursePerWeek: state.shiftsPerNursePerWeek,
      restDaysPerNurse: state.restDaysPerNurse,
      scheduleLengthWeeks: state.scheduleLengthWeeks,
      dailyShiftSlots: state.dailyShiftSlots,
      selectedRestPattern: state.selectedRestPattern,
      maxConsecutiveShifts: state.maxConsecutiveShifts,
      minRestHours: state.minRestHours,
      maxNightShiftsPerPeriod: state.maxNightShiftsPerPeriod,
      departments: state.departments,
      nurses: state.nurses,
    });
  },

  initializeFromProject: (project: Project) => {
    const mapped = hospitalConfigService.mapProjectToState(project);
    set({
      ...mapped,
      projectId: project._id || project.id,
    });
  },

  selectShiftModel: (shiftModel: string) => {
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
      nurses: get().nurses.map((nurse) => ({
        ...nurse,
        maxShiftsPerWeek: defaultShiftsPerWeek,
      })),
    });
  },

  toggleRestDaysPerNurse: (withRest: boolean) => {
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

  setScheduleLengthWeeks: (duration: number) =>
    set({ scheduleLengthWeeks: duration }),

  setDailyShiftSlots: (slots: string[]) =>
    set({ dailyShiftSlots: slots }),

  selectRestPattern: (pattern: string) =>
    set({ selectedRestPattern: pattern }),

  setShiftsPerNursePerWeek: (shifts: number) => {
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
      nurses: state.nurses.map((nurse) => ({
        ...nurse,
        maxShiftsPerWeek: shifts,
      })),
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
