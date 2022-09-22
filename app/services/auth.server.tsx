import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/sessions";
import User from "~/services/User"
import { OAuth2Profile, OAuth2Strategy } from "remix-auth-oauth2";

export let authenticator = new Authenticator<User>(sessionStorage);

let authorizationUrl = process.env.AUTHORIZATION_URL ?? "https://au-syd.appid.cloud.ibm.com/oauth/v4/4a820649-6c17-461b-9d17-9818dca7dba2/authorization";
let tokenUrl = process.env.TOKEN_URL ?? "https://au-syd.appid.cloud.ibm.com/oauth/v4/4a820649-6c17-461b-9d17-9818dca7dba2/token";
let clientId = process.env.CLIENT_ID ?? "969e0d9b-ac3b-440d-801e-b01079bbb020";
let clientSecret = process.env.CLIENT_SECRET ?? 'Invalid';
let callbackURL = process.env.NODE_ENV == "production" ? `https://${process.env.CE_APP}.${process.env.CE_SUBDOMAIN}.${process.env.CE_DOMAIN}/reroute` : "localhost:3000/reroute"

authenticator.use(
    new OAuth2Strategy(
      {
        authorizationURL: authorizationUrl,
        tokenURL: tokenUrl,
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: callbackURL,
      },
      async ({ accessToken, refreshToken, extraParams, profile, context }) => {
        // here you can use the params above to get the user and return it
        // what you do inside this and how you find the user is up to you
        return await getUser(
          accessToken,
          refreshToken,
          extraParams,
          profile,
          context
        );
      }
    ),
    // this is optional, but if you setup more than one OAuth2 instance you will
    // need to set a custom name to each one
    "ibm-appid"
  );


function getUser(accessToken: string, refreshToken: string, extraParams: Record<string, never>, profile: OAuth2Profile, context: any): any {
    return new User(accessToken, refreshToken, extraParams, profile, context);
}
