const textEl = document.getElementById("text");
const choicesEl = document.getElementById("choices");
const invEl = document.getElementById("inventory");
const statsEl = document.getElementById("stats");

let screenText = "";

function write(text) {
    screenText = text;
    renderText();
}

function renderText() {
    const parts = [screenText];

    if (typeof log !== "undefined" && log.length > 0 && !player.inTutorial) {
        parts.push("", "---- LOG ----", ...log);
    }

    textEl.innerText = parts.join("\n");
    textEl.scrollTop = 0;
}

function updateStats() {
    const armorText = player.armor
        ? `${items[player.armor.key].name} (${player.armor.hp}hp)`
        : "geen";

    const tutorialText = player.inTutorial ? "\nMODE: Tutorial" : "";

    statsEl.innerText =
`HP: ${player.hp}/${player.maxHp} | STA: ${player.stamina}/${player.maxStamina}
HUN: ${player.hunger}/100 | THI: ${player.thirst}/100
LVL: ${player.skills.level} | XP: ${player.skills.xp}/20
Armor: ${armorText}${tutorialText}`;
}

function makeButton(label, onClick) {
    const btn = document.createElement("button");
    btn.innerText = label;
    btn.onclick = onClick;
    return btn;
}

function restInRoom() {
    player.stamina = Math.min(player.maxStamina, player.stamina + 3);
    player.hunger = Math.max(0, player.hunger - 1);
    player.thirst = Math.max(0, player.thirst - 1);

    write("Je rust even uit en herstelt stamina.");
    updateStats();
}

function scavengeRoom() {
    if (!currentRoom || player.inTutorial) return;

    const chance = currentRoom.visitedScavenge ? 0.20 : 0.60;
    currentRoom.visitedScavenge = true;

    if (Math.random() > chance) {
        write("Je zoekt rond, maar vindt niets bruikbaars.");
        return;
    }

    const table = lootTables[currentRoom.lootProfile] || [];
    if (table.length === 0) {
        write("Hier ligt niets bruikbaars.");
        return;
    }

    const picked = table[rand(0, table.length - 1)];
    const qty = rand(picked.min, picked.max);
    addGeneratedDrop(currentRoom, picked.key, qty);

    write(`Je vindt ${items[picked.key].name}.`);
    showRoom(currentRoom.key);
}

function pickupGroundItem(index) {
    if (player.inTutorial) return;

    const slot = currentRoom.ground[index];
    if (!slot) return;

    let success = false;

    if (slot.qty !== undefined) {
        success = addItem(slot.key, slot.qty);
    } else {
        success = addItem(slot.key, 1, slot.hp);
    }

    if (success) {
        currentRoom.ground.splice(index, 1);

        if (typeof addLog === "function") {
            addLog(`${items[slot.key].name} opgepakt.`);
        }

        showRoom(currentRoom.key);
    }
}

function startTutorialSlides() {
    player.tutorialSeen = true;
    player.tutorialStep = 1;
    player.inTutorial = true;
    showTutorialStep();
    updateInventory();
}

function showTutorialStep() {
    choicesEl.innerHTML = "";

    if (player.tutorialStep === 1) {
        write(
`Tutorial

Welkom in Zombie Text Survival.

Je gaat nu eerst een korte uitleg krijgen.
Daarna kun je kiezen voor een oefen-tutorial waarin je alles veilig kunt testen.

Stats:
HP = health
STA = stamina
HUN = hunger
THI = thirst
LVL = level`
        );

        choicesEl.appendChild(
            makeButton("Volgende", () => {
                player.tutorialStep = 2;
                showTutorialStep();
            })
        );
        return;
    }

    if (player.tutorialStep === 2) {
        write(
`Tutorial

Belangrijke acties:
- Zoek rond = veilig zoeken naar loot
- Zoek rond (gevaar) = kans op zombies
- Rust = stamina herstellen
- Crafting = items maken
- Save / Load = spel opslaan of laden`
        );

        choicesEl.appendChild(
            makeButton("Vorige", () => {
                player.tutorialStep = 1;
                showTutorialStep();
            })
        );

        choicesEl.appendChild(
            makeButton("Volgende", () => {
                player.tutorialStep = 3;
                showTutorialStep();
            })
        );
        return;
    }

    if (player.tutorialStep === 3) {
        write(
`Tutorial

Je kunt nu kiezen:

1. Direct de echte game starten
2. Eerst een dummy tutorial spelen waarin je alles veilig oefent

Tijdens die dummy tutorial:
- verlies je geen stats
- krijg je geen echte schade
- verbruik je je echte items niet`
        );

        choicesEl.appendChild(
            makeButton("Vorige", () => {
                player.tutorialStep = 2;
                showTutorialStep();
            })
        );

        choicesEl.appendChild(
            makeButton("Start echte game", () => {
                player.inTutorial = false;
                player.tutorialStep = 0;
                showRoom("street");
            })
        );

        choicesEl.appendChild(
            makeButton("Start dummy tutorial", () => {
                startDummyTutorial();
            })
        );
    }
}

function showRoom(key) {
    if (player.inTutorial) return;

    const room = rooms[key];
    currentRoom = room;

    player.visitedRooms[key] = true;
    generateLoot(room);

    write(`${room.name}\n\n${room.text}`);
    choicesEl.innerHTML = "";

    room.exits.forEach(exit => {
        choicesEl.appendChild(
            makeButton(exit.text, () => showRoom(exit.next))
        );
    });

    choicesEl.appendChild(
        makeButton("Zoek rond", () => scavengeRoom())
    );

    choicesEl.appendChild(
        makeButton("Zoek rond (gevaar)", () => randomZombie())
    );

    choicesEl.appendChild(
        makeButton("Rust", () => {
            restInRoom();
            showRoom(room.key);
        })
    );

    choicesEl.appendChild(
        makeButton("Crafting", () => showCraftingMenu())
    );

    choicesEl.appendChild(
        makeButton("Tutorial", () => startTutorialSlides())
    );

    choicesEl.appendChild(
        makeButton("Dummy tutorial", () => startDummyTutorial())
    );

    choicesEl.appendChild(
        makeButton("Save", () => saveGame())
    );

    choicesEl.appendChild(
        makeButton("Load", () => loadGame())
    );

    if (room.ground.length > 0) {
        room.ground.forEach((slot, index) => {
            const item = items[slot.key];
            let label = `Pak ${item.name}`;

            if (slot.qty !== undefined) label += ` x${slot.qty}`;
            if (slot.hp !== undefined) label += ` (${slot.hp}hp)`;

            choicesEl.appendChild(
                makeButton(label, () => pickupGroundItem(index))
            );
        });
    }

    updateStats();
    updateInventory();
}

function startGame() {
    if (gameStarted) return;

    addItem("knife", 1);
    addItem("bandage", 2);
    addItem("water_bottle", 1);
    addItem("canned_food", 1);

    gameStarted = true;
    updateStats();
    updateInventory();

    if (!player.tutorialSeen) {
        startTutorialSlides();
    } else {
        showRoom("street");
    }
}

window.onload = startGame;