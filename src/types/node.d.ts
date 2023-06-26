declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_PORT: string;
      NODE_ENV: string;
      INTERVAL: string;

      NAVER_CLIENT: string;
      NAVER_TOKEN: string;

      KOREAN_CLIMATE: string;
      KOREAN_ENCODED_TOKEN: string;
      KOREAN_DECODED_TOKEN: string;

      SESSION_SECRET: string;

      AUTH_KEY: string;
    }
  }
}
