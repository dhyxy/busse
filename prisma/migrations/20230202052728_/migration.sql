-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RefreshToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RefreshToken" ("createdAt", "id", "token", "userId") SELECT "createdAt", "id", "token", "userId" FROM "RefreshToken";
DROP TABLE "RefreshToken";
ALTER TABLE "new_RefreshToken" RENAME TO "RefreshToken";
CREATE UNIQUE INDEX "RefreshToken_id_key" ON "RefreshToken"("id");
CREATE UNIQUE INDEX "RefreshToken_userId_key" ON "RefreshToken"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
