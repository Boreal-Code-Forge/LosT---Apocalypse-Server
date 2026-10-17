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

Jeder Artikel hat eine eigene Adresse unter `/wiki/<thema>/`. Das Wiki besitzt eine Volltextsuche, Themenfilter, mobile Navigation und Discord-Vorschaudaten. Bisherige Regelwerk-Links bleiben bestehen. Veröffentlichungs- und Prüfnotizen: [WIKI-REDAKTION.md](WIKI-REDAKTION.md).

## Originaloberflächen und Feldatlas

Passende Artikel enthalten vergrößerbare Aufnahmen der echten Projektoberflächen mit erfundenen Beispielwerten. `content/wiki-media.json` dokumentiert Quellen und Bildhashes. Kein Spielserver wird dafür benötigt. Die lokale Original-UI-Vorschau lässt sich mit `node tools/preview-game-ui.mjs <pfad-zum-offiziellen-repo>` öffnen; die Szenarien stehen in `content/ui-examples.js`.

Der [Feldatlas](https://boreal-code-forge.github.io/LosT---Apocalypse-Server/wiki/karte/) enthält das unveränderte 8.192×9.216-Original vom 16.10.2026. Seine etwa 54 MiB werden erst bei Vergrößerung geladen. Der Quellenhash wird beim Website-Check geprüft; neue Kartenversionen mit nachgewiesener Quelle und aktualisiertem Vorschaubild einpflegen.
