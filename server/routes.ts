import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import express from "express";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Serve attached assets (images and audio files)
  app.use("/api/assets", express.static(path.join(process.cwd(), "attached_assets")));

  return httpServer;
}
