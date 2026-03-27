import mongoose from 'mongoose';
import { timeSlotSchema } from './Template.js';


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

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' }, // reference added
  engineType: { type: String, enum: ['task', 'demandSlot'], default: 'task' },
  shiftModel: { type: String, required: true},
  shiftPerWeek: { type: Number, required: true },
  restDays: { type: Number, required: true, default: 0 },
  timeSlots: [timeSlotSchema],
  demandSlots: [demandSlotSchema],
  maxConsecutiveShifts: { type: Number, default: 0 },
  minRestHours: { type: Number, default: 0 },
  maxNightShiftsPerPeriod: { type: Number, default: 0 },
  restPattern: {
    type: String, 
    enum: ['spread', 'consecutive'], 
    default: 'consecutive'
  },
  duration: { type: Number, default: 1 },
}, { timestamps: true });

// Static method to calculate default rest days
projectSchema.statics.calculateDefaultRestDays = function(shiftModel, shiftPerWeek) {
  if (shiftModel === '12h') {
    return 7 - shiftPerWeek;
  } else if (shiftModel === '8h') {
    return 2;
  }
  return 0; // fallback
};

export default mongoose.model('Project', projectSchema);