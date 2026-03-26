import { create } from 'zustand';

type ShiftConfig = {
  shiftModel: string;
  timeSlots: string[];
  nursesNeeded: number;
};

type HospitalConfigStore = {

  // selection (what user chooses)
  selectedShiftModel: string | null;
  selectedRestPattern: string | null;
  shiftsPerNursePerWeek: number;
  scheduleLengthWeeks: number;

  // structure (what defines a shift system)
  dailyShiftSlots: string[];
  availableShiftModels: ShiftConfig[];

  //actions
  initializeFromProject: (project: any) => void;
  selectShiftModel: (shiftModel: string) => void;
  selectRestPattern: (restPattern: string) => void;
  setShiftsPerNursePerWeek: (shiftPerWeek: number) => void;
  setScheduleLengthWeeks: (duration: number) => void;
  setDailyShiftSlots: (timeSlots: string[]) => void;

  // derived
  getStaffingMetrics: () => {
    nursesNeeded: number;
    restDaysPerNurse: number;
  };
}

export const useHospitalConfigStore = create<HospitalConfigStore>((set, get) => ({
  // state
  selectedShiftModel: null,
  selectedRestPattern: null,
  shiftsPerNursePerWeek: 3,
  scheduleLengthWeeks: 1,
  dailyShiftSlots: [],
  availableShiftModels: [],

  // actions
  initializeFromProject: (project) => {
    const initialShiftModel =
      project.shiftModel || project.template.defaultShiftModel;

    const initialRestPattern = project.restPattern || project.template.restPattern;

    const config = project.template.shiftConfigs.find(
      c => c.shiftModel === initialShiftModel
    );

    set({
      selectedShiftModel: initialShiftModel,
      selectedRestPattern: initialRestPattern,
      shiftsPerNursePerWeek: project.shiftPerWeek || 3,
      scheduleLengthWeeks: project.template.duration || 1,
      dailyShiftSlots: config?.timeSlots || [],
      availableShiftModels: project.template.shiftConfigs
    });
  },

  selectShiftModel: (shiftModel) => {
    const { availableShiftModels } = get();

    const config = availableShiftModels.find(c => c.shiftModel === shiftModel);
    // Shifts per nurse per week is based on whether it's a 12h or 8h shift model.
    // the 12h model has 2 types of shifts: 3 shifts per week (36 hours) or 4 shifts per week (48 hours). The 8h model has 5 shifts per week (40 hours).
    const shiftsPerNursePerWeek = shiftModel === '8h' ? 5 : 3;

    set({
      selectedShiftModel: shiftModel,
      dailyShiftSlots: config?.timeSlots || [],
      shiftsPerNursePerWeek: shiftsPerNursePerWeek,
    });
  },

  selectRestPattern: (restPattern) => set({ selectedRestPattern: restPattern }),

  setShiftsPerNursePerWeek: (shiftPerWeek) => set({ shiftsPerNursePerWeek: shiftPerWeek }),

  setScheduleLengthWeeks: (duration) => set({ scheduleLengthWeeks: duration }),

  setDailyShiftSlots: (timeSlots) => set({ dailyShiftSlots: timeSlots }),

  getStaffingMetrics: () => {
    const { selectedShiftModel, shiftsPerNursePerWeek, scheduleLengthWeeks, dailyShiftSlots } = get();

    // calculate nurses needed based on shifts per week and shift model
    let nursesNeeded = 0;
    let restDaysPerNurse = 0;

    const totalShiftsPerWeek = dailyShiftSlots.length * 7;
    nursesNeeded = Math.ceil(totalShiftsPerWeek / shiftsPerNursePerWeek);
    restDaysPerNurse = Math.max(0, 7 - shiftsPerNursePerWeek);

    return {
      nursesNeeded,
      restDaysPerNurse
    };
  }
}));