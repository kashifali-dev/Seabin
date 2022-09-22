import { PrismaClient, Program } from "@prisma/client";
import { format, getYear, subYears } from "date-fns";

export type emc = {
  microplasticPelletsThousands: number;
  microFibersThousands: number;
  months: number;
};

export type ppl = {
  softWrappers: number;
  plasticLids: number;
  plasticStraws: number;
  plasticBags: number;
  plasticBottles: number;
  plasticUtensils: number;
  lollipopAndCottonBuds: number;
  unidentifiedSoftPlastics: number;
  unidentifiedHardPlastics: number;
  hoursInOperation: number;
  months: number;
};

export type littercomp = {
  terrestrialBiomassLandBasedPercentage: number;
  marineBiomassWaterBasedPercentage: number;
  bycatch: number;
  microplasticPelletsCount: number;
  foamPiecesCount: number;
  plasticFoodWrappersSoftCount: number;
  foodPackagingHardCount: number;
  plasticStrawsCount: number;
  plasticBagsCount: number;
  plasticBottlesCount: number;
  plasticUtensilsCount: number;
  coffeeCupspaperCupsCount: number;
  plasticLollipopcottonBudSticksCount: number;
  unidentifiedPlasticItemsSoftCount: number;
  unidentifiedPlasticItemsHardCount: number;
  cigaretteButtsCount: number;
  fishingGearCount: number;
  fishingLineCount: number;
  microfibersCount: number;
  ropeGreaterthan5mmCount: number;
  cansCount: number;
  tapeCount: number;
  rubber: number;
  tennisBallToyBallCount: number;
  faceMasksGlovesPPECount: number;
  syringesCount: number;
  other: number;
};

export type litterovertime = {
  terrestrialBiomassLandBasedPercentage: number;
  marineBiomassWaterBasedPercentage: number;
  bycatch: number;
  microplasticPelletsCount: number;
  foamPiecesCount: number;
  plasticFoodWrappersSoftCount: number;
  foodPackagingHardCount: number;
  plasticStrawsCount: number;
  plasticBagsCount: number;
  plasticBottlesCount: number;
  plasticUtensilsCount: number;
  coffeeCupspaperCupsCount: number;
  plasticLollipopcottonBudSticksCount: number;
  unidentifiedPlasticItemsSoftCount: number;
  unidentifiedPlasticItemsHardCount: number;
  cigaretteButtsCount: number;
  fishingGearCount: number;
  fishingLineCount: number;
  microfibersCount: number;
  ropeGreaterthan5mmCount: number;
  cansCount: number;
  tapeCount: number;
  rubber: number;
  tennisBallToyBallCount: number;
  faceMasksGlovesPPECount: number;
  syringesCount: number;
  other: number;
  months: number;
};

export type rainfall = {
  avg: number;
  months: number;
};

export function getRainfall(db: PrismaClient, startDate: Date, endDate: Date, cityProgramId: string): Promise<[rainfall]> {
  return db.$queryRaw`
      SELECT AVG("mm"), EXTRACT(MONTH from "date")  as months
FROM "Rainfall", "UnitCollectionRecord"
WHERE "date" BETWEEN ${startDate} and ${endDate} and "programId" = ${cityProgramId}
GROUP BY months
ORDER BY months;
      `;
}

export function getMicroPlasticsSumPerMonth(
  db: PrismaClient,
  startDate: Date,
  endDate: Date,
  cityProgramId: string
): Promise<[emc]> {
  // format(startDate, 'd MMM y')} – {format(endDate, 'd MMM y'}

  return db.$queryRaw`
      SELECT ROUND(SUM("microplasticPelletsCount"), 2) as "Microplastic pellets",
       ROUND(SUM("microfibersCount"), 2)         as "Microfibers",
       EXTRACT(MONTH from "collectionDate")      as months
FROM "UnitCollectionRecord"
WHERE "collectionDate" between ${startDate} and ${endDate} and "UnitCollectionRecord"."unitId" in (
SELECT "id" FROM "Unit" WHERE "Unit"."programId" =${cityProgramId} )
GROUP BY months
ORDER BY months;
`;
}

export function getPlasticsPerLitre(
  db: PrismaClient,
  startDate: Date,
  endDate: Date,
  cityProgramId: string
): Promise<[ppl]> {
  return db.$queryRaw`
  SELECT 
      SUM("plasticFoodWrappersSoftCount") as "Soft plastic wrappers", 
      SUM("plasticLidsCount") as "Plastic lids", 
      SUM("plasticStrawsCount") as "Plastic straws", 
      SUM("plasticBagsCount") as "Plastic bags", 
      SUM("plasticBottlesCount") as "Plastic bottles", 
      SUM("plasticUtensilsCount") as "Plastic utensils", 
      SUM("plasticLollipopcottonBudSticksCount") as "Lollipop sticks", 
      SUM("unidentifiedPlasticItemsSoftCount") as "Unidentified soft plastics",
      SUM("unidentifiedPlasticItemsHardCount") as "Unidentified hard plastics", 
      SUM("hoursInOperation") as hoursInOperation,
      EXTRACT(MONTH FROM "collectionDate")   as months
FROM "UnitCollectionRecord"
WHERE "collectionDate" >= ${startDate} and "collectionDate" < ${endDate} and "UnitCollectionRecord"."unitId" in (
SELECT "id" FROM "Unit" WHERE "Unit"."programId" =${cityProgramId} )
          GROUP BY months
          ORDER BY months
      `;
}

