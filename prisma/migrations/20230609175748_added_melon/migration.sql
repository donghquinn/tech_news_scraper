-- CreateTable
CREATE TABLE "naverKin" (
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT[],
    "link" TEXT NOT NULL,
    "create" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "naverKin_pkey" PRIMARY KEY ("uuid")
);
