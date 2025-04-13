import { 
  Template, InsertTemplate, 
  Worksheet, InsertWorksheet,
  Summary, InsertSummary
} from "@shared/schema";
import { templates as templatesData } from "./data/templates";
import { worksheets as worksheetsData } from "./data/worksheets";

// Storage interface
export interface IStorage {
  // Templates
  getAllTemplates(): Promise<Template[]>;
  getTemplateById(id: number): Promise<Template | undefined>;
  getTemplatesByCategory(category: string): Promise<Template[]>;
  
  // Worksheets
  getAllWorksheets(): Promise<Worksheet[]>;
  getWorksheetById(id: number): Promise<Worksheet | undefined>;
  getWorksheetsByCategory(category: string): Promise<Worksheet[]>;
  
  // Summaries
  createSummary(summary: InsertSummary): Promise<Summary>;
  getSummaryById(id: number): Promise<Summary | undefined>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private templates: Map<number, Template>;
  private worksheets: Map<number, Worksheet>;
  private summaries: Map<number, Summary>;
  private summaryCurrentId: number;

  constructor() {
    // Initialize with predefined templates
    this.templates = new Map();
    templatesData.forEach(template => {
      this.templates.set(template.id, template);
    });

    // Initialize with predefined worksheets
    this.worksheets = new Map();
    worksheetsData.forEach(worksheet => {
      this.worksheets.set(worksheet.id, worksheet);
    });

    // Initialize empty summaries
    this.summaries = new Map();
    this.summaryCurrentId = 1;
  }

  // Template methods
  async getAllTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async getTemplateById(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(
      template => template.category === category
    );
  }

  // Worksheet methods
  async getAllWorksheets(): Promise<Worksheet[]> {
    return Array.from(this.worksheets.values());
  }

  async getWorksheetById(id: number): Promise<Worksheet | undefined> {
    return this.worksheets.get(id);
  }

  async getWorksheetsByCategory(category: string): Promise<Worksheet[]> {
    return Array.from(this.worksheets.values()).filter(
      worksheet => worksheet.category === category
    );
  }

  // Summary methods
  async createSummary(insertSummary: InsertSummary): Promise<Summary> {
    const id = this.summaryCurrentId++;
    const summary: Summary = { ...insertSummary, id };
    this.summaries.set(id, summary);
    return summary;
  }

  async getSummaryById(id: number): Promise<Summary | undefined> {
    return this.summaries.get(id);
  }
}

export const storage = new MemStorage();
