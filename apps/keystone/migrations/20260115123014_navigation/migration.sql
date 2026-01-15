-- CreateTable
CREATE TABLE "NavigationItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "icon" TEXT,
    "title" TEXT NOT NULL DEFAULT '',
    "path" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "Navigation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Navigation_items" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Navigation_items_A_fkey" FOREIGN KEY ("A") REFERENCES "Navigation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Navigation_items_B_fkey" FOREIGN KEY ("B") REFERENCES "NavigationItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Navigation_name_key" ON "Navigation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_Navigation_items_AB_unique" ON "_Navigation_items"("A", "B");

-- CreateIndex
CREATE INDEX "_Navigation_items_B_index" ON "_Navigation_items"("B");
