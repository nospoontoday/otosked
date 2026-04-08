export type CreateProjectParams = {
  templateKey: string;
  engineType: string;
};

export type UpdateProjectParams = {
  selectedShiftModel: string | null;
  shiftsPerNursePerWeek: number;
  restDaysPerNurse: number;
  scheduleLengthWeeks: number;
  dailyShiftSlots: string[];
  selectedRestPattern: string | null;
  maxConsecutiveShifts: number;
  minRestHours: number;
  maxNightShiftsPerPeriod: number;
  departments: Array<{
    name: string;
    nursesPerShift: number;
    doctorsPerShift: number;
  }>;
  nurses: Array<{
    name: string;
    maxShiftsPerWeek: number;
    shiftPreference: string;
    availableDays: readonly string[];
    availableStartTime: string;
    availableEndTime: string;
  }>;
};

export type Project = {
  _id?: string;
  id?: string;
  [key: string]: unknown;
};

export const createProject: (params: CreateProjectParams) => Promise<Project>;
export const getProjects: () => Promise<Project[]>;
export const getProject: (id: string) => Promise<Project>;
export const updateProject: (id: string, config: UpdateProjectParams) => Promise<Project>;
export const checkProjectFeasibility: (id: string) => Promise<boolean>;
export const checkFeasibility: (projectData: Project) => Promise<boolean>;
