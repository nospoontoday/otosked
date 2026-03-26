import { create } from 'zustand';

type ShiftConfig = {
  shiftModel: string;
  timeSlots: string[];
  nursesNeeded: number;
};

type HospitalConfigStore = {

  // selection (what user chooses)
  selectedShiftModel: string | null;
  shiftsPerNursePerWeek: number;
  scheduleLengthWeeks: number;

  // structure (what defines a shift system)
  dailyShiftSlots: string[];
  availableShiftModels: ShiftConfig[];

  //actions
  initializeFromProject: (project: any) => void;
  selectShiftModel: (shiftModel: string) => void;
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
  shiftsPerNursePerWeek: 3,
  scheduleLengthWeeks: 1,
  dailyShiftSlots: [],
  availableShiftModels: [],

  // actions
  initializeFromProject: (project) => {
    const initialShiftModel =
      project.shiftModel || project.template.defaultShiftModel;

    const config = project.template.shiftConfigs.find(
      c => c.shiftModel === initialShiftModel
    );

    set({
      selectedShiftModel: initialShiftModel,
      shiftsPerNursePerWeek: project.shiftPerWeek || 3,
      scheduleLengthWeeks: project.template.duration || 1,
      dailyShiftSlots: config?.timeSlots || [],
      availableShiftModels: project.template.shiftConfigs
    });
  },

  selectShiftModel: (shiftModel) => {
    const { availableShiftModels } = get();

    const config = availableShiftModels.find(c => c.shiftModel === shiftModel);

    set({
      selectedShiftModel: shiftModel,
      dailyShiftSlots: config?.timeSlots || []
    });
  },

  setShiftsPerNursePerWeek: (shiftPerWeek) => set({ shiftsPerNursePerWeek: shiftPerWeek }),

  setScheduleLengthWeeks: (duration) => set({ scheduleLengthWeeks: duration }),

  setDailyShiftSlots: (timeSlots) => set({ dailyShiftSlots: timeSlots }),

  getStaffingMetrics: () => {
    const { selectedShiftModel, shiftsPerNursePerWeek, scheduleLengthWeeks, dailyShiftSlots } = get();

    const shiftModels = get().availableShiftModels.find(c => c.shiftModel === selectedShiftModel);

    const nursesNeeded = shiftModels ? shiftModels.nursesNeeded : 0;
    const restDaysPerNurse = Math.max(0, 7 - shiftsPerNursePerWeek);

    return {
      nursesNeeded,
      restDaysPerNurse
    };
  }
}));