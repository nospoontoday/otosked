import { useHospitalConfigStore } from '../stores/useHospitalConfigStore';
import { checkFeasibilityLocally } from './feasibility/index.js';

export const useLocalFeasibilityCheck = () => {
  const selectedShiftModel = useHospitalConfigStore((state) => state.selectedShiftModel);
  const shiftsPerNursePerWeek = useHospitalConfigStore((state) => state.shiftsPerNursePerWeek);
  const restDaysPerNurse = useHospitalConfigStore((state) => state.restDaysPerNurse);
  const scheduleLengthWeeks = useHospitalConfigStore((state) => state.scheduleLengthWeeks);
  const dailyShiftSlots = useHospitalConfigStore((state) => state.dailyShiftSlots);
  const maxConsecutiveShifts = useHospitalConfigStore((state) => state.maxConsecutiveShifts);
  const minRestHours = useHospitalConfigStore((state) => state.minRestHours);
  const selectedRestPattern = useHospitalConfigStore((state) => state.selectedRestPattern);
  const departments = useHospitalConfigStore((state) => state.departments);
  const nurses = useHospitalConfigStore((state) => state.nurses);

  const result = checkFeasibilityLocally({
    selectedShiftModel,
    shiftsPerNursePerWeek,
    restDaysPerNurse,
    scheduleLengthWeeks,
    dailyShiftSlots,
    maxConsecutiveShifts,
    minRestHours,
    selectedRestPattern,
    departments,
    nurses,
  });

  return result;
};
