-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "url" TEXT NOT NULL,
    "dataSourceId" TEXT,
    "timestamp" TEXT NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);
