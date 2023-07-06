/*
  Warnings:

  - The primary key for the `BbcTechNews` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Climate` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Hackers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Melon` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `NaverNews` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `naverKin` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "BbcTechNews" DROP CONSTRAINT "BbcTechNews_pkey",
ADD COLUMN     "writer" TEXT NOT NULL DEFAULT 'dongquinn',
ADD CONSTRAINT "BbcTechNews_pkey" PRIMARY KEY ("writer");

-- AlterTable
ALTER TABLE "Climate" DROP CONSTRAINT "Climate_pkey",
ADD COLUMN     "writer" TEXT NOT NULL DEFAULT 'dongquinn',
ADD CONSTRAINT "Climate_pkey" PRIMARY KEY ("writer");

-- AlterTable
ALTER TABLE "Hackers" DROP CONSTRAINT "Hackers_pkey",
ADD COLUMN     "writer" TEXT NOT NULL DEFAULT 'dongquinn',
ADD CONSTRAINT "Hackers_pkey" PRIMARY KEY ("writer");

-- AlterTable
ALTER TABLE "Melon" DROP CONSTRAINT "Melon_pkey",
ADD COLUMN     "writer" TEXT NOT NULL DEFAULT 'dongquinn',
ADD CONSTRAINT "Melon_pkey" PRIMARY KEY ("writer");

-- AlterTable
ALTER TABLE "NaverNews" DROP CONSTRAINT "NaverNews_pkey",
ADD COLUMN     "writer" TEXT NOT NULL DEFAULT 'dongquinn',
ADD CONSTRAINT "NaverNews_pkey" PRIMARY KEY ("writer");

-- AlterTable
ALTER TABLE "naverKin" DROP CONSTRAINT "naverKin_pkey",
ADD COLUMN     "writer" TEXT NOT NULL DEFAULT 'dongquinn',
ADD CONSTRAINT "naverKin_pkey" PRIMARY KEY ("writer");
