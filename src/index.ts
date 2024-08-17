import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { Express, Request, Response, NextFunction } from 'express'; // Import the Express types from the Express module
import session from 'express-session';

type SessionOptions = session.SessionOptions; // Define the SessionOptions type

// Middleware to check if the user is authenticated
export function authentificateMiddleware (errorRedirectUrl : string) {
    return function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect(errorRedirectUrl);
    }
}

/**
 * Function to handle Google OAuth2.0 authentication-
 * @description Express middleware to handle Google OAuth2.0 authentication
 * @description This will listen on /auth/google and /auth/google/callback
 * @description This will also listen on /auth/check to check if the user is authenticated
 */
export const googleAuthInit = (
    {
        app,
        options,
        errorRedirectUrl,
        successRedirectUrl,
        sessionOptions
    }:
    {
        app: Express, 
        options: GoogleStrategyOptions,
        errorRedirectUrl: string,
        successRedirectUrl: string,
        sessionOptions: SessionOptions
    }
) => {
    app.use(
        session({
          secret: 'secret',
          resave: false,
          saveUninitialized: true,
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
        new GoogleStrategy(
            {
                clientID: options.clientID,
                clientSecret: options.clientSecret,
                callbackURL: options.callbackURL
            },
            (accessToken, refreshToken, profile: Profile, done) => { return done(null, profile); }
        )
    );

    passport.serializeUser((user, done) => { done(null, user); });
    
    passport.deserializeUser((user: Express.User, done) => { done(null, user as Profile); });

    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    app.get(
        '/auth/google/callback',
        passport.authenticate('google', { failureRedirect: errorRedirectUrl }),
        (req, res) => {
          res.redirect(successRedirectUrl); // Redirect to 2FA setup after successful login
        }
    );

    // Route to check if user is authenticated
    app.get('/auth/check', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
        res.status(200).json({ authenticated: true });
        } else {
        res.status(200).json({ authenticated: false });
        }
    });
};


