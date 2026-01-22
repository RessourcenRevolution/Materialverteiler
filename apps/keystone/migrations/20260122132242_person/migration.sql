-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "photo_id" TEXT,
    "photo_filesize" INTEGER,
    "photo_width" INTEGER,
    "photo_height" INTEGER,
    "photo_extension" TEXT
);
