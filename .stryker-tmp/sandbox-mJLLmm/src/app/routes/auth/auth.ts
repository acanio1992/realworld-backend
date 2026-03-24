// @ts-nocheck
import { expressjwt as jwt } from 'express-jwt';
import * as express from 'express';

const getTokenFromHeaders = (req: express.Request): string | null => {
  if (
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

const jwtOptional = jwt({
  secret: process.env.JWT_SECRET || 'superSecret',
  credentialsRequired: false,
  getToken: getTokenFromHeaders,
  algorithms: ['HS256'],
});

const auth = {
  required: jwt({
    secret: process.env.JWT_SECRET || 'superSecret',
    getToken: getTokenFromHeaders,
    algorithms: ['HS256'],
  }),
  optional: (req: express.Request, res: express.Response, next: express.NextFunction) => {
    jwtOptional(req, res, (err) => {
      if (err) {
        // Invalid token on optional route — proceed without auth instead of 401
        return next();
      }
      next();
    });
  },
};

export default auth;
