import { Router, Request, Response } from "express";
import { prisma } from "../db";

const router = Router();

// Вспомогательная функция для получения текущего userId из заголовка (по умолчанию 1)
const getCurrentUserId = (req: Request): number => {
  const headerId = req.headers["x-user-id"];
  return headerId ? Number(headerId) : 1;
};

// 1. ПОЛУЧЕНИЕ ПОСТОВ (GET /posts)
router.get("/", async (req: Request, res: Response) => {
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
    console.error("Error in GET /posts:", error);
    res.status(500).json({ error: "Failed to retrieve posts" });
  }
});

// 2. СОЗДАНИЕ ПОСТА (POST /posts)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { author, userTag, text } = req.body;

    if (!text || text.trim() === "") {
      res.status(400).json({ error: "The post text cannot be empty." });
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
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create the post" });
  }
});

// 3. ТУГГЛ ЛАЙКА (POST /posts/:id/like)
router.post("/:id/like", async (req: Request, res: Response) => {
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
    console.error("Error while liking:", error);
    res.status(500).json({ error: "Failed to update like" });
  }
});

export default router;
