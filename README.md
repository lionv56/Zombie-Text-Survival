# Zombie Text Survival

## Over het project
Zombie Text Survival is een browser-based text adventure game gemaakt met HTML, CSS en JavaScript.  
De speler moet overleven in een post-apocalyptische wereld door locaties te verkennen, items te verzamelen en te vechten tegen zombies.

De game draait volledig in de browser en gebruikt knoppen en tekst als interface.

---

## Doelgroep
Deze game is bedoeld voor:

- Spelers die houden van text-based games
- Mensen die interesse hebben in survival games
- Beginners die willen leren hoe game logica werkt in JavaScript
- Studenten die een voorbeeld willen zien van een project met meerdere systemen

De game is eenvoudig te begrijpen maar bevat meerdere systemen waardoor het ook uitdagend blijft.

---

## Hoe werkt de game

### Start
De speler begint in een locatie (bijvoorbeeld een straat) met een aantal basis items zoals:
- Mes
- Bandage
- Water
- Voedsel

---

### Gameplay

De speler kan:

#### Bewegen
Via knoppen kan de speler naar andere locaties gaan.

#### Zoeken
- "Zoek rond" → veilig zoeken naar loot  
- "Zoek rond (gevaar)" → kans op zombies

#### Combat
Wanneer zombies verschijnen:
- Kies een target
- Kies een wapen
- Val aan of vlucht

Combat bevat:
- Damage systeem
- Crit en miss kans
- Stamina gebruik
- Meerdere zombies tegelijk

---

### Survival systemen

De speler moet rekening houden met:

- HP (health)
- Hunger (honger)
- Thirst (dorst)
- Stamina

Als hunger of thirst op 0 komt:
→ speler verliest HP

---

### Inventory

- Items hebben gewicht
- Inventory heeft een limiet
- Items kunnen:
  - gebruikt worden
  - gedropt worden
  - gestackt worden (zoals ammo en bandages)

---

### Wapens en durability

- Wapens hebben durability (gaan kapot)
- Melee en ranged wapens bestaan
- Ammo is nodig voor guns

---

### Crafting

Speler kan items maken zoals:
- Bandages
- Medkits

Dit vereist materialen zoals:
- Cloth
- Alcohol

---

### Armor

- Armor vermindert damage
- Heeft durability
- Kan kapot gaan

---

### Level systeem

- XP verdienen door zombies te verslaan
- Level verhoogt:
  - HP
  - stamina
  - damage

---

### Save en Load

- Spel kan opgeslagen worden
- Spel kan geladen worden via localStorage

---

## Installatie

1. Download of clone het project
2. Open de map in Visual Studio Code
3. Start Live Server
4. Open `index.html`

---

## Uitbreidbaarheid

De game is modulair opgebouwd en kan uitgebreid worden met:

- Nieuwe locaties (rooms.js)
- Nieuwe items (items.js)
- Nieuwe zombies (zombies.js)
- Nieuwe crafting recepten (crafting.js)

---

## Mogelijke uitbreidingen

- Quests
- NPC's / traders
- Day/Night cycle
- Sound effecten
- UI tabs systeem

---

## Auteur
Lion

Project voor school
