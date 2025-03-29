/*
  Warnings:

  - The primary key for the `Parent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `referralCode` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `walletBalance` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `contactEmail` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `contactPersonDesignation` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `contactPersonName` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `contactPhone` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `licenseCount` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `licenseExpiry` on the `School` table. All the data in the column will be lost.
  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Teacher` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserProfile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Parent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `Parent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[firebaseUid]` on the table `Parent` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Parent` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updatedAt` to the `Parent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Parent" DROP CONSTRAINT "Parent_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_user_id_fkey";

-- DropIndex
DROP INDEX "Parent_referralCode_key";

-- AlterTable
ALTER TABLE "Parent" DROP CONSTRAINT "Parent_pkey",
DROP COLUMN "referralCode",
DROP COLUMN "user_id",
DROP COLUMN "walletBalance",
ADD COLUMN     "accountStatus" VARCHAR(20) NOT NULL DEFAULT 'active',
ADD COLUMN     "email" TEXT,
ADD COLUMN     "firebaseUid" TEXT,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Parent_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "School" DROP COLUMN "contactEmail",
DROP COLUMN "contactPersonDesignation",
DROP COLUMN "contactPersonName",
DROP COLUMN "contactPhone",
DROP COLUMN "licenseCount",
DROP COLUMN "licenseExpiry";

-- DropTable
DROP TABLE "Student";

-- DropTable
DROP TABLE "Teacher";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserProfile";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "ParentProfile" (
    "parent_id" TEXT NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" TEXT,
    "preferredLanguage" TEXT NOT NULL DEFAULT 'en',
    "profilePictureUrl" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentProfile_pkey" PRIMARY KEY ("parent_id")
);

-- CreateTable
CREATE TABLE "Child" (
    "id" TEXT NOT NULL,
    "parent_id" TEXT,
    "school_id" TEXT,
    "fullName" TEXT NOT NULL,
    "displayName" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "profilePictureUrl" TEXT,
    "grade" TEXT,
    "motherTongue" TEXT,
    "learningPreferences" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildCredential" (
    "child_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChildCredential_pkey" PRIMARY KEY ("child_id")
);

-- CreateTable
CREATE TABLE "ParentChildRelationship" (
    "parent_id" TEXT NOT NULL,
    "child_id" TEXT NOT NULL,
    "relationshipType" VARCHAR(50) NOT NULL DEFAULT 'parent',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "canManage" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentChildRelationship_pkey" PRIMARY KEY ("parent_id","child_id")
);

-- CreateTable
CREATE TABLE "ParentAuthMethod" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "methodType" VARCHAR(50) NOT NULL,
    "providerId" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentAuthMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userType" VARCHAR(10) NOT NULL,
    "deviceId" TEXT,
    "deviceName" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "accessTokenHash" TEXT NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtpVerification" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT,
    "otpCode" VARCHAR(10) NOT NULL,
    "purpose" VARCHAR(50) NOT NULL,
    "userType" VARCHAR(10),
    "intendedUserId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolChildAccount" (
    "child_id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "groupId" TEXT,
    "username" TEXT NOT NULL,
    "initialPassword" TEXT NOT NULL,
    "passwordChanged" BOOLEAN NOT NULL DEFAULT false,
    "accountStatus" VARCHAR(20) NOT NULL DEFAULT 'active',
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolChildAccount_pkey" PRIMARY KEY ("child_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ParentProfile_parent_id_key" ON "ParentProfile"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "ChildCredential_username_key" ON "ChildCredential"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ParentAuthMethod_parentId_methodType_providerId_key" ON "ParentAuthMethod"("parentId", "methodType", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "OtpVerification_phoneNumber_key" ON "OtpVerification"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolChildAccount_username_key" ON "SchoolChildAccount"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_email_key" ON "Parent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_phoneNumber_key" ON "Parent"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_firebaseUid_key" ON "Parent"("firebaseUid");

-- AddForeignKey
ALTER TABLE "ParentProfile" ADD CONSTRAINT "ParentProfile_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildCredential" ADD CONSTRAINT "ChildCredential_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentChildRelationship" ADD CONSTRAINT "ParentChildRelationship_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentChildRelationship" ADD CONSTRAINT "ParentChildRelationship_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentAuthMethod" ADD CONSTRAINT "ParentAuthMethod_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolChildAccount" ADD CONSTRAINT "SchoolChildAccount_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolChildAccount" ADD CONSTRAINT "SchoolChildAccount_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
