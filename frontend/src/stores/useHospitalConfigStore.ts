import { create } from 'zustand';

type ShiftConfig = {
  shiftModel: string;
  timeSlots: string[];
  nursesNeeded: number;
  maxConsecutiveShifts: number;
  minRestHours: number;
  maxNightShiftsPerPeriod: number;
};

type HospitalConfigStore = {

  // selection (what user chooses)
  selectedShiftModel: string | null;
  selectedRestPattern: string | null;
  shiftsPerNursePerWeek: number;
  scheduleLengthWeeks: number;
  restDaysPerNurse: number;

  // structure (what defines a shift system)
  dailyShiftSlots: string[];
  availableShiftModels: ShiftConfig[];
  maxConsecutiveShifts: number;
  minRestHours: number;
  maxNightShiftsPerPeriod: number;

  //actions
  initializeFromProject: (project: any) => void;
  selectShiftModel: (shiftModel: string) => void;
  selectRestPattern: (restPattern: string) => void;
  setShiftsPerNursePerWeek: (shiftPerWeek: number) => void;
  setScheduleLengthWeeks: (duration: number) => void;
  setDailyShiftSlots: (timeSlots: string[]) => void;
  setMaxConsecutiveShifts: (maxConsecutiveShifts: number) => void;
  setMinRestHours: (minRestHours: number) => void;
  toggleRestDaysPerNurse: (withRest: boolean) => void;
  setMaxNightShiftsPerPeriod: (maxNightShifts: number) => void;

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
    setMinRestHours: (minRestHours: number) => set({ minRestHours }),
    setMaxNightShiftsPerPeriod: (maxNightShiftsPerPeriod: number) => set({ maxNightShiftsPerPeriod }),

    selectShiftModel: (shiftModel: string) => {
      const { availableShiftModels } = get();
      const config = availableShiftModels.find(c => c.shiftModel === shiftModel);
      const shiftsPerNursePerWeek = shiftModel === '8h' ? 5 : 3;

      // Use the setter to update both shiftsPerNursePerWeek and maxConsecutiveShifts
      actions.setShiftsPerNursePerWeek(shiftsPerNursePerWeek);
      actions.setRestDaysPerNurse(7 - shiftsPerNursePerWeek);


      // set min rest hours
      if (config?.minRestHours !== undefined) {
        actions.setMinRestHours(config.minRestHours);
      }

      // Update other properties directly
      set({
        selectedShiftModel: shiftModel,
        dailyShiftSlots: config?.timeSlots || [],
        maxNightShiftsPerPeriod: config?.maxNightShiftsPerPeriod || 4,
      });
    },

    setRestDaysPerNurse: (restDays: number) => {
      set({ restDaysPerNurse: restDays });
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
    minRestHours: 12,
    restDaysPerNurse: 4,
    maxNightShiftsPerPeriod: 4,

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

    toggleRestDaysPerNurse: (withRest) => {
      if (!withRest) {
        // Batch all "no rest" resets into one set() call
        set({
          restDaysPerNurse: 0,
          selectedRestPattern: null,
          maxConsecutiveShifts: 0,
          minRestHours: 0,
        });
        return;
      }

      // With rest: detect current config and set smart defaults
      const { shiftsPerNursePerWeek, selectedShiftModel, availableShiftModels } = get();
      
      // Find the shift config for the currently selected shift model
      const currentShiftConfig = availableShiftModels.find(
        c => c.shiftModel === selectedShiftModel
      );

      // Calculate rest days based on current shifts per week
      const restDays = 7 - shiftsPerNursePerWeek;

      // Use shift config defaults or fallback to calculated values
      const maxConsecutiveShifts = currentShiftConfig?.maxConsecutiveShifts || shiftsPerNursePerWeek;
      const minRestHours = currentShiftConfig?.minRestHours || (shiftsPerNursePerWeek === 5 ? 12 : 24);
      const maxNightShiftsPerPeriod = currentShiftConfig?.maxNightShiftsPerPeriod || 4;

      // Batch all updates into one set() call
      set({
        restDaysPerNurse: restDays,
        maxConsecutiveShifts,
        minRestHours,
        selectedRestPattern: 'spread',
        maxNightShiftsPerPeriod,
      });
    },

    getStaffingMetrics: () => {
      const { shiftsPerNursePerWeek, dailyShiftSlots, restDaysPerNurse } = get();

      // calculate nurses needed based on shifts per week and shift model
      let nursesNeeded = 0;

      const totalShiftsPerWeek = dailyShiftSlots.length * 7;
      nursesNeeded = Math.ceil(totalShiftsPerWeek / shiftsPerNursePerWeek);

      return {
        nursesNeeded,
        restDaysPerNurse
      };
    }
  };
});