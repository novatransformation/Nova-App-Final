import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AudioPlayer } from "@/components/AudioPlayer";
import MusicPause from "@/components/MusicPause";
import MusicPause3 from "@/components/MusicPause3";
import NewSelfManifest from "@/pages/NewSelfManifest";
import { getLoginUrl } from "@/lib/constants";
import { trpc } from "@/lib/trpc";
import { useLocation, useParams } from "wouter";
import { ArrowRight, Check, Sparkles, Loader2, Home, Download, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSwipeable } from "react-swipeable";


// Themenspezifische Beispiele für alle 9 Schritte (inkl. Schattenarbeit)
const THEME_EXAMPLES: Record<string, Record<number, string>> = {
  "Geld & Fülle": {
    1: "Beispiel: 'Ich habe nie genug Geld für die Dinge, die ich brauche.'",
    2: "Beispiel: 'Ich fühle Angst und Unsicherheit, wenn ich an meine finanzielle Situation denke.'",
    3: "Beispiel: 'Ich spüre Enge in meiner Brust und einen Kloß im Hals, wenn ich an Geld denke.'",
    4: "Beispiel: 'Ich vermeide es, meine Rechnungen anzuschauen und Kontoauszüge zu öffnen.'",
    5: "Beispiel: 'Meine Schulden häufen sich immer weiter an und ich verliere den Überblick.'",
    6: "Beispiel: 'Ich brauche finanzielle Sicherheit und Stabilität in meinem Leben.'",
    7: "Beispiel: 'Ich möchte großzügig sein können und anderen helfen.'",
    8: "Beispiel: 'Ich habe Fähigkeiten und Wissen, mit denen ich Geld verdienen kann.'",
    9: "Beispiel: 'Ich möchte denken: Ich habe genug. Ich möchte Dankbarkeit fühlen. Ich möchte bewusst mit Geld umgehen.'"
  },
  "Gesundheit & Vitalität": {
    1: "Beispiel: 'Ich habe keine Zeit für Sport und gesunde Ernährung.'",
    2: "Beispiel: 'Ich fühle Frustration und Enttäuschung über meinen Körper.'",
    3: "Beispiel: 'Ich spüre Müdigkeit und Schwere in meinem ganzen Körper.'",
    4: "Beispiel: 'Ich esse ungesund und bewege mich zu wenig.'",
    5: "Beispiel: 'Meine Energie sinkt immer weiter und ich fühle mich erschlafft.'",
    6: "Beispiel: 'Ich brauche Energie und Lebenskraft für meinen Alltag.'",
    7: "Beispiel: 'Ich möchte meinen Körper respektieren und gut für ihn sorgen.'",
    8: "Beispiel: 'Ich habe die Fähigkeit, gesunde Entscheidungen zu treffen.'",
    9: "Beispiel: 'Ich möchte denken: Mein Körper ist wertvoll. Ich möchte Dankbarkeit fühlen. Ich möchte mich täglich bewegen.'"
  },
  "Emotionen & Gefühle": {
    1: "Beispiel: 'Ich darf meine Gefühle nicht zeigen, sonst bin ich schwach.'",
    2: "Beispiel: 'Ich fühle Scham, wenn ich traurig oder wütend bin.'",
    3: "Beispiel: 'Ich spüre einen Druck auf der Brust, wenn Emotionen hochkommen.'",
    4: "Beispiel: 'Ich unterdrücke meine Gefühle und lenke mich ab.'",
    5: "Beispiel: 'Meine unterdrückten Emotionen brechen irgendwann unkontrolliert aus.'",
    6: "Beispiel: 'Ich brauche emotionale Sicherheit und Akzeptanz.'",
    7: "Beispiel: 'Ich möchte authentisch sein und meine Gefühle ehrlich ausdrücken.'",
    8: "Beispiel: 'Ich habe die Fähigkeit, meine Emotionen wahrzunehmen und zu fühlen.'",
    9: "Beispiel: 'Ich möchte denken: Meine Gefühle sind wertvoll. Ich möchte Akzeptanz fühlen. Ich möchte meine Emotionen zulassen.'"
  },
  "Selbstwert & Identität": {
    1: "Beispiel: 'Ich bin nicht gut genug, egal was ich tue.'",
    2: "Beispiel: 'Ich fühle Scham und Minderwertigkeit.'",
    3: "Beispiel: 'Ich spüre ein Leeregefühl in meiner Brust.'",
    4: "Beispiel: 'Ich vergleiche mich ständig mit anderen und finde mich schlechter.'",
    5: "Beispiel: 'Ich traue mir nichts zu und bleibe unter meinen Möglichkeiten.'",
    6: "Beispiel: 'Ich brauche Anerkennung und das Gefühl, wertvoll zu sein.'",
    7: "Beispiel: 'Ich möchte mich selbst annehmen und respektieren.'",
    8: "Beispiel: 'Ich habe einzigartige Stärken und Talente.'",
    9: "Beispiel: 'Ich möchte denken: Ich bin genug. Ich möchte Selbstliebe fühlen. Ich möchte meine Stärken leben.'"
  },
  "Beziehungen & Liebe": {
    1: "Beispiel: 'Ich werde immer verlassen oder enttäuscht.'",
    2: "Beispiel: 'Ich fühle Angst vor Nähe und gleichzeitig Sehnsucht danach.'",
    3: "Beispiel: 'Ich spüre Enge im Herzen, wenn ich an Beziehungen denke.'",
    4: "Beispiel: 'Ich halte Menschen auf Distanz und zeige mich nicht verletzlich.'",
    5: "Beispiel: 'Ich bleibe einsam und oberflächlich in meinen Beziehungen.'",
    6: "Beispiel: 'Ich brauche echte Verbindung und bedingungslose Liebe.'",
    7: "Beispiel: 'Ich möchte verletzlich sein können und anderen vertrauen.'",
    8: "Beispiel: 'Ich habe die Fähigkeit, liebevoll und offen zu sein.'",
    9: "Beispiel: 'Ich möchte denken: Ich bin liebenswert. Ich möchte Vertrauen fühlen. Ich möchte mich öffnen.'"
  },
  "Erfolg & Leistung": {
    1: "Beispiel: 'Ich muss perfekt sein, sonst bin ich ein Versager.'",
    2: "Beispiel: 'Ich fühle ständigen Druck und Angst zu versagen.'",
    3: "Beispiel: 'Ich spüre Anspannung in Nacken und Schultern.'",
    4: "Beispiel: 'Ich überarbeite mich und kann nicht entspannen.'",
    5: "Beispiel: 'Ich brenne aus und verliere die Freude an meiner Arbeit.'",
    6: "Beispiel: 'Ich brauche Anerkennung und das Gefühl, etwas zu erreichen.'",
    7: "Beispiel: 'Ich möchte Exzellenz mit Leichtigkeit verbinden.'",
    8: "Beispiel: 'Ich habe Talente und Erfahrung, die wertvoll sind.'",
    9: "Beispiel: 'Ich möchte denken: Ich darf Fehler machen. Ich möchte Gelassenheit fühlen. Ich möchte mit Freude arbeiten.'"
  },
  "Sinn & Purpose": {
    1: "Beispiel: 'Ich weiß nicht, wofür ich hier bin und was mein Beitrag ist.'",
    2: "Beispiel: 'Ich fühle Leere und Orientierungslosigkeit.'",
    3: "Beispiel: 'Ich spüre ein Ziehen im Herzen, eine Sehnsucht nach mehr.'",
    4: "Beispiel: 'Ich funktioniere nur und lebe nicht wirklich.'",
    5: "Beispiel: 'Mein Leben fühlt sich bedeutungslos und leer an.'",
    6: "Beispiel: 'Ich brauche einen Sinn und eine Richtung in meinem Leben.'",
    7: "Beispiel: 'Ich möchte einen positiven Beitrag leisten und etwas bewirken.'",
    8: "Beispiel: 'Ich habe einzigartige Gaben, die die Welt braucht.'",
    9: "Beispiel: 'Ich möchte denken: Ich habe einen Beitrag. Ich möchte Erfüllung fühlen. Ich möchte meinem Purpose folgen.'"
  },
  "Spiritualität & Verbindung": {
    1: "Beispiel: 'Ich bin getrennt von allem und ganz allein.'",
    2: "Beispiel: 'Ich fühle Einsamkeit und spirituelle Leere.'",
    3: "Beispiel: 'Ich spüre eine Leere in meinem Herzen.'",
    4: "Beispiel: 'Ich suche im Außen nach Erfüllung.'",
    5: "Beispiel: 'Ich fühle mich verloren und ohne Verbindung.'",
    6: "Beispiel: 'Ich brauche Verbindung zu etwas Größerem als mir selbst.'",
    7: "Beispiel: 'Ich möchte im Einklang mit dem Leben sein.'",
    8: "Beispiel: 'Ich habe Zugang zu innerer Weisheit und Intuition.'",
    9: "Beispiel: 'Ich möchte denken: Ich bin verbunden. Ich möchte Frieden fühlen. Ich möchte meditieren und lauschen.'"
  }
};

