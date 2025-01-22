declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GEMINI_KEY: string;
    }
  }
}
