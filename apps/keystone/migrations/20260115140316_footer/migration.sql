-- CreateTable
CREATE TABLE "Footer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]'
);

-- CreateTable
CREATE TABLE "_Footer_links" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Footer_links_A_fkey" FOREIGN KEY ("A") REFERENCES "Footer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Footer_links_B_fkey" FOREIGN KEY ("B") REFERENCES "NavigationItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_Footer_links_AB_unique" ON "_Footer_links"("A", "B");

-- CreateIndex
CREATE INDEX "_Footer_links_B_index" ON "_Footer_links"("B");
