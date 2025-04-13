import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { TextGenerationRequest, TextGenerationResponse, LanguageLevel } from "@shared/types";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, Copy, Download, Loader2, SendHorizonal } from "lucide-react";

interface PerplexityAIWriterProps {
  settings: {
    length: number;
    languageLevel: LanguageLevel;
    includeAnalysis: boolean;
    includeStylistic: boolean;
  };
  setSettings: React.Dispatch<React.SetStateAction<{
    length: number;
    languageLevel: LanguageLevel;
    includeAnalysis: boolean;
    includeStylistic: boolean;
  }>>;
}

export default function PerplexityAIWriter({ settings, setSettings }: PerplexityAIWriterProps) {
  // Input and output state
  const [originalText, setOriginalText] = useState("");
  const [textInfo, setTextInfo] = useState("");
  const [customRules, setCustomRules] = useState("");
  const [activeTab, setActiveTab] = useState("result");
  const [result, setResult] = useState<TextGenerationResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Mutations
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const request: TextGenerationRequest = {
        text: originalText,
        textInfo: textInfo || undefined,
        customRules: customRules || undefined,
        settings
      };
      
      const response = await apiRequest("POST", "/api/generate", request);
      const data = await response.json();
      return data as TextGenerationResponse;
    },
    onSuccess: (data) => {
      setResult(data);
      setActiveTab("result");
      toast({
        title: "Erfolgreich",
        description: "Die Textanalyse wurde erstellt.",
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
  
  // Handle file upload to backend
  const { mutate: uploadFile, isPending: isUploading } = useMutation({
    mutationFn: async (file: File) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
          if (event.target?.result) {
            const fileContent = event.target.result.toString();
            
            try {
              const response = await apiRequest("POST", "/api/upload", {
                file: {
                  name: file.name,
                  type: file.type,
                  content: fileContent
                }
              });
              
              const data = await response.json();
              if (data.success) {
                resolve(data.text);
              } else {
                reject(new Error("Fehler beim Hochladen der Datei"));
              }
            } catch (error) {
              reject(error);
            }
          } else {
            reject(new Error("Fehler beim Lesen der Datei"));
          }
        };
        reader.onerror = () => reject(new Error("Fehler beim Lesen der Datei"));
        reader.readAsText(file);
      });
    },
    onSuccess: (text) => {
      setOriginalText(text);
      toast({
        title: "Datei hochgeladen",
        description: "Der Inhalt der Datei wurde erfolgreich geladen.",
      });
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: "Die Datei konnte nicht hochgeladen werden.",
        variant: "destructive",
      });
    },
  });
  
  // Handlers
  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };
  
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
  
  const handleCopy = () => {
    if (result?.summary) {
      navigator.clipboard.writeText(result.summary);
      toast({
        title: "Kopiert",
        description: "Die Zusammenfassung wurde in die Zwischenablage kopiert.",
      });
    }
  };
  
  const handleSave = () => {
    if (result?.summary) {
      const blob = new Blob([result.summary], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'zusammenfassung.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  };
  
  // Render
  return (
    <div className="flex flex-col space-y-6">
      {/* Logo and Header Section */}
      <div className="flex items-center mb-8">
        <div className="h-8 w-8 rounded-full perplexity-gradient mr-3 flex items-center justify-center">
          <FileText className="h-4 w-4 text-white" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground">GermanAI Writer</h1>
      </div>
      
      {/* Main Input Card */}
      <Card className="border-muted bg-card shadow-none">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <Textarea 
              className="w-full h-64 resize-none text-md bg-background border-input focus:ring-primary p-4 rounded-lg"
              placeholder="Füge hier deinen deutschen Text ein oder lade eine Datei hoch..."
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
            />
            
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground flex items-center"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                Datei hochladen
              </Button>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden"
                accept=".txt,.doc,.docx,.pdf"
                onChange={handleFileChange}
              />
              
              <Input 
                className="w-full md:w-auto flex-grow bg-background border-input"
                placeholder="Optionale Informationen (Autor, Titel, Jahr, etc.)"
                value={textInfo}
                onChange={(e) => setTextInfo(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Analysis Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-muted bg-card shadow-none">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-foreground mb-4">Analyseeinstellungen</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-muted-foreground">Umfang</Label>
                  <span className="text-xs text-muted-foreground">{settings.length}/5</span>
                </div>
                <Slider 
                  value={[settings.length]} 
                  min={1} 
                  max={5} 
                  step={1}
                  onValueChange={(value) => setSettings({...settings, length: value[0]})}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Kurz</span>
                  <span>Detailliert</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Sprachniveau</Label>
                <div className="flex flex-wrap gap-2">
                  {(['A1-A2', 'B1-B2', 'C1-C2'] as LanguageLevel[]).map((level) => (
                    <Button 
                      key={level}
                      variant={settings.languageLevel === level ? "default" : "outline"} 
                      size="sm"
                      className={settings.languageLevel === level ? "bg-primary text-primary-foreground" : "text-muted-foreground"}
                      onClick={() => setSettings({...settings, languageLevel: level})}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground" htmlFor="analysis-switch">
                    Detaillierte Textanalyse
                  </Label>
                  <Switch 
                    id="analysis-switch" 
                    checked={settings.includeAnalysis}
                    onCheckedChange={(checked) => setSettings({...settings, includeAnalysis: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground" htmlFor="stylistic-switch">
                    Stilistische Mittel analysieren
                  </Label>
                  <Switch 
                    id="stylistic-switch" 
                    checked={settings.includeStylistic}
                    onCheckedChange={(checked) => setSettings({...settings, includeStylistic: checked})}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Custom Rules */}
        <Card className="border-muted bg-card shadow-none">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-foreground mb-4">Eigene Regeln</h3>
            <Textarea 
              className="w-full h-[218px] resize-none text-sm bg-background border-input rounded-lg"
              placeholder="Definiere hier eigene Regeln für die Textanalyse (z.B. spezifische Aspekte, auf die geachtet werden soll, besondere Formatierungswünsche, etc.)"
              value={customRules}
              onChange={(e) => setCustomRules(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Generate Button */}
      <div className="flex justify-center my-4">
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium flex items-center gap-2 py-6 px-8"
          onClick={handleSubmit}
          disabled={isPending || !originalText.trim()}
          size="lg"
        >
          {isPending ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Analysiere...</>
          ) : (
            <><SendHorizonal className="h-5 w-5" /> Text analysieren</>
          )}
        </Button>
      </div>
      
      {/* Results Section */}
      {result && (
        <Card className="border-muted bg-card shadow-none mt-4">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-foreground">Ergebnis</h3>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-muted-foreground hover:text-foreground flex items-center"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Kopieren
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-muted-foreground hover:text-foreground flex items-center"
                  onClick={handleSave}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Speichern
                </Button>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start border-b mb-4 bg-transparent p-0">
                <TabsTrigger 
                  value="result" 
                  className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
                >
                  Zusammenfassung
                </TabsTrigger>
                
                {settings.includeAnalysis && result.analysis && (
                  <TabsTrigger 
                    value="analysis" 
                    className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
                  >
                    Analyse
                  </TabsTrigger>
                )}
                
                {settings.includeStylistic && result.stylisticDevices && (
                  <TabsTrigger 
                    value="stylistic" 
                    className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
                  >
                    Stilmittel
                  </TabsTrigger>
                )}
                
                {result.suggestions && result.suggestions.length > 0 && (
                  <TabsTrigger 
                    value="suggestions" 
                    className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
                  >
                    Vorschläge
                  </TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="result" className="mt-0">
                <div className="prose dark:prose-invert max-w-none space-y-4">
                  {result.summary.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </TabsContent>
              
              {settings.includeAnalysis && result.analysis && (
                <TabsContent value="analysis" className="mt-0">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-primary mb-1">Einleitung</h4>
                      <p className="text-foreground text-sm">{result.analysis.introduction}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-primary mb-1">Hauptteil</h4>
                      <p className="text-foreground text-sm">{result.analysis.mainPart}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-primary mb-1">Schluss</h4>
                      <p className="text-foreground text-sm">{result.analysis.conclusion}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-primary mb-1">Sprachstil</h4>
                      <p className="text-foreground text-sm">{result.analysis.languageStyle}</p>
                    </div>
                  </div>
                </TabsContent>
              )}
              
              {settings.includeStylistic && result.stylisticDevices && (
                <TabsContent value="stylistic" className="mt-0">
                  <div className="space-y-6">
                    {result.stylisticDevices.map((device, index) => (
                      <div key={index} className="space-y-2">
                        <h4 className="text-sm font-medium text-primary">{device.name}</h4>
                        <p className="text-foreground text-sm">{device.description}</p>
                        <div>
                          <h5 className="text-xs font-medium text-muted-foreground mb-1">Beispiele:</h5>
                          <ul className="list-disc list-inside text-sm text-foreground space-y-1">
                            {device.examples.map((example, i) => (
                              <li key={i}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )}
              
              {result.suggestions && result.suggestions.length > 0 && (
                <TabsContent value="suggestions" className="mt-0">
                  <ul className="list-disc list-inside text-sm text-foreground space-y-2">
                    {result.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}