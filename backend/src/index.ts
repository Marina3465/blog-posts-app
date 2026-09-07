import express, { Request, Response } from "express";
import cors from "cors";
import { prisma } from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Разрешает запросы с фронтенда (React/Webpack)
app.use(express.json()); // Позволяет Express читать JSON в body запроса

// 1. ПОЛУЧЕНИЕ ПОСТОВ (GET /posts)
app.get("/posts", async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        dateOfCreation: "desc", // Сначала самые новые посты
      },
    });
    res.json(posts);
  } catch (error) {
    console.error("Ошибка в GET /posts:", error);
    res.status(500).json({ error: "Не удалось получить посты" });
  }
});

// 2. СОЗДАНИЕ ПОСТА (POST /posts)
app.post("/posts", async (req: Request, res: Response) => {
  try {
    const { author, userTag, text } = req.body;

    // Валидация
    if (!text || text.trim() === "") {
      res.status(400).json({ error: "Текст поста не может быть пустым" });
      return;
    }

    const newPost = await prisma.post.create({
      data: {
        author: author || "Marina",
        userTag: userTag || "@marinakv",
        text,
        likes: 0,
        comments: 0,
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Не удалось создать пост" });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
