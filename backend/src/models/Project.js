import mongoose from 'mongoose';

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
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' }, // reference added
  engineType: { type: String, enum: ['task', 'demandSlot'], default: 'task' },
  demandSlots: [demandSlotSchema],
  // hospitalConfig: { type: hospitalConfigSchema, default: () => ({}) },
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);