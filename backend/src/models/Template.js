import mongoose from 'mongoose';

const resourceTypeSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    isExclusive: { type: Boolean, default: true },
    needsRouting: { type: Boolean, default: false },
    role: { type: String, default: '' },
}, { _id: false });

const timeConfigSchema = new mongoose.Schema({
    start_time: { type: String, default: '08:00' },
    end_time: { type: String, default: '17:00' },
    interval_minutes: { type: Number, default: 60 },
    days: { type: [String], default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
}, { _id: false });

const timeSlotSchema = new mongoose.Schema({
    id: { type: String, required: true },
    label: { type: String, required: true },
    duration: { type: Number, default: 1 },
}, { _id: false });

const shiftConfigSchema = new mongoose.Schema({
  shiftModel: {
    type: String,
    enum: ['12h', '8h'],
    required: true,
  },

  timeSlots: {
    type: [timeSlotSchema],
    default: [],
  }

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

const shiftModelSchema = new mongoose.Schema({
  value: { 
    type: String, 
    enum: ['12h', '8h'], 
    required: true 
  },
  label: { 
    type: String, 
    required: true 
  },
}, { _id: false });

const shiftPerWeekOptionSchema = new mongoose.Schema({
    value: { 
        type: Number, 
        enum: [3, 4], 
        required: true 
    },
    label: { 
        type: String, 
        required: true 
    },
}, { _id: false });

const templateSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true},
    name: { type: String, required: true },
    description: { type: String },
    timeConfig: { type: timeConfigSchema, default: () => ({}) },
    resourceTypes: [resourceTypeSchema],
    shiftConfigs: {
        type: [shiftConfigSchema],
        default: [
            {
            shiftModel: '12h',
            timeSlots: [
                { id: 'day', label: 'Day Shift', duration: 12 },
                { id: 'night', label: 'Night Shift', duration: 12 },
            ],
            },
            {
            shiftModel: '8h',
            timeSlots: [
                { id: 'morning', label: 'Morning Shift', duration: 8 },
                { id: 'evening', label: 'Evening Shift', duration: 8 },
                { id: 'night', label: 'Night Shift', duration: 8 },
            ],
            },
        ],
    },
    resources: [resourceSchema],

    shiftModels: {
        type: [shiftModelSchema],
        default: [
            { value: '12h', label: '12-Hour Shift Model' },
            { value: '8h', label: '8-Hour Shift Model' },
        ],
    },

    shiftPerWeekOptions: {
        type: [shiftPerWeekOptionSchema],
        default: [
            { value: 3, label: '3 Shifts per week (36h/wk)' },
            { value: 4, label: '4 Shifts per week (48h/wk)' },
        ],
    },

    defaultShiftModel: {
        type: String,
        enum: ['12h', '8h'],
        default: '12h',
    },

    defaultShiftPerWeek: {
        type: Number,
        enum: [3, 4],
        default: 3,
    },

    duration: { type: Number, default: 1 },
    tasks: [taskSchema],
    subjects: [subjectSchema],
    subjectAssignments: [subjectAssignmentSchema],
}, { timestamps: true });

export default mongoose.model('Template', templateSchema);

