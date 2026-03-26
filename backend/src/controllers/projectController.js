
import Project from '../models/Project.js';
import Template from '../models/Template.js';

const index = async (_req, res) => {
  try {
    const projects = await Project.find().populate('template');
    return res.status(200).json(projects);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const store = async (req, res) => {
  try {
    const { templateKey = 'custom', engineType = 'task', name } = req.body || {};

    // find template by key
    const template = await Template.findOne({ key: templateKey });

    if (!template) {
      return res.status(404).json({ error: 'Template not found: ' + templateKey });
    }

    const defaultShiftConfig = template.shiftConfigs.find(
      c => c.shiftModel === template.defaultShiftModel
    );

    const defaultRestPattern = template.restPatterns.find(
      p => p.value === template.defaultRestPattern
    );

    // calculate rest days based on template's default shift per week and shift model
    // For example, if using 12h shifts with 3 shifts per week, that's 36 hours/week, so 4 rest days.
    const restDays = Project.calculateDefaultRestDays(template.defaultShiftModel, template.defaultShiftPerWeek);

    const project = await Project.create({
      name: name || `${templateKey} project`,
      template: template._id,
      engineType,
      shiftModel: template.defaultShiftModel,
      shiftPerWeek: template.defaultShiftPerWeek,
      restPattern: defaultRestPattern ? defaultRestPattern.value : 'spread',
      timeSlots: defaultShiftConfig.timeSlots,
      maxConsecutiveShifts: defaultShiftConfig.maxConsecutiveShifts,
      minRestHours: defaultShiftConfig.minRestHours,
      demandSlots: [],
      restDays,
    });

    return res.status(201).json(project);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const show = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id).populate('template');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export { index, store, show };