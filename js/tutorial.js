let tutorialSnapshot = null;

const tutorialRooms = {
    tutorial_hub: {
        key: "tutorial_hub",
        name: "Tutorial kamp",
        text: "Dit is het veilige tutorialgebied. Hier kun je alles oefenen zonder echte gevolgen.",
        exits: [
            { text: "Ga naar loot ruimte", next: "tutorial_loot" },
            { text: "Ga naar combat ruimte", next: "tutorial_combat" },
            { text: "Ga naar crafting ruimte", next: "tutorial_craft" }
        ],
        ground: [],
        generated: true
    },

    tutorial_loot: {
        key: "tutorial_loot",
        name: "Loot ruimte",
        text: "Hier kun je oefenen met items oppakken, gebruiken, droppen en armor equippen.",
        exits: [
            { text: "Ga terug naar tutorial kamp", next: "tutorial_hub" }
        ],
        ground: [
            { key: "bandage", qty: 2 },
            { key: "water_bottle", qty: 1 },
            { key: "canned_food", qty: 1 },
            { key: "jacket", hp: 35 },
            { key: "knife", hp: 30 }
        ],
        generated: true
    },

    tutorial_combat: {
        key: "tutorial_combat",
        name: "Combat ruimte",
        text: "Hier kun je combat oefenen tegen een dummy zombie. Je krijgt geen echte schade en verbruikt geen echte resources.",
        exits: [
            { text: "Ga terug naar tutorial kamp", next: "tutorial_hub" }
        ],
        ground: [],
        generated: true
    },

    tutorial_craft: {
        key: "tutorial_craft",
        name: "Crafting ruimte",
        text: "Hier kun je crafting bekijken en oefenen.",
        exits: [
            { text: "Ga terug naar tutorial kamp", next: "tutorial_hub" }
        ],
        ground: [
            { key: "cloth", qty: 3 },
            { key: "alcohol", qty: 1 }
        ],
        generated: true
    }
};

function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
}

function startDummyTutorial() {
    tutorialSnapshot = {
        player: cloneData(player),
        rooms: cloneData(rooms),
        currentRoomKey: currentRoom ? currentRoom.key : null,
        combatState: cloneData(combatState),
        log: typeof log !== "undefined" ? cloneData(log) : []
    };

    player.inTutorial = true;
    player.tutorialSeen = true;
    tutorialMode = "sandbox";

    player.hp = 100;
    player.maxHp = 100;
    player.stamina = 10;
    player.maxStamina = 10;
    player.hunger = 100;
    player.thirst = 100;
    player.inventory = [
        { key: "knife", hp: 30 },
        { key: "bandage", qty: 2 },
        { key: "water_bottle", qty: 1 },
        { key: "canned_food", qty: 1 }
    ];
    player.armor = null;

    if (typeof log !== "undefined") {
        log = [];
    }

    currentRoom = tutorialRooms.tutorial_hub;
    combatState = null;

    updateStats();
    updateInventory();
    showTutorialSandboxRoom("tutorial_hub");
}

function exitDummyTutorial() {
    if (!tutorialSnapshot) {
        player.inTutorial = false;
        tutorialMode = null;
        showRoom("street");
        return;
    }

    Object.assign(player, tutorialSnapshot.player);

    Object.keys(rooms).forEach(key => {
        if (tutorialSnapshot.rooms[key]) {
            Object.assign(rooms[key], tutorialSnapshot.rooms[key]);
        }
    });

    currentRoom = tutorialSnapshot.currentRoomKey
        ? rooms[tutorialSnapshot.currentRoomKey]
        : rooms.street;

    combatState = tutorialSnapshot.combatState;

    if (typeof log !== "undefined") {
        log = tutorialSnapshot.log || [];
    }

    player.inTutorial = false;
    tutorialMode = null;
    tutorialSnapshot = null;

    updateStats();
    updateInventory();
    showRoom(currentRoom.key);
}

function showTutorialSandboxRoom(key) {
    const room = tutorialRooms[key];
    currentRoom = room;

    write(`${room.name}\n\n${room.text}\n\nIn deze tutorial heeft niets blijvende gevolgen.`);
    choicesEl.innerHTML = "";

    room.exits.forEach(exit => {
        choicesEl.appendChild(
            makeButton(exit.text, () => showTutorialSandboxRoom(exit.next))
        );
    });

    if (key === "tutorial_hub") {
        choicesEl.appendChild(
            makeButton("Uitleg bekijken", () => showDummyTutorialInfo())
        );

        choicesEl.appendChild(
            makeButton("Tutorial verlaten", () => exitDummyTutorial())
        );
    }

    if (key === "tutorial_loot") {
        choicesEl.appendChild(
            makeButton("Leg uitleg uit", () => {
                write(
`Loot tutorial

- Pak items op met de knoppen
- Gebruik bandage, water of voedsel in je inventory
- Equip armor met Equip
- Drop items met Drop

In deze mode blijven je echte spullen veilig.`
                );
            })
        );
    }

    if (key === "tutorial_combat") {
        choicesEl.appendChild(
            makeButton("Start dummy combat", () => startDummyCombat())
        );
    }

    if (key === "tutorial_craft") {
        choicesEl.appendChild(
            makeButton("Open crafting", () => showCraftingMenu())
        );
    }

    if (room.ground.length > 0) {
        room.ground.forEach((slot, index) => {
            const item = items[slot.key];
            let label = `Pak ${item.name}`;

            if (slot.qty !== undefined) label += ` x${slot.qty}`;
            if (slot.hp !== undefined) label += ` (${slot.hp}hp)`;

            choicesEl.appendChild(
                makeButton(label, () => pickupTutorialGroundItem(room.key, index))
            );
        });
    }

    updateStats();
    updateInventory();
}

function pickupTutorialGroundItem(roomKey, index) {
    const room = tutorialRooms[roomKey];
    const slot = room.ground[index];
    if (!slot) return;

    let ok = false;

    if (slot.qty !== undefined) {
        ok = addItem(slot.key, slot.qty);
    } else {
        ok = addItem(slot.key, 1, slot.hp);
    }

    if (ok) {
        room.ground.splice(index, 1);
        write(`${items[slot.key].name} opgepakt in tutorial.`);
        showTutorialSandboxRoom(roomKey);
    }
}

function showDummyTutorialInfo() {
    write(
`Tutorial overzicht

1. Loot ruimte:
Oefen met items oppakken, gebruiken, equippen en droppen.

2. Combat ruimte:
Oefen met doelwit kiezen, wapen kiezen en aanvallen.

3. Crafting ruimte:
Oefen met crafting zonder risico.

4. Tutorial verlaten:
Je keert terug naar je echte game zonder veranderingen.`
    );

    choicesEl.innerHTML = "";
    choicesEl.appendChild(
        makeButton("Terug naar tutorial kamp", () => showTutorialSandboxRoom("tutorial_hub"))
    );
}

function startDummyCombat() {
    combatState = {
        zombies: [
            {
                typeKey: "dummy",
                name: "Dummy zombie",
                hp: 20,
                damage: [0, 0],
                xp: 0,
                tutorial: true
            }
        ],
        turn: 1
    };

    if (typeof log !== "undefined") {
        log = [];
    }

    if (typeof addLog === "function") {
        addLog("Dummy combat gestart.");
    }

    write("Dummy combat. Hier oefen je zonder echte schade.");
    showCombatMenu();
}