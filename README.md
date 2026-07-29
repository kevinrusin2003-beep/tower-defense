# Turm-Verteidigung

Ein Tower-Defense-Spiel im Browser – reines HTML5-Canvas ohne Frameworks, alles in einer
Datei. Läuft am Rechner mit Maus und Tastatur und auf dem iPhone/iPad im Querformat,
wo es sich als App auf den Home-Bildschirm legen lässt.

## Spielen

**Am Rechner:** `index.html` im Browser öffnen – mehr braucht es nicht.

**Auf dem iPhone (als App):**

1. Die veröffentlichte Seite in **Safari** öffnen (siehe „Veröffentlichen" unten).
2. Auf **Teilen** → **Zum Home-Bildschirm** tippen.
3. Die App vom Home-Bildschirm starten – sie läuft im Vollbild ohne Safari-Leisten und
   funktioniert auch ohne Internet.

Safari ist Pflicht: Chrome und Firefox auf iOS können nichts zum Home-Bildschirm hinzufügen.
Das Spiel wird im **Querformat** gespielt; im Hochformat erscheint ein Hinweis zum Drehen.

## Steuerung

| | Rechner | Touch |
|---|---|---|
| Turm wählen | Taste `1`–`8` oder Klick im Shop | Antippen im Shop |
| Turm bauen | Klick auf ein freies Feld | Feld antippen, dann **nochmal** tippen zum Bestätigen |
| Upgrade / Verkauf | Klick auf einen gebauten Turm | Gebauten Turm antippen |
| Auswahl abbrechen | Rechtsklick oder `ESC` | Anderen Turm im Shop wählen |
| Welle starten | Leertaste oder Button | Button |
| Pause | `P` oder Button | Button |

Auf dem Handy gibt es kein Hover, deshalb die Bestätigung mit dem zweiten Tippen: Der erste
Tipp zeigt Reichweite und Bauplatz als Vorschau, der zweite baut.

## Spielprinzip

- **Acht Turmtypen**: Kanone, MG-Turm, Sniper, Frost, Blitz, Rakete, Flammen, Goldmine.
- **Zwei Upgrade-Pfade pro Turm** mit je drei Stufen. Sobald ein Pfad Stufe 2 erreicht,
  ist der andere bei Stufe 1 gesperrt – man muss sich also festlegen.
- **Gegner in vier Stufen** („Sahur"): Getroffene Gegner zerplatzen in die nächstkleinere
  Stufe, statt einfach zu verschwinden.
- **20 Wellen**, danach lässt sich endlos weiterspielen.
- Die **Goldmine** schießt nicht, sondern zahlt Gold aus, solange eine Welle läuft.

## Veröffentlichen (GitHub Pages)

Der Workflow unter `.github/workflows/pages.yml` veröffentlicht das Repo bei jedem Push
automatisch. Einmalig muss Pages dafür freigeschaltet werden:

**Settings → Pages → Build and deployment → Source: „GitHub Actions"**

Danach liegt das Spiel unter `https://<benutzer>.github.io/tower-defense/`. Diese URL in
Safari öffnen und wie oben beschrieben zum Home-Bildschirm hinzufügen.

Der Service Worker (`sw.js`) braucht HTTPS – über GitHub Pages ist das gegeben. Beim
lokalen Öffnen per `file://` wird er übersprungen, das Spiel selbst läuft trotzdem.

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | Das komplette Spiel: Markup, Styles und Logik |
| `manifest.webmanifest` | App-Name, Icons, Vollbild- und Querformat-Vorgabe |
| `sw.js` | Service Worker für den Offline-Betrieb |
| `icons/` | App-Icons, erzeugt aus der Turm-Grafik des Spiels |
| `tools/make-icons.mjs` | Erzeugt die Icons neu (`npm i -D playwright && node tools/make-icons.mjs`) |

## Als native iOS-App

Für eine echte App im App Store lässt sich das Spiel mit
[Capacitor](https://capacitorjs.com/) verpacken. Dafür sind ein **Mac mit Xcode** und ein
Apple-Developer-Account nötig – der Build funktioniert nicht unter Linux oder Windows.
Als PWA vom Home-Bildschirm ist das Spielerlebnis nahezu identisch.
