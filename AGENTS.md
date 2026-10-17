# Lost Santos · öffentliche Website

Regelwerk und Spieler-Wiki gehören zu diesem Repository. Veröffentlichung über GitHub Pages; kein Sites-Hosting und kein Spielserver-Deployment. Nutzertexte auf Deutsch, knapp und ohne wiederholte Grundsatzerklärungen.

## Wiki aktualisieren

- Quelle ist der aktuelle veröffentlichte Git-Stand von `https://github.com/MaxSmoke87/-LosT-.git`, hier lokal bisher `E:/Projekte/Scripte/InEntwicklung/-LosT-`. Vor fachlicher Recherche dessen AGENTS.md und Projektregeln lesen. Lokale offene Arbeiten nicht als veröffentlichten Funktionsstand behandeln.
- Nach erfolgreichem Pull: `node tools/wiki-sources.mjs <offizielles-repo>` zeigt geänderte zugeordnete Quellen je Artikel. Nur lesend; kein automatisches Umschreiben. Bei entferntem Quellpfad dessen Ersatz suchen.
- `content/wiki.json` enthält die redaktionellen Spielertexte und Quellenzuordnung. Aktuellen Code, Ressourcen-README und jüngere Änderungsnotizen gemeinsam prüfen; ältere Übersichten können veraltet sein. Widersprüche anhand tatsächlicher Umsetzung lösen, nicht durch Vermutung.
- Öffentlich ausschließlich Spielerwissen veröffentlichen. Keine privaten Quelldokumente, Zugangsdaten, Live-Daten, Infrastrukturdetails oder Adminanleitungen übernehmen. Herkunft wird als Dateipfad/Git-Objekt in `content/wiki-sources.json` belegt, nicht als Kopie des privaten Repositories.
- Noch geplante Bereiche: `status: planned`, Titel und Quellen, keine Zusammenfassung und keine Inhaltsabschnitte. Im Wiki steht nur „Bald verfügbar“. Keine erfundenen Termine. Vor Aktivierung Umsetzung und Status erneut prüfen.
- Nach geprüften Änderungen `reviewedAt` pflegen und `node tools/wiki-sources.mjs <offizielles-repo> --record` ausführen. Das bestätigt eine redaktionelle Prüfung; niemals ungeprüft als Reparatur für geänderte Quellen verwenden.
- Neues Quellmaterial und Funktionen ohne bisherige Zuordnung gesondert prüfen; der Quellenvergleich erkennt nur bereits zugeordnete Dateien. Keine automatische Vollständigkeit behaupten. Keine wiederkehrende Automation ohne Nutzerauftrag.

## Bauen und veröffentlichen

`node tools/build-site.mjs` erzeugt `_site/` mit bestehendem Regelwerk im Stamm und Wiki unter `/wiki/`. `node tools/check-site.mjs` prüft lokale Links, Bilder und Metadaten. Änderungen an Wiki-CSS/JS mit Versionsanhebung im Generator ausliefern. Browserprüfung: Einstieg, Suche, Artikel, geplanter Bereich, mobiles Layout.

Nur eigene Änderungen stagen. Vor Push aktuellen Remote-Stand prüfen. Workflow `regelwerk-pages.yml` manuell starten; er baut und prüft beide Bereiche gemeinsam. Deployment-Erfolg und öffentliche Seiten anschließend prüfen. Regelwerk-Adressen `/` und `/regelwerk.html` erhalten. Beide Regelwerk-HTML-Dateien bei Inhaltsänderungen synchron halten.

## Original-UI und Karten

`content/wiki-media.json` dokumentiert Herkunft, geprüfte UI-Quellbäume, Screenshot-Hashes und den unveränderten Atlas. Die Screenshots zeigen echtes Projekt-HTML mit fiktiven Daten; keine KI-Nachzeichnungen und keine behaupteten Ingame-Aufnahmen. Beispiele stehen in `content/ui-examples.js`. Lokale Vorschau: `node tools/preview-game-ui.mjs <offizielles-repo>`; Browseraufnahmen ausschließlich mit den zugelassenen Browserwerkzeugen. Keine Test-/Diagnosetexte, defekten Bilder oder echten Spielerdaten veröffentlichen. Live-Ressourcen werden dafür weder gestartet noch verbunden.

Nach UI-Änderungen betroffene Aufnahmen neu erstellen und die Medien-Hashes sowie Quellstände erst nach Sichtprüfung aktualisieren. Bildhinweise im Artikel unter `media` pflegen. Geplante Artikel bleiben auch ohne Medien. Atlas nur als unverändertes Original mit nachvollziehbarer neuer Quelle ersetzen; Preview und eingebrannte Gebietsgrenzen können einen historischen Stand darstellen. Aktuelle Karte: 8.192 × 9.216, Atlasstand 16.10.2026. Die große Datei erst auf Nutzeraktion laden.

## Bannerzuordnung (Betreiberkorrektur 17.10.2026)

Auf den Webseiten den originalen animierten GIF-Banner anzeigen (statisches Original bei reduzierter Bewegung). Die beschrifteten Bereichsbanner ausschließlich für Discord verwenden: Open Graph, Twitter-Metadaten, Discord-Komponentenvorschau und passende Watcher-Meldungen. Keine beschrifteten Banner als sichtbaren Website-Kopf einsetzen. Bereits gepostete Discord-Linkvorschauen können zwischengespeichert bleiben; eine aktualisierte Webseite verändert fremde bestehende Beiträge nicht automatisch.
