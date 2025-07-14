import express from "express";
import { createServer } from "http";
import { setupVite, log } from "./vite";

(async () => {
  const app = express();
  const server = createServer(app);

    await setupVite(app, server);

  const port = 5000;
  server.listen({
    port,
    host: "127.0.0.1",
  }, () => {
    log(`serving on port ${port}`);
  });
})();
