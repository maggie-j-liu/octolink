/*
  Warnings:

  - A unique constraint covering the columns `[githubUsername]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `githubUsername` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `githubId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `githubUsername` VARCHAR(191) NOT NULL,
    MODIFY `githubId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_githubUsername_key` ON `User`(`githubUsername`);
