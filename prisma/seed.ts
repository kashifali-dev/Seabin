import { db } from "~/utils/db.server";
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';

const SeaBinCollections = fs.readFileSync(`SeabinCollections.csv`);
const unitsCsv = fs.readFileSync('DirectoryOfSeabins.csv');

const records = parse(SeaBinCollections, {
  columns: true
});
const seabins = parse(unitsCsv, {
  columns: true
});


import { SponsorshipTier } from '@prisma/client';

async function seed() {

  // UNITS INGESTION
  await db.unit.deleteMany({});
  const unitsIngested = await Promise.allSettled(
    seabins.map(async (bin: any) => {
      let unitsIngested = {
        marinaName: bin['Marina Name'],
        country: bin['Seabin Country'],
        number: parseInt(bin['Unit Number']),
        region: bin['State'],
        lat: parseFloat(bin['Latitude N/S']) || 0,
        lng: parseFloat(bin['Longitude E/W']) || 0,

        //how do you link this to a sponsor 
      };
      return db.unit.create({
        data: unitsIngested
      });
    })
  );
  console.log(unitsIngested.map(promise => {
    if (promise.status === 'fulfilled') return 'fulfilled';
    else return promise;
  }));

  await db.unitCollectionRecord.deleteMany({});

  let errorsSet: Set<string> = new Set();
  const recordsIngested = await Promise.allSettled(
    records.map(async (rec: any) => {
      // 1. Get the Unit using the marina name and the unit number in the CSV
      if (isNaN(parseInt(rec['Unit Number ']))) {
        console.error('Unit for this data collection record does not have a number.');
        console.error(rec);
        throw ('Unit for this data collection record does not have a number.');
      }
      const units = await db.unit.findMany({
        where: {
          AND: [
            {
              marinaName: (rec['Marina Name '] as string).trim(),
              number: parseInt(rec['Unit Number '])
            }
          ]
        },
        select: { id: true }
      });
      if (units.length === 1) {
        // 2. Associate the found unit from the db with the Unit in the record
        let collectionDateStr: string = rec['Date'];
        if (collectionDateStr.length === 0) {
          console.error('Invalid record date');
          console.error(rec);
        }
        var parts = collectionDateStr.split("/");
        let collectionDate = new Date(parseInt(parts[2], 10),
          parseInt(parts[1], 10) - 1,
          parseInt(parts[0], 10));

        const unit = units[0];
        let unitCollectionRecord = {
          dataCollectorName: rec['Data Collector'],
          collectionDate: collectionDate,
          totalWeightInGrams: parseFloat(rec['Total weight (g)']) || 0,
          hoursInOperation: parseInt(rec['Hours in Operation (since last empty)']) || 0,
          terrestrialBiomassLandBasedPercentage: parseFloat(rec['Terrestrial Biomass (land based) (%)']) || 0,
          marineBiomassWaterBasedPercentage: parseFloat(rec['Marine Biomass (water based) (%)']) || 0,
          bycatch: rec['Bycatch'],

          microplasticPelletsCount: parseInt(rec['Microplastic (Pellets) (#)']) || 0,
          foamPiecesCount: parseInt(rec['Foam Pieces (#)']) || 0,
          plasticFoodWrappersSoftCount: parseInt(rec['Plastic Food Wrappers - Soft (#)']) || 0,
          foodPackagingHardCount: parseInt(rec['Food packaging - Hard (#)']) || 0,
          plasticLidsCount: parseInt(rec['Plastic Lids (#)']) || 0,
          plasticStrawsCount: parseInt(rec['Plastic Straws (#)']) || 0,
          plasticBagsCount: parseInt(rec['Plastic Bags (#)']) || 0,
          plasticBottlesCount: parseInt(rec['Plastic Bottles (#)']) || 0,
          plasticUtensilsCount: parseInt(rec['Plastic Utensils (#)']) || 0,
          coffeeCupspaperCupsCount: parseInt(rec['Coffee Cups/Paper Cups (#)']) || 0,
          plasticLollipopcottonBudSticksCount: parseInt(rec['Plastic Lollipop/Cotton bud sticks (#)']) || 0,
          unidentifiedPlasticItemsSoftCount: parseInt(rec['Unidentified Plastic Items - Soft (#)']) || 0,
          unidentifiedPlasticItemsHardCount: parseInt(rec['Unidentified Plastic Items - Hard (#)']) || 0,
          cigaretteButtsCount: parseInt(rec['Cigarette butts (#)']) || 0,
          fishingGearCount: parseInt(rec['Fishing gear (#)']) || 0,
          fishingLineCount: parseInt(rec['Fishing Line (#)']) || 0,
          microfibersCount: parseInt(rec['Microfibers (#)']) || 0,
          ropeGreaterthan5mmCount: parseInt(rec['Rope >5mm (#)']) || 0,
          cansCount: parseInt(rec['Cans (#)']) || 0,
          tapeCount: parseInt(rec['Tape (#)']) || 0,
          rubber: parseInt(rec['Rubber']) || 0,
          tennisBallToyBallCount: parseInt(rec['Tennis Ball/ Toy Ball (#)']) || 0,
          faceMasksGlovesPPECount: parseInt(rec['Face masks/ Gloves/ PPE (#)']) || 0,
          syringesCount: parseInt(rec['Syringes (#)']) || 0,
          other: rec['Other'],
          estimatedMicroPlasticsCount: 0,
          plasticsPerLitre: 0,
          pollutionIndex: 0,
          Unit: {
            connect: { id: unit.id }
          }
        };

        return db.unitCollectionRecord.create({
          data: unitCollectionRecord
        }).catch((reason) => {
          console.error('Rejected');
          console.error(reason);
        });
      } else {
        if (units.length === 0) {
          errorsSet.add(`Cannot find marina ${(rec['Marina Name '] as string).trim()} with unit number ${parseInt(rec['Unit Number '])}`);
        } else {
          // units.length > 1
          errorsSet.add(`Found more than 1 marina name ${(rec['Marina Name '] as string).trim()} with the same unit number ${parseInt(rec['Unit Number '])}`);
        }
      }
    })
  );

  recordsIngested.map(promise => {
    if (promise.status === 'fulfilled') return 'fulfilled';
    console.log(promise);
  });

  console.log(errorsSet);

  await db.sponsor.deleteMany({});
  let sponsors = [{
    name: 'Discovery',
    imageLink: 'https://ohp-dashboard-assets-cos-static-web-hosting.s3.us-east.cloud-object-storage.appdomain.cloud/OHP-Sponsor%20logos-svgartboards_Discovery.svg'
  }, {
    name: 'YAMAHA',
    imageLink: 'https://ohp-dashboard-assets-cos-static-web-hosting.s3.us-east.cloud-object-storage.appdomain.cloud/OHP-Sponsor%20logos-svgartboards_yamaha.svg'
  }, {
    name: "Ben & Jerry's",
    imageLink: 'https://ohp-dashboard-assets-cos-static-web-hosting.s3.us-east.cloud-object-storage.appdomain.cloud/OHP-Sponsor%20logos-svgartboards_B&J.svg'
  }, {
    name: "Nautica",
    imageLink: 'https://ohp-dashboard-assets-cos-static-web-hosting.s3.us-east.cloud-object-storage.appdomain.cloud/OHP-Sponsor%20logos-svgartboards_NAUTICA.svg'
  }, {
    name: 'Kingspan',
    imageLink: 'https://ohp-dashboard-assets-cos-static-web-hosting.s3.us-east.cloud-object-storage.appdomain.cloud/OHP-Sponsor%20logos-svgartboards_Kingspan.svg'
  }];
  await db.sponsor.createMany({ data: sponsors });
  console.log('Inserted sponsors');

  // // Update units with sponsors
  let discoverySponsor = await db.sponsor.findFirst({ where: { name: { contains: 'discovery', mode: 'insensitive' } } });
  let yamahaSponsor = await db.sponsor.findFirst({ where: { name: { contains: 'yamaha', mode: 'insensitive' } } });
  let benAndJerrySponsor = await db.sponsor.findFirst({ where: { name: { contains: 'ben & jerry', mode: 'insensitive' } } });
  let nauticaSponsor = await db.sponsor.findFirst({ where: { name: { contains: 'nautica', mode: 'insensitive' } } });
  let kingspanSponsor = await db.sponsor.findFirst({ where: { name: { contains: 'kingspan', mode: 'insensitive' } } });

  let cyca_u1 = await db.unit.findFirst({ where: { marinaName: { contains: 'cruising yacht club of australia', mode: 'insensitive' }, number: 1 } });
  let cyca_u2 = await db.unit.findFirst({ where: { marinaName: { contains: 'cruising yacht club of australia', mode: 'insensitive' }, number: 2 } });
  let cyca_u3 = await db.unit.findFirst({ where: { marinaName: { contains: 'cruising yacht club of australia', mode: 'insensitive' }, number: 3 } });
  let cyca_u4 = await db.unit.findFirst({ where: { marinaName: { contains: 'cruising yacht club of australia', mode: 'insensitive' }, number: 4 } });
  let manly = await db.unit.findFirst({ where: { marinaName: { contains: 'manly', mode: 'insensitive' }, number: 1 } });
  let jonesBayWharf_1 = await db.unit.findFirst({ where: { marinaName: { contains: 'Jones Bay Wharf', mode: 'insensitive' }, number: 1 } });

  // Principal Sponsor: Discovery
  // Major Sponsor: Yamaha
  // Unit Sponsors
  // Ben and Jerry's: Manly;
  //   Nautica: CYCA U4;
  //   Kingspan: Jones Bay Wharf 1;
  //   Discovery: CYCA U1, 2, 3;
  await db.sponsorForUnit.deleteMany({});

  let sponsorships = [
    // units
    { sponsorId: benAndJerrySponsor!.id, unitId: manly!.id, tier: SponsorshipTier.UNIT },
    { sponsorId: nauticaSponsor!.id, unitId: cyca_u4!.id, tier: SponsorshipTier.UNIT },
    { sponsorId: kingspanSponsor!.id, unitId: jonesBayWharf_1!.id, tier: SponsorshipTier.UNIT },
    { sponsorId: discoverySponsor!.id, unitId: cyca_u1!.id, tier: SponsorshipTier.UNIT },
    { sponsorId: discoverySponsor!.id, unitId: cyca_u2!.id, tier: SponsorshipTier.UNIT },
    { sponsorId: discoverySponsor!.id, unitId: cyca_u3!.id, tier: SponsorshipTier.UNIT },
    // principal
    { sponsorId: discoverySponsor!.id, unitId: manly!.id, tier: SponsorshipTier.PRINCIPAL },
    { sponsorId: discoverySponsor!.id, unitId: cyca_u1!.id, tier: SponsorshipTier.PRINCIPAL },
    { sponsorId: discoverySponsor!.id, unitId: cyca_u2!.id, tier: SponsorshipTier.PRINCIPAL },
    { sponsorId: discoverySponsor!.id, unitId: cyca_u3!.id, tier: SponsorshipTier.PRINCIPAL },
    { sponsorId: discoverySponsor!.id, unitId: cyca_u4!.id, tier: SponsorshipTier.PRINCIPAL },
    { sponsorId: discoverySponsor!.id, unitId: jonesBayWharf_1!.id, tier: SponsorshipTier.PRINCIPAL },
    // major    
    { sponsorId: yamahaSponsor!.id, unitId: manly!.id, tier: SponsorshipTier.MAJOR },
    { sponsorId: yamahaSponsor!.id, unitId: cyca_u1!.id, tier: SponsorshipTier.MAJOR },
    { sponsorId: yamahaSponsor!.id, unitId: cyca_u2!.id, tier: SponsorshipTier.MAJOR },
    { sponsorId: yamahaSponsor!.id, unitId: cyca_u3!.id, tier: SponsorshipTier.MAJOR },
    { sponsorId: yamahaSponsor!.id, unitId: cyca_u4!.id, tier: SponsorshipTier.MAJOR },
    { sponsorId: yamahaSponsor!.id, unitId: jonesBayWharf_1!.id, tier: SponsorshipTier.MAJOR },
  ];

  const unitSponsorshipsCreation = await Promise.allSettled(
    sponsorships.map(async (uS: any) => {
      return db.sponsorForUnit.create({
        data: uS
      });
    })
  );
  console.log(unitSponsorshipsCreation.map(promise => {
    if (promise.status === 'fulfilled') return 'fulfilled';
    else return promise;
  }));

  // add city program
  // Principal Sponsor: Discovery
  // Major Sponsor: Yamaha
  // Unit Sponsors
  // Ben and Jerry's: Manly;
  //   Nautica: CYCA U4;
  //   Kingspan: Jones Bay Wharf 1;
  //   Discovery: CYCA U1, 2, 3;
  await db.program.deleteMany({});
  try {
    const sydneyCityProgram = await db.program.create({
      data: {
        name: 'Sydney, Australia', units: {
          connect: [
            { id: manly!.id },
            { id: cyca_u1!.id },
            { id: cyca_u2!.id },
            { id: cyca_u3!.id },
            { id: cyca_u4!.id },
            { id: jonesBayWharf_1!.id }
          ]
        }
      }
    });
    console.log('Created city programs');
  } catch (error) {
    console.error('Unable to create city program');
    console.error(error);
  }

}

seed();
