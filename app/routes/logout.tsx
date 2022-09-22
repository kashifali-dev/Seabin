import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node"
import { authenticator } from "~/services/auth.server"

export default function logout() {}

  export let loader: LoaderFunction = async ({ request }) => {
    console.log("hello loader function")
   await authenticator.logout(request, { redirectTo: "/" });
 };