import * as taskService from '../services/task.service.js';

export const create = async (req, res) => {
  try {
    const task = await taskService.createTask({ ...req.body, userId: req.userId });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAll = async (req, res) => {
  const userId = req.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const tasks = await taskService.getTasksByUserPaginated(userId, page, limit);
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const update = async (req, res) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body, req.userId);
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const task = await taskService.deleteTask(req.params.id, req.userId);
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
