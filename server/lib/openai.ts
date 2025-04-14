import OpenAI from "openai";
import { TextGenerationRequest, TextGenerationResponse } from "@shared/types";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Sucht nach einem Text basierend auf Titel, Autor und Jahr
 */
export async function searchText(title: string, author?: string, year?: string): Promise<string> {
  try {
    const searchTerm = `${title}${author ? ` von ${author}` : ''}${year ? ` aus dem Jahr ${year}` : ''}`;
    console.log(`Suche nach: ${searchTerm}`);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Du bist ein Literaturexperte mit Schwerpunkt auf deutsche Literatur. Deine Aufgabe ist es, AUSSCHLIESSLICH den vollständigen literarischen Text zu liefern, ohne jegliche zusätzliche Kommentare, Einleitungen oder Erklärungen.
          
          WICHTIG:
          - Gib NUR den Text selbst zurück, ohne Kommentare oder eigene Hinzufügungen
          - Wenn möglich, liefere den vollständigen Text und nicht nur Auszüge
          - Liefere NIEMALS eine Zusammenfassung oder Paraphrase statt des Originaltextes
          - Füge KEINE Einleitung, Erklärung oder Schlussworte hinzu
          - Formatiere den Text so, wie er im Original erscheint (mit Absätzen, etc.)
          - Verwende KEINE Markdown-Formatierung oder Ähnliches`
        },
        {
          role: "user",
          content: `Liefere den vollständigen Text von: ${searchTerm} - WICHTIG: Gib NUR den Text selbst zurück ohne eigene Kommentare oder Erklärungen. Keine Einleitung, keine Zusammenfassung.`
        }
      ],
      temperature: 0.1,
      max_tokens: 4000
    });

    return response.choices[0].message.content || `Es konnte kein Text für "${searchTerm}" gefunden werden.`;
  } catch (error: any) {
    console.error("Fehler bei der Textsuche:", error);
    const errorMessage = error?.message || "Unbekannter Fehler";
    throw new Error(`Fehler bei der Suche nach dem Text: ${errorMessage}`);
  }
}

/**
 * Generate a text summary based on the German input text and custom rules
 */
export async function generateTextSummary(
  request: TextGenerationRequest
): Promise<TextGenerationResponse> {
  try {
    const { text, textInfo, settings, customRules } = request;
    
    // Build detailed prompt based on request parameters
    const prompt = buildTextAnalysisPrompt(text, textInfo, settings, customRules);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Du bist ein deutschsprachiger Assistent, der auf die Analyse und Zusammenfassung deutscher Texte spezialisiert ist. Beachte genau die vom Benutzer vorgegebenen Regeln für die Analyse."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000
    });

    // Parse response as JSON
    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      summary: result.summary || "Es gab ein Problem bei der Erstellung der Zusammenfassung.",
      analysis: result.analysis,
      stylisticDevices: result.stylisticDevices,
      suggestions: result.suggestions
    };
  } catch (error: any) {
    console.error("Error generating summary:", error);
    throw new Error("Fehler bei der Textgenerierung. Bitte versuche es später erneut.");
  }
}

/**
 * Builds the prompt for German text analysis based on settings and custom rules
 */
function buildTextAnalysisPrompt(
  text: string, 
  textInfo: string | undefined,
  settings: TextGenerationRequest["settings"],
  customRules: string | undefined
): string {
  const lengthGuidance = {
    1: "sehr kurz und kompakt (ca. 150 Wörter)",
    2: "kurz (ca. 250 Wörter)",
    3: "mittlerer Länge (ca. 350 Wörter)",
    4: "ausführlich (ca. 450 Wörter)",
    5: "sehr detailliert (ca. 550+ Wörter)"
  }[settings.length];

  const languageLevelGuidance = {
    "A1-A2": "einfache Sprache, kurze Sätze, grundlegender Wortschatz",
    "B1-B2": "mittleres Sprachniveau, klare Struktur, gängiger Wortschatz",
    "C1-C2": "anspruchsvolles Sprachniveau, komplexe Satzstrukturen, präziser Wortschatz"
  }[settings.languageLevel];

  // Add text info if provided
  const textInfoSection = textInfo 
    ? `Textinformationen: ${textInfo}\n\n` 
    : "";
  
  // Additional requirements
  const analysisRequest = settings.includeAnalysis 
    ? "Füge eine detaillierte Textanalyse hinzu, die Einleitung, Hauptteil, Schluss und Sprachstil bewertet." 
    : "";
  
  const stylisticRequest = settings.includeStylistic 
    ? "Identifiziere und erkläre stilistische Mittel im Text mit konkreten Beispielen." 
    : "";

  // Custom rules section
  const customRulesSection = customRules
    ? `\nBENUTZERDEFINIERTE REGELN:\n${customRules}\n`
    : "";

  return `
Analysiere und fasse den folgenden deutschen Text zusammen:

${textInfoSection}
TEXT:
${text}
${customRulesSection}
ANFORDERUNGEN:
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
