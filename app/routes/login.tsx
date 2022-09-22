import { LoaderFunction } from "@remix-run/node"
import { authenticator } from "~/services/auth.server"

export default function Screen() {}

// export let action: ActionFunction = async ({ request }) => {
//     return await authenticator.authenticate("ibm-appid", request, {
//       successRedirect: "/fakepage",
//       failureRedirect: "/fakepage",
//     });
//   };
  
export let loader: LoaderFunction = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request);
  console.log((user))
  if (user) {
    return await authenticator.isAuthenticated(request, {
      successRedirect: "/reroute",
    });
  }
  return await authenticator.authenticate("ibm-appid", request, {
      successRedirect: "/reroute",
      failureRedirect: "/reroute",
    });
};
