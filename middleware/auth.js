"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");


/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization; //first checks if req.headers is truthy before accessing value from headers.Authorization. Returns undefined (if header doesn't exist) rather than an error (if Authorization property doesn't exist)
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim(); //Removes "Bearer" prefix from the authHeader value and trims whitespace.
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}

function ensureAdmin(req, res, next) {
  try {
    if(res.locals.user.isAdmin === false) throw new UnauthorizedError();
    return(next);
  } catch (err) {
    return next(err);
  }
}

function ensureAdminOrThatUser(req, res, next) {
  try {
    if(res.locals.user.isAdmin || res.locals.user.username === req.params.username) {
      return next();
    } else {
      throw new UnauthorizedError();
    }
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureAdminOrThatUser
};
