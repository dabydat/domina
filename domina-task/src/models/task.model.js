import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false },
  userId: { type: String, required: true } // ID del usuario al que pertenece la tarea
}, {
  timestamps: true
});

export const Task = mongoose.model('tasks', taskSchema);
