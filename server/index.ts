import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { calculateRemainingAmount, calculateTotalCollected } from "../shared/tontine";
import {
  contributionPreviewSchema,
  corsMiddleware,
  errorMiddleware,
  securityMiddleware,
  validateBody,
} from "./security";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.use(securityMiddleware);
  app.use(corsMiddleware);
  app.use(express.json({ limit: "32kb", strict: true }));
  app.use(express.urlencoded({ extended: false, limit: "8kb" }));

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok", service: "tontinebj-web" });
  });

  app.post("/api/contributions/preview", validateBody(contributionPreviewSchema), (req, res) => {
    const { target, contributions } = req.body as { target: number; contributions: number[] };
    res.status(200).json({
      target,
      collected: calculateTotalCollected(contributions),
      remaining: calculateRemainingAmount(target, contributions),
    });
  });

  // Serve static files from dist/public in production.
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath, { index: "index.html", maxAge: "1h" }));

  // Handle client-side routing - serve index.html for all non-API routes.
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      res.status(404).json({ code: "NOT_FOUND", message: "Ressource API introuvable." });
      return;
    }
    res.sendFile(path.join(staticPath, "index.html"), (error) => {
      if (error) next(error);
    });
  });

  app.use(errorMiddleware);
  return app;
}

async function startServer() {
  const app = createApp();
  const server = createServer(app);
  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch((error) => {
  console.error("[server] failed to start", error);
  process.exitCode = 1;
});
