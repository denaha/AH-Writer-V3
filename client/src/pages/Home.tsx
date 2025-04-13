import { useState } from "react";
import { LanguageLevel } from "@shared/types";
import PerplexityAIWriter from "@/components/PerplexityAIWriter";

export default function Home() {
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
    <div className="perplexity-container">
      <PerplexityAIWriter settings={settings} setSettings={setSettings} />
    </div>
  );
}
