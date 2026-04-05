-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED');

-- CreateTable
CREATE TABLE "districts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "headquarterAssemblyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "circuits" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "headquarterAssemblyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "circuits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assemblies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "circuitId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assemblies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "positions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_positions" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "member_positions_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "members"
ADD COLUMN "assemblyId" TEXT,
ADD COLUMN "business" TEXT,
ADD COLUMN "digitalAddress" TEXT,
ADD COLUMN "fatherId" TEXT,
ADD COLUMN "fatherName" TEXT,
ADD COLUMN "hometownHouseNo" TEXT,
ADD COLUMN "hometownPhone" TEXT,
ADD COLUMN "hometownPostalAddress" TEXT,
ADD COLUMN "hometownTownRegion" TEXT,
ADD COLUMN "maritalStatus" "MaritalStatus",
ADD COLUMN "motherId" TEXT,
ADD COLUMN "motherName" TEXT,
ADD COLUMN "nationality" TEXT,
ADD COLUMN "nextOfKinAddress" TEXT,
ADD COLUMN "nextOfKinCityRegion" TEXT,
ADD COLUMN "nextOfKinName" TEXT,
ADD COLUMN "nextOfKinPhone" TEXT,
ADD COLUMN "nextOfKinRelationship" TEXT,
ADD COLUMN "numberOfChildren" INTEGER,
ADD COLUMN "placeOfBirth" TEXT,
ADD COLUMN "postalAddress" TEXT,
ADD COLUMN "recordedBy" TEXT,
ADD COLUMN "spouseId" TEXT,
ADD COLUMN "spouseName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "districts_name_key" ON "districts"("name");

-- CreateIndex
CREATE UNIQUE INDEX "districts_headquarterAssemblyId_key" ON "districts"("headquarterAssemblyId");

-- CreateIndex
CREATE UNIQUE INDEX "circuits_headquarterAssemblyId_key" ON "circuits"("headquarterAssemblyId");

-- CreateIndex
CREATE UNIQUE INDEX "circuits_name_districtId_key" ON "circuits"("name", "districtId");

-- CreateIndex
CREATE UNIQUE INDEX "assemblies_name_circuitId_key" ON "assemblies"("name", "circuitId");

-- CreateIndex
CREATE UNIQUE INDEX "positions_name_key" ON "positions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "member_positions_memberId_positionId_key" ON "member_positions"("memberId", "positionId");

-- AddForeignKey
ALTER TABLE "circuits" ADD CONSTRAINT "circuits_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assemblies" ADD CONSTRAINT "assemblies_circuitId_fkey" FOREIGN KEY ("circuitId") REFERENCES "circuits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_headquarterAssemblyId_fkey" FOREIGN KEY ("headquarterAssemblyId") REFERENCES "assemblies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "circuits" ADD CONSTRAINT "circuits_headquarterAssemblyId_fkey" FOREIGN KEY ("headquarterAssemblyId") REFERENCES "assemblies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_assemblyId_fkey" FOREIGN KEY ("assemblyId") REFERENCES "assemblies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_fatherId_fkey" FOREIGN KEY ("fatherId") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_spouseId_fkey" FOREIGN KEY ("spouseId") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_positions" ADD CONSTRAINT "member_positions_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_positions" ADD CONSTRAINT "member_positions_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
