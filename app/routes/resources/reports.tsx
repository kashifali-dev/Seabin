import type { LoaderFunction } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { format, getYear, subYears } from "date-fns";
import invariant from "tiny-invariant";

import { emc, getLitterComposition, getLitterOverTime, getMicroPlasticsSumPerMonth, getPlasticsPerLitre, getRainfall, littercomp, litterovertime, ppl, rainfall } from "~/services/reports-service.server";

export type ReportDataType = {
  emc: [emc];
  ppl: [ppl];
  littercomp: [littercomp];
  litterovertime: [litterovertime];
  rainfall: [rainfall];
};

/**
 * This route is called via `useFetcher` from the Listbox input. It returns a
 * set of city programs. It's called a Resource Route because it
 * doesn't export a component, like an API route
 */
export const loader: LoaderFunction = async ({ request }) => {
  // First get what the user is searching for by creating a URL:
  // https://developer.mozilla.org/en-US/docs/Web/API/URL
  // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
  const url = new URL(request.url);
  
  // const startDate = url.searchParams.get('startDate') ?? new Date(2018, 0,1);
  // const endDate = url.searchParams.get('endDate') ?? new Date(2100, 0,1);
  // const cityProgramId = url.searchParams.get('programId') ?? "";
  const startDateParam = url.searchParams.get('startDate');
  const endDateParam = url.searchParams.get('endDate');
  const cityProgramIdParam = url.searchParams.get('programId');
  invariant(startDateParam != null, 'start date cannot be null');
  invariant(endDateParam != null, 'end date cannot be null');
  invariant(cityProgramIdParam != null, 'city program cannot be null');

  const startDate: Date = new Date(startDateParam);
  const endDate: Date = new Date(endDateParam);
  const cityProgramId: string = cityProgramIdParam ?? ""; 

  const microPlasticsSumPerMonth = await getMicroPlasticsSumPerMonth(db, startDate, endDate, cityProgramId);
  const plasticsPerLitre = await getPlasticsPerLitre(db, startDate, endDate, cityProgramId);
  const litterComposition = await getLitterComposition(db, startDate, endDate, cityProgramId);
  const litterOverTime = await getLitterOverTime(db, startDate, endDate, cityProgramId);
  const rainfall = await getRainfall(db, startDate, endDate, cityProgramId);

  const response = {
    emc: microPlasticsSumPerMonth,
    ppl: plasticsPerLitre,
    littercomp: litterComposition,
    litterovertime: litterOverTime,
    rainfall: rainfall
  };
  return response;
};

/**
 * You shouldn't have to export this, we have a bug.
 * TODO: add github issue link (or just fix it)
 */
export default function Bug() {
  return null;
}
