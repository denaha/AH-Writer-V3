import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { TextGenerationRequest, TextGenerationResponse, LanguageLevel, TextType } from "@shared/types";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, Copy, Download, Loader2, SendHorizonal, Camera, BookOpen, Search } from "lucide-react";

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
  const [selectedTextType, setSelectedTextType] = useState<TextType>("Inhaltsangabe");
  const [photoSource, setPhotoSource] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isAutoLookupModalOpen, setIsAutoLookupModalOpen] = useState(false);
  const [autoLookupInfo, setAutoLookupInfo] = useState({
    title: "",
    author: "",
    year: ""
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  // Mutations
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const request: TextGenerationRequest = {
        text: originalText,
        textInfo: textInfo || undefined,
        customRules: customRules || undefined,
        textType: selectedTextType,
        settings,
        photoSource: photoSource ? { dataUrl: photoSource } : undefined,
        autoLookupInfo: autoLookupInfo.title ? {
          title: autoLookupInfo.title,
          author: autoLookupInfo.author,
          year: autoLookupInfo.year
        } : undefined
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
  // Camera functions
  const startCamera = async () => {
    if (videoRef.current && navigator.mediaDevices) {
      try {
        console.log("Starte Kamera...");
        const constraints = {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "environment"
          }
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) videoRef.current.play();
            console.log("Video stream geladen");
          };
        }
      } catch (err) {
        console.error("Fehler beim Zugriff auf die Kamera:", err);
        toast({
          title: "Kamerafehler",
          description: "Zugriff auf die Kamera nicht möglich.",
          variant: "destructive",
        });
        setCameraActive(false);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPhotoSource(dataUrl);
        stopCamera();
        
        toast({
          title: "Foto aufgenommen",
          description: "Das Foto wurde erfolgreich aufgenommen und wird zur Textanalyse verwendet.",
        });
      }
    }
  };

  // Auto-Lookup function
  const handleAutoLookup = async () => {
    if (!autoLookupInfo.title.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib mindestens einen Titel ein.",
        variant: "destructive",
      });
      return;
    }

    // Hier würde normalerweise ein API-Aufruf stattfinden, um den Text zu finden
    toast({
      title: "Text wird gesucht",
      description: "Dein Text wird gesucht und geladen...",
    });

    // Simulation eines erfolgreichen API-Aufrufs
    setTimeout(() => {
      // Realistische Demo-Texte für verschiedene bekannte Werke
      let loadedText = "";
      
      if (autoLookupInfo.title.toLowerCase().includes("das brot")) {
        loadedText = `Das Brot\n\nSie hörte, wie er leise und vorsichtig durchs Zimmer ging. Er sah nicht vom Teller auf. Er hatte noch immer sein weißes Gesicht. Aber er hielt den Kopf gebückt. Er sah nicht, daß sie abends heimlich nach dem Brot sah. Sie konnte es erst nach dem dritten Abend sagen. Sie sagte: Ich kann dieses Brot nicht mehr essen. Sie sagte: Ich weiß auch, warum du nachts immer rausgehst. Ich höre doch, wie du die Küchenschrank-Tür aufreißt. Du ißt doch nachts heimlich Brot. Das mußte er zugeben. Er schämte sich. Nach dem nächsten Nacht - sie hatte wieder in der Küche gesessen - gab sie ihm Brot. Nachts um halb drei. Er nahm es und aß. Vor ihr. Und zum erstenmal seit vielen Jahren hatten sie nachts eine halbe Stunde lang das Licht an. Zusammen.`;
      } else if (autoLookupInfo.title.toLowerCase().includes("schimmelreiter") || autoLookupInfo.author.toLowerCase().includes("storm")) {
        loadedText = `Der Schimmelreiter von Theodor Storm\n\nWas ich zu berichten beabsichtige, ist mir vor reichlich einem halben Jahrhundert im Hause meiner Urgroßmutter, der alten Frau Senator Feddersen, kundgeworden, während ich, an ihrem Lehnstuhl sitzend, mich mit dem Lesen eines in blaue Pappe eingebundenen Zeitschriftenheftes beschäftigte; ich finde jetzt selbst, daß es besser sei, sie in ihrem Grabe zu lassen und auch mit schweigen ob jener spukhaften Erscheinung jenes grauenhaften Reiters und seines Schimmels, den sie in unheimlich stürmischen Nächten am Deich dahinreiten gesehen.\n\nHauke Haien war der Sohn eines Landvermessers, eines sogenannten 'Kooginspektors'; und der alte Tede Haien hatte seinen Jungen wenig von ihm erzählt. Aus einem Schulzimmer drängte sich alles ungestüm der Tür zu; mein Gefährte packte mich an und zog mich fort: 'Komm, da bringen sie einen Ertrunkenen; er ist über Jeverssand gefahren; der Schimmel hat ihn abgeworfen; Schimmel und Karriol sind auch ertrunken!'`;
      } else if (autoLookupInfo.title.toLowerCase().includes("faust") || autoLookupInfo.author.toLowerCase().includes("goethe")) {
        loadedText = `Faust: Der Tragödie erster Teil von Johann Wolfgang von Goethe\n\nHabe nun, ach! Philosophie,\nJuristerei und Medizin,\nUnd leider auch Theologie\nDurchaus studiert, mit heißem Bemühn.\nDa steh ich nun, ich armer Tor!\nUnd bin so klug als wie zuvor;\nHeiße Magister, heiße Doktor gar\nUnd ziehe schon an die zehen Jahr\nHerauf, herab und quer und krumm\nMeine Schüler an der Nase herum –\nUnd sehe, daß wir nichts wissen können!\nDas will mir schier das Herz verbrennen.\nZwar bin ich gescheiter als all die Laffen,\nDoktoren, Magister, Schreiber und Pfaffen;\nMich plagen keine Skrupel noch Zweifel,\nFürchte mich weder vor Hölle noch Teufel –\nDafür ist mir auch alle Freud entrissen,\nBilde mir nicht ein, was Rechts zu wissen,\nBilde mir nicht ein, ich könnte was lehren,\nDie Menschen zu bessern und zu bekehren.`;
      } else {
        // Generischer Text für alle anderen Anfragen
        loadedText = `${autoLookupInfo.title}${autoLookupInfo.author ? ` von ${autoLookupInfo.author}` : ''}${autoLookupInfo.year ? ` (${autoLookupInfo.year})` : ''}\n\nHier wäre normalerweise der vollständige Text dieses Werkes zu finden. In einer vollständigen Implementierung würde hier der tatsächlich aus einer Datenbank oder API abgerufene Text erscheinen, basierend auf den von Ihnen eingegebenen Suchkriterien.\n\nIn diesem Beispiel simulieren wir eine erfolgreiche Textsuche. In einer fertigen Anwendung würden Sie an dieser Stelle den vollständigen Originaltext sehen, inklusive sämtlicher Absätze, Kapitel und Formatierungen des Originals.`;
      }
      
      setOriginalText(loadedText);
      setIsAutoLookupModalOpen(false);
      
      toast({
        title: "Text gefunden",
        description: "Der Text wurde erfolgreich geladen.",
      });
    }, 1500);
  };

  // Process the photo after it's captured
  const processPhoto = (dataUrl: string) => {
    // This would use OCR to extract text in a real implementation
    toast({
      title: "Verarbeite Foto",
      description: "Das Foto wird verarbeitet...",
    });
    
    // For demonstration purposes, we'll use a simulated response
    console.log("Foto wird verarbeitet:", dataUrl.substring(0, 50) + "...");
    
    setTimeout(() => {
      setOriginalText("Text erkannt aus dem Foto: Dies ist ein Beispieltext, der aus dem Foto extrahiert wurde. In einer vollständigen Implementierung würde hier der tatsächlich erkannte Text stehen.");
      toast({
        title: "Fertig",
        description: "Der Text wurde aus dem Foto extrahiert.",
      });
    }, 2000);
  };
  
  // Effects
  useEffect(() => {
    // Cleanup when component unmounts
    return () => {
      if (cameraActive) {
        stopCamera();
      }
    };
  }, [cameraActive]);
  
  // Process photo when photoSource changes
  useEffect(() => {
    if (photoSource) {
      processPhoto(photoSource);
    }
  }, [photoSource]);

  useEffect(() => {
    if (cameraActive) {
      startCamera();
    }
  }, [cameraActive]);

  return (
    <div className="flex flex-col space-y-6">
      {/* Dialog for auto lookup */}
      <Dialog open={isAutoLookupModalOpen} onOpenChange={setIsAutoLookupModalOpen}>
        <DialogContent className="bg-card border-muted">
          <DialogHeader>
            <DialogTitle>Text automatisch suchen</DialogTitle>
            <DialogDescription>
              Gib Informationen über den Text ein, um ihn automatisch zu finden.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Titel</Label>
              <Input 
                value={autoLookupInfo.title}
                onChange={(e) => setAutoLookupInfo({...autoLookupInfo, title: e.target.value})}
                placeholder="z.B. Der Schimmelreiter"
                className="bg-background border-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Autor</Label>
              <Input 
                value={autoLookupInfo.author}
                onChange={(e) => setAutoLookupInfo({...autoLookupInfo, author: e.target.value})}
                placeholder="z.B. Theodor Storm"
                className="bg-background border-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Erscheinungsjahr</Label>
              <Input 
                value={autoLookupInfo.year}
                onChange={(e) => setAutoLookupInfo({...autoLookupInfo, year: e.target.value})}
                placeholder="z.B. 1888"
                className="bg-background border-input"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAutoLookupModalOpen(false)}>
              Abbrechen
            </Button>
            <Button className="bg-primary text-primary-foreground" onClick={handleAutoLookup}>
              <Search className="h-4 w-4 mr-2" />
              Suchen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Camera Dialog */}
      <Dialog open={cameraActive} onOpenChange={setCameraActive}> 
        <DialogContent className="bg-card border-muted max-w-screen-sm">
          <DialogHeader>
            <DialogTitle>Foto aufnehmen</DialogTitle>
            <DialogDescription>
              Halte den Text gerade und gut beleuchtet für optimale Ergebnisse.
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative overflow-hidden rounded-lg bg-black aspect-video">
            <video 
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCameraActive(false)}>
              Abbrechen
            </Button>
            <Button className="bg-primary text-primary-foreground" onClick={capturePhoto}>
              <Camera className="h-4 w-4 mr-2" />
              Foto aufnehmen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Logo and Header Section */}
      <div className="flex items-center mb-8">
        <div className="h-8 w-8 rounded-full perplexity-gradient mr-3 flex items-center justify-center">
          <FileText className="h-4 w-4 text-white" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground">AH Writer V3</h1>
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
            
            <div className="flex flex-col space-y-4">
              {/* Text Type Selector */}
              <div className="w-full">
                <Label className="text-sm text-muted-foreground mb-2 block">Textart</Label>
                <Select value={selectedTextType} onValueChange={(value) => setSelectedTextType(value as TextType)}>
                  <SelectTrigger className="w-full bg-background border-input">
                    <SelectValue placeholder="Wähle eine Textart" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inhaltsangabe">Inhaltsangabe</SelectItem>
                    <SelectItem value="Charakterisierung">Charakterisierung</SelectItem>
                    <SelectItem value="Literarische Analyse">Literarische Analyse</SelectItem>
                    <SelectItem value="Gedichtanalyse">Gedichtanalyse</SelectItem>
                    <SelectItem value="Sachtextanalyse">Sachtextanalyse</SelectItem>
                    <SelectItem value="Erörterung">Erörterung</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-4 items-start">
                <div className="flex flex-wrap gap-2 w-full">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-muted-foreground hover:text-foreground flex items-center"
                    onClick={handleUpload}
                    disabled={isUploading}
                  >
                    {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                    Datei
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-muted-foreground hover:text-foreground flex items-center"
                    onClick={() => setIsAutoLookupModalOpen(true)}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Suchen
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-muted-foreground hover:text-foreground flex items-center"
                    onClick={() => setCameraActive(true)}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Foto
                  </Button>
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden"
                  accept=".txt,.doc,.docx,.pdf"
                  onChange={handleFileChange}
                />
                
                <Input 
                  className="w-full bg-background border-input"
                  placeholder="Optionale Informationen (Autor, Titel, Jahr, etc.)"
                  value={textInfo}
                  onChange={(e) => setTextInfo(e.target.value)}
                />
              </div>
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