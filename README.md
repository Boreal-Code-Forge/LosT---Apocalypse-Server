# Lost Santos · Apocalypse

Regelwerk und Spieler-Wiki für Lost Santos – Apocalypse.

- [Spieler-Wiki](https://boreal-code-forge.github.io/LosT---Apocalypse-Server/wiki/)
- [Regelwerk](https://boreal-code-forge.github.io/LosT---Apocalypse-Server/regelwerk.html)

Das Regelwerk liegt unter `website/regelwerk`. Das Wiki wird aus `content/wiki.json` und `website/wiki-assets` erzeugt. Der GitHub-Pages-Workflow baut und prüft beide Bereiche und veröffentlicht ausschließlich `_site/`.

Texte: `website/regelwerk/index.html`. Gestaltung: `website/regelwerk/style.css`. Originales Projektbranding: `website/regelwerk/assets`.

## Wiki pflegen

Die Inhalte wurden aus dem offiziellen Projekt-Repository redaktionell abgeleitet. `content/wiki-sources.json` hält den geprüften Commit und die Git-Objekte der zugeordneten Quelldateien fest. Private Quelltexte werden nicht veröffentlicht.

1. Offizielles Projekt nach dessen Arbeitsregeln aktualisieren.
2. `node tools/wiki-sources.mjs <pfad-zum-offiziellen-repo>` zeigt Themen mit geänderten Quellen. Zusätzlich neue Funktionen außerhalb der vorhandenen Zuordnung prüfen.
3. Betroffene Texte und Quellen in `content/wiki.json` überarbeiten; `reviewedAt` aktualisieren. Geplante Bereiche bleiben ohne Inhalt mit `status: planned`.
4. Nach redaktioneller Prüfung `node tools/wiki-sources.mjs <pfad-zum-offiziellen-repo> --record` ausführen.
5. `node tools/build-site.mjs` und `node tools/check-site.mjs` ausführen; bei Bedarf mit `node tools/preview-site.mjs` im Browser prüfen.
6. Änderungen committen/pushen und den Workflow **Lost Santos – Regelwerk und Wiki** manuell starten.

Der Quellenvergleich ist eine Aktualisierungshilfe, keine automatische Texterstellung und kein Nachweis der Ingame-Abnahme. Historische README-Abschnitte gegen jüngere Dokumentation und tatsächlichen Code prüfen. Änderungen im offiziellen Repo werden nicht ungeprüft öffentlich übernommen. Es ist keine regelmäßige Automation eingerichtet.

Jeder Artikel hat eine eigene Adresse unter `/wiki/<thema>/`. Ausgabe 02 vom
26.10.2026 umfasst 34 Anleitungen und einen ausdrücklich geplanten Bereich.
Neu erklärt sind Fraktionen/Ruf, Faction War, Konvois, Handel, Berufe, Anbau,
Angeln, Naturgewinnung und Elektrik/Funk. Camp- und Lageranleitungen beschreiben
den neuen Block-/Baukastenstand. Volltextsuche mit Kurztexten, Themenfilter,
mobile Navigation, Inhaltsanker und Discord-Vorschaudaten bleiben vorhanden.
Bisherige Artikel- und Regelwerk-Links bleiben bestehen. Veröffentlichungs-
und Prüfnotizen: [WIKI-REDAKTION.md](WIKI-REDAKTION.md).

## Originaloberflächen und Feldatlas

Der Berufsartikel enthält eine unveränderte aktuelle Aufnahme des echten
Charaktererstellers vom 25.10. mit Beispieldaten. Die zehn veralteten UI-Beispiele
vom 17.10. wurden entfernt. `content/wiki-media.json` dokumentiert Quelle und
Bildhash. Die vorhandenen Vorschauwerkzeuge bleiben als Entwicklungshelfer im
Repository; vor neuen Aufnahmen deren Beispieldaten an den aktuellen Code anpassen.

Der [Feldatlas](https://boreal-code-forge.github.io/LosT---Apocalypse-Server/wiki/karte/) enthält das unveränderte 8.192×9.216-Original vom 16.10.2026. Seine etwa 54 MiB werden erst bei Vergrößerung geladen. Der Quellenhash wird beim Website-Check geprüft; neue Kartenversionen mit nachgewiesener Quelle und aktualisiertem Vorschaubild einpflegen.

## Discord-Communitykarte

Regelwerk und Wiki-Einstieg nutzen das öffentliche Widget-JSON für Guild 1552250932643893249, ohne Token/Webhook. Einladung ist auch ohne API verfügbar. Die Online-Anzahl bezieht sich auf Discord, nicht auf den Spielserver. Abruf erst in Sichtnähe, Aktualisierung ca. jede Minute nur bei sichtbarem Widget und aktivem Tab; bei Fehler kein falscher Offline-/Nullstatus. Öffentliche Widget-Avatare höchstens sieben, keine Mitgliederliste/Namen. Im eingebetteten F4-Handbuch wird die Karte ausgeblendet und es werden keine Widgetdaten angefordert. API-Ausgabe wird über DOM-Text und geprüfte Discord-URLs verarbeitet.
