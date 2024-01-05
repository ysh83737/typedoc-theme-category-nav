declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** Doc build environment */
      DOC_ENV: string;
    }
  }
}
export {};