export function getLitterComposition(
  db: PrismaClient,
  startDate: Date,
  endDate: Date,
  cityProgramId: string
): Promise<[littercomp]> {
  return db.$queryRaw`
  SELECT 
      SUM("microplasticPelletsCount") as "Microplastic pellets", 
      SUM("foamPiecesCount") as "Foam pieces", 
      SUM("plasticFoodWrappersSoftCount") as "Soft plastic food wrappers",
      SUM("foodPackagingHardCount") as "Hard food packaging",
      SUM("plasticStrawsCount") as "Plastic straws",
      SUM("plasticLidsCount") as "Plastic sids",  
      SUM("plasticBagsCount") as "Plastic bags",
      SUM("plasticBottlesCount") as "Plastic bottles",
      SUM("plasticUtensilsCount") as "Plastic utensils",
      SUM("coffeeCupspaperCupsCount") as "Paper coffee cups", 
      SUM("plasticLollipopcottonBudSticksCount") as "Plastic lollipop sticks", 
      SUM("unidentifiedPlasticItemsSoftCount") as "Unidentified soft slastics",
      SUM("unidentifiedPlasticItemsHardCount") as "Unidentified hard plastics", 
      SUM("cigaretteButtsCount") as "Cigarette buts", 
      SUM("fishingGearCount") as "Fishing gear", 
      SUM("fishingLineCount") as "Fishing line", 
      SUM("microfibersCount") as "Microfibres", 
      SUM("ropeGreaterthan5mmCount") as "Rope (>5mm)",
      SUM("cansCount") as "Cans",
      SUM("tapeCount") as "Tape",
      SUM("rubber") as "Rubber", 
      SUM("tennisBallToyBallCount") as "Tennis balls",
      SUM("faceMasksGlovesPPECount") as "Misc. PPE", 
      SUM("syringesCount") as "Syringes"
FROM "UnitCollectionRecord"
WHERE "collectionDate" between ${startDate} and ${endDate} and "UnitCollectionRecord"."unitId" in (
SELECT "id" FROM "Unit" WHERE "Unit"."programId" =${cityProgramId} )
      `;
}

export function getLitterOverTime(
  db: PrismaClient,
  startDate: Date,
  endDate: Date,
  cityProgramId: string
): Promise<[litterovertime]> {
  return db.$queryRaw`
  SELECT  
  SUM("microplasticPelletsCount") as "Microplastic Pellets", 
      SUM("foamPiecesCount") as "Foam Pieces", 
      SUM("plasticFoodWrappersSoftCount") as "Soft Plastic Food Wrappers",
      SUM("foodPackagingHardCount") as "Hard Food Packaging",
      SUM("plasticStrawsCount") as "Plastic Straws",
      SUM("plasticLidsCount") as "Plastic Lids",  
      SUM("plasticBagsCount") as "Plastic Bags",
      SUM("plasticBottlesCount") as "Plastic Bottles",
      SUM("plasticUtensilsCount") as "Plastic Utensils",
      SUM("coffeeCupspaperCupsCount") as "Paper Coffee Cups", 
      SUM("plasticLollipopcottonBudSticksCount") as "Plastic Lollipop Sticks", 
      SUM("unidentifiedPlasticItemsSoftCount") as "Unidentified Soft Plastics",
      SUM("unidentifiedPlasticItemsHardCount") as "Unidentified Hard Plastics", 
      SUM("cigaretteButtsCount") as "Cigarette Buts", 
      SUM("fishingGearCount") as "Fishing Gear", 
      SUM("fishingLineCount") as "Fishing Line", 
      SUM("microfibersCount") as "Microfibres", 
      SUM("ropeGreaterthan5mmCount") as "Rope (>5mm)",
      SUM("cansCount") as "Cans",
      SUM("tapeCount") as "Tape",
      SUM("rubber") as "Rubber", 
      SUM("tennisBallToyBallCount") as "Tennis Balls",
      SUM("faceMasksGlovesPPECount") as "Misc. PPE", 
      SUM("syringesCount") as "Syringes",
      EXTRACT(MONTH from "collectionDate")   as months
FROM "UnitCollectionRecord"
WHERE "collectionDate" between ${startDate} and ${endDate} and "UnitCollectionRecord"."unitId" in (
SELECT "id" FROM "Unit" WHERE "Unit"."programId" = ${cityProgramId})
GROUP BY months
ORDER BY months;

      `;
}
