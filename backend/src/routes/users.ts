import { Router, Request, Response } from "express";
import { prisma } from "../db";
import { requireAuth } from "../middleware/requireAuth";

const MAX_RESULTS = 6;

// LIKE в SQLite не различает регистр только у латиницы: «мар» не найдет «Марина».
// Поэтому ищем сразу по трем написаниям: как ввели, строчными и с заглавной
const caseVariants = (query: string) => {
  const lower = query.toLowerCase();
  const capitalized = lower.charAt(0).toUpperCase() + lower.slice(1);

  return [...new Set([query, lower, capitalized])];
};

const router = Router();

// ПОИСК ПОЛЬЗОВАТЕЛЕЙ (GET /users/search?q=...)
router.get("/search", requireAuth, async (req: Request, res: Response) => {
  try {
    const rawQuery = req.query.q;

    if (typeof rawQuery !== "string") {
      res.status(400).json({ error: "Query is required" });
      return;
    }

    // Тег можно вводить и с собачкой: «@marina» ищет так же, как «marina»
    const query = rawQuery.trim().replace(/^@/, "");

    if (query === "") {
      res.json([]);
      return;
    }

    const users = await prisma.user.findMany({
      where: {
        OR: caseVariants(query).flatMap((variant) => [
          { name: { contains: variant } },
          { userTag: { contains: variant } },
        ]),
      },
      orderBy: { name: "asc" },
      take: MAX_RESULTS,
      // Отдаем только то, что видно в ленте: email и пароль наружу не уходят
      select: { id: true, name: true, userTag: true, avatar: true },
    });

    res.json(users);
  } catch (error) {
    console.error("Error in GET /users/search:", error);
    res.status(500).json({ error: "Failed to search users" });
  }
});

export default router;
