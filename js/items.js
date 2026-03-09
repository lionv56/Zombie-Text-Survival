const items = {
    // ===== MELEE =====
    knife: {
        name: "Mes",
        damage: [3, 6],
        durability: 30,
        weight: 2,
        type: "melee",
        rarity: 3
    },

    bat: {
        name: "Knuppel",
        damage: [5, 9],
        durability: 40,
        weight: 3,
        type: "melee",
        rarity: 2
    },

    crowbar: {
        name: "Breekijzer",
        damage: [6, 10],
        durability: 45,
        weight: 3.5,
        type: "melee",
        rarity: 2
    },

    // ===== GUNS =====
    pistol: {
        name: "Pistool",
        damage: [10, 18],
        durability: 60,
        ammoType: "ammo",
        weight: 4,
        type: "gun",
        rarity: 1
    },

    // ===== CONSUMABLES =====
    bandage: {
        name: "Bandage",
        heal: 15,
        stack: true,
        weight: 0.3,
        rarity: 3
    },

    medkit: {
        name: "Medkit",
        heal: 50,
        stack: true,
        weight: 2,
        rarity: 1
    },

    canned_food: {
        name: "Blikvoer",
        hungerRestore: 25,
        stack: true,
        weight: 0.8,
        rarity: 3
    },

    water_bottle: {
        name: "Waterfles",
        thirstRestore: 30,
        stack: true,
        weight: 1,
        rarity: 3
    },

    // ===== AMMO =====
    ammo: {
        name: "Ammo",
        stack: true,
        weight: 0.2,
        rarity: 2
    },

    // ===== ARMOR =====
    jacket: {
        name: "Jacket",
        defense: 2,
        durability: 35,
        weight: 3,
        type: "armor",
        rarity: 2
    },

    vest: {
        name: "Vest",
        defense: 5,
        durability: 50,
        weight: 6,
        type: "armor",
        rarity: 1
    },

    // ===== MATERIALS =====
    cloth: {
        name: "Cloth",
        stack: true,
        weight: 0.3,
        rarity: 3
    },

    alcohol: {
        name: "Alcohol",
        stack: true,
        weight: 0.5,
        rarity: 2
    },

    scrap: {
        name: "Schroot",
        stack: true,
        weight: 0.7,
        rarity: 3
    }
};