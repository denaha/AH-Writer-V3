import { useState } from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { Template, Worksheet } from "@shared/schema";
import { LanguageLevel } from "@shared/types";
import { Skeleton } from "@/components/ui/skeleton";

interface ControlPanelProps {
  selectedTemplate: number;
  setSelectedTemplate: (id: number) => void;
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

export default function ControlPanel({
  selectedTemplate,
  setSelectedTemplate,
  settings,
  setSettings
}: ControlPanelProps) {
  const { data: templates, isLoading: templatesLoading } = useQuery<Template[]>({
    queryKey: ['/api/templates']
  });
  
  const { data: worksheets, isLoading: worksheetsLoading } = useQuery<Worksheet[]>({
    queryKey: ['/api/worksheets'] 
  });
  
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTemplate(parseInt(e.target.value));
  };
  
  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      length: parseInt(e.target.value)
    });
  };
  
  const setLanguageLevel = (level: LanguageLevel) => {
    setSettings({
      ...settings,
      languageLevel: level
    });
  };
  
  const selectedTemplateDetails = templates?.find(t => t.id === selectedTemplate)?.details as any;
  
  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-primary">Vorlage auswählen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="relative">
              {templatesLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <select 
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:border-accent focus:ring focus:ring-accent focus:ring-opacity-50 rounded-md"
                  value={selectedTemplate}
                  onChange={handleTemplateChange}
                >
                  {templates?.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium text-secondary mb-2">Vorlagendetails:</h3>
            {templatesLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <div className="text-sm text-secondary">
                {selectedTemplateDetails && selectedTemplateDetails.structure?.map((item: string, index: number) => (
                  <p key={index}>• {item}</p>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-primary">Einstellungen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-secondary mb-1">Umfang</Label>
              <div className="flex items-center">
                <span className="text-xs text-secondary">Kurz</span>
                <input 
                  type="range" 
                  className="mx-2 flex-grow" 
                  min="1" 
                  max="5" 
                  value={settings.length}
                  onChange={handleLengthChange}
                />
                <span className="text-xs text-secondary">Detailliert</span>
              </div>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-secondary mb-1">Sprachniveau</Label>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setLanguageLevel('A1-A2')}
                  className={`px-3 py-1 text-xs ${settings.languageLevel === 'A1-A2' ? 'bg-accent text-white' : 'border border-accent text-accent'} rounded-full`}
                >
                  A1-A2
                </button>
                <button
                  onClick={() => setLanguageLevel('B1-B2')}
                  className={`px-3 py-1 text-xs ${settings.languageLevel === 'B1-B2' ? 'bg-accent text-white' : 'border border-accent text-accent'} rounded-full`}
                >
                  B1-B2
                </button>
                <button
                  onClick={() => setLanguageLevel('C1-C2')}
                  className={`px-3 py-1 text-xs ${settings.languageLevel === 'C1-C2' ? 'bg-accent text-white' : 'border border-accent text-accent'} rounded-full`}
                >
                  C1-C2
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-analysis" 
                checked={settings.includeAnalysis}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    includeAnalysis: checked as boolean
                  })
                }
              />
              <Label htmlFor="include-analysis" className="text-sm text-secondary">
                Textanalyse einschließen
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-stylistic" 
                checked={settings.includeStylistic}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    includeStylistic: checked as boolean
                  })
                }
              />
              <Label htmlFor="include-stylistic" className="text-sm text-secondary">
                Stilistische Mittel hervorheben
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-primary">Hilfsressourcen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {worksheetsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : (
              worksheets?.map(worksheet => (
                <a 
                  key={worksheet.id}
                  href={`/worksheets/${worksheet.id}`} 
                  className="flex items-center text-accent hover:text-primary"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{worksheet.title}</span>
                </a>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
