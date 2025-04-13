import { Template } from "@shared/schema";

export const templates: Template[] = [
  {
    id: 1,
    name: "Inhaltsangabe (Standard)",
    description: "Klassische Inhaltsangabe für literarische Texte und Sachtexte",
    details: {
      structure: [
        "Einleitung mit Basisinformationen",
        "Hauptteil mit chronologischer Zusammenfassung",
        "Schluss mit Kernaussage/Intention"
      ],
      guidelines: [
        "Sachlicher, neutraler Stil",
        "Verwendung des Präsens",
        "Keine wörtliche Rede",
        "Keine persönliche Meinung"
      ],
      examples: [
        "In seinem Roman 'Der Prozess' (1925) erzählt Franz Kafka die Geschichte eines Mannes, der ohne ersichtlichen Grund verhaftet wird."
      ],
      timeForm: "Präsens"
    },
    category: "allgemein"
  },
  {
    id: 2,
    name: "Literarische Analyse",
    description: "Detaillierte Analyse literarischer Texte mit Fokus auf Erzähltechnik",
    details: {
      structure: [
        "Einleitung mit Textinformationen",
        "Analyse von Erzählperspektive, Charakteren und Handlung",
        "Untersuchung von Stil und sprachlichen Mitteln",
        "Interpretation der Themen und Motive",
        "Fazit zur Bedeutung des Werks"
      ],
      guidelines: [
        "Tiefgehende Analyse der Erzähltechnik",
        "Textbelege durch Zitate",
        "Berücksichtigung des historischen Kontexts",
        "Analytischer, sachlicher Stil"
      ],
      examples: [
        "Kafka verwendet in 'Die Verwandlung' eine personale Erzählperspektive, die es ermöglicht, die Isolation der Hauptfigur zu verdeutlichen."
      ],
      timeForm: "Präsens"
    },
    category: "literatur"
  },
  {
    id: 3,
    name: "Charakterisierung",
    description: "Analyse von Figuren in literarischen Texten",
    details: {
      structure: [
        "Einleitung mit Basisinformationen zur Figur",
        "Beschreibung äußerer Merkmale",
        "Analyse von Verhaltensweisen und Charakter",
        "Untersuchung der Beziehungen zu anderen Figuren",
        "Entwicklung der Figur im Verlauf der Handlung",
        "Fazit zur Bedeutung der Figur"
      ],
      guidelines: [
        "Sachliche Darstellung",
        "Verwendung von Textbelegen",
        "Präsens als Zeitform",
        "Berücksichtigung direkter und indirekter Charakterisierung"
      ],
      examples: [
        "Gregor Samsa zeichnet sich durch sein pflichtbewusstes Verhalten aus, das sich in seiner langjährigen Arbeit als Handlungsreisender zeigt."
      ],
      timeForm: "Präsens"
    },
    category: "literatur"
  },
  {
    id: 4,
    name: "Gedichtanalyse",
    description: "Strukturierte Analyse von Gedichten",
    details: {
      structure: [
        "Einleitung mit formalen Informationen",
        "Analyse der Form (Strophen, Verse, Reimschema)",
        "Untersuchung der sprachlichen Mittel",
        "Analyse des lyrischen Ichs",
        "Interpretation des Gedichts",
        "Fazit zur Aussage des Gedichts"
      ],
      guidelines: [
        "Berücksichtigung von Form und Inhalt",
        "Analyse von Metrik und Rhythmus",
        "Untersuchung sprachlicher Bilder",
        "Berücksichtigung des historischen Kontexts"
      ],
      examples: [
        "In Goethes Gedicht 'Erlkönig' (1782) wird durch den durchgehenden Trochäus ein bedrohlicher Rhythmus erzeugt, der die unheimliche Atmosphäre unterstreicht."
      ],
      timeForm: "Präsens"
    },
    category: "lyrik"
  },
  {
    id: 5,
    name: "Sachtextanalyse",
    description: "Analyse von Sachtexten und argumentativen Texten",
    details: {
      structure: [
        "Einleitung mit Textinformationen",
        "Bestimmung der Textsorte",
        "Analyse der Struktur und des Aufbaus",
        "Untersuchung der Argumentation",
        "Analyse sprachlicher Mittel",
        "Fazit zur Intention des Autors"
      ],
      guidelines: [
        "Sachlicher Stil",
        "Berücksichtigung der Adressaten",
        "Analyse der Argumentationsstruktur",
        "Untersuchung der Überzeugungsmittel"
      ],
      examples: [
        "In seinem Essay argumentiert der Autor hauptsächlich mit Statistiken und Expertenmeinungen, um seine Position zu untermauern."
      ],
      timeForm: "Präsens"
    },
    category: "sachtexte"
  }
];
