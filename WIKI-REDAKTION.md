# Wiki · erste Redaktion am 17.10.2026

Auf Betreiberauftrag Spieler-Wiki aus dem offiziellen Git-Stand abgeleitet. Maßgeblicher Commit und Quelldatei-Objekte stehen in `content/wiki-sources.json`. Lokale offene Änderungen im offiziellen Checkout nicht übernommen. Keine Server-/Datenbank-/Discord-Aktion.

## Umfang

22 Anleitungen: Einstieg, Steuerung, Inventar, Loot, Handwerk/Kochen, Medizin, Fähigkeiten, Fahrzeuge, Mechanik/Forschung, Fahrzeuglager/Bergung, Camp, Lager/Wohnen, Jagd, Betriebsstoffe/Strom, Orientierung/HUD, Social, Gebiete, Zombies, Ereignisse, Jahreszeiten, Gesten/Sitzplätze und Welt-Radios.

Sechs Bereiche ausschließlich als „Bald verfügbar“ ohne Anleitung: Angeln, Farming, Fraktionen/Reputation, Berufswahl/Startskillung, Überlebensbaum, Körpertemperatur/Wetterschutz.

## Redaktionelle Grenzen

- Ressourcendokumentation und aktuelle Codebelege haben Vorrang vor historischen Übersichtswerten. Ältere Knowledge-Base-Texte nennen unter anderem inzwischen überholte Wochenzeitpunkte oder offene Medizin-/Werkstattfunktionen. Dafür jüngere spezialisierte Quellen verwendet.
- Keine vermuteten Händler-/Fraktionsabläufe, fertigen Berufspakete, angelbaren Fischarten, Körpertemperaturschäden oder Termine erfunden.
- Keine exakten dynamischen Rezepte, vollständigen Itemkataloge, internen Adminbefehle, privaten Projektprotokolle, Zugangsdaten oder Serveradressen exportiert.
- Allgemeine Anleitungen beschreiben den dokumentierten Implementierungsstand. Sie behaupten keine neue Laufzeit-/Multiplayerabnahme; Werte und Freigaben können vom Betreiber geändert sein. Der öffentliche Footer verweist einmalig auf die aktuellen Spielhinweise.
- Stabile Artikeladressen, Quellenzuordnung und lesender Änderungsvergleich erlauben spätere gezielte redaktionelle Aktualisierung. Neue Funktionen ohne bestehende Quellenzuordnung weiterhin gesondert sichten.

## Prüfung vor Veröffentlichung

- Build und Prüfung aller lokalen Links, Assets, Abschnittsziele und eingebetteter JSON-Daten.
- Quellenvergleich gegen die aufgezeichneten Git-Objekte; geplante Artikel dürfen keine Inhaltsabschnitte besitzen.
- Browser: Desktop-Einstieg, Volltextsuche nach „Batterie“, Treffer zu Fahrzeugen und Mechanik, Artikelansicht, Themenfilter „Unterwegs“, mobiler Artikel bei 390 Pixeln ohne horizontalen Überlauf, mobile Navigation und leerer Angeln-Platzhalter. Keine Browserwarnungen oder JavaScriptfehler bei diesen Prüfungen.
- Öffentliche Auslieferung nach erfolgreichem Pages-Workflow separat prüfen. Ein HTTP-Erfolg ersetzt nicht die Sichtprüfung aller Spielmechaniken.

## Originaloberflächen und 8K-Atlas · 17.10.2026

Auf Betreiberwunsch zehn neue 1920×1080-Browseraufnahmen direkt aus Original-HTML/CSS/JS des offiziellen Checkouts erzeugt. Fiktive Figuren, Gruppe/Clan, Vorräte, Verletzungen, Erfahrung und Fahrzeugzustände; keine echten Spieler- oder Live-Daten. Original-Layout und vorhandene Projektbilder verwendet. Nur der lokale Adapter ersetzt NUI-Antworten und Spielhintergrund; keine Laufzeitdateien verändert. Großansicht und Originallink in den passenden Artikeln. Geplante Bereiche bleiben leer.

Atlas aus `work/atlas-symbols-20261016/lost-santos-field-atlas-8192.png`: 8.192×9.216, 56.738.169 Bytes. SHA256 deckt sich mit `docs/atlas-symbols-20261016/tiles-build.json` des offiziellen Repos; unveränderte Datei. Gespeicherte Gebietsdarstellung vom 16.10.2026, kein Live-Layer. Kleinere vorhandene Atlas-Vorschau zum Einstieg, volle Datei erst auf Vergrößern/8K-Laden. Eigener Artikel `/wiki/karte/`, Zoom, Verschieben, Einpassen und Link zum vollständigen Original.

Geprüft: Sichtkontrolle sämtlicher ausgewählter UI-Aufnahmen, UI-Bilder ohne Nachzeichnen, korrigierte Beispieldaten statt alter Diagnose-Screenshots; Wiki-Bilddialog und Schließen, 8K-Nachladen bis naturalWidth=8192/naturalHeight=9216, Einpassen, mobile Kartenansicht mit 390 px ohne horizontalen Seitenüberlauf, keine JavaScriptfehler in diesen Abläufen. Alle Medienhashes und lokalen Seitenverweise vor Veröffentlichung geprüft. Öffentliche Auslieferung wird danach separat überprüft.
