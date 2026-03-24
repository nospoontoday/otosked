
import Project from '../models/Project.js';
import Template from '../models/Template.js';

const store = async (req, res) => {
  try {
    const { templateKey = 'custom', engineType = 'task', name } = req.body || {};

    // find template by key
    const template = await Template.findOne({ key: templateKey });

    if (!template) {
      return res.status(404).json({ error: 'Template not found: ' + templateKey });
    }

    const project = await Project.create({
      name: name || `${templateKey} project`,
      template: template._id, // store reference
      engineType,
      demandSlots: [],
    });

    return res.status(201).json(project);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export { store };