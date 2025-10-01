+++
template="project.html"
title="Modul 2: Cloud-Computing und Datenanalyse"
weight=2

extra.resources=[
    {title="Folien Modul 2", url="ADA_GDA_WS1_Modul2.pdf"},
    {title="Notebooks Modul 2", url="ADA_GDA_WS1_Modul2.zip"}
]
+++

### Themen
In **Modul 2** beginnen wir mit der Einführung in die benötigte Software und Arbeitsumgebung. Es werden keine Vorkenntnisse in der Datenanalyse erwartet. Sie können sich auf folgende Themen freuen:

* Erste Schritte im Cloud-Computing
* Überblick über die vorliegenden Daten
* Erste Analysen mit der Software *R*
* Umgang mit Daten(problemen)
* Stichprobenziehung als Strategie

{{image(path="projekte/gda/workshop-1/Stichprobe.jpg",round=true)}}

{%card(title='Lernziele', color="lilac")%}

Am Ende dieses Moduls können Sie…
- Potentiale erkennen
  - ... Cloud-Computing als Möglichkeit für sichere Datenanalyse einschätzen.
  - ... in der Cloud-Arbeitsumgebung arbeiten.
- Die Daten analysieren
  - ... die Daten vorbereiten und verstehen.
  - ... erste Datenanalysen durchführung und die Ergebnisse interpretieren.
  - ... eine Entscheidung über eine gute Strategie für die Stichprobenziehung fällen.
{%end%}

<!-- 
::: {.callout-note collapse="true"}
### Anleitung Cloud-Umgebung

#### Login
1. Navigation zu https://adrf.okta.com
1. Username (endet auf `@adrf.net`) und Passwort eingeben, `Sign In` klicken
1. `Send me the code` klicken und dann den Code eingeben, `Verify` klicken
1. `ADA Bayern` auswählen
1. `Desktop` auswählen
1. Passwort eingeben, `Sign in` klicken
1. Eine Windows-Oberfläche öffnet sich mit einem Pop-Up Fenster. Dort `I Acknowledge` auswählen und die Quizfrage beantworten. Dann `Submit` klicken.
1. Das offene Browserfenster kann geschlossen werden.

#### Erste Nutzung
Vor der ersten Nutzung müssen wir die Notebooks in Ihren persönlichen Arbeitsordner
kopieren.

1. `File Explorer` öffnen.
1. Zu `projects`-Laufwerk (`P:`) navigieren, darin liegt ein Ordner `pr-ada-bayern`
1. Ordner `pr-ada-bayern` öffnen, darin liegt eine zip-Datei `notebooks_utf8_vx.zip`
1. zip-Datei `notebooks_utf8_vx.zip` kopieren (z.B. Recktsklick -> `Copy`)
1. Zu  `users`-Laufwerk (`U:`) navigieren, darin liegt ein Ordner mit ihrem Namen (`vorname.nachname.id`, dies ist ihr Arbeitsordner)
1. Ordner mit ihrem Namen (`vorname.nachname.id`) öffnen und dort die zip-Datei einfügen (z.B. Rechtsklick -> `Paste`)
1. Doppelklick auf die zip-Datei öffnet ein Programm zum ent-zippen
1. `Extract To` auswählen und im sich öffnenden Fenster `OK`

Nun ist ein Ordner in Ihrem Arbeitstsordner der die Notebooks enthält.

#### Notebooks öffnen
1. `File Explorer` öffnen.
1. Zu  `users`-Laufwerk (`U:`) navigieren, darin liegt ein Ordner mit ihrem Namen (`vorname.nachname.id`, dies ist ihr Arbeitsordner)
1. Ordner mit ihrem Namen (`vorname.nachname.id`) öffnen und den Ordner darin (`notebooks_utf8_vx`, siehe oben) öffnen
1. Doppelklick auf `Notebooks.Rproj` öffnet die Notebooks in RStudio

#### Arbeit mit den Notebooks
- Wählen Sie das gewünschte Notebook über die Tabs in RStudio aus
- Sie können beliebig Text sowie R-Code ändern
- Code können Sie über den grünen Pfeil am Code-Block ausführen

---

Sollte etwas nicht funktionieren, wenden Sie sich bitte an [data-analytics@stat.uni-muenchen.de](mailto:data-analytics@stat.uni-muenchen.de).
::: -->