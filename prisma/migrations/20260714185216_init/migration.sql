-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('approved', 'rejected', 'pending');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applicants" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "tgUsername" TEXT NOT NULL,
    "cv" TEXT NOT NULL,
    "agileMethodology" BOOLEAN NOT NULL,
    "ITTeam" BOOLEAN NOT NULL,
    "status" "STATUS" NOT NULL DEFAULT 'pending',

    CONSTRAINT "applicants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applicantSkills" (
    "skillId" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,

    CONSTRAINT "applicantSkills_pkey" PRIMARY KEY ("applicantId","skillId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");

-- AddForeignKey
ALTER TABLE "applicantSkills" ADD CONSTRAINT "applicantSkills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicantSkills" ADD CONSTRAINT "applicantSkills_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "applicants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
