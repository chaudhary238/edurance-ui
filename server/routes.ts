import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPolicySchema, insertPolicyAnalysisSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (mock authentication)
  app.get("/api/user", async (req, res) => {
    try {
      // For demo purposes, return the first user
      const user = await storage.getUser(1);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get user policies
  app.get("/api/policies", async (req, res) => {
    try {
      // For demo purposes, use user ID 1
      const policies = await storage.getPoliciesByUser(1);
      res.json(policies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch policies" });
    }
  });

  // Search policies
  app.get("/api/policies/search", async (req, res) => {
    try {
      const { q } = req.query;
      const query = typeof q === 'string' ? q : '';
      
      const policies = await storage.searchPolicies(1, query);
      res.json(policies);
    } catch (error) {
      res.status(500).json({ message: "Failed to search policies" });
    }
  });

  // Create new policy
  app.post("/api/policies", async (req, res) => {
    try {
      const validatedData = insertPolicySchema.parse({
        ...req.body,
        userId: 1 // For demo purposes
      });
      
      const policy = await storage.createPolicy(validatedData);
      res.status(201).json(policy);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid policy data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create policy" });
    }
  });

  // Get policy by ID
  app.get("/api/policies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const policy = await storage.getPolicy(id);
      
      if (!policy) {
        return res.status(404).json({ message: "Policy not found" });
      }
      
      res.json(policy);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch policy" });
    }
  });

  // Update policy analysis timestamp
  app.patch("/api/policies/:id/analyze", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedPolicy = await storage.updatePolicy(id, {
        lastAnalyzed: new Date()
      });
      
      if (!updatedPolicy) {
        return res.status(404).json({ message: "Policy not found" });
      }
      
      res.json(updatedPolicy);
    } catch (error) {
      res.status(500).json({ message: "Failed to update policy" });
    }
  });

  // Get policy analyses
  app.get("/api/policies/:id/analyses", async (req, res) => {
    try {
      const policyId = parseInt(req.params.id);
      const analyses = await storage.getAnalysesByPolicy(policyId);
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analyses" });
    }
  });

  // Create policy analysis
  app.post("/api/policies/:id/analyses", async (req, res) => {
    try {
      const policyId = parseInt(req.params.id);
      const validatedData = insertPolicyAnalysisSchema.parse({
        ...req.body,
        policyId
      });
      
      const analysis = await storage.createAnalysis(validatedData);
      res.status(201).json(analysis);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid analysis data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create analysis" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
