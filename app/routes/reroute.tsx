import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node"
import { authenticator } from "~/services/auth.server"
export default function reroute() {}


export let loader: LoaderFunction = async ({ request }) => {
  // let user = await authenticator.isAuthenticated(request);
  // await new Promise(resolve => setTimeout(resolve, 10000)); // 3 sec
  return await authenticator.authenticate("ibm-appid", request, {
      successRedirect: "/",
      failureRedirect: "/login",
    });
};