-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "author" TEXT NOT NULL,
    "userTag" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "dateOfCreation" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" INTEGER,
    CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("author", "comments", "dateOfCreation", "id", "text", "userTag") SELECT "author", "comments", "dateOfCreation", "id", "text", "userTag" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- Backfill: связываем старые посты с авторами по совпадению тега.
-- Там, где пользователя с таким тегом нет, authorId останется NULL —
-- такой пост считается ничьим и удалить его через API нельзя.
UPDATE "Post"
SET "authorId" = (
    SELECT "id" FROM "User" WHERE "User"."userTag" = "Post"."userTag"
)
WHERE "authorId" IS NULL;
