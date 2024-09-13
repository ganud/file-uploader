-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "folderId" INTEGER NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_url_key" ON "File"("url");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
