# Regelwerk-Webseite · Entwurf 02

Statische, mobil angepasste HTML-/CSS-Seite ohne Build, JavaScript, Tracking oder externe Medien. `index.html` direkt im Browser öffnen. Text und Gestaltung sind ein Vorschlag zur gemeinsamen Abstimmung, kein beschlossenes Regelwerk. RP und Ich-RP sind vollständig freiwillig; Survival ohne RP ist gleichberechtigt. Getrennte Ingame- und Community-Regeln. Betreiberfestlegung: In der PvP-Zone sind Angriffe und Eliminierungen ohne Gespräch, Ankündigung oder RP-Vorgeschichte erlaubt. Weitere Schutz-, Raub-, Basen-, Todes- und Sanktionsdetails werden dadurch nicht festgelegt.

## Im Git pflegen

- Texte: `website/regelwerk/index.html`.
- Gestaltung: `website/regelwerk/style.css`. Bei Änderungen die CSS-Version im HTML erhöhen.
- Änderungen können im Git-Diff gemeinsam geprüft werden. Nur diesen Website-Ordner veröffentlichen; das Serverrepository enthält interne Dokumentation.

## GitHub Pages vorbereiten

GitHub stellt HTML in der normalen Dateiansicht als Quelltext dar. Eine gerenderte Seite benötigt Hosting, beispielsweise GitHub Pages. Die offizielle Anleitung steht unter https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site.

Der Workflow `.github/workflows/regelwerk-pages.yml` ist ausschließlich manuell startbar. Nach Freigabe und Push unter Repository Settings → Pages als Quelle **GitHub Actions** auswählen, dann unter Actions **Regelwerk auf GitHub Pages** starten. Der Workflow veröffentlicht ausschließlich `website/regelwerk`, keine anderen Dateien des Repositories. Vorher bestehende Pages-Nutzung, Berechtigungen, Tarifunterstützung für das private Repository und gewünschte öffentliche Sichtbarkeit prüfen. Eine Pages-Webseite kann trotz privatem Quellrepository öffentlich erreichbar sein. Repository nicht für diesen Zweck öffentlich schalten.

Veröffentlichung am 17.10.2026 beauftragt. Die verfügbare GitHub-Anmeldung hat Push-, aber keine Adminrechte. Pages-Abfrage und Einrichtung liefern HTTP 404; Pages ist damit nicht als nutzbar bestätigt. Die Webseite und der manuelle Workflow wurden dort bereitgestellt. Auf Betreiberwunsch erfolgt die Veröffentlichung nun im eigenen Repository Boreal-Code-Forge/LosT---Apocalypse-Server; dort sind Adminrechte vorhanden. Die tatsächliche URL ergibt sich nach erfolgreichem Deployment.

Commit-Vorschlag: `Schlankes Regelwerk als eigenständige Webseite vorbereiten`.

## Discord-Anbindung · geprüft am 17.10.2026

Die Website bleibt die zentrale Textfassung im Git. Ein Discord-Regelkanal kann eine kurze Einführung und Links auf die veröffentlichte Seite enthalten. Mit `#ingame` und `#community` am Ende der späteren öffentlichen Website-Adresse führen Links direkt zum jeweiligen Abschnitt. Lokale file-Adressen funktionieren für andere Mitglieder nicht.

Vorgeschlagene Einführung: „Willkommen in Lost Santos. Hier sind Survival-Spieler und RP-Spieler gleichermaßen willkommen. RP ist vollständig freiwillig. Respekt und faires Spielen gelten für alle. In der PvP-Zone braucht ein Angriff keine vorherige Ankündigung oder RP-Szene.“ Anschließend die beiden öffentlichen Abschnittslinks ergänzen. Noch keine öffentliche URL vorhanden; keinen Platzhalter als fertigen Link veröffentlichen.