const STEP_INFO = [
  { 
    number: 1, 
    name: "Gedanken",
    estimatedTime: "10", 
    question: "Was beschäftigt dich, wenn du an <span class='text-[#A6805B] font-bold'>{theme}</span> denkst?",
    getInstruction: (theme: string) => {
      const themeWord = theme === "Geld & Fülle" ? "Geld" :
                        theme === "Gesundheit & Vitalität" ? "deine Gesundheit" :
                        theme === "Emotionen & Gefühle" ? "deine Emotionen" :
                        theme === "Selbstwert & Identität" ? "deinen Selbstwert" :
                        theme === "Beziehungen & Liebe" ? "Beziehungen" :
                        theme === "Erfolg & Leistung" ? "Erfolg" :
                        theme === "Sinn & Purpose" ? "deinen Sinn" :
                        theme === "Spiritualität & Verbindung" ? "Spiritualität" :
                        "dein Thema";
      return `Sprich dich aus:\n\nStell dir vor, deine beste Freundin sitzt vor dir und sagt: "Erzähl mir alles, was dich zu diesem Thema beschäftigt. Ich höre zu."\n\nSchreibe ALLES auf, was dir durch den Kopf geht. Lass es raus. Halte nichts zurück. Schreibe, bis du das Gefühl hast: "Ja, das war's. Das musste raus."`;
    },
    instruction: "Schreibe deine Gedanken in ganzen Sätzen auf – so, wie sie dir im Kopf herumgehen. Hier gibt es kein Richtig oder Falsch, du darfst ehrlich und frei sein. Welche Sorgen, Ängste oder Hoffnungen hast du, wenn du an dein Thema denkst?",
    instructionClass: "font-light",
    placeholder: "Wenn ich an [Thema] denke...",
    tip: "**Wie sollst du schreiben?**\n\n❌ Nicht so: 'Ich denke, dass meine finanzielle Situation verbesserungswürdig ist.'\n\n✅ Sondern so: 'Ich hab einfach nie genug Geld und das macht mir so eine Angst. Egal wie sehr ich arbeite, am Ende des Monats ist das Konto leer...'\n\nSchreibe, bis du das Gefühl hast: 'Ja, das war's. Ich hab mich ausgesprochen.' Es gibt keine Mindest- oder Maximallänge. Manche schreiben 3 Sätze, andere 3 Seiten. Beides ist richtig.",
    knowledgeBox: "Transformation beginnt damit, dass du die alte Energie komplett aus deinem System entlässt. Deine Gedanken sind nicht nur im Kopf – sie sind als emotionale Ladung in deinem Körper gespeichert. Wenn du dich hier wirklich aussprichst und alles rauslässt, befreist du diese Energie. Erst dann kann etwas Neues entstehen."
  },
  { 
    number: 2, 
    name: "Gefühle",
    estimatedTime: "5", 
    question: "Welche <span class='text-[#A6805B] font-bold'>Gefühle</span> lösen diese Gedanken in dir aus?",
    instruction: "Sprich dich aus:\n\nLies deine Gedanken aus Schritt 1 noch einmal durch.\n\nWelche **Gefühle** entstehen dabei in dir?\n\nBenenne sie so genau wie möglich. Es können mehrere Gefühle gleichzeitig sein. Das ist völlig normal.\n\nSchreibe ALLES auf, was du fühlst. Halte nichts zurück.",
    instructionClass: "font-light",
    placeholder: "Wenn ich diese Gedanken habe, fühle ich...",
    knowledgeBox: "Gedanken und Gefühle sind nicht dasselbe.\n\n**Gedanken** sind Sätze in deinem Kopf: 'Ich habe nie genug Geld.'\n\n**Gefühle** sind Emotionen in deinem Körper: Angst, Scham, Wut, Trauer.\n\nWenn du deine Gefühle klar benennst, verlieren sie ihre Macht über dich. Du erkennst: 'Aha, das ist Angst' oder 'Das ist Scham'. Erst dann kannst du sie loslassen.",
    tip: "**Wie benenne ich meine Gefühle richtig?**\n\nGefühle sind oft ein Mix. Hier sind die häufigsten Gefühle zum Thema Geld:\n\n**Angst-Familie:**\nAngst, Panik, Sorge, Unsicherheit, Nervosität\n\n**Scham-Familie:**\nScham, Peinlichkeit, Unwürdigkeit, Minderwertigkeitsgefühl\n\n**Wut-Familie:**\nWut, Ärger, Frustration, Verbitterung, Groll\n\n**Trauer-Familie:**\nTrauer, Hoffnungslosigkeit, Resignation, Verzweiflung\n\n**Neid-Familie:**\nNeid, Eifersucht, Verbitterung\n\nDu kannst auch sagen: 'Ich fühle einen Mix aus Angst, Scham und Wut.' Das ist völlig okay!"
  },
  { 
    number: 3, 
    name: "Körperempfindungen",
    estimatedTime: "5", 
    question: "Wo und wie spürst du diese Gefühle in deinem <span class='text-[#A6805B] font-bold'>Körper</span>?",
    instruction: "Sprich dich aus:\n\nSchließe kurz die Augen. Atme tief ein.\n\nDenke an deine Gefühle aus Schritt 2: Angst, Scham, Wut...\n\n**Wo** in deinem Körper spürst du diese Gefühle?\n- In der Brust? Im Bauch? Im Hals? Im Kopf?\n\n**Wie** fühlt es sich an?\n- Eng? Schwer? Heiß? Kalt? Kribbelig? Taub?\n\nBeschreibe ALLES, was du in deinem Körper wahrnimmst. Je genauer, desto besser.",
    instructionClass: "font-light",
    placeholder: "In meinem Körper spüre ich...",
    knowledgeBox: "**Emotionen sind Energie, die in deinem Körper feststeckt.**\n\nWenn du Angst, Scham oder Wut fühlst, ist das nicht nur ein Gedanke – es ist **festgesetzte Energie** in deinen Energiezentren (Chakren).\n\nDiese Energie zeigt sich als körperliche Empfindungen: Enge in der Brust, Knoten im Bauch, Kloß im Hals.\n\nWenn du diese Körperempfindungen bewusst wahrnimmst und benennst, beginnst du, die festgesetzte Energie freizusetzen. Der Körper kann sie dann loslassen. Das ist der Weg zur Transformation.",
    tip: "**Wie beschreibe ich Körperempfindungen?**\n\nDein Körper spricht in Empfindungen. Hier sind die häufigsten:\n\n**Wo im Körper?**\nBrust, Herz, Lunge, Bauch, Magen, Hals, Kehle, Kopf, Stirn, Nacken, Schultern, Rücken, Arme, Hände, Beine, Füße\n\n**Wie fühlt es sich an?**\n\n**Druck/Spannung:** Eng, zusammengezogen, verkrampft, angespannt, gedrückt, schwer\n\n**Temperatur:** Heiß, kalt, brennend, eisig, warm\n\n**Bewegung:** Kribbelig, zitternd, unruhig, flatternd, pulsierend\n\n**Leere:** Taub, leer, hohl, gefühllos, abgeschnitten\n\n**Blockade:** Kloß im Hals, Knoten im Bauch, Enge in der Brust\n\nDu kannst auch sagen: 'Ich spüre Enge in der Brust und gleichzeitig Hitze im Gesicht.' Mehrere Empfindungen sind normal!"
  },
  { 
    number: 4, 
    name: "Taten",
    estimatedTime: "5", 
    question: "Was <span class='text-[#A6805B] font-bold'>tust</span> du, wenn diese Gefühle hochkommen?",
    instruction: "Sprich dich aus:\n\nDenke an eine Situation, in der diese Gefühle hochkommen (z.B. wenn du auf dein Konto schaust, wenn Rechnungen kommen...).\n\n**Was tust du dann?**\n\nSei radikal ehrlich. Niemand außer dir wird das lesen.\n\n- Vermeidest du etwas?\n- Lenkst du dich ab?\n- Kaufst du etwas?\n- Vergleichst du dich mit anderen?\n- Machst du dich klein?\n\nSchreibe ALLES auf, was du tust. Auch die Dinge, für die du dich schämst. Keine Bewertung – nur Bewusstwerdung.",
    instructionClass: "font-light",
    placeholder: "Wenn diese Gefühle hochkommen, dann...",
    knowledgeBox: "**Deine Taten sind deine unbewussten Überlebensprogramme.**\n\nWenn Angst, Scham oder Wut hochkommen, reagierst du automatisch – oft ohne es zu merken.\n\nDu vermeidest. Du lenkst dich ab. Du sabotierst dich. Du fällst in alte Muster.\n\nDiese Reaktionen sind nicht 'falsch' – sie haben dich früher geschützt. Aber heute halten sie dich gefangen.\n\nWenn du deine automatischen Reaktionen bewusst machst, kannst du sie durchbrechen. Das ist der erste Schritt zur Veränderung.",
    tip: "**Typische unbewusste Reaktionsmuster:**\n\n**Vermeidung:** Rechnungen nicht öffnen, Kontostand nicht checken, Gespräche über Geld vermeiden, Entscheidungen aufschieben\n\n**Ablenkung:** Endlos scrollen (Social Media, Netflix...), Essen, Trinken, Übermäßig arbeiten (um nicht zu fühlen)\n\n**Kompensation:** Impulsiv shoppen ('Retail Therapy'), Sich etwas 'gönnen', obwohl das Geld fehlt\n\n**Selbstsabotage:** Chancen nicht wahrnehmen, Sich selbst kleinreden, Prokrastinieren, Projekte nicht zu Ende bringen\n\n**Vergleichen & Neiden:** Ständig mit anderen vergleichen, Social Media stalken, Sich minderwertig fühlen\n\n**Rückzug:** Soziale Kontakte meiden, Sich isolieren, Einladungen absagen\n\n**Wichtig:** Diese Reaktionen sind nicht 'falsch'. Sie haben dich früher geschützt. Jetzt darfst du sie loslassen."
  },
  { 
    number: 5, 
    name: "Wirkung",
    estimatedTime: "5", 
    question: "Welche <span class='text-[#A6805B] font-bold'>Realität</span> hast du durch diese Gedanken, Gefühle und Taten erschaffen?",
    instruction: "Sprich dich aus:\n\nSchau dir deine aktuelle Realität an. Sei radikal ehrlich.\n\n**Wo stehst du JETZT?**\n\n- Wie sieht deine finanzielle Situation aus?\n- Was sind die konkreten Konsequenzen deiner Gedanken, Gefühle und Taten?\n- Was hast du (nicht) erreicht?\n- Wo fühlst du dich gefangen?\n\nDas ist kein Selbstvorwurf. Das ist Bewusstwerdung.\n\nDu erkennst: 'Okay, DAS habe ich erschaffen. Und wenn ich DAS erschaffen habe, kann ich auch etwas NEUES erschaffen.'\n\nSchreibe ALLES auf, was du siehst. Je ehrlicher, desto kraftvoller die Transformation.",
    instructionClass: "font-light",
    placeholder: "Meine aktuelle Realität ist...",
    knowledgeBox: "**Du bist nicht das Opfer deiner Umstände. Du bist der Schöpfer deiner Realität.**\n\nDeine Gedanken erzeugen Gefühle. Deine Gefühle erzeugen Taten. Deine Taten erschaffen deine Realität.\n\nWenn du denkst 'Ich habe nie genug Geld', fühlst du Angst und Scham, vermeidest Rechnungen, sabotierst Chancen – und erschaffst genau die Realität, die du befürchtest: Geldmangel.\n\nDas ist nicht Schuld. Das ist **Macht**.\n\nWenn DU deine Realität erschaffen hast, kannst DU sie auch verändern. Das ist der Wendepunkt.",
    tip: "**Wie beschreibe ich meine erschaffene Realität?**\n\nSei konkret, nicht abstrakt:\n\n**Finanziell:** Wie viel Schulden? Wie viel gespart? Lebst du von Gehalt zu Gehalt?\n\n**Emotional:** Wie fühlst du dich? Ständig gestresst? Ängstlich? Hoffnungslos?\n\n**Sozial:** Musst du Einladungen absagen? Ziehst du dich zurück?\n\n**Zukunft:** Siehst du eine positive Zukunft? Oder fühlst du dich gefangen?\n\n**Chancen:** Welche Möglichkeiten hast du NICHT wahrgenommen? Wo hast du dich selbst klein gehalten?\n\n**Wichtig:** Das ist NICHT Selbstvorwurf. Das ist Bewusstwerdung.\n\nWenn du erkennst: 'ICH habe das erschaffen', erkennst du auch: 'ICH kann es ändern.' Das ist pure Macht."
  },
  { 
    number: 6, 
    name: "Schattenarbeit",
    estimatedTime: "7", 
    question: "Was lehnst du an dir selbst ab, wenn es um <span class='text-[#A6805B] font-bold'>{theme}</span> geht?",
    instruction: "Sprich dich aus:\n\nLies noch einmal, was du in Schritt 1-5 geschrieben hast.\n\nJetzt schau tiefer – in deinen Schatten:\n\n**1. SELBST-ABLEHNUNG**\nWelche Teile von dir lehnst du ab?\n- Deine Gier? Deinen Neid? Deine Faulheit? Deine Macht?\n- Was verurteilst du an dir selbst?\n\n**2. PROJEKTION**\nWas verurteilst du an anderen Menschen?\n- \"Reiche sind gierig\" → Lehnst DU deine eigene Gier ab?\n- \"Erfolgreiche sind kalt\" → Lehnst DU deine eigene Macht ab?\n- Was du an anderen kritisierst, lehnst du oft in dir selbst ab.\n\n**3. ANNAHME**\nKannst du annehmen, dass auch DU diese Teile hast?\n- \"Ja, ich bin manchmal gierig. Und das ist okay.\"\n- \"Ja, ich bin manchmal neidisch. Und das ist menschlich.\"\n- \"Ja, ich will Macht haben. Und das ist erlaubt.\"\n\nSchreibe ALLES auf, was du an dir ablehnst und was du auf andere projizierst.\n\nDas ist keine Selbstverurteilung. Das ist Selbst-Erkenntnis.\n\nErst wenn du deinen Schatten annimmst, kann er sich integrieren.",
    instructionClass: "font-light",
    placeholder: "Was lehne ich an mir ab? Was projiziere ich auf andere?",
    knowledgeBox: "**Dein Schatten ist der Teil von dir, den du ablehnst.**\n\nCarl Jung sagt: 'Was du widerstehst, besteht. Was du annimmst, transformiert sich.'\n\n**Dein Schatten zeigt sich in 2 Formen:**\n\n**1. SELBST-ABLEHNUNG:**\nDu verurteilst Teile von dir selbst.\n- \"Ich bin gierig\" → Scham\n- \"Ich bin neidisch\" → Schuld\n- \"Ich bin faul\" → Selbsthass\n\n**2. PROJEKTION:**\nDu siehst in anderen, was du in dir ablehnst.\n- \"Reiche sind gierig\" → Du lehnst deine eigene Gier ab\n- \"Erfolgreiche sind kalt\" → Du lehnst deine eigene Macht ab\n\n**Wenn du deine Gier ablehnst, kämpfst du gegen sie an – und sie wird stärker.**\n\n**Wenn du deine Gier annimmst, verliert sie ihre Macht – und wird zu gesundem Begehren.**\n\nDas Gleiche gilt für Neid, Faulheit, Macht, Angst, Scham, Wut.\n\n**Dein Schatten ist nicht dein Feind. Er ist ein Teil von dir, der gesehen werden will.**\n\nWenn du ihn annimmst, integrierst du ihn. Und dann wird er zu deiner Kraft.\n\n**Das ist die tiefste Ebene der Transformation.**",
    tip: "**Wie erkenne ich meinen Schatten?**\n\n**SELBST-ABLEHNUNG erkennen:**\n\nFrage dich: Was verurteile ich an mir selbst?\n- Gier, Neid, Faulheit, Macht, Angst, Scham, Wut, Schwäche\n\n**PROJEKTION erkennen:**\n\nFrage dich: Was verurteile ich an anderen?\n- \"Reiche sind gierig\" → Ich lehne meine Gier ab\n- \"Erfolgreiche sind kalt\" → Ich lehne meine Macht ab\n- \"Faule Menschen sind wertlos\" → Ich lehne meine Faulheit ab\n\n**ANNAHME üben:**\n\nSage zu dir selbst:\n- \"Ja, ich bin manchmal gierig. Und das ist menschlich.\"\n- \"Ja, ich bin manchmal neidisch. Und das zeigt mir, was ich will.\"\n- \"Ja, ich bin manchmal faul. Und das zeigt mir, dass ich Ruhe brauche.\"\n\n**Wichtig:** Dein Schatten ist nicht dein Feind. Er ist ein Teil von dir, der gesehen werden will. Wenn du ihn annimmst, wird er zu deiner Kraft."
  },
  { 
    number: 7, 
    name: "Filter",
    estimatedTime: "3", 
    question: "Was hast du <span class='text-[#A6805B] font-bold'>ausgeblendet, verzerrt oder verallgemeinert</span>?",
    instruction: "Sprich dich aus:\n\nLies noch einmal, was du in Schritt 1-5 geschrieben hast.\n\nSchau genau hin:\n\n**TILGUNG – Was hast du ausgeblendet?**\n- Was siehst du NICHT, obwohl es da ist?\n- Welche positiven Aspekte ignorierst du?\n\n**VERZERRUNG – Was hast du falsch interpretiert?**\n- Welche Bedeutungen gibst du Dingen, die sie vielleicht nicht haben?\n- Wo ziehst du falsche Schlüsse?\n\n**GENERALISIERUNG – Was hast du verallgemeinert?**\n- Wo sagst du 'IMMER', 'NIE', 'ALLE', 'KEINER'?\n- Stimmt das wirklich? Oder gab es Ausnahmen?\n\nSei radikal ehrlich. Diese Filter sind unbewusst – jetzt machst du sie bewusst.",
    instructionClass: "font-light",
    placeholder: "Ich habe ausgeblendet, dass... Ich habe verzerrt, indem... Ich habe verallgemeinert, dass...",
    knowledgeBox: "**Dein Gehirn filtert die Realität – und erschafft dadurch deine subjektive Wahrheit.**\n\nEs gibt 3 unbewusste Filter, die deine Wahrnehmung verzerren:\n\n**TILGUNG:** Du siehst nur, was deine Überzeugung bestätigt. Du blendest aus, was nicht passt.\n\n**VERZERRUNG:** Du gibst Dingen Bedeutungen, die sie nicht haben. Du interpretierst falsch.\n\n**GENERALISIERUNG:** Du machst aus Einzelerfahrungen absolute Wahrheiten. 'Immer', 'Nie', 'Alle'.\n\nDiese Filter halten dich in deinen alten Mustern gefangen.\n\nWenn du erkennst, WIE du filterst, kannst du die Filter durchbrechen. Das ist der Schlüssel zur Bewusstwerdung.",
    tip: "**Die 3 Filter erkennen:**\n\n**TILGUNG – Signalwörter:** 'Ich sehe nur...', 'Ich ignoriere...', 'Ich blende aus...'\n\n**Fragen:** Was siehst du NICHT, obwohl es da ist? Welche positiven Aspekte ignorierst du?\n\n**VERZERRUNG – Signalwörter:** 'Das bedeutet...', 'Wenn..., dann bin ich...', 'Das heißt, dass...'\n\n**Fragen:** Welche Bedeutungen gibst du Dingen? Sind diese Bedeutungen wahr?\n\n**GENERALISIERUNG – Signalwörter:** 'IMMER', 'NIE', 'ALLE', 'KEINER', 'JEDES MAL'\n\n**Fragen:** Stimmt diese Verallgemeinerung wirklich? Gab es Ausnahmen?\n\n**Wichtig:** Diese Filter sind NICHT schlecht. Sie sind unbewusste Schutzmechanismen. Aber jetzt machst du sie bewusst. Und dadurch kannst du sie durchbrechen."
  },
  { 
    number: 8, 
    name: "IST-Zustand",
    estimatedTime: "3", 
    question: "Was <span class='text-[#A6805B] font-bold'>IST</span> wirklich wahr – ohne Bewertung?",
    instruction: "Sprich dich aus:\n\nJetzt schaust du auf die FAKTEN. Ohne Bewertung. Ohne Emotion. Einfach nur: Was IST.\n\n**Beispiel Geld:**\nNicht: 'Ich bin arm.' (Bewertung)\nSondern: 'Ich habe 2.500€ Einkommen pro Monat.' (Fakt)\n\n**Schreibe die FAKTEN auf:**\n- Wie viel Geld kommt rein?\n- Wie viel geht raus?\n- Wie viel Schulden hast du?\n- Wie viel Ersparnis?\n- Was HAST du? (Wohnung, Essen, Klamotten...)\n- Was hast du NICHT?\n\nKeine Bewertung. Keine Interpretation. Nur: **Was IST.**\n\nDas ist der IST-Zustand. Die objektive Realität.",
    instructionClass: "font-light",
    placeholder: "Die objektive Realität ist...",
    knowledgeBox: "**Es gibt einen Unterschied zwischen dem, was IST, und dem, was du darüber DENKST.**\n\nIn Schritt 5 hast du gesehen: 'Welche Realität habe ich erschaffen?' Das war deine **subjektive** Realität – gefiltert durch deine Gedanken, Gefühle und Bewertungen.\n\nIn Schritt 6 hast du deinen Schatten gesehen: 'Was lehne ich ab?'\n\nIn Schritt 7 hast du erkannt: 'Wie habe ich die Realität verzerrt?' Du hast deine Filter gesehen.\n\n**Jetzt in Schritt 8: Was IST wirklich wahr?**\n\nDas ist die **objektive** Realität. Ohne Bewertung. Ohne Interpretation. Ohne 'gut' oder 'schlecht'.\n\nEinfach nur: **Was IST.**\n\nWenn du den IST-Zustand klar siehst, kannst du ihn annehmen. Und erst dann kannst du ihn verändern.",
    tip: "**Wie beschreibe ich den IST-Zustand?**\n\n**FAKTEN, keine Bewertungen:**\n\n❌ **Bewertung:** 'Ich bin arm.'\n✅ **Fakt:** 'Ich habe 2.500€ Einkommen.'\n\n❌ **Bewertung:** 'Ich habe nie genug.'\n✅ **Fakt:** 'Ich habe 1.800€ Ausgaben.'\n\n**ZAHLEN, keine Gefühle:**\nSchreibe konkrete Zahlen auf: Einkommen X€, Ausgaben X€, Schulden X€\n\n**WAS IST, nicht was sein sollte:**\n❌ 'Ich sollte mehr verdienen.'\n✅ 'Ich verdiene X€.'\n\n**Beide Seiten sehen:**\n- Was ich HABE: (Liste alles auf)\n- Was ich NICHT habe: (Liste alles auf)\n\n**Wichtig:** Der IST-Zustand ist NEUTRAL. Keine Bewertung. Keine Emotion. Nur: Was IST."
  },
  { 
    number: 9, 
    name: "Annahme",
    estimatedTime: "5", 
    question: "Kannst du <span class='text-[#A6805B] font-bold'>annehmen</span>, was ist?",
    instruction: "Sprich dich aus:\n\nLies noch einmal, was du in den letzten Schritten geschrieben hast.\n\nBesonders Schritt 8: Den IST-Zustand. Die Fakten. Die objektive Realität.\n\n**Kannst du das annehmen?**\n\nNicht gut finden. Nicht rechtfertigen. Nicht erklären.\n\nEinfach nur: **'JA, das IST gerade da. Das ist meine aktuelle Realität. Ich nehme sie an.'**\n\nDas kann sich schwer anfühlen. Das kann Widerstand auslösen. Das ist okay.\n\nAber versuche es. Sage JA zu dem, was ist.\n\nSchreibe auf:\n- Was nimmst du an?\n- Wo spürst du noch Widerstand?\n- Was passiert, wenn du aufhörst zu kämpfen?\n- Wie fühlt sich Annahme an?\n\nDas ist der Wendepunkt. Der Moment, wo Transformation möglich wird.",
    instructionClass: "font-light",
    placeholder: "Ich nehme an, dass...",
    knowledgeBox: "**Was du nicht annimmst, kann sich nicht verändern.**\n\nDu hast jetzt gesehen: Deine Gedanken, Gefühle, Körperempfindungen, Taten, die Realität, deine Filter und den IST-Zustand.\n\nVielleicht kämpfst du noch dagegen an. Vielleicht denkst du: 'Das darf nicht sein. Das will ich nicht.'\n\n**Aber Widerstand bindet deine Energie.** Solange du gegen das kämpfst, was ist, bleibst du darin gefangen.\n\n**Annahme bedeutet NICHT Aufgeben.** Annahme bedeutet: 'JA, das IST gerade da.'\n\nErst wenn du annimmst, was ist, kann Transformation beginnen.\n\nDas ist das Paradox: Du musst das Alte vollständig annehmen, bevor du das Neue erschaffen kannst.",
    tip: "**Annahme vs. Widerstand**\n\n**Widerstand klingt so:** 'Das darf nicht sein!', 'Das ist unfair!', 'Warum ich?', 'Das will ich nicht!'\n\n**Annahme klingt so:** 'JA, das IST gerade da.', 'Das ist meine aktuelle Realität.', 'Ich kämpfe nicht mehr dagegen.', 'Ich nehme an, was ist.'\n\n**Was Annahme NICHT bedeutet:** ❌ Gut finden, ❌ Rechtfertigen, ❌ Aufgeben, ❌ Resignation\n\n**Was Annahme bedeutet:** ✅ Bewusst anerkennen, ✅ Aufhören zu kämpfen, ✅ Energie freisetzen, ✅ Raum schaffen\n\n**Das Paradox:** Du musst das Alte vollständig annehmen, bevor du das Neue erschaffen kannst.\n\n**Wie fühlt sich Annahme an?** Erleichterung, Raum, Frieden, Hoffnung, Klarheit, Kraft. Annahme ist nicht Schwäche. Annahme ist Macht."
  },
  { 
    number: 9, 
    name: "Neue Gedanken",
    estimatedTime: "7", 
    question: "Welche neuen, kraftvollen <span class='text-[#A6805B] font-bold'>Gedanken</span> möchtest du zu diesem Thema denken?",
    instruction: "Erschaffe deine neue Frequenz:\n\nDu hast deine alte Frequenz erkannt und angenommen.\n\nJetzt kommt der kraftvollste Moment: **Du erschaffst bewusst NEUE Gedanken.**\n\n**LIVING IN THE END:**\n\nStelle dir vor, es ist 3 Monate in der Zukunft. Dein Wunsch ist erfüllt.\n\n- Wie DENKST du jetzt über dieses Thema?\n- Was geht dir durch den Kopf, wenn du morgens aufwachst?\n- Was denkst du, wenn du an dein Leben denkst?\n\n**Schreibe NICHT 'Ich will...' oder 'Ich werde...'**\n\nSchreibe: **'Ich BIN...', 'Ich HABE...', 'Ich WEIß...'**\n\n**Schreibe 3-5 Gedanken, die dein neues Ich JETZT denkt.**\n\nDas ist keine Lüge. Das ist 'believe it in' - du glaubst es hinein.",
    instructionClass: "font-light",
    placeholder: "Ich denke...",
    knowledgeBox: "**Deine Gedanken erschaffen deine Realität.**\n\nDr. Joe Dispenza sagt: 'Wenn du immer die gleichen Gedanken denkst, erschaffst du immer die gleiche Realität.'\n\n**Aber was, wenn du NEUE Gedanken denkst?**\n\nDann erschaffst du eine NEUE Realität.\n\n**Das ist Quantenphysik. Das ist Neuroplastizität. Das ist Transformation.**\n\nDeine alten Gedanken haben deine alte Realität erschaffen.\n\nDeine NEUEN Gedanken erschaffen deine NEUE Realität.\n\n**Aber du musst sie REGELMÄSSIG denken.**\n\nNicht einmal. Nicht manchmal. Sondern täglich, bewusst, mit Absicht.\n\n**Das ist der Schlüssel zur Transformation.**",
    tip: "**Wie formuliere ich neue Gedanken?**\n\n**❌ FALSCH (Wunsch, Zukunft):**\n- 'Ich will reich sein'\n- 'Ich werde gesund sein'\n- 'Ich hoffe, geliebt zu werden'\n\n**✅ RICHTIG (Realität, Gegenwart):**\n- 'Ich bin finanziell frei'\n- 'Mein Körper ist gesund und kraftvoll'\n- 'Ich bin liebenswert und geliebt'\n\n**Der Unterschied:**\n- Wunsch = Mangel (Ich habe es NICHT)\n- Realität = Fülle (Ich habe es JETZT)\n\n**Dein Gehirn kennt den Unterschied zwischen Realität und Vorstellung nicht.**\n\nWenn du denkst 'Ich BIN reich', reagiert dein Gehirn, als wäre es wahr.\n\n**Das ist keine Lüge. Das ist Schöpfung.**\n\n**Formuliere deine neuen Gedanken:**\n- Positiv (nicht 'Ich habe keine Angst', sondern 'Ich fühle mich sicher')\n- Gegenwärtig (nicht 'Ich werde', sondern 'Ich bin')\n- Kraftvoll (nicht 'Vielleicht', sondern 'Ich weiß')\n- Spezifisch (nicht 'Ich bin glücklich', sondern 'Ich fühle Freude in meinem Herzen')\n\n**Deine neuen Gedanken sind der Samen deiner neuen Realität.**",
    isPart2: true
  },
  { 
    number: 10, 
    name: "Neue Gefühle",
    estimatedTime: "5", 
    question: "Welche <span class='text-[#A6805B] font-bold'>Gefühle</span> möchtest du fühlen, wenn du an dieses Thema denkst?",
    instruction: "Erschaffe deine neue Frequenz:\n\nDu hast neue Gedanken erschaffen.\n\nJetzt kommt der entscheidende Schritt: **Fühle die Emotionen deiner neuen Realität.**\n\n**EMOTIONALE FREQUENZ:**\n\nStelle dir vor, es ist 3 Monate in der Zukunft. Dein Wunsch ist erfüllt.\n\n**Schließe jetzt die Augen. Atme tief ein.**\n\n- Welche EMOTION fühlst du in deinem Körper?\n- WO spürst du sie? (Herz? Brust? Bauch?)\n- WIE fühlt sie sich an? (Warm? Leicht? Weit?)\n\n**Benenne 2-3 Gefühle:**\n- Freude, Dankbarkeit, Liebe, Frieden, Leichtigkeit, Vertrauen, Sicherheit, Fülle\n\n**Lokalisiere sie im Körper:**\n- 'Ich fühle Freude in meinem Herzen'\n- 'Ich fühle Leichtigkeit in meiner Brust'\n\n**Fühle es JETZT - nicht morgen, nicht nächste Woche, JETZT.**\n\nDas ist keine Fantasie. Das ist Training deines Körpers.",
    instructionClass: "font-light",
    placeholder: "Ich fühle...",
    knowledgeBox: "**Deine Gefühle sind die Sprache deines Körpers.**\n\nDr. Joe Dispenza sagt: 'Gedanken sind die Sprache des Gehirns. Gefühle sind die Sprache des Körpers.'\n\n**Wenn du denkst UND fühlst, erschaffst du.**\n\nDeine alten Gefühle (Angst, Scham, Wut) haben deine alte Realität erschaffen.\n\nDeine NEUEN Gefühle (Freude, Dankbarkeit, Liebe) erschaffen deine NEUE Realität.\n\n**Aber du musst sie FÜHLEN, nicht nur denken.**\n\nNicht 'Ich will glücklich sein' (Gedanke).\n\nSondern 'Ich FÜHLE Freude in meinem Herzen' (Gefühl).\n\n**Das ist der Unterschied zwischen Wunsch und Schöpfung.**\n\nWenn du die Emotionen deiner Zukunft JETZT schon fühlst, ziehst du diese Zukunft an.\n\n**Das ist das Geheimnis der Manifestation.**",
    tip: "**Wie fühle ich neue Gefühle?**\n\n**1. BENENNE das Gefühl:**\n- Freude, Dankbarkeit, Liebe, Frieden, Leichtigkeit, Vertrauen, Sicherheit, Fülle\n\n**2. LOKALISIERE es im Körper:**\n- 'Ich fühle Freude in meinem Herzen'\n- 'Ich fühle Leichtigkeit in meiner Brust'\n- 'Ich fühle Wärme in meinem Bauch'\n\n**3. VERSTÄRKE es:**\n- Schließe die Augen\n- Atme tief ein\n- Stelle dir vor, wie sich das Gefühl ausbreitet\n- Lass es durch deinen ganzen Körper fließen\n\n**4. WIEDERHOLE es:**\n- Täglich, morgens oder abends\n- 5-10 Minuten\n- Mit geschlossenen Augen\n- Mit voller Aufmerksamkeit\n\n**Das ist keine Fantasie. Das ist Training.**\n\nDein Körper lernt, diese neuen Gefühle zu fühlen.\n\nUnd wenn dein Körper diese Gefühle fühlt, erschaffst du die Realität, die zu diesen Gefühlen passt.\n\n**Das ist Neuroplastizität. Das ist Quantenphysik. Das ist Magie.**",
    mindfulnessHint: "Schließe kurz die Augen und versuche, dieses Gefühl jetzt schon in deinem Körper zu spüren. Wo nimmst du es wahr? Lass es sich ausbreiten.",
    isPart2: true
  },
  { 
    number: 11, 
    name: "Neue Körperempfindungen",
    estimatedTime: "5", 
    question: "Wie fühlt sich diese neue Realität in deinem <span class='text-[#A6805B] font-bold'>Körper</span> an?",
    instruction: "Erschaffe deine neue Frequenz:\n\nDu hast neue Gedanken und Gefühle erschaffen.\n\nJetzt verankere sie in deinem Körper: **Spüre die körperlichen Empfindungen deiner neuen Realität.**\n\n**BODY SCAN:**\n\nStelle dir vor, es ist 3 Monate in der Zukunft. Dein Wunsch ist erfüllt.\n\n**Schließe die Augen. Atme tief ein. Scanne deinen Körper von Kopf bis Fuß.**\n\n- **Kopf:** Wie fühlt sich dein Kopf an? Klar? Leicht?\n- **Brust:** Wie fühlt sich deine Brust an? Weit? Offen?\n- **Bauch:** Wie fühlt sich dein Bauch an? Entspannt? Warm?\n- **Beine:** Wie fühlen sich deine Beine an? Stabil? Kraftvoll?\n\n**Beschreibe 3-5 Körperempfindungen:**\n- 'Ich spüre Leichtigkeit in meiner Brust'\n- 'Ich spüre Wärme in meinem Bauch'\n- 'Ich spüre Energie in meinen Händen'\n\n**Spüre es JETZT. Atme in die Empfindung hinein.**\n\nDein Körper ist der Anker deiner neuen Frequenz.",
    instructionClass: "font-light",
    placeholder: "In meinem Körper spüre ich...",
    knowledgeBox: "**Dein Körper ist das Unbewusste Selbst.**\n\nDr. Joe Dispenza sagt: 'Dein Körper ist dein Unbewusstes. Wenn dein Körper die neue Frequenz fühlt, wird sie zur Gewohnheit.'\n\n**Deine alten Körperempfindungen (Enge, Schwere, Anspannung) haben deine alte Realität verankert.**\n\nDeine NEUEN Körperempfindungen (Leichtigkeit, Weite, Entspannung) verankern deine NEUE Realität.\n\n**Das ist der Unterschied zwischen Wissen und Sein.**\n\nDu kannst WISSEN, dass du reich bist.\n\nAber wenn dein Körper sich IMMER NOCH eng und angespannt fühlt, lebst du die alte Frequenz.\n\n**Erst wenn dein Körper die neue Frequenz FÜHLT, wird sie zur Realität.**\n\nDas ist Embodiment. Das ist Integration. Das ist Transformation.",
    tip: "**Wie spüre ich neue Körperempfindungen?**\n\n**1. SCANNE deinen Körper:**\n- Schließe die Augen\n- Atme tief ein\n- Gehe durch deinen Körper von Kopf bis Fuß\n- Was spürst du?\n\n**2. BENENNE die Empfindungen:**\n- Leichtigkeit, Weite, Entspannung, Wärme, Kribbeln, Energie, Kraft\n\n**3. LOKALISIERE sie:**\n- 'Ich spüre Leichtigkeit in meiner Brust'\n- 'Ich spüre Wärme in meinem Bauch'\n- 'Ich spüre Energie in meinen Händen'\n\n**4. VERSTÄRKE sie:**\n- Atme in die Empfindung hinein\n- Stelle dir vor, wie sie sich ausbreitet\n- Lass sie durch deinen ganzen Körper fließen\n\n**Der Unterschied zur alten Frequenz:**\n\n**ALT:**\n- Enge in der Brust\n- Schwere im Bauch\n- Anspannung im Nacken\n\n**NEU:**\n- Weite in der Brust\n- Leichtigkeit im Bauch\n- Entspannung im Nacken\n\n**Dein Körper ist der Anker deiner neuen Frequenz.**",
    isPart2: true
  },
  { 
    number: 12, 
    name: "Neue Taten",
    estimatedTime: "7", 
    question: "Was <span class='text-[#A6805B] font-bold'>tust</span> du anders in dieser neuen Realität?",
    instruction: "Erschaffe deine neue Frequenz:\n\nDu hast neue Gedanken, Gefühle und Körperempfindungen erschaffen.\n\nJetzt kommt die Manifestation: **Handle aus deiner neuen Frequenz heraus.**\n\n**LIVING IN THE END:**\n\nStelle dir vor, es ist 3 Monate in der Zukunft. Dein Wunsch ist erfüllt.\n\n**Wie verhältst du dich JETZT?**\n\n- Was tust du morgens als Erstes?\n- Wie gehst du mit Geld um?\n- Wie sprichst du mit Menschen?\n- Wie triffst du Entscheidungen?\n\n**Beschreibe 3-5 konkrete Handlungen:**\n- 'Ich sage Nein zu dem, was mir nicht dient'\n- 'Ich investiere in meine Gesundheit'\n- 'Ich spreche aus, was ich fühle'\n\n**Wichtig:** Handle aus LIEBE (Ich will...), nicht aus ANGST (Ich muss...)\n\n**Dein neues Ich würde nicht warten. Es würde JETZT handeln.**\n\nWelche EINE Handlung kannst du HEUTE tun?",
    instructionClass: "font-light",
    placeholder: "Ich tue...",
    knowledgeBox: "**Deine Taten erschaffen deine Realität.**\n\nDr. Joe Dispenza sagt: 'Du kannst nicht die gleichen Dinge tun und ein anderes Ergebnis erwarten.'\n\n**Deine alten Taten (Vermeidung, Ablenkung, Selbstsabotage) haben deine alte Realität erschaffen.**\n\nDeine NEUEN Taten (Mut, Klarheit, Selbstverantwortung) erschaffen deine NEUE Realität.\n\n**Aber du musst aus deiner NEUEN Frequenz heraus handeln.**\n\nNicht aus Angst ('Ich muss...').\n\nSondern aus Liebe ('Ich will...').\n\n**Das ist der Unterschied zwischen Zwang und Schöpfung.**\n\nWenn du aus deiner neuen Frequenz heraus handelst, fühlt es sich leicht an.\n\nWenn du aus deiner alten Frequenz heraus handelst, fühlt es sich schwer an.\n\n**Deine Taten sind der Beweis deiner Transformation.**",
    tip: "**Wie handle ich aus meiner neuen Frequenz?**\n\n**1. ERKENNE den Unterschied:**\n\n**ALT (aus Angst):**\n- 'Ich MUSS Geld verdienen' (Zwang)\n- 'Ich SOLLTE Sport machen' (Pflicht)\n- 'Ich DARF nicht Nein sagen' (Angst)\n\n**NEU (aus Liebe):**\n- 'Ich WILL Wert erschaffen' (Freude)\n- 'Ich LIEBE es, meinen Körper zu bewegen' (Lust)\n- 'Ich SAGE Nein zu dem, was mir nicht dient' (Selbstliebe)\n\n**2. HANDLE aus dem Gefühl heraus:**\n\nNicht: 'Ich fühle mich reich, DESHALB werde ich...'\n\nSondern: 'Ich fühle mich reich, DESHALB tue ich JETZT...'\n\n**3. STARTE KLEIN:**\n\nNicht: 'Ich werde mein ganzes Leben ändern'\n\nSondern: 'Ich tue HEUTE eine Sache anders'\n\n**Beispiele:**\n- Ich sage Nein zu einer Anfrage, die mir nicht dient\n- Ich kaufe mir etwas Schönes, ohne schlechtes Gewissen\n- Ich spreche aus, was ich fühle\n- Ich gehe spazieren, weil ich meinen Körper liebe\n\n**Dein neues Ich würde nicht warten. Es würde JETZT handeln.**",
    empowermentHint: "Dein neues Ich würde nicht auf ein Zeichen warten. Es würde selbst Zeichen setzen. Welche Handlung, egal wie klein, entspringt direkt aus dem Gefühl von Fülle, Liebe oder Gesundheit, das du gerade erschaffen hast?",
    isPart2: true
  },
  { 
    number: 13, 
    name: "Neue Wirkung",
    estimatedTime: "10", 
    question: "Was ist das <span class='text-[#A6805B] font-bold'>Ergebnis</span> dieser neuen Frequenz in deinem Leben?",
    instruction: "Erschaffe deine neue Frequenz:\n\nDu hast neue Gedanken, Gefühle, Körperempfindungen und Taten erschaffen.\n\nJetzt kommt die Ernte: **Welche Realität erschaffst du durch diese neue Frequenz?**\n\n**5-SINNE-VISUALISIERUNG:**\n\nStelle dir vor, es ist 3 Monate in der Zukunft. Dein Wunsch ist erfüllt.\n\n**Schließe die Augen. Male dir eine SZENE aus, die impliziert, dass dein Wunsch erfüllt ist.**\n\n**1. Was SIEHST du?**\n- Dein Bankkonto? Deine Wohnung? Deine Beziehungen?\n\n**2. Was HÖRST du?**\n- Lob? Dankbarkeit? Lachen? Musik?\n\n**3. Was FÜHLST du?**\n- Freude? Frieden? Liebe? Leichtigkeit?\n\n**4. Was RIECHST du?**\n- Frische Luft? Gutes Essen? Blumen?\n\n**5. Was SCHMECKST du?**\n- Erfolg? Fülle? Leben?\n\n**Beschreibe diese Szene in 5-10 Sätzen.**\n\nSchreibe SO, als wäre es JETZT schon da.\n\nDas ist deine neue Realität. Das ist deine Schöpfung.",
    instructionClass: "font-light",
    placeholder: "Mein Leben ist...",
    knowledgeBox: "**Deine Frequenz erschafft deine Realität.**\n\nDr. Joe Dispenza sagt: 'Deine Energie zieht deine Realität an.'\n\n**Deine alte Frequenz (Gedanken, Gefühle, Körper, Taten) hat deine alte Realität erschaffen.**\n\nDeine NEUE Frequenz (Gedanken, Gefühle, Körper, Taten) erschafft deine NEUE Realität.\n\n**Das ist das Gesetz der Anziehung. Das ist Quantenphysik. Das ist Spiritualität.**\n\nWenn du auf der Frequenz von Mangel schwingst, ziehst du Mangel an.\n\nWenn du auf der Frequenz von Fülle schwingst, ziehst du Fülle an.\n\n**Das ist keine Esoterik. Das ist Wissenschaft.**\n\nDeine Gedanken senden Signale aus.\n\nDeine Gefühle verstärken diese Signale.\n\nDein Körper verankert diese Signale.\n\nDeine Taten manifestieren diese Signale.\n\n**Und die Realität antwortet.**\n\nDas ist die Macht der Transformation.",
    tip: "**Wie beschreibe ich meine neue Realität?**\n\n**1. SEI SPEZIFISCH:**\n\nNicht: 'Ich bin glücklich'\n\nSondern: 'Ich wache morgens auf und fühle Freude. Ich habe genug Geld für alles, was ich brauche. Ich bin umgeben von Menschen, die mich lieben.'\n\n**2. NUTZE ALLE SINNE:**\n\n- Was SIEHST du? (Dein Bankkonto, deine Wohnung, deine Beziehungen)\n- Was HÖRST du? (Lob, Dankbarkeit, Lachen)\n- Was FÜHLST du? (Freude, Frieden, Liebe)\n- Was RIECHST du? (Frische Luft, gutes Essen)\n- Was SCHMECKST du? (Erfolg, Fülle, Leben)\n\n**3. SCHREIBE IN DER GEGENWART:**\n\nNicht: 'Ich werde reich sein'\n\nSondern: 'Ich BIN finanziell frei'\n\n**4. FÜHLE ES:**\n\nNicht nur denken. Sondern FÜHLEN.\n\nSchließe die Augen. Stelle dir vor, wie es sich anfühlt, diese Realität JETZT zu leben.\n\n**Das ist keine Fantasie. Das ist Schöpfung.**\n\nDeine neue Realität existiert bereits im Quantenfeld.\n\nDu musst sie nur noch manifestieren.\n\n**Und das tust du, indem du sie FÜHLST, DENKST und LEBST.**",
    isPart2: true
  },
];

