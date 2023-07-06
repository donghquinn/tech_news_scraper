/*
  Warnings:

  - You are about to drop the column `writer` on the `BbcTechNews` table. All the data in the column will be lost.
  - You are about to drop the column `writer` on the `Climate` table. All the data in the column will be lost.
  - You are about to drop the column `writer` on the `Hackers` table. All the data in the column will be lost.
  - You are about to drop the column `writer` on the `NaverNews` table. All the data in the column will be lost.
  - You are about to drop the column `writer` on the `naverKin` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "BbcTechNews_writer_key";

-- DropIndex
DROP INDEX "Climate_writer_key";

-- DropIndex
DROP INDEX "Hackers_writer_key";

-- DropIndex
DROP INDEX "NaverNews_writer_key";

-- DropIndex
DROP INDEX "naverKin_writer_key";

-- AlterTable
ALTER TABLE "BbcTechNews" DROP COLUMN "writer";

-- AlterTable
ALTER TABLE "Climate" DROP COLUMN "writer";

-- AlterTable
ALTER TABLE "Hackers" DROP COLUMN "writer";

-- AlterTable
ALTER TABLE "NaverNews" DROP COLUMN "writer";

-- AlterTable
ALTER TABLE "naverKin" DROP COLUMN "writer";
