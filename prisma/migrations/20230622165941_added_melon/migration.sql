/*
  Warnings:

  - The `founded` column on the `BbcTechNews` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `created` on the `Climate` table. All the data in the column will be lost.
  - The `founded` column on the `Hackers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `founded` column on the `Melon` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `founded` column on the `NaverNews` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `create` on the `naverKin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BbcTechNews" DROP COLUMN "founded",
ADD COLUMN     "founded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Climate" DROP COLUMN "created",
ADD COLUMN     "founded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Hackers" DROP COLUMN "founded",
ADD COLUMN     "founded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Melon" DROP COLUMN "founded",
ADD COLUMN     "founded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "NaverNews" DROP COLUMN "founded",
ADD COLUMN     "founded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "naverKin" DROP COLUMN "create",
ADD COLUMN     "founded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
