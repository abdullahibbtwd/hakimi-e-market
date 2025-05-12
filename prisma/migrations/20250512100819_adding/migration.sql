-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT[],

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);
