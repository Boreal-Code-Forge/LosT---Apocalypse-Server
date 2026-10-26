# Spieler-Wiki · Abgleich und Neugestaltung

26.10.2026, Europe/Berlin. Auftrag: aktuellen Projektstand einarbeiten,
überholte Inhalte entfernen und das Wiki neu gestalten.

Quelle ist der veröffentlichte Spielprojektstand
`654c24411e60ba5a989cb40e4d6dad08d2d4abf5`. Ressourcenübersicht mit 44 eigenen
Ressourcen, aktuelle Fach-READMEs, jüngere Umsetzungsnachweise, Roadmap und
betroffene Spielregeln wurden zur redaktionellen Einordnung herangezogen.
Nicht jede Zeile des Gesamtprojekts wurde auf Fehler geprüft; dies ist ein
inhaltlicher Spielerhandbuch-Abgleich, kein erneuter technischer Gesamtaudit.
Keine offenen lokalen Teamänderungen als veröffentlichten Stand übernommen.

## Ergebnis

- 34 Anleitungen, ein leerer tatsächlich geplanter Bereich; alle 29 bisherigen
  Artikeladressen erhalten. Fünf alte Platzhalter haben jetzt Inhalte,
  sechs neue Themen ergänzen den Bestand.
- Camp-2-Grundstücke, persönliche Claims, Hammermodus, Ausbauten, Stromnetz,
  Naturgewinnung, Farming, Angeln, Berufe und 13 Fachbäume beschrieben.
- Fraktionslore, Beitritt/Ruf, NPC-Handel, Wochenversorgung, Einnahmen,
  Outlaw-Gegenangriffe, offizielle Rufplätze und Konvois erklärt.
- Kein erfundener automatischer Händlerkatalog; Konvois ausdrücklich als
  Versorgungseinheiten, nicht als frei entnehmbare Inventarware dokumentiert.
- Grundlegende Schutzkleidung, Helme, Funk und heutige Direktbetankung ergänzt.
- Zehn überholte UI-Aufnahmen entfernt, aktuellen Creator unverändert kopiert.
  Atlas unverändert und seine historischen Gebietsmarkierungen klar datiert.
- Original-GIF sichtbar; beschrifteter Wiki-Banner nur für Vorschau-Metadaten.

## Prüfungen

`tools/build-site.mjs`, `tools/check-site.mjs`, `tools/check-wiki-content.mjs`
und `tools/wiki-sources.mjs` bestanden. 38 erzeugte HTML-Seiten mit geprüften
Links, Bildern, Abschnittsankern und JSON. Medien per SHA256 geprüft;
Quellenzuordnung pro Artikel in `content/wiki-sources.json`.

`layout-checks.json`: echte Browserdarstellung in lokalen Iframes mit 320,
390, 768, 1280 und 1920 Pixeln Breite, sieben Einstieg-/Artikelkombinationen.
Anfangs ein durch lange Kartentitel ausgelöster Überlauf bei 320 Pixeln;
gezielt auf flexible Gridspalten und Wortumbruch korrigiert. Danach kein
horizontaler Seitenüberlauf oder defektes bereits geladenes Bild.
Lazy-Bilder außerhalb der Sichtfläche sind dabei keine Ladefehler.

Suche „Konvoi“ und „Farming“, leere Trefferliste, Suchfeld leeren, Filter
„Fraktionen & Konflikt“, Artikellinks und mobile Themenübersicht tatsächlich
bedient. Browserbilder unverändert: `wiki-desktop.png`, `wiki-mobile.png`.

Vorhandene Regelwerktexte und authentifizierte F4-Brücke bleiben bytegleich.
Kein Spielserver-Deployment, keine Datenbankänderung, kein Spiel-/Ressourcenstart.
Native Ingame-Bedienung ist von diesen Websiteprüfungen getrennt.

## Veröffentlichung bestätigt

Nach ausdrücklichem Betreiber-Go am 26.10.2026 gepusht und veröffentlicht:
Website-Commit `8591eabd3883b25219b08ac73f3598e90c19835d`,
[Pages-Lauf 40299082939](https://github.com/Boreal-Code-Forge/LosT---Apocalypse-Server/actions/runs/40299082939)
abgeschlossen mit `success`.

`public-verification.json`: 42 öffentliche Dateien vollständig heruntergeladen
und SHA256-bytegleich bestätigt: Wiki-Einstieg und alle 35 Artikel, beide
Gestaltungsdateien, neuer Creator sowie unveränderte Regelwerkseiten und
F4-Brücke. Drei stichprobenartig geprüfte entfernte Screenshotadressen liefern
404. Veröffentlichte Startseite: `wiki-public.png`.

Originale unveränderte F4-Hülle unter dem vorgesehenen lokalen Vorschauursprung
8772 geöffnet. Wiki-Auswahl lädt die neue öffentliche Website; interner Link
öffnet die Konvoi-Anleitung im selben Rahmen. F4 aus dem Websitefokus schließt
die Hülle und entlädt den iframe. `wiki-f4-browser.png` zeigt die eingebettete
Anleitung. Das ist eine echte Browserprüfung der Einbettung, keine native
FiveM-/CEF-Abnahme. Websiteaktualisierung benötigt keinen Spielserverneustart.

Die Nachweisarchivierung ändert nach dem Website-Commit keine ausgelieferten
Seitendateien und benötigt keinen weiteren Pages-Lauf.
