import { useState } from "react";
import ControlPanel from "@/components/ControlPanel";
import TextProcessingArea from "@/components/TextProcessingArea";
import { LanguageLevel } from "@shared/types";

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1);
  const [settings, setSettings] = useState<{
    length: number;
    languageLevel: LanguageLevel;
    includeAnalysis: boolean;
    includeStylistic: boolean;
  }>({
    length: 3,
    languageLevel: 'B1-B2',
    includeAnalysis: true,
    includeStylistic: false,
  });

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-primary">Inhaltsangabe & Zusammenfassung</h1>
        <p className="text-secondary mt-1">Analysiere und fasse deutsche Texte nach akademischen Standards zusammen</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ControlPanel 
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          settings={settings}
          setSettings={setSettings}
        />
        <TextProcessingArea 
          templateId={selectedTemplate}
          settings={settings}
        />
      </div>
    </>
  );
}
