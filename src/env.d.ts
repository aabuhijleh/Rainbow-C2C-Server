declare namespace NodeJS {
  interface ProcessEnv {
    APP_ID: string;
    APP_SECRET: string;
    RAINBOW_HOST: string;
    REDIRECT_URI: string;
    PORT: string;
    SESSION_SECRET: string;
  }
}