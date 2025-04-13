import OpenAI from "openai";
import { TextGenerationRequest, TextGenerationResponse } from "@shared/types";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "sk-dummy-key-for-development" });

/**
 * Generate a text summary based on the German input text and selected template
 */
export async function generateTextSummary(
  request: TextGenerationRequest
): Promise<TextGenerationResponse> {
  try {
    const { text, textInfo, templateId, settings } = request;
    
    // Build detailed prompt based on request parameters
    const prompt = buildGermanTextAnalysisPrompt(text, textInfo, templateId, settings);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Du bist ein deutschsprachiger Assistent, der auf die Analyse und Zusammenfassung deutscher Texte nach akademischen Standards spezialisiert ist. Du erstellst Inhaltsangaben, die den deutschen schulischen Anforderungen entsprechen."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    // Parse response as JSON
    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      summary: result.summary || "Es gab ein Problem bei der Erstellung der Zusammenfassung.",
      analysis: result.analysis,
      stylisticDevices: result.stylisticDevices,
      suggestions: result.suggestions
    };
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Fehler bei der Textgenerierung. Bitte versuche es später erneut.");
  }
}

/**
 * Builds the prompt for German text analysis based on the template and settings
 */
function buildGermanTextAnalysisPrompt(
  text: string, 
  textInfo: string | undefined, 
  templateId: number,
  settings: TextGenerationRequest["settings"]
): string {
  const lengthGuidance = {
    1: "sehr kurz und kompakt",
    2: "kurz",
    3: "mittlerer Länge",
    4: "ausführlich",
    5: "sehr detailliert"
  }[settings.length];

  const languageLevelGuidance = {
    "A1-A2": "einfache Sprache, kurze Sätze, grundlegender Wortschatz",
    "B1-B2": "mittleres Sprachniveau, klare Struktur, gängiger Wortschatz",
    "C1-C2": "anspruchsvolles Sprachniveau, komplexe Satzstrukturen, präziser Wortschatz"
  }[settings.languageLevel];

  let templateGuidance = "";
  switch (templateId) {
    case 1: // Standard Inhaltsangabe
      templateGuidance = "Erstelle eine Standard-Inhaltsangabe mit Einleitung (Basisinformationen), Hauptteil (chronologische Zusammenfassung) und Schluss (Kernaussage/Intention). Verwende das Präsens als Zeitform.";
      break;
    case 2: // Literarische Analyse
      templateGuidance = "Erstelle eine literarische Analyse, die Erzählperspektive, Charaktere, Stil und Themen des Textes beleuchtet.";
      break;
    case 3: // Charakterisierung
      templateGuidance = "Erstelle eine Charakterisierung der Hauptfigur(en), die äußere Merkmale, Verhaltensweisen, Beziehungen zu anderen Figuren und Entwicklung im Verlauf der Handlung beschreibt.";
      break;
    case 4: // Gedichtanalyse
      templateGuidance = "Erstelle eine Gedichtanalyse, die Form, Sprache, Reimschema, lyrisches Ich und Interpretation des Gedichts umfasst.";
      break;
    case 5: // Sachtextanalyse
      templateGuidance = "Erstelle eine Sachtextanalyse, die Textsorte, Struktur, Argumentation, sprachliche Mittel und Intention des Autors analysiert.";
      break;
    default:
      templateGuidance = "Erstelle eine Standard-Inhaltsangabe mit Einleitung (Basisinformationen), Hauptteil (chronologische Zusammenfassung) und Schluss (Kernaussage/Intention). Verwende das Präsens als Zeitform.";
  }

  // Add text info if provided
  const textInfoSection = textInfo 
    ? `Textinformationen: ${textInfo}\n\n` 
    : "";
  
  // Additional requirements
  const analysisRequest = settings.includeAnalysis 
    ? "Bitte füge eine detaillierte Textanalyse hinzu, die Einleitung, Hauptteil, Schluss und Sprachstil bewertet." 
    : "";
  
  const stylisticRequest = settings.includeStylistic 
    ? "Bitte identifiziere und erkläre stilistische Mittel im Text mit konkreten Beispielen." 
    : "";

  return `
Analysiere und fasse den folgenden deutschen Text zusammen:

${textInfoSection}
TEXT:
${text}

ANFORDERUNGEN:
- ${templateGuidance}
- Die Zusammenfassung soll ${lengthGuidance} sein.
- Verwende ein ${languageLevelGuidance}.
- ${analysisRequest}
- ${stylisticRequest}

FORMATIERUNG:
Antworte mit einem JSON-Objekt, das folgende Schlüssel enthält:
- "summary": Die Zusammenfassung des Textes.
${settings.includeAnalysis ? '- "analysis": Ein Objekt mit den Schlüsseln "introduction", "mainPart", "conclusion" und "languageStyle".' : ''}
${settings.includeStylistic ? '- "stylisticDevices": Ein Array von Objekten mit den Schlüsseln "name", "description" und "examples".' : ''}
- "suggestions": Ein Array mit Verbesserungsvorschlägen.
  `;
}
