import { Router, type RequestHandler } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import { prisma } from "../db";
import { isGoogleAuthEnabled } from "../config/passport";

const router = Router();

// Если ключи Google не заданы — отвечаем понятной ошибкой, а не падаем
const requireGoogleAuth: RequestHandler = (req, res, next) => {
  if (!isGoogleAuthEnabled) {
    return res.status(503).json({ error: "Google sign-in is not configured" });
  }
  next();
};

// 1. Перенаправление в Google
router.get(
  "/google",
  requireGoogleAuth,
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// 2. Callback от Google
router.get(
  "/google/callback",
  requireGoogleAuth,
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:3000"}/login`,
  }),
  (req, res) => {
    res.redirect(
      `${process.env.CLIENT_URL || "http://localhost:3000"}/dashboard`,
    );
  },
);

// 3. Регистрация по логину/паролю
router.post("/register", async (req, res) => {
  try {
    const { name, userTag, email, password } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { userTag }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email)
        return res.status(400).json({ error: "This email is already taken" });
      return res.status(400).json({ error: "This userTag is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, userTag, email, password: hashedPassword },
    });

    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: "Failed to sign in" });
      const { password, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to register" });
  }
});

// 4. Вход по логину/паролю
router.post("/login", async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ userTag: login }, { email: login }],
      },
    });

    if (!user || !user.password) {
      return res.status(400).json({ error: "Invalid login or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid login or password" });
    }

    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: "Failed to sign in" });
      const { password, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to sign in" });
  }
});

// 5. Получить текущего авторизованного пользователя
router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user as any;
    if (user && user.password) {
      const { password, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    }
    return res.json(req.user);
  }
  res.status(401).json({ error: "Not authenticated" });
});

// 6. Выход
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ success: true });
  });
});

export default router;
