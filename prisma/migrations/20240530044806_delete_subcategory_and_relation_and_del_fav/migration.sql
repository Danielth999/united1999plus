/*
  Warnings:

  - You are about to drop the `FavoriteItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subcategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FavoriteItem" DROP CONSTRAINT "FavoriteItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteItem" DROP CONSTRAINT "FavoriteItem_userId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_subcategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Subcategory" DROP CONSTRAINT "Subcategory_categoryId_fkey";

-- DropTable
DROP TABLE "FavoriteItem";

-- DropTable
DROP TABLE "Subcategory";
