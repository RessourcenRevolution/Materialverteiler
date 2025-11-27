-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "parent" TEXT,
    "path" TEXT NOT NULL DEFAULT '',
    "access" TEXT NOT NULL DEFAULT 'public',
    "content" TEXT NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]',
    CONSTRAINT "Page_parent_fkey" FOREIGN KEY ("parent") REFERENCES "Page" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Page" ("content", "id", "parent", "path", "slug", "title") SELECT "content", "id", "parent", "path", "slug", "title" FROM "Page";
DROP TABLE "Page";
ALTER TABLE "new_Page" RENAME TO "Page";
CREATE UNIQUE INDEX "Page_path_key" ON "Page"("path");
CREATE INDEX "Page_parent_idx" ON "Page"("parent");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