- **Einfacher Start:** Regelkanal mit Einführung und Abschnittslinks. Discord unterstützt anklickbare Textlinks. Kein Bot und kein Webhook erforderlich.
- **Optional für Community-Server:** Über Rules Screening lassen sich kurze Regeln beim Beitritt bestätigen. Dort den gemeinsamen Umgang und Fairness aufnehmen; keine verpflichtende RP-Zustimmung verlangen. Diese Texte werden separat gepflegt und nicht automatisch aus HTML synchronisiert.
- **Optionaler Server Guide:** Discord kann schreibgeschützte Kanäle als Ressourcenseiten darstellen. Darin die Einführung und den Website-Link hinterlegen. Eine native HTML-Darstellung der Webseite im Kanal ist damit nicht verbunden.
- **Linkvorschau:** Open-Graph-Titel und Beschreibung sind im HTML vorbereitet. Ob Discord eine Vorschau zeigt, muss nach öffentlicher Veröffentlichung geprüft werden; lokale Dateiadressen reichen dafür nicht.
- **Später automatisierbar:** Ein Bot/Webhook könnte freigegebene Änderungen verlinken. Dafür sind Zielkanal, Zugang und ausdrücklicher Auftrag zum Posten nötig. Keine Zugangsdaten ins Repository schreiben. Für den Start genügt die Verlinkung.

Geprüft wurden die allgemeinen Discord-Funktionen, nicht die Einstellungen oder Berechtigungen unseres konkreten Servers. Keine Discord-Verbindung eingerichtet und nichts gepostet.

Offizielle Quellen:
- https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline
- https://support.discord.com/hc/en-us/articles/1500000466882-Rules-Screening-FAQ
- https://support.discord.com/hc/en-us/articles/13497665141655-Server-Guide-FAQ
## Originales Branding

Banner aus `enhanced-server/txData/ESXLegacy_9EDF86.base/resources/[lost_santos]/ls_branding/assets/banner.gif`; statische Alternative aus dem benachbarten `banner.png`. Logo aus `enhanced-server/Diverses/Lost-Santos-Branding/serverliste-animiert-v2/logo-server.png`, visuell mit dem Projektlogo im Zonen-Menü abgeglichen. Unveränderte, per SHA256 geprüfte Kopien unter `assets/`. Banner im vollständigen Seitenverhältnis ohne Beschnitt, Logo im Kopf und als Favicon. Bei aktivierter Betriebssystemeinstellung für reduzierte Bewegung wird der statische Banner verwendet. Keine Originaldateien verändert.

## Discord-Linkvorschau · 17.10.2026

Eigenes Open-Graph-Vorschaubild aus dem vorhandenen Branding-Master (2172 × 724), mit absoluter HTTPS-Adresse, Bildmaßen, Alternativtext, Seitentitel und kurzer Beschreibung. Originaldatei unverändert kopiert. Große Bildkarte über twitter:card ergänzt; konkrete Darstellung entscheidet Discord. Bereits gepostete Links können eine ältere Vorschau zeigen. Keine Discord-Nachricht oder Servereinstellung geändert. Offizielle Referenz: https://discord.com/developers/docs/link-previews/overview


Discord-Nacharbeit: Seite und Originalbild unter Discordbot-Kennung jeweils HTTP 200. Twitter-Bildmetadaten vervollständigt; zusätzlich offiziell dokumentierte Component-Embed-Karte mit Projektbild und zwei Abschnittsschaltflächen, reguläre Open-Graph-Karte als Rückfall. Eigene Teilen-Adresse regelwerk.html zur getrennten Vorschauabfrage. Diese Datei enthält dieselbe Webseite und muss bei künftigen Inhaltsänderungen mit index.html synchron bleiben. Echte Discord-Darstellung weiterhin vom Client zu bestätigen. Quelle: https://github.com/discord/discord-api-docs/blob/main/developers/link-previews/component-embeds.mdx


## Redaktion · 17.10.2026

Wiederholte RP-Erklärungen auf einen Satz im Einstieg gekürzt. Ingame enthält Fairness und die einzige ausdrücklich festgehaltene PvP-Regel: Die Zufahrtsstraßen ins PvP-Gebiet dürfen nicht abgecampt werden. Community-Regeln bleiben separat. Beide HTML-Einstiegsseiten gemeinsam aktualisiert. Keine Spielmechanik geändert.
