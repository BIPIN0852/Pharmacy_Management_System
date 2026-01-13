// const jwt = require("jsonwebtoken");

// function authenticateToken(req, res, next) {
//   // Token in header: Authorization: Bearer <token>
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No token provided" });
//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ message: "Token invalid" });
//     req.user = user; // contains id, role, email
//     next();
//   });
// }

// module.exports = authenticateToken;
// const jwt = require("jsonwebtoken");

// function authenticateToken(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) return res.status(401).json({ message: "No token provided" });

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ message: "Token invalid" });

//     req.user = user; // contains id, role, email, name
//     next();
//   });
// }

// module.exports = authenticateToken;

// backend/middleware/auth.js
// const jwt = require("jsonwebtoken");

// /**
//  * Authenticate JWT token from Authorization header or cookie.
//  * Attaches decoded user payload to req.user (id, role, email, name).
//  */
// function authenticateToken(req, res, next) {
//   // Try to read token from "Authorization: Bearer <token>"
//   const authHeader = req.headers["authorization"];
//   let token = authHeader && authHeader.split(" ")[1];

//   // Or from cookie named "token" (optional, if you ever use cookies)
//   if (!token && req.cookies && req.cookies.token) {
//     token = req.cookies.token;
//   }

//   if (!token) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) {
//       console.error("JWT verify error:", err);
//       return res.status(403).json({ message: "Token invalid or expired" });
//     }

//     // user will contain whatever you signed in the token: { id, role, email, name }
//     req.user = user;
//     next();
//   });
// }

// module.exports = authenticateToken;

// const jwt = require("jsonwebtoken");

// /**
//  * Authenticate JWT token from Authorization header or cookie.
//  * Attaches decoded user payload to req.user (id, role, email, name).
//  */
// function authenticateToken(req, res, next) {
//   try {
//     // Extract token from "Authorization: Bearer <token>"
//     const authHeader = req.headers["authorization"];
//     let token = authHeader && authHeader.split(" ")[1];

//     // Or from cookie named "token" (optional)
//     if (!token && req.cookies && req.cookies.token) {
//       token = req.cookies.token;
//     }

//     if (!token) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//       if (err) {
//         console.error("JWT verify error:", err);
//         return res.status(403).json({ message: "Token invalid or expired" });
//       }

//       // Attach user info payload from token to req.user
//       req.user = user;
//       next();
//     });
//   } catch (error) {
//     console.error("Authentication middleware error:", error);
//     res.status(500).json({ message: "Internal server error in auth" });
//   }
// }

// module.exports = authenticateToken;

// const jwt = require("jsonwebtoken");

// /**
//  * Authenticate JWT token from Authorization header or cookie.
//  * Attaches decoded user payload to req.user (id, role, email, name).
//  */
// function authenticateToken(req, res, next) {
//   try {
//     // Read Authorization header exactly as sent by client
//     const authHeader = req.headers.authorization || req.headers.Authorization;
//     let token = null;

//     // Expect "Bearer <token>"
//     if (authHeader && authHeader.startsWith("Bearer ")) {
//       token = authHeader.split(" ")[1];
//     }

//     // Or from cookie named "token" (optional)
//     if (!token && req.cookies && req.cookies.token) {
//       token = req.cookies.token;
//     }

//     if (!token) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//       if (err) {
//         console.error("JWT verify error:", err);
//         return res.status(403).json({ message: "Token invalid or expired" });
//       }

//       // Attach user info payload from token to req.user
//       req.user = user;
//       next();
//     });
//   } catch (error) {
//     console.error("Authentication middleware error:", error);
//     res.status(500).json({ message: "Internal server error in auth" });
//   }
// }

// module.exports = authenticateToken;

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 1. Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// 2. Protect Middleware (Verify Token)
const protect = async (req, res, next) => {
  let token;

  // Check Authorization Header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (Bearer <token>)
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token, exclude password
      // This attaches the full User object to req.user for use in controllers
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// 3. Admin Middleware
const admin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.isAdmin)) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

// 4. Pharmacist Middleware
const pharmacist = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "pharmacist" || req.user.role === "admin")
  ) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Pharmacists only." });
  }
};

module.exports = { generateToken, protect, admin, pharmacist };
