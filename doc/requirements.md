# Interclub Planning Tool — Requirements

## Doel

Een tool om mogelijke samenstellingen van ploegen te evalueren voor interclub tennisontmoetingen.

## Format van een ontmoeting

- 4 enkelwedstrijden
- 2 dubbelwedstrijden

## Classement

Classementen zijn getallen uit de reeks: **3, 5, 10, 15, 20, 25, ...**  
(beginnend bij 3, dan 5, daarna veelvouden van 5)

Een hoger getal betekent een **sterkere** speler.

## Beperking (grens)

Elke ontmoeting heeft een vastgelegde grens (bv. 20, 75, 140).

- De som van de **enkel**classementen van de 4 enkelspelers mag de grens **niet overschrijden**.
- De som van de **dubbel**classementen van de 4 dubbel spelers (2 koppels × 2 spelers) mag de grens **niet overschrijden**.

Beide berekeningen gebruiken dezelfde grens.

## Volgorde

- De 4 enkelspelers worden gerangschikt van sterk naar zwak: **positie 1 = sterkste speler** (hoogste classement).
- De 2 dubbelkoppels worden gerangschikt van sterk naar zwak: **koppel 1 = sterkste koppel**. De sterkte van een koppel is de som van de dubbel classementen van de 2 spelers (hoogste som = sterkste koppel).

## Spelers overlap

Een speler mag in dezelfde ontmoeting zowel in enkel als in dubbel spelen.

## Input

1. De **grens** (bv. 140)
2. Een **lijst van beschikbare spelers**, elk met:
   - Naam
   - Enkel classement
   - Dubbel classement

Het aantal beschikbare spelers varieert (typisch ~10).

## Drempelwaarden

Elke ontmoeting heeft twee grenzen:

- **Maximum** (de grens): de som mag deze waarde niet overschrijden (bv. 140)
- **Minimum**: samenstellingen met een som onder deze waarde zijn niet interessant. Wordt door de gebruiker ingegeven; typisch ~60% van het maximum (bv. 84 bij een grens van 140).

## Output

### Fase 1 (nu)
Alle **geldige samenstellingen** waarbij `minimum ≤ som ≤ maximum`, gesorteerd van hoogste som naar laagste som (sterkste ploeg bovenaan).

Een samenstelling bestaat uit:
- 4 enkelspelers (geordend sterk → zwak)
- 2 dubbelkoppels (geordend sterk → zwak)

### Fase 2 (later)
Twee extra categorieën tonen:
- Samenstellingen die **net boven het maximum** vallen (som iets te hoog)
- Samenstellingen die **net onder het minimum** vallen (som iets te laag)

## Automatische combinaties

De tool genereert **alle mogelijke samenstellingen** zonder tussenkomst:

- Alle manieren om 4 enkelspelers te kiezen uit de beschikbare spelers
- Alle manieren om 4 dubbelspelers te kiezen uit de beschikbare spelers
- Alle mogelijke koppelvorming uit de 4 geselecteerde dubbelspelers (er zijn 3 manieren om 4 spelers in 2 koppels te verdelen)

Twee samenstellingen met dezelfde spelers maar een andere koppeling worden als **verschillende samenstellingen** beschouwd.

## Voorbeeld

Grens: 140, beschikbare spelers o.a. met classementen 60, 50, 45, 40, 20, 15.

- Optimale enkels: 60 + 45 + 20 + 15 = **140** (exact aan de grens, geldig)
- Alternatief: 50 + 40 + 20 + 15 = **125** (ook geldig, maar zwakkere opstelling)

## Platform

- **Webapplicatie** (browser)
- Geen server, geen database
- Spelersgegevens worden bewaard in **localStorage** van de browser
