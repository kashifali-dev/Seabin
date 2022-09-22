import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getCityPrograms } from "~/services/programs.server";
import { db } from "~/utils/db.server";

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
  const cityPrograms = await getCityPrograms(db);
  return json(cityPrograms);
};

/**
 * You shouldn't have to export this, we have a bug.
 * TODO: add github issue link (or just fix it)
 */
export default function Bug() {
  return null;
}
