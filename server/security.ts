import type { NextFunction, Request, RequestHandler, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { z, type ZodType } from "zod";

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [];

export const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || process.env.NODE_ENV !== "production") {
      callback(null, true);
    } else if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS bloqué par la politique de sécurité."));
    }
  },
  credentials: true,
});

export function validateBody<T>(schema: ZodType<T>): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        code: "VALIDATION_ERROR",
        message: "Les données envoyées sont invalides.",
        issues: result.error.issues.map(({ path, code }) => ({ path, code })),
      });
      return;
    }

    req.body = result.data;
    next();
  };
}

export const contributionPreviewSchema = z
  .object({
    target: z.number().int().positive().max(10_000_000),
    contributions: z.array(z.number().int().positive().max(10_000_000)).max(500),
  })
  .strict();

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error("[server] request failed", error instanceof Error ? error.message : "unknown error");
  if (res.headersSent) return;
  res.status(500).json({ code: "INTERNAL_ERROR", message: "Une erreur interne est survenue." });
}
