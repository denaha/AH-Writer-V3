export default function StepByStepGuide() {
  return (
    <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
      <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        Schritt-für-Schritt Anleitung
      </h2>
      
      <div className="space-y-4">
        <div className="flex">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">1</div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-primary">Einleitung schreiben</h3>
            <p className="text-sm text-secondary mt-1">Beginne mit den formalen Angaben zum Werk: Autor, Titel, Erscheinungsjahr und Textsorte. Füge einen einleitenden Satz zum Inhalt hinzu.</p>
          </div>
        </div>
        
        <div className="flex">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">2</div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-primary">Hauptteil verfassen</h3>
            <p className="text-sm text-secondary mt-1">Fasse die Handlung sachlich, chronologisch und im Präsens zusammen. Konzentriere dich auf die wichtigsten Ereignisse und verzichte auf unwichtige Details.</p>
          </div>
        </div>
        
        <div className="flex">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">3</div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-primary">Schluss formulieren</h3>
            <p className="text-sm text-secondary mt-1">Gehe auf die zentrale Aussage oder Intention des Textes ein. Beende die Inhaltsangabe ohne persönliche Wertung oder Meinung.</p>
          </div>
        </div>
        
        <div className="flex">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">4</div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-primary">Überprüfen und korrigieren</h3>
            <p className="text-sm text-secondary mt-1">Überprüfe deine Inhaltsangabe auf sachlichen Stil, korrekte Zeitform und angemessene Länge. Achte auf klare, präzise Formulierungen.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
