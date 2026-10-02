import { Router, Request, Response } from "express";
import { prisma } from "../db";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

// 1. ПОЛУЧЕНИЕ ПОСТОВ (GET /posts)
router.get("/", async (req: Request, res: Response) => {
  try {
    // Ленту может читать и гость — у него просто нет своих лайков
    const currentUserId = req.user?.id;

    const posts = await prisma.post.findMany({
      orderBy: { dateOfCreation: "desc" },
      include: {
        likes: true, // Загружаем связанные лайки из таблицы Like
      },
    });

    // Форматируем ответ с флагами для фронтенда
    const formattedPosts = posts.map((post) => {
      const isLikedByMe = currentUserId
        ? post.likes.some((like) => like.userId === currentUserId)
        : false;

      return {
        id: post.id,
        author: post.author,
        userTag: post.userTag,
        text: post.text,
        comments: post.comments,
        dateOfCreation: post.dateOfCreation,
        likesCount: post.likes.length,
        isLikedByMe,
        // Свой пост можно удалить — кнопку показываем только автору
        isMine: currentUserId !== undefined && post.authorId === currentUserId,
      };
    });

    res.json(formattedPosts);
  } catch (error) {
    console.error("Error in GET /posts:", error);
    res.status(500).json({ error: "Failed to retrieve posts" });
  }
});

// 2. СОЗДАНИЕ ПОСТА (POST /posts)
router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      res.status(400).json({ error: "The post text cannot be empty." });
      return;
    }

    // Автора берем из сессии, а не из тела запроса:
    // клиент не должен сообщать, кто он
    const author = req.user!;

    const newPost = await prisma.post.create({
      data: {
        author: author.name,
        userTag: author.userTag,
        authorId: author.id,
        text,
        comments: 0,
      },
    });

    // Возвращаем пост с начальными полями лайков для фронтенда
    res.status(201).json({
      ...newPost,
      likesCount: 0,
      isLikedByMe: false,
      isMine: true,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create the post" });
  }
});

// 3. ТУГГЛ ЛАЙКА (POST /posts/:id/like)
router.post("/:id/like", requireAuth, async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.id);
    const userId = req.user!.id;

    if (Number.isNaN(postId)) {
      res.status(400).json({ error: "Invalid post id" });
      return;
    }

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

// 4. УДАЛЕНИЕ ПОСТА (DELETE /posts/:id)
router.delete("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.id);

    if (Number.isNaN(postId)) {
      res.status(400).json({ error: "Invalid post id" });
      return;
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    // Удалять может только автор. У постов, созданных до авторизации,
    // authorId пустой — такие не удаляет никто
    if (post.authorId !== req.user!.id) {
      res.status(403).json({ error: "You can delete only your own posts" });
      return;
    }

    // Лайки уйдут сами: в схеме у Like стоит onDelete: Cascade
    await prisma.post.delete({ where: { id: postId } });

    res.json({ id: postId });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete the post" });
  }
});

export default router;
