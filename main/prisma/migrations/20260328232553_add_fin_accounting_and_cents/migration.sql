/*
  Warnings:

  - You are about to alter the column `amount` on the `contributions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `amount` on the `pledges` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `amountPaid` on the `pledges` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.

*/
-- CreateEnum
CREATE TYPE "FinAccountType" AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "FinJournalEntryStatus" AS ENUM ('DRAFT', 'POSTED');

-- Convert existing decimal amounts to cents (pesewas) before type change
UPDATE "contributions" SET "amount" = "amount" * 100;
UPDATE "pledges" SET "amount" = "amount" * 100, "amountPaid" = "amountPaid" * 100;

-- AlterTable
ALTER TABLE "contributions" ALTER COLUMN "amount" SET DATA TYPE INTEGER USING "amount"::integer;

-- AlterTable
ALTER TABLE "pledges" ALTER COLUMN "amount" SET DATA TYPE INTEGER USING "amount"::integer,
ALTER COLUMN "amountPaid" SET DEFAULT 0,
ALTER COLUMN "amountPaid" SET DATA TYPE INTEGER USING "amountPaid"::integer;

-- CreateTable
CREATE TABLE "fin_accounts" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "accountType" "FinAccountType" NOT NULL,
    "isGroup" BOOLEAN NOT NULL DEFAULT false,
    "isContra" BOOLEAN NOT NULL DEFAULT false,
    "parentAccountId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fin_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fin_journal_entries" (
    "id" TEXT NOT NULL,
    "status" "FinJournalEntryStatus" NOT NULL DEFAULT 'DRAFT',
    "reference" TEXT,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,
    "postedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fin_journal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fin_journal_entry_lines" (
    "id" TEXT NOT NULL,
    "journalEntryId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "debit" INTEGER NOT NULL DEFAULT 0,
    "credit" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,

    CONSTRAINT "fin_journal_entry_lines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fin_accounts_code_key" ON "fin_accounts"("code");

-- AddForeignKey
ALTER TABLE "fin_accounts" ADD CONSTRAINT "fin_accounts_parentAccountId_fkey" FOREIGN KEY ("parentAccountId") REFERENCES "fin_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fin_journal_entry_lines" ADD CONSTRAINT "fin_journal_entry_lines_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "fin_journal_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fin_journal_entry_lines" ADD CONSTRAINT "fin_journal_entry_lines_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "fin_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
