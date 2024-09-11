/*
  Warnings:

  - A unique constraint covering the columns `[moviesCode]` on the table `MoviesCollection` will be added. If there are existing duplicate values, this will fail.
  - Made the column `moviesCode` on table `MoviesCollection` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdTime` on table `MoviesCollection` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "MovieInfo" ALTER COLUMN "updatedTime" DROP DEFAULT;

-- AlterTable
ALTER TABLE "MoviesCollection" ALTER COLUMN "moviesCode" SET NOT NULL,
ALTER COLUMN "createdTime" SET NOT NULL,
ALTER COLUMN "createdTime" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "MoviesVideoResource" ALTER COLUMN "size" SET DATA TYPE VARCHAR(100);

-- CreateIndex
CREATE UNIQUE INDEX "MoviesCollection_moviesCode_key" ON "MoviesCollection"("moviesCode");
