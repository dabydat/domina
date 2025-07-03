export const getUserId = (req, res, next) => {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(401).json({ message: 'User ID no proporcionado' });
  }

  req.userId = userId;
  next();
};
