import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";

import { setupPassport } from "./config/passport";
import authRoutes from "./routes/auth";
import postsRoutes from "./routes/posts";

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- Middleware (всегда до роутов) ----------

// CORS — разрешаем передачу куки с React
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

// Сессии
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true для HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

// Инициализируем Passport (setupPassport вызываем один раз, до passport.session)
setupPassport();
app.use(passport.initialize());
app.use(passport.session());

// ---------- Роуты ----------

// Все пути из auth.ts автоматически получат префикс /api/auth
app.use("/api/auth", authRoutes);

// Все пути из posts.ts автоматически получат префикс /posts
app.use("/posts", postsRoutes);

// ---------- Запуск сервера ----------

app.listen(PORT, () => {
  console.log(`🚀 The server is running on http://localhost:${PORT}`);
});
