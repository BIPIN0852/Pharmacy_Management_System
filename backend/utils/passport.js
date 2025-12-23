// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const User = require("../models/User");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:5000/auth/google/callback",

//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await User.findOne({ googleId: profile.id });

//         if (!user) {
//           // create new user if not exists
//           user = await User.create({
//             googleId: profile.id,
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             role: "customer", // default role
//           });
//         }

//         // create JWT token
//         const payload = {
//           id: user._id,
//           role: user.role,
//           email: user.email,
//           name: user.name,
//         };

//         const token = jwt.sign(payload, process.env.JWT_SECRET, {
//           expiresIn: process.env.JWT_EXPIRES_IN || "7d",
//         });

//         // attach token to user object
//         user.token = token;

//         return done(null, user);
//       } catch (err) {
//         return done(err, null);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

// module.exports = passport;

require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Debugging line (optional, to confirm JWT_SECRET is loaded)
if (!process.env.JWT_SECRET) {
  console.error(
    "❌ JWT_SECRET not found. Check your .env file and load order."
  );
} else {
  console.log("✅ JWT_SECRET loaded successfully");
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback", // must match Google Cloud Console redirect URI
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // find existing user
        let user = await User.findOne({ googleId: profile.id });

        // create new user if not exists
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            role: "customer",
          });
        }

        // ✅ Check before signing token
        if (!process.env.JWT_SECRET) {
          console.error("❌ Missing JWT_SECRET in environment variables.");
          return done(new Error("JWT_SECRET missing"), null);
        }

        // Create JWT token
        const payload = {
          id: user._id,
          role: user.role,
          email: user.email,
          name: user.name,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        });

        // Attach token to user object
        user.token = token;

        return done(null, user);
      } catch (err) {
        console.error("Google Auth Error:", err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
