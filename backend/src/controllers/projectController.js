
import Project from '../models/Project.js';
import Template from '../models/Template.js';
import { checkFeasibility } from '../services/feasibilityService.js';

const index = async (_req, res) => {
  try {
    const projects = await Project.find().populate('template');
    return res.status(200).json(projects);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const checkFeasibilityHandler = async (req, res) => {
  try {
    const { id } = req.params;
    
    let project;
    if (id) {
      project = await Project.findById(id).populate('template');
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
    } else {
      project = req.body;
    }

    const result = checkFeasibility(project);
    return res.status(200).json(result);
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

    const defaultDuration = template.duration || 1;

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
      maxNightShiftsPerPeriod: defaultShiftConfig.maxNightShiftsPerPeriod || 0,
      demandSlots: [],
      restDays,
      duration: defaultDuration,
      departments: template.departments || [],
      nurses: template.nurses || [],
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

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      shiftModel,
      shiftsPerWeek: shiftPerWeek,
      selectedRestPattern: restPattern,
      restDays,
      maxConsecutiveShifts,
      minRestHours,
      maxNightShiftsPerPeriod,
      scheduleLengthWeeks: duration,
      dailyShiftSlots: timeSlots,
      departments,
    } = req.body;

    const project = await Project.findByIdAndUpdate(
      id,
      {
        shiftModel,
        shiftPerWeek,
        restPattern,
        restDays,
        maxConsecutiveShifts,
        minRestHours,
        maxNightShiftsPerPeriod,
        duration,
        timeSlots,
        departments,
      },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.status(200).json(project);
    // return res.status(200).json({ message: 'Project updated successfully' });
  } catch (err) {
    console.error('Error updating project:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export { index, store, show, update, checkFeasibilityHandler };