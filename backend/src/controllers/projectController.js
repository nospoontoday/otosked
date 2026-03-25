
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

    console.log("DEFAULT SHIFT CONFIG:", defaultShiftConfig);

    const project = await Project.create({
      name: name || `${templateKey} project`,
      template: template._id,
      engineType,
      shiftModel: template.defaultShiftModel,
      shiftPerWeek: template.defaultShiftPerWeek,
      timeSlots: defaultShiftConfig.timeSlots,
      demandSlots: [],
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