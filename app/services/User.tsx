import { OAuth2Profile, OAuth2Strategy } from "remix-auth-oauth2";


export default class User {
    // We can populate this with whatever we want. That said it seems as though the session cookie size is a function of the User object size.
    // We do not want to expose anything sensitive to other functions. Access and refresh tokens do not need to be exposed.
    // accessToken: string;
    // refreshToken: string;
    extraParams: Record<string, never>;
    profile: OAuth2Profile;
    context: any


    constructor(accessToken: string, refreshToken: string, extraParams: Record<string, never>, profile: OAuth2Profile, context: any) {
        // this.accessToken = accessToken;
        // this.refreshToken = refreshToken;
        this.extraParams = extraParams;
        this.profile = profile;
        this.context = context;
    }
  }

  