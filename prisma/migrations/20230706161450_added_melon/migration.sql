/*
  Warnings:

  - The primary key for the `BbcTechNews` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Climate` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Hackers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `NaverNews` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `naverKin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Melon` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[writer]` on the table `BbcTechNews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[writer]` on the table `Climate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[writer]` on the table `Hackers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[writer]` on the table `NaverNews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[writer]` on the table `naverKin` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BbcTechNews" DROP CONSTRAINT "BbcTechNews_pkey",
ADD CONSTRAINT "BbcTechNews_pkey" PRIMARY KEY ("uuid");

-- AlterTable
ALTER TABLE "Climate" DROP CONSTRAINT "Climate_pkey",
ADD CONSTRAINT "Climate_pkey" PRIMARY KEY ("uuid");

-- AlterTable
ALTER TABLE "Hackers" DROP CONSTRAINT "Hackers_pkey",
ADD CONSTRAINT "Hackers_pkey" PRIMARY KEY ("uuid");

-- AlterTable
ALTER TABLE "NaverNews" DROP CONSTRAINT "NaverNews_pkey",
ADD CONSTRAINT "NaverNews_pkey" PRIMARY KEY ("uuid");

-- AlterTable
ALTER TABLE "naverKin" DROP CONSTRAINT "naverKin_pkey",
ADD CONSTRAINT "naverKin_pkey" PRIMARY KEY ("uuid");

-- DropTable
DROP TABLE "Melon";

-- CreateIndex
CREATE UNIQUE INDEX "BbcTechNews_writer_key" ON "BbcTechNews"("writer");

-- CreateIndex
CREATE UNIQUE INDEX "Climate_writer_key" ON "Climate"("writer");

-- CreateIndex
CREATE UNIQUE INDEX "Hackers_writer_key" ON "Hackers"("writer");

-- CreateIndex
CREATE UNIQUE INDEX "NaverNews_writer_key" ON "NaverNews"("writer");

-- CreateIndex
CREATE UNIQUE INDEX "naverKin_writer_key" ON "naverKin"("writer");
