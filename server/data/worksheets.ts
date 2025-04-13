import { Worksheet } from "@shared/schema";

export const worksheets: Worksheet[] = [
  {
    id: 1,
    title: "Arbeitsblatt: Inhaltsangabe",
    description: "Leitfaden zur Erstellung einer strukturierten Inhaltsangabe",
    content: {
      sections: [
        {
          title: "Was ist eine Inhaltsangabe?",
          text: "Eine Inhaltsangabe ist eine sachliche und stark gekürzte Wiedergabe eines Textes. Sie informiert über den wesentlichen Inhalt und die zentrale Aussage eines Textes, ohne diesen zu bewerten."
        },
        {
          title: "Aufbau einer Inhaltsangabe",
          items: [
            "Einleitung: Autor, Titel, Erscheinungsjahr, Textsorte, Thema in einem Satz",
            "Hauptteil: Chronologische Zusammenfassung der wichtigsten Handlungsschritte",
            "Schluss: Zentrale Aussage/Intention des Textes"
          ]
        },
        {
          title: "Sprachliche Merkmale",
          items: [
            "Präsens als Zeitform",
            "Sachlicher Stil ohne wertende Adjektive",
            "Keine wörtliche Rede (indirekte Rede verwenden)",
            "Keine unwichtigen Details oder Nebenhandlungen",
            "Keine persönliche Meinung"
          ]
        },
        {
          title: "Nützliche Formulierungen",
          items: [
            "In seinem/ihrem [Textsorte] '[Titel]' ([Jahr]) beschreibt [Autor] ...",
            "Die Handlung spielt in/während ...",
            "Die Hauptfigur ist/handelt ...",
            "Im Mittelpunkt steht ...",
            "Abschließend wird deutlich, dass ...",
            "Der Autor verdeutlicht/kritisiert/stellt dar ..."
          ]
        }
      ],
      exercises: [
        {
          title: "Übung 1: Einleitungssatz",
          task: "Formuliere einen Einleitungssatz für eine Inhaltsangabe zu einem dir bekannten Buch oder Film.",
          example: "In seinem Roman 'Der Vorleser' (1995) erzählt Bernhard Schlink die Geschichte einer ungewöhnlichen Beziehung zwischen einem Jugendlichen und einer älteren Frau in der Nachkriegszeit."
        },
        {
          title: "Übung 2: Zeitform",
          task: "Wandle folgende Sätze ins Präsens um.",
          examples: [
            "Original: 'Er hatte keine Ahnung, was geschehen war.' → Präsens: 'Er hat keine Ahnung, was geschehen ist.'",
            "Original: 'Sie waren glücklich zusammen gewesen.' → Präsens: 'Sie sind glücklich zusammen.'"
          ]
        }
      ]
    },
    category: "basis"
  },
  {
    id: 2,
    title: "Checkliste für Inhaltsangaben",
    description: "Überprüfe deine Inhaltsangabe anhand dieser Kriterien",
    content: {
      sections: [
        {
          title: "Formale Kriterien",
          items: [
            "Einleitung enthält alle notwendigen Basisinformationen (Autor, Titel, Jahr, Textsorte)",
            "Sachlicher, wertneutraler Stil ohne persönliche Meinung",
            "Durchgehende Verwendung des Präsens",
            "Keine wörtliche Rede",
            "Angemessene Länge (ca. 1/3 des Originaltextes)"
          ]
        },
        {
          title: "Inhaltliche Kriterien",
          items: [
            "Alle wichtigen Handlungsschritte sind enthalten",
            "Unwichtige Details wurden weggelassen",
            "Chronologische Darstellung der Handlung",
            "Sachlicher, neutraler Ton",
            "Zentrale Aussage/Intention des Textes wird im Schluss benannt"
          ]
        },
        {
          title: "Sprachliche Kriterien",
          items: [
            "Keine Fehler in Rechtschreibung und Grammatik",
            "Klare, präzise Formulierungen",
            "Angemessene Satzverknüpfungen",
            "Keine Wiederholungen",
            "Fachbegriffe werden korrekt verwendet"
          ]
        }
      ]
    },
    category: "basis"
  },
  {
    id: 3,
    title: "Tipps zum Schreibstil",
    description: "Verbessere den Stil deiner Inhaltsangabe",
    content: {
      sections: [
        {
          title: "Sachlichkeit",
          text: "Eine Inhaltsangabe soll objektiv und neutral sein. Vermeide wertende Adjektive wie 'schön', 'schlecht', 'aufregend' oder 'langweilig'. Beschreibe stattdessen, was tatsächlich passiert."
        },
        {
          title: "Prägnanz",
          text: "Fasse dich kurz und konzentriere dich auf das Wesentliche. Achte darauf, dass deine Inhaltsangabe deutlich kürzer als der Originaltext ist, aber trotzdem alle wichtigen Informationen enthält."
        },
        {
          title: "Satzverknüpfungen",
          items: [
            "Verwende abwechslungsreiche Satzverknüpfungen, um den Text flüssig zu gestalten.",
            "Beispiele: zunächst, daraufhin, anschließend, schließlich, folglich, dabei, letztendlich"
          ]
        },
        {
          title: "Vermeidung von wörtlicher Rede",
          text: "Verwende indirekte Rede anstelle von Zitaten.",
          examples: [
            "Direkt: Sie sagte: 'Ich komme morgen wieder.'",
            "Indirekt: Sie sagt, dass sie am nächsten Tag wiederkommen werde."
          ]
        }
      ],
      examples: [
        {
          title: "Beispiel für gelungene Formulierungen",
          text: "In Franz Kafkas Erzählung 'Die Verwandlung' (1915) wird die Geschichte eines jungen Mannes geschildert, der sich eines Morgens in einen Käfer verwandelt. Der Protagonist Gregor Samsa versucht zunächst, seine Verwandlung zu verbergen. Seine Familie reagiert mit Entsetzen auf seine neue Gestalt. Im Laufe der Zeit wird Gregor zunehmend von seiner Familie isoliert und vernachlässigt. Schließlich stirbt er einsam in seinem Zimmer, woraufhin seine Familie Erleichterung empfindet und hoffnungsvoll in die Zukunft blickt."
        }
      ]
    },
    category: "fortgeschritten"
  },
  {
    id: 4,
    title: "Akademische Formulierungen",
    description: "Erweitere deinen Wortschatz für Textanalysen",
    content: {
      sections: [
        {
          title: "Nützliche Verben",
          items: [
            "darstellen, schildern, beschreiben, erläutern, erklären",
            "analysieren, untersuchen, betrachten, verdeutlichen",
            "argumentieren, diskutieren, erörtern, abwägen",
            "kritisieren, hinterfragen, bezweifeln, widerlegen",
            "schlussfolgern, resümieren, zusammenfassen"
          ]
        },
        {
          title: "Einleitungsformulierungen",
          items: [
            "In seinem/ihrem [Textsorte] '[Titel]' ([Jahr]) thematisiert [Autor] ...",
            "[Autor] beschäftigt sich in [Textsorte] mit der Frage/dem Thema ...",
            "Der vorliegende Text stammt aus ... und handelt von ...",
            "Im Mittelpunkt des [Textsorte] steht die Problematik ..."
          ]
        },
        {
          title: "Überleitungen",
          items: [
            "Im Folgenden wird dargestellt, wie ...",
            "Anschließend entwickelt sich ...",
            "Diese Situation führt dazu, dass ...",
            "Daraus ergibt sich ...",
            "Im Kontrast dazu steht ..."
          ]
        },
        {
          title: "Schlussformulierungen",
          items: [
            "Abschließend macht der Autor deutlich, dass ...",
            "Die zentrale Aussage des Textes bezieht sich auf ...",
            "Durch den Text wird die Problematik ... verdeutlicht.",
            "Der Autor beabsichtigt mit seinem Text ..."
          ]
        }
      ],
      levels: [
        {
          level: "A1-A2",
          examples: [
            "Der Text handelt von einem Mann, der ein Problem hat.",
            "Die Hauptfigur ist traurig, weil sie allein ist.",
            "Am Ende ist das Problem gelöst."
          ]
        },
        {
          level: "B1-B2",
          examples: [
            "Im vorliegenden Text wird die Geschichte eines jungen Mannes geschildert, der mit verschiedenen Herausforderungen konfrontiert wird.",
            "Die Hauptfigur empfindet Einsamkeit und Verzweiflung aufgrund ihrer sozialen Isolation.",
            "Zum Schluss wird die Problematik gelöst, indem die Figur einen Kompromiss findet."
          ]
        },
        {
          level: "C1-C2",
          examples: [
            "In der Erzählung entfaltet der Autor ein komplexes Geflecht aus inneren Konflikten und gesellschaftlichen Zwängen, denen sich der Protagonist ausgesetzt sieht.",
            "Die vielschichtige Charakterdarstellung der Hauptfigur offenbart eine tiefgreifende existenzielle Krise, die durch soziale Isolation und Entfremdung gekennzeichnet ist.",
            "In der finalen Passage der Narration kulminiert die Handlung in einer ambivalenten Auflösung, die die grundlegende Problematik zwar nicht vollständig negiert, jedoch eine differenzierte Perspektive eröffnet."
          ]
        }
      ]
    },
    category: "fortgeschritten"
  }
];
