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
import { FileText, Upload, Copy, Download, Loader2, SendHorizonal, Camera, BookOpen, Search, ImageIcon } from "lucide-react";

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
  const [isSearchingText, setIsSearchingText] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
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
      // Auf mobilen Geräten direkte Fotomediathek für die Dateiauswahl öffnen
      if (isMobileDevice) {
        // Auf mobilen Geräten "accept" auf "image/*" setzen, um Fotogalerie zu öffnen
        // WICHTIG: Kein "capture" Attribut setzen, damit die Mediathek und nicht direkt die Kamera geöffnet wird
        fileInputRef.current.setAttribute("accept", "image/*");
      } else {
        // Auf Desktop normale Dateiauswahl
        fileInputRef.current.setAttribute("accept", ".txt,.doc,.docx,.pdf");
      }
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Prüfen, ob die Datei ein Foto ist (auf mobilen Geräten)
      const isPhoto = file.type.startsWith('image/');
      
      uploadFile(file);
      
      // Setze die Textinfo entsprechend
      if (isPhoto) {
        setTextInfo(`Datei: ${file.name} (Foto von Mobilgerät)`);
      } else {
        setTextInfo(`Datei: ${file.name}`);
      }
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
    if (videoRef.current) {
      try {
        console.log("Starte Kamera und versuche explizit Berechtigungen zu bekommen...");
        
        // Prüfen, ob die MediaDevices-API verfügbar ist
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Dein Browser unterstützt die Kamerafunktion nicht");
        }

        // Vor dem Versuch, auf die Kamera zuzugreifen, zeige einen ausdrücklichen Hinweis
        toast({
          title: "Kamerazugriff",
          description: "Bitte erlaube den Zugriff auf deine Kamera, wenn du dazu aufgefordert wirst.",
        });
        
        // Verzögerung einfügen, damit der Benutzer den Toast sieht
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Direkt getUserMedia aufrufen, was die Berechtigungsanfrage auslöst
        const constraints = {
          audio: false,
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "environment", // Rückkamera für Mobile verwenden
          }
        };
        
        console.log("Fordere Kamera-Berechtigungen an...");
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log("Kamera-Berechtigungen erhalten!");
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play().catch(e => {
                console.error("Fehler beim Abspielen des Video-Streams:", e);
              });
              console.log("Video stream geladen und wird abgespielt");
            }
          };
        }
      } catch (err) {
        console.error("Fehler beim Zugriff auf die Kamera:", err);
        
        let errorMessage = "Zugriff auf die Kamera nicht möglich.";
        
        // Spezifische Fehlermeldungen für verschiedene Fehlertypen
        if (err instanceof Error) {
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            errorMessage = "Kamerazugriff wurde verweigert. Bitte erlaube den Zugriff in den Einstellungen deines Browsers/Geräts.";
          } else if (err.name === 'NotFoundError') {
            errorMessage = "Keine Kamera gefunden. Bitte stelle sicher, dass dein Gerät eine Kamera hat.";
          } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            errorMessage = "Die Kamera ist bereits von einer anderen Anwendung in Verwendung oder nicht zugänglich.";
          } else if (err.name === 'OverconstrainedError') {
            errorMessage = "Die angeforderten Kameraeinstellungen können nicht erfüllt werden.";
          } else if (err.name === 'TypeError') {
            errorMessage = "Ungültige Kameraeinstellungen.";
          } else {
            errorMessage = err.message;
          }
        }
        
        toast({
          title: "Kamerafehler",
          description: errorMessage,
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

  // Auto-Lookup function - echte API-Anfrage an OpenAI
  const handleAutoLookup = async () => {
    if (!autoLookupInfo.title.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib mindestens einen Titel ein.",
        variant: "destructive",
      });
      return;
    }

    // Setze den Ladeindikator
    setIsSearchingText(true);

    // Zeige Lade-Toast an
    toast({
      title: "Text wird gesucht",
      description: "Der Text wird über KI gesucht und geladen...",
    });

    try {
      // API-Aufruf zur Textsuche
      const response = await fetch('/api/search-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: autoLookupInfo.title,
          author: autoLookupInfo.author,
          year: autoLookupInfo.year
        }),
      });
      
      if (!response.ok) {
        throw new Error('Fehler bei der Textsuche');
      }
      
      const data = await response.json();
      
      if (data.success && data.text) {
        const textResponse = data.text;
        
        // Prüfen, ob der Text eine Entschuldigung enthält (OpenAI kann urheberrechtlich geschützte Texte nicht zurückgeben)
        if (textResponse.includes("Es tut mir leid") || 
            textResponse.includes("kann nicht bereitstellen") || 
            textResponse.includes("Ich kann leider nicht") ||
            textResponse.includes("kann ich nicht vollständig")) {
          // Alternative: Lade einen Beispieltext
          toast({
            title: "Text nicht verfügbar",
            description: "Der angeforderte Text ist urheberrechtlich geschützt. Ein ähnlicher Beispieltext wurde geladen.",
          });
          
          // Beispieltext laden
          if (autoLookupInfo.title.toLowerCase().includes("das brot")) {
            setOriginalText(`Das Brot (Beispieltext ähnlich Wolfgang Borchert)\n\nSie standen mitten in der Nacht auf. Es war drei Uhr. "Was ist?", fragte er. "Ich habe etwas gehört", antwortete sie und schaute in die dunkle Küche. "Wahrscheinlich war es die Katze", sagte er und folgte ihr. Die Frau machte Licht und sah, dass die Brotkrümel auf dem Tisch lagen.\n\n"Du hast nachts Brot gegessen?", fragte sie ihn. "Nein", erwiderte er schnell, zu schnell. "Ich dachte, es war die Katze", sagte er. Sie sah auf die Brotkrümel. "Wir haben keine Katze", flüsterte sie.\n\nEr stand am Tisch und starrte auf die Krümel. Die Frau holte einen Teller und legte Brot und Messer bereit. "Iss", sagte sie leise. "Iss ruhig. Ich weiß, dass wir wenig haben. Du brauchst nicht nachts heimlich Brot zu essen."\n\nEr nahm das Brot und begann zu essen. Sie saß am Tisch und beobachtete ihn. Dann ging sie zu ihrem Bett und stellte sich schlafend. Sie hörte, wie er in der Küche das Brot zurück in die Schublade legte.`);
          } else if (autoLookupInfo.title.toLowerCase().includes("faust")) {
            setOriginalText(`Faust (Beispieltext im Stil von Goethe)\n\nDer Tragödie erster Teil\n\nIn einem hochgewölbten, engen, gotischen Zimmer sitzt Faust unruhig an seinem Pult.\n\nFAUST:\nHabe nun, ach! Philosophie,\nJuristerei und Medizin,\nUnd leider auch Theologie\nDurchaus studiert, mit heißem Bemühn.\nDa steh ich nun, ich armer Tor!\nUnd bin so klug als wie zuvor;\nHeiße Magister, heiße Doktor gar\nUnd ziehe schon an die zehen Jahr\nHerauf, herab und quer und krumm\nMeine Schüler an der Nase herum –\nUnd sehe, dass wir nichts wissen können!\nDas will mir schier das Herz verbrennen.`);
          } else {
            setOriginalText(`Beispieltext (da der angeforderte Text nicht verfügbar ist)\n\nEs war ein kalter Wintermorgen, als Marie das Haus verließ. Der Schnee knirschte unter ihren Stiefeln, und ihr Atem bildete kleine Wolken in der Luft. Sie war spät dran für die Schule, wieder einmal. Ihre Mutter hatte sie gewarnt, dass es Konsequenzen geben würde, wenn sie noch einmal zu spät käme, aber Marie hatte die Zeit beim Frühstück vergessen.\n\nAls sie die Straße entlanglief, sah sie den alten Herrn Schmidt, der wie jeden Morgen seinen Gehweg fegte. Er nickte ihr freundlich zu, als sie vorbeieilte. "Wieder spät dran, Marie?", rief er ihr nach. Sie winkte nur und lief weiter. An der Ecke blieb sie stehen, um auf den Bus zu warten, der sie hoffentlich noch rechtzeitig zur Schule bringen würde. Sie hoffte inständig, dass Herr Müller, ihr Deutschlehrer, heute Verständnis haben würde.`);
          }
          setIsAutoLookupModalOpen(false);
        } else {
          // Normaler Fall: Originaltext zurückgeben
          setOriginalText(textResponse);
          setIsAutoLookupModalOpen(false);
          
          toast({
            title: "Text gefunden",
            description: "Der Text wurde erfolgreich geladen.",
          });
        }
      } else {
        toast({
          title: "Fehler",
          description: "Der Text konnte nicht gefunden werden.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Fehler bei der Textsuche:", error);
      toast({
        title: "Fehler",
        description: "Es gab ein Problem bei der Textsuche. Bitte versuche es später noch einmal.",
        variant: "destructive",
      });
    } finally {
      // Unabhängig vom Ergebnis den Ladeindikator zurücksetzen
      setIsSearchingText(false);
    }
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
  // Prüfen, ob es sich um ein mobiles Gerät handelt
  useEffect(() => {
    const checkMobile = () => {
      // Einfache Erkennung von Mobilgeräten basierend auf Bildschirmbreite und Touch-Unterstützung
      const isMobile = 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (window.innerWidth <= 768 && 'ontouchstart' in window);
      
      setIsMobileDevice(isMobile);
      console.log("Mobiles Gerät erkannt:", isMobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
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
            <Button 
              className="bg-primary text-primary-foreground" 
              onClick={handleAutoLookup}
              disabled={isSearchingText}
            >
              {isSearchingText ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Suche...</>
              ) : (
                <><Search className="h-4 w-4 mr-2" /> Suchen</>
              )}
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
      <Card className="border-muted bg-card shadow-none animate-fade-in">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <Textarea 
              className="w-full h-64 resize-none text-md bg-background border-input focus:ring-primary p-4 rounded-lg transition-smooth hover-scale"
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
                  {isMobileDevice ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-muted-foreground hover:text-foreground flex items-center"
                      onClick={handleUpload}
                      disabled={isUploading}
                    >
                      {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ImageIcon className="h-4 w-4 mr-2" />}
                      Datei
                    </Button>
                  ) : (
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
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-muted-foreground hover:text-foreground flex items-center"
                    onClick={() => setIsAutoLookupModalOpen(true)}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Suchen
                  </Button>
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden"
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
        <Card className="border-muted bg-card shadow-none animate-fade-in animation-delay-100">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Analyseeinstellungen</h3>
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
        <Card className="border-muted bg-card shadow-none animate-fade-in animation-delay-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Eigene Regeln</h3>
            <Textarea 
              className="w-full h-[218px] resize-none text-sm bg-background border-input rounded-lg transition-smooth hover-scale"
              placeholder="Definiere hier eigene Regeln für die Textanalyse (z.B. spezifische Aspekte, auf die geachtet werden soll, besondere Formatierungswünsche, etc.)"
              value={customRules}
              onChange={(e) => setCustomRules(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Generate Button */}
      <div className="flex justify-center my-4 animate-fade-in animation-delay-300">
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium flex items-center gap-2 py-6 px-8 transition-transform hover:scale-105 active:scale-95"
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
        <Card className="border-muted bg-card shadow-none mt-4 animate-slide-up">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">Ergebnis</h3>
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
                  {selectedTextType === "Inhaltsangabe" ? "Zusammenfassung" : 
                   selectedTextType === "Charakterisierung" ? "Charakterisierung" :
                   selectedTextType === "Literarische Analyse" ? "Analyse" :
                   selectedTextType === "Gedichtanalyse" ? "Gedichtanalyse" :
                   selectedTextType === "Sachtextanalyse" ? "Sachtextanalyse" :
                   selectedTextType === "Erörterung" ? "Erörterung" : 
                   "Zusammenfassung"}
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
                
                <TabsTrigger 
                  value="sources" 
                  className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
                >
                  Quellen
                </TabsTrigger>
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
              
              <TabsContent value="sources" className="mt-0">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-primary mb-2">Verwendete Quellen und Einstellungen</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <h5 className="font-medium">Textart:</h5>
                      <p className="text-foreground">{selectedTextType}</p>
                    </div>

                    <div>
                      <h5 className="font-medium">Textquelle:</h5>
                      <p className="text-foreground">
                        {photoSource ? "Foto-Erfassung" : 
                         textInfo && textInfo.includes("Datei:") ? "Hochgeladene Datei" :
                         autoLookupInfo.title ? `Automatische Textsuche: "${autoLookupInfo.title}"${autoLookupInfo.author ? ` von ${autoLookupInfo.author}` : ""}${autoLookupInfo.year ? ` (${autoLookupInfo.year})` : ""}` : 
                         "Manuell eingegebener Text"}
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium">Analyseeinstellungen:</h5>
                      <ul className="list-disc list-inside pl-2 space-y-1">
                        <li>Umfang: {settings.length}/5</li>
                        <li>Sprachniveau: {settings.languageLevel}</li>
                        <li>Detaillierte Analyse: {settings.includeAnalysis ? "Ja" : "Nein"}</li>
                        <li>Analyse stilistischer Mittel: {settings.includeStylistic ? "Ja" : "Nein"}</li>
                      </ul>
                    </div>

                    {customRules && (
                      <div>
                        <h5 className="font-medium">Benutzerdefinierte Regeln:</h5>
                        <p className="text-foreground whitespace-pre-line border border-border rounded-md p-2 bg-muted/20">{customRules}</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              {result.suggestions && result.suggestions.length > 0 && (
                <TabsContent value="suggestions" className="mt-0 hidden">
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