import type { RequestHandler } from 'express';
import { env } from '../config/env.ts';
import { ForbiddenError } from '../errors/ForbiddenError.ts';

const unsafeMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const allowedOrigins = new Set([
  env.corsOrigin,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  `http://localhost:${env.port}`,
  `http://127.0.0.1:${env.port}`,
]);

export const originGuard: RequestHandler = (req, _res, next) => {
  if (!unsafeMethods.has(req.method)) return next();

  const origin = req.headers.origin;

  if (
    !origin ||
    allowedOrigins.has(origin) ||
    /^http:\/\/localhost:\d+$/.test(origin) ||
    /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
  ) {
    return next();
  }

  return next(new ForbiddenError('Origin request tidak diizinkan'));
};
