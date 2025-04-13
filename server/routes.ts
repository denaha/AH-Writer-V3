import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateTextSummary } from "./lib/openai";
import { insertSummarySchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { TextGenerationRequest } from "@shared/types";

export async function registerRoutes(app: Express): Promise<Server> {
  // Route for getting all templates
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getAllTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Fehler beim Laden der Vorlagen." });
    }
  });
  
  // Route for getting a specific template
  app.get("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.getTemplateById(id);
      
      if (!template) {
        return res.status(404).json({ message: "Vorlage nicht gefunden." });
      }
      
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Fehler beim Laden der Vorlage." });
    }
  });

  // Route for getting templates by category
  app.get("/api/templates/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const templates = await storage.getTemplatesByCategory(category);
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Fehler beim Laden der Vorlagen." });
    }
  });

  // Route for getting all worksheets
  app.get("/api/worksheets", async (req, res) => {
    try {
      const worksheets = await storage.getAllWorksheets();
      res.json(worksheets);
    } catch (error) {
      res.status(500).json({ message: "Fehler beim Laden der Arbeitsblätter." });
    }
  });

  // Route for getting a specific worksheet
  app.get("/api/worksheets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const worksheet = await storage.getWorksheetById(id);
      
      if (!worksheet) {
        return res.status(404).json({ message: "Arbeitsblatt nicht gefunden." });
      }
      
      res.json(worksheet);
    } catch (error) {
      res.status(500).json({ message: "Fehler beim Laden des Arbeitsblatts." });
    }
  });

  // Route for getting worksheets by category
  app.get("/api/worksheets/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const worksheets = await storage.getWorksheetsByCategory(category);
      res.json(worksheets);
    } catch (error) {
      res.status(500).json({ message: "Fehler beim Laden der Arbeitsblätter." });
    }
  });

  // Route for generating text summaries
  app.post("/api/generate", async (req, res) => {
    try {
      // Validate request body
      const request = req.body as TextGenerationRequest;
      
      if (!request.text) {
        return res.status(400).json({ message: "Ein Text ist erforderlich." });
      }
      
      // Generate the summary using OpenAI
      const response = await generateTextSummary(request);
      
      // Create a record in the database (optional)
      const now = new Date();
      const summary = await storage.createSummary({
        originalText: request.text,
        summary: response.summary,
        analysis: response.analysis || null,
        templateId: request.templateId || 1, // Default template ID if not specified
        createdAt: now.toISOString()
      });
      
      // Return the generated content
      res.json({
        id: summary.id,
        ...response
      });
    } catch (error) {
      console.error("Error generating summary:", error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      res.status(500).json({ 
        message: "Fehler bei der Textgenerierung. Bitte versuche es später erneut." 
      });
    }
  });
  
  // Route for handling file uploads
  app.post("/api/upload", async (req, res) => {
    try {
      const file = req.body.file;
      
      if (!file || !file.content) {
        return res.status(400).json({ message: "Eine Datei ist erforderlich." });
      }
      
      // Return success with the file content
      res.json({ 
        success: true,
        fileName: file.name,
        fileType: file.type,
        text: file.content
      });
    } catch (error) {
      console.error("Error handling file upload:", error);
      res.status(500).json({ 
        message: "Fehler beim Hochladen der Datei. Bitte versuche es später erneut." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
