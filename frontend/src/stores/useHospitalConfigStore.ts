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
  maxConsecutiveShifts: number;

  //actions
  initializeFromProject: (project: any) => void;
  selectShiftModel: (shiftModel: string) => void;
  selectRestPattern: (restPattern: string) => void;
  setShiftsPerNursePerWeek: (shiftPerWeek: number) => void;
  setScheduleLengthWeeks: (duration: number) => void;
  setDailyShiftSlots: (timeSlots: string[]) => void;
  setMaxConsecutiveShifts: (maxConsecutiveShifts: number) => void;

  // derived
  getStaffingMetrics: () => {
    nursesNeeded: number;
    restDaysPerNurse: number;
  };
}

export const useHospitalConfigStore = create<HospitalConfigStore>((set, get) => {
  // Define actions as a separate object to allow cross-references
  const actions = {
    setShiftsPerNursePerWeek: (shiftPerWeek: number) => set({ 
      shiftsPerNursePerWeek: shiftPerWeek,
      maxConsecutiveShifts: shiftPerWeek,
    }),

    setMaxConsecutiveShifts: (maxConsecutiveShifts: number) => set({ maxConsecutiveShifts }),

    selectShiftModel: (shiftModel: string) => {
      const { availableShiftModels } = get();
      const config = availableShiftModels.find(c => c.shiftModel === shiftModel);
      const shiftsPerNursePerWeek = shiftModel === '8h' ? 5 : 3;

      // Use the setter to update both shiftsPerNursePerWeek and maxConsecutiveShifts
      actions.setShiftsPerNursePerWeek(shiftsPerNursePerWeek);

      // Update other properties directly
      set({
        selectedShiftModel: shiftModel,
        dailyShiftSlots: config?.timeSlots || [],
      });
    },
  };

  return {
    // state
    selectedShiftModel: null,
    selectedRestPattern: null,
    shiftsPerNursePerWeek: 3,
    scheduleLengthWeeks: 1,
    dailyShiftSlots: [],
    availableShiftModels: [],
    maxConsecutiveShifts: 3,

    // actions
    ...actions,
    initializeFromProject: (project) => {
      const initialShiftModel =
        project.shiftModel || project.template.defaultShiftModel;

      const initialRestPattern = project.restPattern || project.template.restPattern;

      const config = (project.template.shiftConfigs as ShiftConfig[]).find(
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

    selectRestPattern: (restPattern) => set({ selectedRestPattern: restPattern }),

    setScheduleLengthWeeks: (duration) => set({ scheduleLengthWeeks: duration }),

    setDailyShiftSlots: (timeSlots) => set({ dailyShiftSlots: timeSlots }),

    getStaffingMetrics: () => {
      const { shiftsPerNursePerWeek, dailyShiftSlots } = get();

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
  };
});