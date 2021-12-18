/*
  Warnings:

  - You are about to drop the column `repo` on the `Link` table. All the data in the column will be lost.
  - Added the required column `repoId` to the `Link` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repoName` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Link` DROP COLUMN `repo`,
    ADD COLUMN `repoId` INTEGER NOT NULL,
    ADD COLUMN `repoName` VARCHAR(191) NOT NULL;
