/*
  Warnings:

  - You are about to drop the column `bir` on the `Actress` table. All the data in the column will be lost.
  - You are about to drop the column `createdTime` on the `Actress` table. All the data in the column will be lost.
  - You are about to drop the column `createdTime` on the `FilesInfo` table. All the data in the column will be lost.
  - You are about to drop the column `createdTime` on the `MagnetLinks` table. All the data in the column will be lost.
  - You are about to drop the column `linkName` on the `MagnetLinks` table. All the data in the column will be lost.
  - You are about to drop the `ActressMovie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MoviesOnTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Actress" DROP COLUMN "bir",
DROP COLUMN "createdTime",
ADD COLUMN     "birthDay" DATE;

-- AlterTable
ALTER TABLE "FilesInfo" DROP COLUMN "createdTime";

-- AlterTable
ALTER TABLE "MagnetLinks" DROP COLUMN "createdTime",
DROP COLUMN "linkName";

-- DropTable
DROP TABLE "ActressMovie";

-- DropTable
DROP TABLE "MoviesOnTag";

-- CreateTable
CREATE TABLE "_ActressMovie" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MoviesOnTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ActressMovie_AB_unique" ON "_ActressMovie"("A", "B");

-- CreateIndex
CREATE INDEX "_ActressMovie_B_index" ON "_ActressMovie"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MoviesOnTag_AB_unique" ON "_MoviesOnTag"("A", "B");

-- CreateIndex
CREATE INDEX "_MoviesOnTag_B_index" ON "_MoviesOnTag"("B");


