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

    if (log.length > 0) {
        parts.push("", "---- LOG ----", ...log);
    }

    textEl.innerText = parts.join("\n");
    textEl.scrollTop = 0;
}

function updateStats() {
    const armorText = player.armor
        ? `${items[player.armor.key].name} (${player.armor.hp}hp)`
        : "geen";

    statsEl.innerText =
`HP: ${player.hp}/${player.maxHp} | STA: ${player.stamina}/${player.maxStamina}
HUN: ${player.hunger}/100 | THI: ${player.thirst}/100
LVL: ${player.skills.level} | XP: ${player.skills.xp}/20
Armor: ${armorText}`;
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

    write("Je rust even uit. Je stamina herstelt een beetje.");
    updateStats();
}

function scavengeRoom() {
    if (!currentRoom) return;

    const chance = currentRoom.visitedScavenge ? 0.20 : 0.60;
    currentRoom.visitedScavenge = true;

    if (Math.random() > chance) {
        write("Je zoekt grondig, maar vindt niets bruikbaars.");
        return;
    }

    const table = lootTables[currentRoom.lootProfile] || [];
    if (table.length === 0) {
        write("Hier lijkt niets meer te liggen.");
        return;
    }

    const picked = table[rand(0, table.length - 1)];
    const qty = rand(picked.min, picked.max);
    addGeneratedDrop(currentRoom, picked.key, qty);

    write(`Je vindt iets bruikbaars: ${items[picked.key].name}.`);
    showRoom(currentRoom.key);
}

function pickupGroundItem(index) {
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
        addLog(`${items[slot.key].name} opgepakt.`);
        showRoom(currentRoom.key);
    }
}

function showRoom(key) {
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
    showRoom("street");
}

window.onload = startGame;