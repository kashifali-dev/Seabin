import { Prisma, PrismaClient, Program, Sponsor, SponsorForUnit, SponsorshipTier, Unit } from "@prisma/client";

export async function getCityPrograms(db: PrismaClient): Promise<{id: string; name: string}[]> {
  const programs = await db.program.findMany({
    select: {
      id: true,
      name: true
    }
  });
  return programs;
}

export async function getUnitsInProgram(db: PrismaClient, programId: string): Promise<Unit[] | null> {
  const unitsInProgram = await db.unit.findMany({
    where: {
      programId: programId
    }
  });
  return unitsInProgram
}

export async function getTotalWeightInGrams(db: PrismaClient, programId: string): Promise<number | null> {
  const unitsInProgram = await getUnitsInProgram(db, programId);
  if (!unitsInProgram) {
    return null;
  }

  const totalWeightForProgramInGrams = await db.unitCollectionRecord.aggregate({
    where: {
      unitId: {
        in: unitsInProgram.map(u => u.id)
      }
    },
    _sum: {
      totalWeightInGrams: true
    }
  });

  return totalWeightForProgramInGrams._sum.totalWeightInGrams;
}

export async function getTotalVolumeFilteredByProgram(db: PrismaClient, programId: string, unitFilteringVolumeInLitresPerHour: number = 25000): Promise<number | null> {
  const unitsInProgram = await getUnitsInProgram(db, programId);
  if (!unitsInProgram) {
    return null;
  }

  const totalHoursOfOperation = await db.unitCollectionRecord.aggregate({
    where: {
      unitId: {
        in: unitsInProgram.map(u => u.id)
      }
    },
    _sum: {
      hoursInOperation: true
    }
  });

  if (!totalHoursOfOperation._sum.hoursInOperation) {
    return null
  }

  return totalHoursOfOperation._sum.hoursInOperation * unitFilteringVolumeInLitresPerHour;
}

export type FlatSponsorForUnit = {
  id: string;
  tier: SponsorshipTier;
  name: string;
  imageLink: string;
  startDate: Date | null;
  endDate: Date | null;
}

export async function getSponsorsForProgram(db: PrismaClient, programId: string): Promise<FlatSponsorForUnit[] | null> {
  const unitsInProgram = await getUnitsInProgram(db, programId);
  if (!unitsInProgram) {
    return null;
  }

  const rawSponsorsInProgram = await db.sponsorForUnit.findMany({
    where: {
      unitId: {
        in: unitsInProgram.map(u => u.id)
      }
    },
    include: {
      Sponsor: true
    }
  });
  if (!rawSponsorsInProgram) {
    return null;
  }

  const sponsorsInProgram: FlatSponsorForUnit[] = rawSponsorsInProgram.map(s => {
    return {
      id: s.sponsorId,
      tier: s.tier,
      name: s.Sponsor.name,
      imageLink: s.Sponsor.imageLink,
      startDate: s.startDate,
      endDate: s.endDate
    }
  });
  return sponsorsInProgram;
}