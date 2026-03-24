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

const templateSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true},
    name: { type: String, required: true },
    description: { type: String },
    timeConfig: { type: timeConfigSchema, default: () => ({}) },
    resourceTypes: [resourceTypeSchema],
    timeSlots: [timeSlotSchema],
    resources: [resourceSchema],
    tasks: [taskSchema],
    subjects: [subjectSchema],
    subjectAssignments: [subjectAssignmentSchema],
}, { timestamps: true });

export default mongoose.model('Template', templateSchema);

