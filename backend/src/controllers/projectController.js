
import Project from '../models/Project.js';

const store = async (req, res) => {
  try {
    // const { templateKey, name } = req.body;
    // const tmpl = templates[templateKey] || templates.custom;
    // const project = await Project.create({
    //   name: name || tmpl.name,
    //   templateKey: templateKey || 'custom',
    //   engineType: req.body.engineType || 'task',
    //   resourceTypes: tmpl.resourceTypes,
    //   timeSlots: tmpl.timeSlots,
    //   timeConfig: tmpl.timeConfig || {},
    //   resources: tmpl.resources,
    //   tasks: tmpl.tasks,
    //   subjects: tmpl.subjects || [],
    //   subjectAssignments: tmpl.subjectAssignments || [],
    //   demandSlots: [],
    // });
    // res.status(201).json(project);
    res.status(201).json({ message: 'Project created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { store };