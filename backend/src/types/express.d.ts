import { User as PrismaUser } from "@prisma/client";

// Passport кладет в req.user результат deserializeUser — у нас это модель User.
// Без этого объявления TypeScript считает req.user пустым объектом.
declare global {
  namespace Express {
    interface User extends PrismaUser {}
  }
}

export {};
