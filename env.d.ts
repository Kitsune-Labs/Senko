export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly TOKEN: string;
      readonly NIGHTLY_TOKEN: string;
      readonly STATUS_URL: string;
      readonly NIGHTLY: string;
      readonly SUPABASE_URL: string;
      readonly SUPABASE_KEY: string;
      readonly PSEUDO_MARKET: string;
    }
  }
}