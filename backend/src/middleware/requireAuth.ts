import { RequestHandler } from "express";

// Пускаем дальше только с валидной сессией.
// Читать ленту можно всем, а писать — только своим.
export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated() || !req.user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  next();
};
