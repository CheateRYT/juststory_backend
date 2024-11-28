-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'User',
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "subscription" BOOLEAN NOT NULL DEFAULT false,
    "subBuyTime" DATETIME,
    "subEndTime" DATETIME
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "daysPeriod" INTEGER NOT NULL DEFAULT 30,
    "description" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_password_key" ON "User"("password");