export default function TransformationProcess() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const params = useParams();
  const sessionId = parseInt(params.id || "0");
  
  // Get part parameter from URL (part=1 or part=2)
  const urlParams = new URLSearchParams(window.location.search);
  // No more part parameter - continuous flow from 1-13
  const startStep = 1;
  const FILTERED_STEPS = STEP_INFO; // All steps 1-13
  const [currentStep, setCurrentStep] = useState(startStep);
  const [userInput, setUserInput] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showTransitionScreen, setShowTransitionScreen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showCommitment, setShowCommitment] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [commitment, setCommitment] = useState('');
  const [showKnowledgeBox, setShowKnowledgeBox] = useState(false);
  const [showImpulses, setShowImpulses] = useState(false);
  const [showTip, setShowTip] = useState(false);
  
  // Swipeable handlers
  const handlePrevious = () => {
    if (currentStep > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setUserInput("");
        setTimeout(() => setIsTransitioning(false), 50);
      }, 300);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedDown: () => handleNext(),
    onSwipedUp: () => handlePrevious(),
    preventScrollOnSwipe: false,
    trackMouse: false,
    delta: 50,
  });
  const [showMirror, setShowMirror] = useState(false);
  const [showRecognition, setShowRecognition] = useState(false);
  const [showBridge, setShowBridge] = useState(false);
  const [showMusicPause, setShowMusicPause] = useState(false);
  const [showMusicPause3, setShowMusicPause3] = useState(false);
  const [showNewSelfManifest, setShowNewSelfManifest] = useState(false);
  const [mirrorText, setMirrorText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mirrorAudioUrl, setMirrorAudioUrl] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [healingAudioUrl, setHealingAudioUrl] = useState<string | null>(null);
  const [isGeneratingHealingAudio, setIsGeneratingHealingAudio] = useState(false);
  // Removed: oldSummary, newSummary, summariesLoading, activeTab - no longer needed

  const { data: sessionData, isLoading, refetch: refetchSession } = trpc.transformations.get.useQuery(
    { sessionId },
    { enabled: isAuthenticated && sessionId > 0 }
  );

  const { data: suggestions } = trpc.steps.getSuggestions.useQuery(
    { stepNumber: currentStep, sessionId },
    { enabled: isAuthenticated && sessionId > 0 }
  );

  const updateStepMutation = trpc.steps.update.useMutation();

  const analyzeSessionMutation = trpc.nova.analyze.useMutation({
    onSuccess: () => {
      // Analysis complete, now show download screen
      setShowCommitment(false);
      setShowDownload(true);
    },
    onError: (error) => {
      toast.error('Ups – etwas ist schiefgegangen. Bitte versuche es erneut.');
    },
  });

  const saveCommitmentMutation = trpc.transformations.saveCommitment.useMutation();
  
  const generateMirrorTextMutation = trpc.nova.generateMirrorText.useMutation();
  const generateAudioMutation = trpc.nova.generateAudio.useMutation();
  
  const updateStatusMutation = trpc.transformations.updateStatus.useMutation();
  
  const toggleFavoriteMutation = trpc.transformations.toggleFavorite.useMutation({
    onSuccess: (result) => {
      toast.success(result.isFavorite ? '⭐ Zu Favoriten hinzugefügt!' : 'Aus Favoriten entfernt');
      window.location.reload();
    },
    onError: () => {
      toast.error('Fehler beim Speichern');
    },
  });
  
  const generateMirrorTextWithData = async (data: any) => {
    setIsTyping(true);
    
    // Get steps 1-5 for mirror text from fresh data
    const steps = data.steps;
    const step1 = steps.find((s: any) => s.stepNumber === 1)?.userInput || '';
    const step2 = steps.find((s: any) => s.stepNumber === 2)?.userInput || '';
    const step3 = steps.find((s: any) => s.stepNumber === 3)?.userInput || '';
    const step4 = steps.find((s: any) => s.stepNumber === 4)?.userInput || '';
    const step5 = steps.find((s: any) => s.stepNumber === 5)?.userInput || '';
    
    console.log('=== MIRROR TEXT DEBUG (FRESH DATA) ===');
    console.log('All steps:', steps);
    console.log('Step 1:', step1);
    console.log('Step 2:', step2);
    console.log('Step 3:', step3);
    console.log('Step 4:', step4);
    console.log('Step 5:', step5);
    
    try {
      const result = await generateMirrorTextMutation.mutateAsync({
        sessionId,
        step1, step2, step3, step4, step5
      });
      
      const text = result.text;
      
      // Typewriter effect
      let currentText = '';
      for (let i = 0; i < text.length; i++) {
        currentText += text[i];
        setMirrorText(currentText);
        await new Promise(resolve => setTimeout(resolve, 30)); // 30ms per character
      }
      
      setIsTyping(false);
    } catch (error) {
      console.error('Mirror text generation failed:', error);
      toast.error('Spiegeltext konnte nicht generiert werden.');
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (sessionData?.steps) {
      const step = sessionData.steps.find(s => s.stepNumber === currentStep);
      if (step) {
        setUserInput(step.userInput || "");
      }
    }
  }, [currentStep, sessionData]);

  // Removed: Summary generation useEffect - summaries now only in PDF

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Button onClick={() => setLocation("/")}>Zur Startseite</Button>
      </div>
    );
  }

  const currentStepInfo = STEP_INFO[currentStep - 1];
  const maxStep = 13; // All steps 1-13

  // Removed: handleSuggestionToggle - impulses are now read-only



  const handleNext = async () => {
    await updateStepMutation.mutateAsync({
      sessionId,
      stepNumber: currentStep,
      userInput,
      selectedSuggestions: [],
      isCompleted: true,
    });

    if (currentStep === 5) {
      // After step 5: Show music pause
      setShowMusicPause(true);
      return;
    } else if (currentStep === 9) {
      // After step 9: Show mirror screen
      setShowMirror(true);
      // IMPORTANT: Refetch session data to get updated steps 1-8
      const { data: freshData } = await refetchSession();
      // Generate mirror text with LLM using fresh data
      if (freshData) {
        generateMirrorTextWithData(freshData);
      }
      return;
    } else if (currentStep === 13) {
      // After step 13: Show MusicPause3 (epic motivation)
      setShowMusicPause3(true);
      return;
    } else if (currentStep < maxStep) {
      // Slide up animation
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setUserInput("");
        // Slide in from bottom
        setTimeout(() => setIsTransitioning(false), 50);
      }, 300);
    } else {
      // After step 13: Show celebration flow
      setShowCelebration(true);
    }
  };

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
    setShowComparison(true);
  };

  const handleComparisonComplete = () => {
    setShowComparison(false);
    setShowCommitment(true);
  };

  const handleCommitmentComplete = async () => {
    console.log('handleCommitmentComplete called');
    console.log('Commitment text:', commitment);
    
    try {
      // Save commitment if provided
      if (commitment.trim()) {
        console.log('Saving commitment...');
        await saveCommitmentMutation.mutateAsync({
          sessionId,
          commitment: commitment.trim(),
        });
        console.log('Commitment saved successfully');
      } else {
        console.log('No commitment text, skipping save');
      }
      
      // Always proceed to analysis (runs in background)
      console.log('Starting analysis...');
      analyzeSessionMutation.mutate({ sessionId });
    } catch (error) {
      console.error('Error in handleCommitmentComplete:', error);
      toast.error('Ups – bitte überprüfe deine Eingabe und versuche es erneut.');
    }
  };

  // Transition Screen after Step 8 - "Der Wendepunkt"
  if (showTransitionScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#183847] to-[#244451] flex items-center justify-center p-6 animate-in fade-in duration-1000">
        <div className="max-w-2xl w-full text-center space-y-12 py-8">
          {/* Lotus Flower Symbol - Filigree SVG */}
          <div className="flex justify-center animate-pulse" style={{ animation: 'pulse 3s ease-in-out infinite' }}>
            <svg width="120" height="120" viewBox="n0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#C9A961]">
              {/* Center circle */}
              <circle cx="60" cy="60" r="8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              {/* Inner petals */}
              <path d="M60 52 Q55 45, 60 38 Q65 45, 60 52" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M68 60 Q75 55, 82 60 Q75 65, 68 60" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M60 68 Q65 75, 60 82 Q55 75, 60 68" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M52 60 Q45 65, 38 60 Q45 55, 52 60" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              {/* Diagonal petals */}
              <path d="M54 54 Q45 45, 40 40 Q48 48, 54 54" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M66 54 Q75 45, 80 40 Q72 48, 66 54" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M66 66 Q75 75, 80 80 Q72 72, 66 66" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M54 66 Q45 75, 40 80 Q48 72, 54 66" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              {/* Outer petals */}
              <path d="M60 30 Q50 20, 60 10 Q70 20, 60 30" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M85 45 Q95 35, 105 45 Q95 55, 85 45" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M90 60 Q100 50, 110 60 Q100 70, 90 60" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M85 75 Q95 85, 105 75 Q95 65, 85 75" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M60 90 Q70 100, 60 110 Q50 100, 60 90" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M35 75 Q25 85, 15 75 Q25 65, 35 75" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M30 60 Q20 70, 10 60 Q20 50, 30 60" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M35 45 Q25 35, 15 45 Q25 55, 35 45" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>
          
          {/* Main Quote */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-[#F5F1E8] leading-tight" style={{
              textShadow: '0 1px 0 rgba(255, 255, 255, 0.5), 0 -1px 0 rgba(0, 0, 0, 0.1)'
            }}>
              Der Schmerz des Bleibens ist größer<br/>
              als der Schmerz der Veränderung.
            </h1>
            
            <p className="text-2xl  font-light italic" style={{color: "#E8DCC8"}}>
              Du bist bereit für deine Transformation.
            </p>
          </div>

          {/* Button */}
          <div className="pt-8">
            <Button
              onClick={() => {
                setShowTransitionScreen(false);
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentStep(9);
                  setUserInput("");
                  setTimeout(() => setIsTransitioning(false), 50);
                }, 200);
              }}
              className="border-2 border-[#C9A961] bg-transparent hover:bg-[#C9A961]/10 text-[#C9A961] px-16 py-7 text-2xl font-semibold shadow-lg hover:shadow-[#C9A961]/30 transition-all duration-300 rounded-full"
            >
              Ich bin bereit
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Old transition screen code - REMOVED
  if (false && showTransitionScreen) {
    // Get completed steps data
    const step1 = sessionData?.steps?.find(s => s.stepNumber === 1);
    const step2 = sessionData?.steps?.find(s => s.stepNumber === 2);
    const step3 = sessionData?.steps?.find(s => s.stepNumber === 3);
    const step4 = sessionData?.steps?.find(s => s.stepNumber === 4);
    const step5 = sessionData?.steps?.find(s => s.stepNumber === 5);

    // Create emotional pain monologue from user inputs or selected suggestions
    const getStepText = (step: any) => {
      if (step?.userInput && step.userInput.trim()) {
        return step.userInput;
      }
      if (step?.selectedSuggestions) {
        try {
          const suggestions = JSON.parse(step.selectedSuggestions);
          return suggestions.join('. ');
        } catch {
          return '';
        }
      }
      return '';
    };

    const thoughts = getStepText(step1);
    const feelings = getStepText(step2);
    const body = getStepText(step3);
    const actions = getStepText(step4);
    const results = getStepText(step5);
    
    // Debug logging
    console.log('Old Frequency Debug:');
    console.log('Step 1:', step1);
    console.log('Step 2:', step2);
    console.log('Step 3:', step3);
    console.log('Step 4:', step4);
    console.log('Step 5:', step5);
    console.log('Thoughts:', thoughts);
    console.log('Feelings:', feelings);
    console.log('Body:', body);
    console.log('Actions:', actions);
    console.log('Results:', results);

    // Build emotional monologue with short, painful sentences
    const painMonologue = `${thoughts} ${feelings} ${body} ${actions} ${results}`
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .join('. ') + '.';

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#1A0F2E] to-[#0A0A0A] flex items-center justify-center p-6 animate-in fade-in duration-1000 overflow-y-auto">
        <div className="max-w-3xl w-full space-y-12 py-8">
          <div className="text-6xl text-center mb-8 animate-pulse">🔮</div>
          
          {/* Old Frequency - Emotional Pain Monologue */}
          <div className="space-y-6 p-8 rounded-2xl border-2 border-purple-500/30 bg-purple-950/20 backdrop-blur-sm shadow-2xl">
            <h2 className="text-3xl font-semibold text-purple-300 text-center leading-tight">
              Meine alte Frequenz
            </h2>
            
            <div className="space-y-6 text-left">
              <p className="text-lg  leading-relaxed font-light" style={{color: "#E8DCC8"}}>
                {painMonologue}
              </p>
            </div>
            
            <div className="pt-4 border-t border-purple-500/20">
              <p className="text-center text-purple-300 text-xl font-light italic">
                Das ist der Schmerz des Bleibens.
              </p>
            </div>
          </div>

          <div className="text-center space-y-8 pt-8">
            <Button
              onClick={() => {
                setShowTransitionScreen(false);
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentStep(9);
                  setUserInput("");
                  setTimeout(() => setIsTransitioning(false), 50);
                }, 200);
              }}
              className="bg-transparent border-2 border-[#C9A961]  hover:bg-[#C9A961]/10 px-12 py-6 text-xl font-medium transition-all duration-300" style={{color: "#A6805B"}}
            >
              Ich ändere meine Frequenz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Celebration Screen (Step 1: Emotional Peak)
  if (showCelebration) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F1E8] via-[#183847] to-[#F5F1E8] flex items-center justify-center p-6 animate-in fade-in duration-1000">
        <div className="text-center space-y-8 max-w-lg">

          
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-[#F5F1E8]" style={{
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              DU HAST ES GESCHAFFT!
            </h1>
            
            <p className="text-xl font-light " style={{color: "#E8DCC8"}}>
              Du hast deine neue Realität erschaffen.
            </p>
            
            <p className="text-lg font-light text-[#C9A961]">
              Deine Frequenz hat sich verändert.
            </p>
          </div>

          <Button
            onClick={() => {
              handleCelebrationComplete();
            }}
            className="bg-transparent border-2 border-[#C9A961]  hover:bg-[#C9A961]/10 px-8 py-6 text-lg font-medium mt-8" style={{color: "#A6805B"}}
          >
            Meine Transformation ansehen
          </Button>
        </div>
      </div>
    );
  }

  // Skip New Frequency Screen - go directly to Commitment
  if (showComparison) {
    // Auto-advance to commitment screen
    setShowComparison(false);
    setShowCommitment(true);
    return null;
  }

  // Old code (removed):
  if (false) {
    // Get completed steps data for new frequency
    const step9 = sessionData?.steps?.find(s => s.stepNumber === 9);
    const step10 = sessionData?.steps?.find(s => s.stepNumber === 10);
    const step11 = sessionData?.steps?.find(s => s.stepNumber === 11);
    const step12 = sessionData?.steps?.find(s => s.stepNumber === 12);
    const step13 = sessionData?.steps?.find(s => s.stepNumber === 13);

    // Create emotional joy monologue from user inputs or selected suggestions
    const getStepText = (step: any) => {
      if (step?.userInput && step.userInput.trim()) {
        return step.userInput;
      }
      if (step?.selectedSuggestions) {
        try {
          const suggestions = JSON.parse(step.selectedSuggestions);
          return suggestions.join('. ');
        } catch {
          return '';
        }
      }
      return '';
    };

    const newThoughts = getStepText(step9);
    const newFeelings = getStepText(step10);
    const newBody = getStepText(step11);
    const newActions = getStepText(step12);
    const newResults = getStepText(step13);

    // Build emotional monologue with joyful, empowering sentences
    const joyMonologue = `${newThoughts} ${newFeelings} ${newBody} ${newActions} ${newResults}`
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .join('. ') + '.';

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#183847] via-[#2C5F6F] to-[#244451] flex items-center justify-center p-6 animate-in fade-in duration-1000 overflow-y-auto">
        <div className="max-w-3xl w-full space-y-12 py-8">

          
          {/* New Frequency - Emotional Joy Monologue */}
          <div className="space-y-6 p-8 rounded-2xl border-2 border-[#A6805B]/40 bg-gradient-to-br from-[#A6805B]/10 to-[#A6805B]/5 backdrop-blur-sm shadow-2xl shadow-[#A6805B]/20">
            <h2 className="text-3xl font-semibold  text-center leading-tight" style={{color: "#A6805B"}}>
              Meine neue Frequenz
            </h2>
            
            <div className="space-y-6 text-left">
              <p className="text-lg  leading-relaxed font-light" style={{color: "#E8DCC8"}}>
                {joyMonologue}
              </p>
            </div>
            
            <div className="pt-4 border-t border-[#A6805B]/20">
              <p className="text-center  text-xl font-light italic" style={{color: "#A6805B"}}>
                Das ist die Freude meiner Transformation.
              </p>
            </div>
          </div>

          <div className="text-center space-y-6 pt-4">
            <p className="text-2xl font-light text-[#F5F1E8] leading-relaxed" style={{
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              Ich habe meine innere Frequenz geändert.
            </p>
            <p className="text-lg font-light " style={{color: "#E8DCC8"}}>
              Jetzt gilt es, sie jeden Tag zu leben.
            </p>
            
            {/* Empowerment Quote */}
            <div className="pt-4">
              <p className="text-base italic font-light text-[#9B8B7E] max-w-2xl mx-auto">
                „Deine Vorstellungskraft ist die Vorschau auf die kommenden Attraktionen des Lebens.“
              </p>
              <p className="text-sm font-light  mt-2" style={{color: "#A6805B"}}>
                – Albert Einstein
              </p>
            </div>
            
            <Button
              onClick={handleComparisonComplete}
              className="bg-transparent border-2 border-[#C9A961]  hover:bg-[#C9A961]/10 px-12 py-6 text-xl font-medium transition-all duration-300" style={{color: "#A6805B"}}
            >
              Meine Transformation verankern
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Music Pause (After Step 5)
  if (showMusicPause) {
    return (
      <MusicPause
        duration={180} // 3 minutes
        onComplete={() => {
          setShowMusicPause(false);
          setCurrentStep(6);
          setUserInput("");
        }}
      />
    );
  }

  // Music Pause 2 removed - direct flow from Kompass to Teil 2

  // Music Pause 3 (Epic Motivation - After Teil 2)
  if (showMusicPause3) {
    return (
      <MusicPause3
        onContinue={() => {
          setShowMusicPause3(false);
          setShowNewSelfManifest(true);
        }}
      />
    );
  }

  // New Self Manifest (After MusicPause3)
  if (showNewSelfManifest && sessionData?.session?.id) {
    return (
      <NewSelfManifest
        sessionId={sessionData.session.id}
        onContinue={async () => {
          // Mark session as completed
          await updateStatusMutation.mutateAsync({
            sessionId,
            status: 'completed'
          });
          // Set flag for unlock animation
          sessionStorage.setItem('showPart2Unlock', 'true');
          // Go to home
          setLocation('/home');
        }}
      />
    );
  }

  // Mirror Screen (Phase 1: Der Spiegel)
  if (showMirror) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#183847] to-[#2C5F6F] flex items-center justify-center p-6">
        <div className="max-w-3xl w-full space-y-12">
          {/* Loading State - Show while AI generates text */}
          {!mirrorText && (
            <div className="text-center space-y-8 animate-in fade-in duration-500">
              {/* Spinner */}
              <div className="flex justify-center">
                <div className="w-16 h-16 border-4 border-[#C9A961]/30 border-t-[#A6805B] rounded-full animate-spin"></div>
              </div>
              
              {/* Loading Text */}
              <div className="space-y-4">
                <p className="text-2xl  font-medium" style={{color: "#A6805B"}}>
                  Deine innere Stimme wird sichtbar...
                </p>
                <p className="text-lg text-[#F5F1E8]/60 font-light">
                  Einen Moment Geduld
                </p>
              </div>
            </div>
          )}
          
          {/* Mirror Text with Typewriter Effect */}
          {mirrorText && (
            <div className="text-center space-y-8">
              <p className="text-2xl md:text-3xl text-[#F5F1E8] leading-relaxed font-light whitespace-pre-wrap">
                {mirrorText}
              </p>
            </div>
          )}

          {/* Question appears after typing is complete */}
          {!isTyping && mirrorText && (
            <div className="space-y-8 animate-in fade-in duration-1000">
              <div className="text-center">
                <p className="text-2xl  font-medium" style={{color: "#A6805B"}}>
                  Erkennst du dich darin wieder?
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-4 max-w-md mx-auto">
                <Button
                  onClick={() => {
                    setShowMirror(false);
                    setShowRecognition(true);
                  }}
                  className="bg-transparent border-2 border-[#C9A961]  hover:bg-[#C9A961]/10 px-8 py-6 text-lg font-medium" style={{color: "#A6805B"}}
                >
                  Ja, das bin ich.
                </Button>
                <Button
                  onClick={() => {
                    // TODO: Go back to edit answers
                    toast.info('Diese Funktion kommt bald!');
                  }}
                  variant="ghost"
                  className="text-[#F5F1E8]/60 hover:text-[#F5F1E8] text-sm"
                >
                  Nein, etwas fühlt sich nicht stimmig an.
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Kompass zur Heilung (Wendepunkt-Hub)
  if (showRecognition) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#183847] to-[#2C5F6F] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Golden light glow in center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 bg-[#A6805B] rounded-full blur-[120px] opacity-20 animate-pulse"></div>
        </div>

        <div className="max-w-3xl w-full space-y-12 relative z-10">
          {/* Überschrift */}
          <div className="text-center relative">
            <h1 className="text-4xl md:text-5xl font-semibold  leading-tight" style={{color: "#A6805B", textShadow: '0 2px 8px rgba(212, 175, 55, 0.3)'}}>
              Die Heilung
            </h1>
            <p className="text-2xl text-[#F5F1E8] font-light mt-6">
              Der erste Schritt ist getan.
            </p>
            
            {/* Favorite Button */}
            <button
              onClick={() => {
                toggleFavoriteMutation.mutate({ sessionId });
              }}
              className="absolute top-0 right-0 p-2 hover:scale-110 transition-transform"
              aria-label="Zu Favoriten hinzufügen"
              disabled={toggleFavoriteMutation.isPending}
            >
              <span className="text-3xl">
                {sessionData?.session?.isFavorite ? '⭐' : '☆'}
              </span>
            </button>
          </div>

          {/* Audio Player - Main Element */}
          <div className="flex justify-center">
            <AudioPlayer
              className="w-full max-w-2xl"
              audioUrl={healingAudioUrl || undefined}
              isLoading={isGeneratingHealingAudio}
              onGenerate={async () => {
                setIsGeneratingHealingAudio(true);
                try {
                  const result = await generateAudioMutation.mutateAsync({
                    sessionId,
                    type: 'healing'
                  });
                  setHealingAudioUrl(result.audioUrl);
                } catch (error) {
                  console.error('Healing audio generation failed:', error);
                } finally {
                  setIsGeneratingHealingAudio(false);
                }
              }}
            />
          </div>

          {/* Continue to Bridge Screen */}
          <div className="text-center">
            <Button
              onClick={() => {
                setShowRecognition(false);
                setShowBridge(true);
              }}
              className="bg-transparent border-2 border-[#A6805B]  hover:bg-[#A6805B]/10 px-8 py-4 text-lg font-medium" style={{color: "#A6805B"}}
            >
              Weiter
            </Button>
          </div>


        </div>
      </div>
    );
  }

  // Bridge Screen - Transition from Teil 1 to Teil 2
  if (showBridge) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A1F2E] via-[#183847] to-[#0A1F2E] flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-3xl w-full space-y-8 sm:space-y-12 text-center px-4">
          {/* Heading */}
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight" style={{color: "#A6805B", textShadow: '0 2px 8px rgba(212, 175, 55, 0.3)'}}>
              Der erste Schritt ist getan.
            </h1>
            <p className="text-xl sm:text-2xl text-[#E8DCC8] font-light">
              Du hast das Alte erkannt. Du hast die Heilung erfahren.
            </p>
          </div>

          {/* Body Text */}
          <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-[#E8DCC8] leading-relaxed">
            <p>
              Jetzt beginnt der zweite Teil deiner Transformation:
              <strong className="text-[#D4AF37]"> Die Erschaffung des Neuen.</strong>
            </p>
            <p>
              In den nächsten Schritten wirst du deine neue Realität formen.
              Du wirst die Person werden, die du sein möchtest.
            </p>
            <p className="text-[#D4AF37] font-medium">
              Es gibt keine Eile. Nimm dir die Zeit, die du brauchst.
            </p>
          </div>

          {/* PDF Download Option */}
          <div className="bg-[#183847]/50 p-6 rounded-lg border border-[#D4AF37]/30 space-y-4">
            <p className="text-[#E8DCC8]">
              Möchtest du deine bisherige Transformation als PDF herunterladen?
            </p>
            <Button
              onClick={async () => {
                if (sessionData) {
                  const { download3ChapterPDF } = await import('@/lib/download3ChapterPDF');
                  await download3ChapterPDF(sessionData);
                }
              }}
              className="bg-transparent border-2 border-[#A6805B] hover:bg-[#A6805B]/10 px-6 py-3 text-base font-medium w-full truncate"
              style={{color: "#A6805B"}}
            >
              PDF herunterladen (Teil 1: Die Heilung)
            </Button>
          </div>

          {/* Continue Button */}
          <div className="pt-8">
            <Button
              onClick={() => {
                setShowBridge(false);
                setCurrentStep(9);
                setUserInput("");
              }}
              className="w-full max-w-md mx-auto bg-gradient-to-r from-[#D4AF37] to-[#A6805B] hover:from-[#A6805B] hover:to-[#8B7355] text-[#0A1F2E] px-8 py-6 text-xl font-bold"
            >
              Weiter zu Teil 2: Die Erschaffung
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Commitment Screen (Step 3: 24h Action)
  if (showCommitment) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#183847] to-[#2C5F6F] flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-semibold" style={{color: "#A6805B", textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'}}>
              Deine neue Frequenz ist erschaffen.
            </h1>
            <p className="text-xl font-light text-[#F5F1E8]">
              Jetzt gilt es, sie zu leben.
            </p>
          </div>

          <div className="space-y-4 p-6 rounded-lg border-2 border-[#C9A961] bg-[#183847]/30 backdrop-blur-sm">
            <label className="block text-lg font-medium text-[#F5F1E8]">
              Wenn du bereits die Person wärst, die du sein willst – was wäre die EINE Sache,
              die du heute ganz selbstverständlich tun würdest?
            </label>
            
            <textarea
              value={commitment}
              onChange={(e) => setCommitment(e.target.value)}
              placeholder="Z.B.: Ich werde heute bewusst 10 Minuten meditieren und meine neuen Gedanken wiederholen..."
              className="w-full h-32 px-4 py-3 rounded-lg bg-transparent border-2 border-[#C9A961] text-[#E5E5E5] placeholder:text-[#E5E5E5]/40 focus:outline-none focus:border-[#A6805B] focus:ring-2 focus:ring-[#A6805B]/20 resize-none"
            />
          </div>

          <div className="text-center">
            <Button
              onClick={() => {
                console.log('Button clicked!');
                handleCommitmentComplete();
              }}
              type="button"
              className="bg-transparent border-2 border-[#C9A961]  hover:bg-[#C9A961]/10 px-8 py-4 text-lg font-medium" style={{color: "#A6805B"}}
              disabled={analyzeSessionMutation.isPending}
            >
              {analyzeSessionMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Erstelle dein Manifest...
                </>
              ) : (
                commitment.trim() ? 'Ich verpflichte mich' : 'Weiter'
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Download Screen (after analysis is complete)
  if (showDownload) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#183847] to-[#244451] flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <Sparkles className="w-16 h-16 " style={{color: "#A6805B"}} />
            </div>
            <h1 className="text-4xl font-bold text-[#F5F1E8]" style={{
              textShadow: '0 1px 0 rgba(255, 255, 255, 0.5), 0 -1px 0 rgba(0, 0, 0, 0.1)'
            }}>
              Dein Transformations-Manifest ist bereit!
            </h1>
            <p className="text-xl font-light " style={{color: "#E8DCC8"}}>
              Lade es herunter, drucke es aus, hänge es auf.
            </p>
            <p className="text-lg font-extralight text-[#9B8B7E]">
              Deine neue Frequenz, in deinen eigenen Worten.
            </p>
          </div>

          <div className="bg-white/60 border-2 border-[#C9A961] rounded-lg p-6 space-y-3">
            <p className="text-base font-medium text-[#F5F1E8] flex items-center gap-2">
              <span>🧡</span>
              Reflexion
            </p>
            <p className="text-sm  leading-relaxed" style={{color: "#E8DCC8"}}>
              Wie wirst du dich daran erinnern, deine neue Frequenz täglich zu leben?
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={async () => {
                if (sessionData) {
                  const { downloadTransformationsManifest } = await import('@/lib/pdfDownload');
                  await downloadTransformationsManifest(sessionData);
                }
              }}
              className="w-full bg-transparent border-2 border-[#C9A961]  hover:bg-[#C9A961]/10 px-8 py-6 text-xl font-medium transition-all duration-300" style={{color: "#A6805B"}}
            >
              <Download className="w-5 h-5 mr-2" />
              Mein Manifest herunterladen
            </Button>

            <Button
              onClick={() => setLocation('/')}
              variant="outline"
              className="w-full py-6 text-sm sm:text-base md:text-lg border-2 border-[#C9A961] text-[#F5F1E8] hover:bg-[#C9A961]/10 whitespace-normal break-words"
            >
              <Home className="w-5 h-5 mr-2" />
              Zurück zur Startseite
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-1000 bg-gradient-to-b from-[#183847] to-[#2C5F6F]`}>
      {/* Header with Home Button */}
      <div className={`sticky top-0 z-10 backdrop-blur-sm bg-[#183847]/95`}>
        <div className="px-4 py-3 flex justify-between items-center">
          <span className={`text-xs font-light tracking-wide text-[#E8DCC8]`}>
            {currentStep <= 8 ? `Teil 1 • ~${currentStepInfo.estimatedTime || '5'} Min` : `Teil 2 • ~${currentStepInfo.estimatedTime || '5'} Min`}
          </span>
          <Button onClick={() => setLocation("/")} variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Home className="w-3.5 h-3.5 icon-gold" />
          </Button>
        </div>
        <div className="divider-gold" />
      </div>

      {/* Main Content with Fade Transition */}
      <div 
        {...swipeHandlers}
        className="flex-1 flex flex-col p-6 pb-32"
      >
        <div 
          className={`max-w-2xl mx-auto w-full space-y-8 flex-1 flex flex-col transition-all duration-500 ease-out ${
            isTransitioning ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'
          }`}
        >
          {/* Question */}
          <div className="text-center space-y-4">
            {/* Removed: Ursache-Wirkung Hinweis nach Schritt 5 */}
            <h1 
              className="text-3xl md:text-4xl font-bold leading-tight"
              style={{color: "#A6805B", textShadow: currentStep >= 9 ? '0 1px 0 rgba(255, 255, 255, 0.5), 0 -1px 0 rgba(0, 0, 0, 0.1)' : '0 2px 4px rgba(0, 0, 0, 0.3)'}}
              dangerouslySetInnerHTML={{ __html: currentStepInfo.question }}
            />
            <p className={`text-base max-w-xl mx-auto font-light ${
              currentStep >= 9 ? 'text-[#E8DCC8]' : 'text-[#E8DCC8]'
            }`}>
              {currentStepInfo.getInstruction && sessionData?.session?.theme 
                ? currentStepInfo.getInstruction(sessionData.session.theme)
                : currentStepInfo.instruction}
            </p>
            {/* Example text removed for steps 1-12 - now in Impulses */}
            {currentStep > 12 && (
              <p className={`text-sm italic max-w-xl mx-auto font-extralight ${
                currentStep >= 9 ? 'text-[#9B8B7E]' : 'text-[#E8DCC8]'
              }`}>
                {sessionData.session.theme && THEME_EXAMPLES[sessionData.session.theme]?.[currentStep]}
              </p>
            )}
            {/* Steps 1-12: 3 buttons side by side */}
            {(currentStep >= 1 && currentStep <= 12) && (
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="flex flex-row gap-2 justify-center flex-wrap">
                  {/* Knowledge Box Button */}
                  {currentStepInfo.knowledgeBox && (
                    <button
                      onClick={() => setShowKnowledgeBox(!showKnowledgeBox)}
                      className="text-sm font-medium flex items-center gap-2 px-6 py-3 rounded-lg transition-colors bg-white/10 border border-[#A6805B]/30 hover:bg-white/20 relative z-10 touch-manipulation" style={{color: "#A6805B"}}
                    >
                      <span className="text-lg">💡</span>
                      Warum wichtig?
                    </button>
                  )}
                  {/* Impulses Button */}
                  <button
                    onClick={() => setShowImpulses(!showImpulses)}
                    className="text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-white/10 border border-[#A6805B]/30  hover:bg-white/20" style={{color: "#A6805B"}}
                  >
                    <span className="text-lg">💡</span>
                    Inspiration?
                  </button>
                  {/* Tip Button */}
                  {currentStepInfo.tip && (
                    <button
                      onClick={() => setShowTip(!showTip)}
                      className="text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-white/10 border border-[#A6805B]/30  hover:bg-white/20" style={{color: "#A6805B"}}
                    >
                      <span className="text-lg">💫</span>
                      Tipp
                    </button>
                  )}
                </div>
                
                {/* Knowledge Box Content */}
                {showKnowledgeBox && currentStepInfo.knowledgeBox && (
                  <div className="mt-3 p-4 rounded-lg border bg-white/10 border-[#A6805B] " style={{color: "#E8DCC8"}}>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{currentStepInfo.knowledgeBox}</p>
                  </div>
                )}
                
                {/* Impulses Content - moved here from below textarea */}
                {showImpulses && suggestions && Array.isArray(suggestions) && suggestions.length > 0 && (
                  <div className="mt-3 p-4 rounded-lg border bg-white/10 border-[#A6805B]">
                    <p className="text-sm  mb-3" style={{color: "#E8DCC8"}}>Hier siehst du, wie andere Menschen sich zu diesem Thema <strong>ausgesprochen</strong> haben. Sie haben nicht nur einen Gedanken aufgeschrieben, sondern alles rausgelassen.</p>
                    <div className="space-y-3">
                      {suggestions.map((suggestion, idx) => (
                        <p key={idx} className="text-sm  leading-relaxed italic" style={{color: "#E8DCC8"}}>
                          "{suggestion}"
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Tip Content */}
                {showTip && currentStepInfo.tip && (
                  <div className="mt-3 p-4 rounded-lg border bg-white/10 border-[#A6805B] " style={{color: "#E8DCC8"}}>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{currentStepInfo.tip}</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Duplicate buttons removed - using top section only */}
            {currentStepInfo.mindfulnessHint && (
              <div className="mt-6 max-w-2xl mx-auto p-5 rounded-lg bg-gradient-to-r from-[#C9A961]/10 to-[#A6805B]/10 border-2 border-[#C9A961]">
                <p className="text-sm leading-relaxed  italic" style={{color: "#E8DCC8"}}>
                  🧘‍♀️ {currentStepInfo.mindfulnessHint}
                </p>
              </div>
            )}
            {currentStepInfo.empowermentHint && (
              <div className="mt-6 max-w-2xl mx-auto p-5 rounded-lg bg-gradient-to-r from-[#C9A961]/10 to-[#A6805B]/10 border-2 border-[#C9A961]">
                <p className="text-sm leading-relaxed  italic" style={{color: "#E8DCC8"}}>
                  ⚡ {currentStepInfo.empowermentHint}
                </p>
              </div>
            )}
          </div>

          {/* User Input */}
          <div className="space-y-3">
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={currentStepInfo.placeholder}
              className={`${currentStep === 1 ? 'min-h-[300px] max-h-[300px]' : 'min-h-[180px] max-h-[180px]'} text-base resize-none ${
                currentStep >= 9 
                  ? 'textarea-gold' 
                  : 'textarea-part1'
              }`}
            />
            {/* Duplicate impulse section removed - using top section only */}
          </div>
        </div>
      </div>

      {/* Progress dots removed - swipe to navigate */}
      {/* Fixed Bottom Button */}
      {/* Navigation button removed - swipe to navigate */}

    </div>
  );
}


