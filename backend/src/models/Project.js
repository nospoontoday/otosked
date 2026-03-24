import mongoose from 'mongoose';

const resourceTypeSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    isExclusive: { type: Boolean, default: true },
    needsRouting: { type: Boolean, default: false },
    role: { type: String, default: '' },
  }, { _id: false });
  
  const timeSlotSchema = new mongoose.Schema({
    id: { type: String, required: true },
    label: { type: String, required: true },
    duration: { type: Number, default: 1 },
  }, { _id: false });
  
  const availabilityRuleSchema = new mongoose.Schema({
    days: { type: [String], default: [] },
    startTime: { type: String, default: '08:00' },
    endTime: { type: String, default: '17:00' },
  }, { _id: false });
  
  const skillSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
  }, { _id: false });
  
  const preferenceSchema = new mongoose.Schema({
    key: { type: String, required: true },
    value: { type: String, required: true },
    weight: { type: Number, default: 20 },
  }, { _id: false });
  
  const resourceSchema = new mongoose.Schema({
    id: { type: String, required: true },
    typeId: { type: String, required: true },
    name: { type: String, required: true },
    capacity: { type: Number, default: 0 },
    maxHoursPerWeek: { type: Number, default: 0 },
    size: { type: Number, default: 0 },
    availability: { type: [availabilityRuleSchema], default: [] },
    skills: { type: [skillSchema], default: [] },
    preferences: { type: [preferenceSchema], default: [] },
    shiftPreference: { type: String, default: '' },
    maxCallsPerWeek: { type: Number, default: 0 },
    postCallRest: { type: Boolean, default: false },
    maxShiftsPerWeek: { type: Number, default: 0 },
    preferredShifts: { type: [String], default: [] },
    schedulingType: { type: String, default: '' },
    deptDoctors: { type: Number, default: 0 },
    deptNurses: { type: Number, default: 0 },
  }, { _id: false });
  
  const requirementSchema = new mongoose.Schema({
    typeId: { type: String, required: true },
    count: { type: Number, required: true, min: 1 },
    allowedResourceIds: { type: [String], default: [] },
  }, { _id: false });
  
  const taskSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    requirements: [requirementSchema],
  }, { _id: false });
  
  const subjectSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
  }, { _id: false });
  
  const subjectAssignmentSchema = new mongoose.Schema({
    subjectId: { type: String, required: true },
    sectionId: { type: String, required: true },
    hoursPerWeek: { type: Number, required: true },
    allowedTeacherIds: { type: [String], default: [] },
  }, { _id: false });
  
  const demandSlotSchema = new mongoose.Schema({
    slot_id: { type: String, required: true },
    timeslot_id: { type: String, required: true },
    role_required: { type: String, default: '' },
    department_id: { type: String, default: '' },
    department_name: { type: String, default: '' },
    location_id: { type: String, default: '' },
    candidate_resource_ids: { type: [String], default: [] },
    label: { type: String, default: '' },
  }, { _id: false });
  
  const timeConfigSchema = new mongoose.Schema({
    start_time: { type: String, default: '08:00' },
    end_time: { type: String, default: '17:00' },
    interval_minutes: { type: Number, default: 60 },
    days: { type: [String], default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  }, { _id: false });
  
  const hospitalConfigSchema = new mongoose.Schema({
    weeks: { type: Number, default: 1 },
    withRest: { type: Boolean, default: true },
    restDays: { type: Number, default: 2 },
    restPattern: { type: String, default: 'scattered' },
    maxConsecutive12h: { type: Number, default: 3 },
    maxConsecutive8h: { type: Number, default: 5 },
    minRestHours: { type: Number, default: 12 },
    nurseShiftModel: { type: String, default: '12h' },
    shiftsPerWeek: { type: Number, default: 5 },
    maxNightShiftsPerPeriod: { type: Number, default: 3 },
    doctorShiftModel: { type: String, default: '8h-regular' },
  }, { _id: false });
  
  const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    templateKey: { type: String, default: 'custom' },
    engineType: { type: String, enum: ['task', 'demandSlot'], default: 'task' },
    resourceTypes: [resourceTypeSchema],
    timeSlots: [timeSlotSchema],
    timeConfig: { type: timeConfigSchema, default: () => ({}) },
    resources: [resourceSchema],
    tasks: [taskSchema],
    subjects: [subjectSchema],
    subjectAssignments: [subjectAssignmentSchema],
    demandSlots: [demandSlotSchema],
    hospitalConfig: { type: hospitalConfigSchema, default: () => ({}) },
  }, { timestamps: true });
  
  export default mongoose.model('Project', projectSchema);