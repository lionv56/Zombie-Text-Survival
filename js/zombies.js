const zombieTypes = {
    walker: {
        name: "Walker",
        hp: [15, 25],
        damage: [3, 6],
        xp: 8,
        chance: 0.60
    },

    runner: {
        name: "Runner",
        hp: [10, 18],
        damage: [5, 10],
        xp: 12,
        chance: 0.30
    },

    brute: {
        name: "Brute",
        hp: [24, 36],
        damage: [7, 12],
        xp: 18,
        chance: 0.10
    }
};

function pickZombieType() {
    const roll = Math.random();
    let sum = 0;

    for (const [key, z] of Object.entries(zombieTypes)) {
        sum += z.chance;
        if (roll <= sum) return key;
    }

    return "walker";
}

function spawnZombies(roomKey) {
    let count = 1;

    if (roomKey === "street") count = rand(1, 3);
    else if (roomKey === "shop") count = rand(1, 2);
    else count = rand(1, 2);

    const list = [];

    for (let i = 0; i < count; i++) {
        const typeKey = pickZombieType();
        const type = zombieTypes[typeKey];

        list.push({
            typeKey,
            name: type.name,
            hp: rand(type.hp[0], type.hp[1]),
            damage: [...type.damage],
            xp: type.xp
        });
    }

    return list;
}

function randomZombie() {
    const chance = currentRoom && currentRoom.key === "street" ? 0.65 : 0.45;

    if (Math.random() > chance) {
        write("Je verkent de omgeving, maar deze keer zie je geen zombies.");
        return;
    }

    const zombies = spawnZombies(currentRoom ? currentRoom.key : "street");
    startCombat(zombies);
}