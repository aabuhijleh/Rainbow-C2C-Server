require("dotenv-safe").config();

import { app } from "./app";
import { logger } from "./logger";
import { client } from "./oauth2";
import shortid from "shortid";
import querystring from "querystring";
import { getStringFromError } from "./utils/getStringFromError";

app.get("/login", (_, res) => {
  const authorizationUri = client.authorizeURL({
    redirect_uri: process.env.REDIRECT_URI,
    scope: "all",
    state: shortid.generate(),
  });

  res.redirect(authorizationUri);
});

app.get("/oauth/callback", async (req, res) => {
  if (req.query.error) {
    const error = {
      error: "LOGIN_ERROR",
      oauth_error: req.query.error as string,
      error_description: req.query.error_description as string,
    };

    logger.error(`/oauth/callback error:[${JSON.stringify(error)}]`);

    res.redirect(`/?${querystring.stringify(error)}`);
    return;
  }

  try {
    const accessToken = await client.getToken({
      code: req.query.code as string,
      redirect_uri: process.env.REDIRECT_URI,
    });

    res.redirect(
      `/?access_token=${accessToken.token.access_token}&refresh_token=${accessToken.token.refresh_token}`
    );
  } catch (err) {
    const error = `could not get token - error:[${getStringFromError(err)}]`;
    logger.error(error);
    res.status(500).send(error);
  }
});

app.post("/refresh", async (req, res) => {
  try {
    const validToken = {
      ...req.body,
      expires_in: 3599,
      token_type: "Bearer",
      scope: "all",
    };
    const accessToken = client.createToken(validToken);
    const refershedToken = await accessToken.refresh();
    res.send(refershedToken);
  } catch (err) {
    const error = `could not refresh token - error:[${getStringFromError(
      err
    )}]`;
    logger.error(error);
    res.status(500).send(error);
  }
});

app.listen(process.env.PORT);
logger.info(`app started on port ${process.env.PORT}`);
