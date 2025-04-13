import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Guide() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-primary">Leitfaden zur Textanalyse</h1>
        <p className="text-secondary mt-1">Hilfreiche Tipps und Anleitungen für die Erstellung verschiedener Textanalysen</p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-primary mb-4">Grundlagen der Inhaltsangabe</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="what-is-inhaltsangabe">
              <AccordionTrigger className="text-left font-medium">Was ist eine Inhaltsangabe?</AccordionTrigger>
              <AccordionContent className="text-secondary">
                <p className="mb-2">Eine Inhaltsangabe ist eine sachliche, knappe Zusammenfassung eines Textes. Sie gibt die wichtigsten Handlungsschritte und die zentrale Aussage oder Intention des Textes wieder, ohne ihn zu bewerten.</p>
                <p>Im Gegensatz zu einer Nacherzählung verzichtet eine Inhaltsangabe auf ausschmückende Details und wird im Präsens (Gegenwartsform) verfasst.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="structure">
              <AccordionTrigger className="text-left font-medium">Aufbau einer Inhaltsangabe</AccordionTrigger>
              <AccordionContent className="text-secondary">
                <ol className="list-decimal list-inside space-y-2">
                  <li><strong>Einleitung:</strong> Enthält die wichtigsten Informationen zum Text (Autor, Titel, Erscheinungsjahr, Textsorte) und einen kurzen Überblick über das Thema oder den Inhalt.</li>
                  <li><strong>Hauptteil:</strong> Fasst die Handlung in chronologischer Reihenfolge zusammen. Wichtige Ereignisse werden dargestellt, unwichtige Details weggelassen.</li>
                  <li><strong>Schluss:</strong> Nennt die zentrale Aussage oder Intention des Textes, ohne persönliche Bewertung.</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="language">
              <AccordionTrigger className="text-left font-medium">Sprachliche Merkmale</AccordionTrigger>
              <AccordionContent className="text-secondary">
                <ul className="list-disc list-inside space-y-1">
                  <li>Verwendung des Präsens (Gegenwartsform)</li>
                  <li>Sachlicher, neutraler Stil ohne wertende Adjektive</li>
                  <li>Keine wörtliche Rede (stattdessen indirekte Rede)</li>
                  <li>Keine persönliche Meinung oder Wertung</li>
                  <li>Klare, präzise Formulierungen</li>
                  <li>Drittperson-Perspektive (er/sie/es)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="common-mistakes">
              <AccordionTrigger className="text-left font-medium">Häufige Fehler vermeiden</AccordionTrigger>
              <AccordionContent className="text-secondary">
                <ul className="list-disc list-inside space-y-1">
                  <li>Zu detaillierte Darstellung oder zu starke Verkürzung</li>
                  <li>Verwendung von Vergangenheitsformen statt Präsens</li>
                  <li>Einbau wörtlicher Rede oder Zitate ohne Umformulierung</li>
                  <li>Subjektive Bewertungen oder persönliche Meinungen</li>
                  <li>Fehlende Einleitung mit Basisinformationen</li>
                  <li>Unzusammenhängende Darstellung der Handlung</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-primary mb-4">Spezifische Textanalysen</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-primary">Literarische Analyse</CardTitle>
              </CardHeader>
              <CardContent className="text-secondary">
                <p className="mb-2">Eine literarische Analyse untersucht die verschiedenen Elemente eines literarischen Werks:</p>
                <ul className="list-disc list-inside">
                  <li>Erzählperspektive und Erzählsituation</li>
                  <li>Charakterisierung der Figuren</li>
                  <li>Aufbau und Struktur</li>
                  <li>Sprache und Stil</li>
                  <li>Motive und Symbole</li>
                  <li>Thematik und Intention</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-primary">Charakterisierung</CardTitle>
              </CardHeader>
              <CardContent className="text-secondary">
                <p className="mb-2">Eine Charakterisierung beschreibt und analysiert die Eigenschaften einer literarischen Figur:</p>
                <ul className="list-disc list-inside">
                  <li>Äußere Merkmale</li>
                  <li>Charaktereigenschaften und Verhaltensweisen</li>
                  <li>Beziehungen zu anderen Figuren</li>
                  <li>Entwicklung im Verlauf der Handlung</li>
                  <li>Funktionen innerhalb des Textes</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-primary">Gedichtanalyse</CardTitle>
              </CardHeader>
              <CardContent className="text-secondary">
                <p className="mb-2">Eine Gedichtanalyse untersucht formale und inhaltliche Aspekte eines Gedichts:</p>
                <ul className="list-disc list-inside">
                  <li>Form (Strophen, Verse, Reimschema)</li>
                  <li>Metrum und Rhythmus</li>
                  <li>Sprachliche Bilder und rhetorische Mittel</li>
                  <li>Lyrisches Ich und Perspektive</li>
                  <li>Thematik und Motivik</li>
                  <li>Historischer und literarischer Kontext</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-primary">Sachtextanalyse</CardTitle>
              </CardHeader>
              <CardContent className="text-secondary">
                <p className="mb-2">Eine Sachtextanalyse untersucht die Struktur und Argumentationsweise eines Sachtextes:</p>
                <ul className="list-disc list-inside">
                  <li>Textsorte und Textfunktion</li>
                  <li>Aufbau und Gliederung</li>
                  <li>Argumentationsstruktur</li>
                  <li>Sprachliche Mittel und Stilebene</li>
                  <li>Adressatenbezug</li>
                  <li>Intention des Verfassers</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-primary mb-4">Sprachniveaus</h2>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-primary">A1-A2 (Anfänger)</CardTitle>
              </CardHeader>
              <CardContent className="text-secondary">
                <p className="mb-2">Merkmale:</p>
                <ul className="list-disc list-inside mb-3">
                  <li>Einfache, kurze Sätze</li>
                  <li>Grundlegender Wortschatz</li>
                  <li>Klare Struktur</li>
                  <li>Vermeidung komplexer grammatikalischer Strukturen</li>
                </ul>
                <p className="mb-1">Beispiel:</p>
                <p className="italic">In dem Text geht es um einen Mann. Er heißt Gregor. Er wird zu einem Käfer. Seine Familie mag ihn nicht mehr. Am Ende stirbt er.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-primary">B1-B2 (Mittelstufe)</CardTitle>
              </CardHeader>
              <CardContent className="text-secondary">
                <p className="mb-2">Merkmale:</p>
                <ul className="list-disc list-inside mb-3">
                  <li>Komplexere Satzstrukturen mit Nebensätzen</li>
                  <li>Erweiterter Wortschatz mit einigen Fachbegriffen</li>
                  <li>Variierte Satzanfänge</li>
                  <li>Präzisere Ausdrucksweise</li>
                </ul>
                <p className="mb-1">Beispiel:</p>
                <p className="italic">In Franz Kafkas Erzählung "Die Verwandlung" (1915) geht es um einen Mann namens Gregor Samsa, der sich eines Morgens in einen Käfer verwandelt hat. Seine Familie reagiert zunächst mit Schock und später mit Ablehnung auf seine Verwandlung. Nach einer Phase der Isolation stirbt Gregor, woraufhin seine Familie erleichtert ist.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-primary">C1-C2 (Fortgeschritten)</CardTitle>
              </CardHeader>
              <CardContent className="text-secondary">
                <p className="mb-2">Merkmale:</p>
                <ul className="list-disc list-inside mb-3">
                  <li>Differenzierte, komplexe Satzstrukturen</li>
                  <li>Präziser Fachwortschatz</li>
                  <li>Nuancierte Ausdrucksweise</li>
                  <li>Stilistische Varianz</li>
                  <li>Subtile Bedeutungsnuancen</li>
                </ul>
                <p className="mb-1">Beispiel:</p>
                <p className="italic">In Franz Kafkas 1915 veröffentlichter Erzählung "Die Verwandlung" wird die Metamorphose des Protagonisten Gregor Samsa zu einem ungeheuren Insekt als Ausgangspunkt einer existenziellen Krise dargestellt. Die sukzessive Entfremdung zwischen dem Protagonisten und seiner Familie illustriert die gesellschaftliche Isolation des Individuums, das seiner Funktionalität beraubt wird. Mit dem Tod Gregor Samsas kulminiert die Erzählung in einer ambivalenten Auflösung, die die Fragilität sozialer Beziehungen in der modernen Gesellschaft entlarvt.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
