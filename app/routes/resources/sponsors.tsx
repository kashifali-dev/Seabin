import type { LoaderFunction } from "@remix-run/node";
import { getSponsorsForProgram, FlatSponsorForUnit } from "~/services/programs.server";
import { db } from "~/utils/db.server";

export type SponsorsResponse = {
  flatSponsors: FlatSponsorForUnit[];
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
  const cityProgramId = url.searchParams.get('programId');
  if (!cityProgramId) {
    return [];
  }
  const sponsors = await getSponsorsForProgram(db, cityProgramId); 
  return {
    flatSponsors: sponsors
  };
};

/**
 * You shouldn't have to export this, we have a bug.
 * TODO: add github issue link (or just fix it)
 */
export default function Bug() {
  return null;
}
