import { Task } from '../models/task.model.js';

export const createTask = async ({ title, description, userId }) => {
  return await Task.create({ title, description, userId });
};

export const getTasksByUserPaginated = async (userId, page, limit) => {
  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    Task.find({ userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }), 
    Task.countDocuments({ userId })
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    tasks
  };
};

export const updateTask = async (taskId, data, userId) => {
  return await Task.findOneAndUpdate({ _id: taskId, userId }, data, { new: true });
};

export const deleteTask = async (taskId, userId) => {
  return await Task.findOneAndDelete({ _id: taskId, userId });
};
