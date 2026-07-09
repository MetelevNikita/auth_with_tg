/*
  Warnings:

  - Changed the type of `сonfirmed` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `admin` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "сonfirmed",
ADD COLUMN     "сonfirmed" BOOLEAN NOT NULL,
DROP COLUMN "admin",
ADD COLUMN     "admin" BOOLEAN NOT NULL;
