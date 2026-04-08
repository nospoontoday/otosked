export type ShiftPreference = 'day' | 'night' | 'evening';

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export type Department = {
  name: string;
  nursesPerShift: number;
  doctorsPerShift: number;
};

export type Nurse = {
  name: string;
  maxShiftsPerWeek: number;
  shiftPreference: ShiftPreference;
  availableDays: readonly DayOfWeek[];
  availableStartTime: string;
  availableEndTime: string;
};

export type ShiftConfig = {
  shiftModel: string;
  timeSlots: string[];
  nursesNeeded: number;
  maxConsecutiveShifts: number;
  minRestHours: number;
  maxNightShiftsPerPeriod: number;
};

export type Project = {
  _id?: string;
  id?: string;
  shiftModel?: string;
  restPattern?: string;
  shiftPerWeek?: number;
  duration?: number;
  timeSlots?: string[];
  restDays?: number;
  maxConsecutiveShifts?: number;
  minRestHours?: number;
  maxNightShiftsPerPeriod?: number;
  departments?: Department[];
  nurses?: Partial<Nurse>[];
  template: {
    defaultShiftModel: string;
    restPattern: string;
    duration: number;
    shiftConfigs: ShiftConfig[];
  };
};

export const DEFAULT_DEPARTMENTS: readonly Department[] = [
  { name: "ICU", nursesPerShift: 1, doctorsPerShift: 1 },
  { name: "ER", nursesPerShift: 2, doctorsPerShift: 1 },
  { name: "General Ward", nursesPerShift: 3, doctorsPerShift: 1 },
] as const;

export const DEFAULT_NURSE_TEMPLATE: Omit<Nurse, 'name'> = {
  maxShiftsPerWeek: 3,
  shiftPreference: "day",
  availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const,
  availableStartTime: "",
  availableEndTime: "",
};

export const createNurse = (name: string): Nurse => ({
  name,
  ...DEFAULT_NURSE_TEMPLATE,
});

export const DEFAULT_NURSES: readonly Nurse[] = [
  createNurse("Nurse 1"),
  createNurse("Nurse 2"),
  createNurse("Nurse 3"),
];
