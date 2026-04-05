ALTER TABLE "contributions"
ADD COLUMN "journalEntryId" TEXT;

CREATE UNIQUE INDEX "contributions_journalEntryId_key"
ON "contributions"("journalEntryId");

ALTER TABLE "contributions"
ADD CONSTRAINT "contributions_journalEntryId_fkey"
FOREIGN KEY ("journalEntryId") REFERENCES "fin_journal_entries"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
