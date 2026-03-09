const lootTables = {
    street: [
        { key: "scrap", min: 1, max: 2, chance: 0.55 },
        { key: "cloth", min: 1, max: 2, chance: 0.30 },
        { key: "water_bottle", min: 1, max: 1, chance: 0.25 },
        { key: "bat", min: 1, max: 1, chance: 0.15 }
    ],

    house: [
        { key: "bandage", min: 1, max: 2, chance: 0.45 },
        { key: "canned_food", min: 1, max: 2, chance: 0.50 },
        { key: "water_bottle", min: 1, max: 2, chance: 0.35 },
        { key: "knife", min: 1, max: 1, chance: 0.18 },
        { key: "jacket", min: 1, max: 1, chance: 0.15 }
    ],

    bedroom: [
        { key: "cloth", min: 1, max: 3, chance: 0.55 },
        { key: "bandage", min: 1, max: 1, chance: 0.25 },
        { key: "knife", min: 1, max: 1, chance: 0.12 }
    ],

    shop: [
        { key: "canned_food", min: 1, max: 3, chance: 0.65 },
        { key: "water_bottle", min: 1, max: 2, chance: 0.55 },
        { key: "cloth", min: 1, max: 2, chance: 0.25 },
        { key: "ammo", min: 2, max: 6, chance: 0.15 }
    ],

    storage: [
        { key: "scrap", min: 1, max: 3, chance: 0.65 },
        { key: "alcohol", min: 1, max: 2, chance: 0.35 },
        { key: "crowbar", min: 1, max: 1, chance: 0.18 },
        { key: "pistol", min: 1, max: 1, chance: 0.07 }
    ],

    clinic: [
        { key: "bandage", min: 1, max: 3, chance: 0.70 },
        { key: "medkit", min: 1, max: 1, chance: 0.25 },
        { key: "alcohol", min: 1, max: 2, chance: 0.45 },
        { key: "water_bottle", min: 1, max: 1, chance: 0.25 }
    ]
};

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createGroundDrop(itemKey, qty) {
    const item = items[itemKey];

    if (item.stack) {
        return { key: itemKey, qty };
    }

    const drops = [];
    for (let i = 0; i < qty; i++) {
        drops.push({
            key: itemKey,
            hp: item.durability
        });
    }
    return drops;
}

function addGeneratedDrop(room, itemKey, qty) {
    const made = createGroundDrop(itemKey, qty);

    if (Array.isArray(made)) {
        room.ground.push(...made);
    } else {
        room.ground.push(made);
    }
}

function generateLoot(room) {
    if (room.generated) return;

    room.generated = true;

    const table = lootTables[room.lootProfile] || [];
    table.forEach(entry => {
        if (Math.random() <= entry.chance) {
            const qty = rand(entry.min, entry.max);
            addGeneratedDrop(room, entry.key, qty);
        }
    });
}