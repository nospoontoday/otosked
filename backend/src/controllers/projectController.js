
import Project from '../models/Project.js';

const store = async (req, res) => {
  try {
    const { templateKey = 'custom', engineType = 'task', name } = req.body || {};
    const project = await Project.create({
      name: name || `${templateKey} project`,
      templateKey,
      engineType,
      resourceTypes: [],
      timeSlots: [],
      timeConfig: {},
      resources: [],
      tasks: [],
      subjects: [],
      subjectAssignments: [],
      demandSlots: [],
    });

    return res.status(201).json(project);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export { store };