import { db } from "~/utils/db.server";
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';

const rainfallCsv = fs.readFileSync('prisma/rainfall.csv');
const rainfall = parse(rainfallCsv, {
  columns: true
});

async function seed() {
  const rainfallIngested = await Promise.allSettled(
    rainfall.map(async (rain: any) => {
      const program = await db.program.findUnique({
        where: {
          id: rain['program_id']
        }
      });
      if (program) {
        let rainfall = {
          Program: {
            connect: { id: program.id }
          },
          mm: parseFloat(rain['mm']),
          city: rain['city'],
          country: rain['country'],
          date: new Date(rain['date']),
        };
        return db.rainfall.create({
          data: rainfall
        });
      }
    })
  );
  console.log(rainfallIngested.map(promise => {
    if (promise.status === 'fulfilled') return 'fulfilled';
    else return promise;
  }));
}

seed();
