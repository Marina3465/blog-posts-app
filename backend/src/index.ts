import express, { Request, Response } from "express";
import cors from "cors";
import { prisma } from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Вспомогательная функция для получения текущего userId из заголовка (по умолчанию 1)
const getCurrentUserId = (req: Request): number => {
  const headerId = req.headers["x-user-id"];
  return headerId ? Number(headerId) : 1;
};

// 1. ПОЛУЧЕНИЕ ПОСТОВ (GET /posts)
app.get("/posts", async (req: Request, res: Response) => {
  try {
    const currentUserId = getCurrentUserId(req);

    const posts = await prisma.post.findMany({
      orderBy: { dateOfCreation: "desc" },
      include: {
        likes: true, // Загружаем связанные лайки из таблицы Like
      },
    });

    // Форматируем ответ с флагами для фронтенда
    const formattedPosts = posts.map((post) => {
      const isLikedByMe = post.likes.some(
        (like) => like.userId === currentUserId,
      );
      return {
        id: post.id,
        author: post.author,
        userTag: post.userTag,
        text: post.text,
        comments: post.comments,
        dateOfCreation: post.dateOfCreation,
        likesCount: post.likes.length,
        isLikedByMe,
      };
    });

    res.json(formattedPosts);
  } catch (error) {
    console.error("Ошибка в GET /posts:", error);
    res.status(500).json({ error: "Не удалось получить посты" });
  }
});

// 2. СОЗДАНИЕ ПОСТА (POST /posts)
app.post("/posts", async (req: Request, res: Response) => {
  try {
    const { author, userTag, text } = req.body;

    if (!text || text.trim() === "") {
      res.status(400).json({ error: "Текст поста не может быть пустым" });
      return;
    }

    const newPost = await prisma.post.create({
      data: {
        author: author || "Marina",
        userTag: userTag || "@marinakv",
        text,
        comments: 0,
      },
    });

    // Возвращаем пост с начальными полями лайков для фронтенда
    res.status(201).json({
      ...newPost,
      likesCount: 0,
      isLikedByMe: false,
    });
  } catch (error) {
    console.error("Ошибка при создании поста:", error);
    res.status(500).json({ error: "Не удалось создать пост" });
  }
});

// 3. ТУГГЛ ЛАЙКА (POST /posts/:id/like)
app.post("/posts/:id/like", async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.id);
    const userId = getCurrentUserId(req);

    // Убедимся, что дефолтный пользователь с id=1 существует в базе
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, name: "Marina", userTag: "@marinakv" },
    });

    // Проверяем, стоял ли уже лайк
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existingLike) {
      // Снимаем лайк
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
    } else {
      // Ставим лайк
      await prisma.like.create({
        data: { userId, postId },
      });
    }

    // Считаем актуальное количество и статус
    const likesCount = await prisma.like.count({ where: { postId } });
    const isLikedByMe = !existingLike;

    res.json({ postId, likesCount, isLikedByMe });
  } catch (error) {
    console.error("Ошибка при лайке:", error);
    res.status(500).json({ error: "Не удалось обновить лайк" });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
