import { AuthorizationCode } from "simple-oauth2";

export const client = new AuthorizationCode({
  client: {
    id: process.env.APP_ID,
    secret: process.env.APP_SECRET,
  },
  auth: {
    tokenHost: process.env.RAINBOW_HOST,
    tokenPath: "/api/rainbow/authentication/v1.0/oauth/token",
    authorizePath: "/api/rainbow/authentication/v1.0/oauth/authorize",
  },
});
