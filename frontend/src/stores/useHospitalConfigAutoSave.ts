// stores/useHospitalConfigAutoSave.ts

import { useHospitalConfigStore } from './useHospitalConfigStore';

let timeout: ReturnType<typeof setTimeout>;
let previousSnapshot: any = null;

const fieldsToWatch = [
  'selectedShiftModel',
  'shiftsPerNursePerWeek',
  'restDaysPerNurse',
  'maxConsecutiveShifts',
  'minRestHours',
  'maxNightShiftsPerPeriod',
  'selectedRestPattern',
  'scheduleLengthWeeks',
  'dailyShiftSlots',
];

export const setupHospitalConfigAutoSave = () => {
  return useHospitalConfigStore.subscribe(
    (state: any) => {
      // Extract only the fields we want to persist
      const snapshot = fieldsToWatch.reduce((acc, field) => {
        acc[field] = state[field];
        return acc;
      }, {} as any);

      // Only trigger save if snapshot changed
      if (JSON.stringify(snapshot) !== JSON.stringify(previousSnapshot)) {
        previousSnapshot = snapshot;

        clearTimeout(timeout);
        timeout = setTimeout(() => {
          (useHospitalConfigStore.getState() as any).saveConfig();
        }, 500); // debounce
      }
    }
  );
};