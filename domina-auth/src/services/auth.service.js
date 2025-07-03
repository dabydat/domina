import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async ({ username, password }) => {
  const exists = await User.findOne({ username });
  if (exists) throw new Error('Usuario ya registrado');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashedPassword });
  return user;
};

export const loginUser = async ({ username, password }) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error('Usuario no encontrado');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Contraseña incorrecta');

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};
