import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "../db";

// Google OAuth включаем только если заданы ключи, иначе сервер не стартует
export const isGoogleAuthEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

export function setupPassport() {
  // Настройка стратегии Google OAuth
  if (isGoogleAuthEnabled) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          callbackURL:
            process.env.CALLBACK_URL ||
            "http://localhost:5000/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const googleId = profile.id;
            const email = profile.emails?.[0]?.value || "";
            const name = profile.displayName;
            const avatar = profile.photos?.[0]?.value || "";

            // 1. Ищем пользователя по googleId
            let user = await prisma.user.findUnique({ where: { googleId } });
            if (user) return done(null, user);

            // 2. Ищем по email (слияние аккаунтов)
            if (email) {
              user = await prisma.user.findUnique({ where: { email } });
              if (user) {
                user = await prisma.user.update({
                  where: { id: user.id },
                  data: { googleId, avatar: user.avatar || avatar },
                });
                return done(null, user);
              }
            }

            // 3. Если пользователя нет — создаем нового
            const generatedTag = `user_${googleId.slice(-8)}`;
            user = await prisma.user.create({
              data: {
                googleId,
                email,
                name,
                avatar,
                userTag: generatedTag,
              },
            });

            return done(null, user);
          } catch (error) {
            return done(error as Error);
          }
        },
      ),
    );
  } else {
    console.warn(
      "⚠️  GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET не заданы — вход через Google отключен",
    );
  }

  // Сохраняем ID пользователя в сессию
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Достаем пользователя из БД по ID из сессии
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}
