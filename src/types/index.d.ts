// types/index.d.ts

declare module 'google-auth-lib' {
    // Export the types, classes, and functions from your library here
    export function googleAuthInit(
        {
            app,
            options,
            errorRedirectUrl,
            successRedirectUrl
        }:
        {
            app: Express, 
            options: GoogleStrategyOptions,
            errorRedirectUrl: string,
            successRedirectUrl: string
        }
    ): void;

    export function authentificateMiddleware (errorRedirectUrl : string): RequestHandler<{}, any, any, ParsedQs, Record<string, any>>
}
  