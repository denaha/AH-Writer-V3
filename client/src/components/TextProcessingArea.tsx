import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { TextGenerationRequest, TextGenerationResponse } from "@shared/types";
import { useToast } from "@/hooks/use-toast";
import StepByStepGuide from "./StepByStepGuide";

interface TextProcessingAreaProps {
  templateId: number;
  settings: {
    length: number;
    languageLevel: any;
    includeAnalysis: boolean;
    includeStylistic: boolean;
  };
}

export default function TextProcessingArea({ 
  templateId,
  settings 
}: TextProcessingAreaProps) {
  const [originalText, setOriginalText] = useState("");
  const [textInfo, setTextInfo] = useState("");
  const [activeTab, setActiveTab] = useState("textAnalysis");
  const { toast } = useToast();
  
  const [result, setResult] = useState<TextGenerationResponse | null>(null);
  
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const request: TextGenerationRequest = {
        text: originalText,
        textInfo: textInfo || undefined,
        templateId,
        settings
      };
      
      const response = await apiRequest("POST", "/api/generate", request);
      const data = await response.json();
      return data as TextGenerationResponse;
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "Erfolgreich",
        description: "Die Inhaltsangabe wurde erstellt.",
      });
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: "Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.",
        variant: "destructive",
      });
    },
  });
  
  const handleSubmit = () => {
    if (!originalText.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib einen Text ein.",
        variant: "destructive",
      });
      return;
    }
    
    mutate();
  };
  
  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.doc,.docx,.pdf';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setOriginalText(event.target.result.toString());
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };
  
  const handleCopy = () => {
    if (result?.summary) {
      navigator.clipboard.writeText(result.summary);
      toast({
        title: "Kopiert",
        description: "Die Inhaltsangabe wurde in die Zwischenablage kopiert.",
      });
    }
  };
  
  const handleSave = () => {
    if (result?.summary) {
      const blob = new Blob([result.summary], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'inhaltsangabe.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  };
  
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Text Input Area */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-primary">Originaltext</CardTitle>
          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2 text-accent hover:text-primary"
              onClick={handleUpload}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Hochladen
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-accent hover:text-primary"
              onClick={() => navigator.clipboard.readText().then(text => setOriginalText(text))}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Einfügen
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea 
            className="w-full h-64 p-4 border border-gray-300 rounded-md focus:border-accent focus:ring focus:ring-accent focus:ring-opacity-50 font-sourceSans" 
            placeholder="Füge hier deinen deutschen Text ein oder lade eine Datei hoch..."
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
          />
          
          <div className="mt-4">
            <div className="flex justify-between text-xs text-secondary mb-1">
              <span>Informationen zum Text (optional)</span>
              <span>{textInfo.length}/200</span>
            </div>
            <Input 
              className="w-full p-2 border border-gray-300 rounded-md focus:border-accent focus:ring focus:ring-accent focus:ring-opacity-50" 
              placeholder="Autor, Titel, Jahr, Textsorte..." 
              value={textInfo}
              onChange={(e) => setTextInfo(e.target.value)}
              maxLength={200}
            />
          </div>
        </CardContent>
      </Card>

      {/* Processing Controls */}
      <div className="flex justify-center">
        <Button 
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium flex items-center"
          onClick={handleSubmit}
          disabled={isPending || !originalText.trim()}
        >
          {isPending ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8l-4 4m0 0l4 4m-4-4h18" />
            </svg>
          )}
          Inhaltsangabe generieren
        </Button>
      </div>

      {/* Results Area */}
      {result && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-primary">Inhaltsangabe</CardTitle>
            <div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2 text-accent hover:text-primary"
                onClick={handleCopy}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                Kopieren
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-accent hover:text-primary"
                onClick={handleSave}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Speichern
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none space-y-4 font-sourceSans">
              {result.summary.split('\n\n').map((paragraph, index) => (
                <p key={index} className={index === 0 ? "font-medium" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>
            
            {/* Analysis Tabs */}
            {settings.includeAnalysis && result.analysis && (
              <div className="mt-6 border-t border-gray-200 pt-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="flex space-x-4 border-b border-gray-200">
                    <TabsTrigger value="textAnalysis" className="text-primary px-4 py-2 font-medium text-sm">
                      Textanalyse
                    </TabsTrigger>
                    {settings.includeStylistic && result.stylisticDevices && (
                      <TabsTrigger value="stylisticDevices" className="text-secondary hover:text-primary px-4 py-2 font-medium text-sm">
                        Stilistische Mittel
                      </TabsTrigger>
                    )}
                    {result.suggestions && (
                      <TabsTrigger value="suggestions" className="text-secondary hover:text-primary px-4 py-2 font-medium text-sm">
                        Verbesserungsvorschläge
                      </TabsTrigger>
                    )}
                  </TabsList>
                  
                  <TabsContent value="textAnalysis" className="py-4 space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-primary">Einleitung:</span>
                      <span className="text-secondary"> {result.analysis.introduction}</span>
                    </div>
                    <div>
                      <span className="font-medium text-primary">Hauptteil:</span>
                      <span className="text-secondary"> {result.analysis.mainPart}</span>
                    </div>
                    <div>
                      <span className="font-medium text-primary">Schluss:</span>
                      <span className="text-secondary"> {result.analysis.conclusion}</span>
                    </div>
                    <div>
                      <span className="font-medium text-primary">Sprachstil:</span>
                      <span className="text-secondary"> {result.analysis.languageStyle}</span>
                    </div>
                  </TabsContent>
                  
                  {settings.includeStylistic && result.stylisticDevices && (
                    <TabsContent value="stylisticDevices" className="py-4 space-y-4 text-sm">
                      {result.stylisticDevices.map((device, index) => (
                        <div key={index}>
                          <h3 className="font-medium text-primary">{device.name}</h3>
                          <p className="text-secondary mb-1">{device.description}</p>
                          <ul className="list-disc pl-5 text-secondary">
                            {device.examples.map((example, i) => (
                              <li key={i}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </TabsContent>
                  )}
                  
                  {result.suggestions && (
                    <TabsContent value="suggestions" className="py-4 space-y-2 text-sm">
                      <ul className="list-disc pl-5 text-secondary">
                        {result.suggestions.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </TabsContent>
                  )}
                </Tabs>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step-by-Step Guide */}
      <StepByStepGuide />
    </div>
  );
}
