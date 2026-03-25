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

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' }, // reference added
  engineType: { type: String, enum: ['task', 'demandSlot'], default: 'task' },
  shiftModel: { type: String, required: true},
  shiftPerWeek: { type: Number, required: true },
  shiftConfig: { type: Object, default: {} },
  demandSlots: [demandSlotSchema],
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);