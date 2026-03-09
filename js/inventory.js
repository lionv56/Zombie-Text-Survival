function isStackable(item) {
    return item.stack === true;
}

function getWeight() {
    return player.inventory.reduce((sum, slot) => {
        const item = items[slot.key];
        return sum + item.weight * (slot.qty || 1);
    }, 0);
}

function getItemQty(key) {
    return player.inventory
        .filter(slot => slot.key === key)
        .reduce((sum, slot) => sum + (slot.qty || 1), 0);
}

function canCarry(key, qty = 1) {
    const item = items[key];
    const extraWeight = item.weight * qty;
    return getWeight() + extraWeight <= player.maxWeight;
}

function addItem(key, qty = 1, customHp = null) {
    const item = items[key];

    if (isStackable(item)) {
        if (!canCarry(key, qty)) {
            write("Te zwaar om mee te nemen.");
            return false;
        }

        const found = player.inventory.find(slot => slot.key === key && slot.qty !== undefined);
        if (found) {
            found.qty += qty;
        } else {
            player.inventory.push({ key, qty });
        }

        updateInventory();
        return true;
    }

    for (let i = 0; i < qty; i++) {
        if (!canCarry(key, 1)) {
            write("Te zwaar om verder mee te nemen.");
            updateInventory();
            return false;
        }

        player.inventory.push({
            key,
            hp: customHp ?? item.durability
        });
    }

    updateInventory();
    return true;
}

function removeItem(key, qty = 1) {
    const item = items[key];

    if (isStackable(item)) {
        const slot = player.inventory.find(s => s.key === key && s.qty !== undefined);
        if (!slot) return false;

        slot.qty -= qty;
        if (slot.qty <= 0) {
            player.inventory = player.inventory.filter(s => !(s.key === key && s.qty !== undefined));
        }
        return true;
    }

    let removed = 0;
    player.inventory = player.inventory.filter(slot => {
        if (slot.key === key && removed < qty) {
            removed++;
            return false;
        }
        return true;
    });

    return removed > 0;
}

function dropItem(index) {
    const slot = player.inventory[index];
    if (!slot || !currentRoom) return;

    currentRoom.ground.push({ ...slot });
    player.inventory.splice(index, 1);

    addLog(`${items[slot.key].name} gedropt.`);
    updateInventory();
    showRoom(currentRoom.key);
}

function useItem(index) {
    const slot = player.inventory[index];
    if (!slot) return;

    const item = items[slot.key];
    let used = false;
    let msg = [];

    if (item.heal) {
        if (player.hp >= player.maxHp) {
            msg.push("Je bent al volledig gezond.");
        } else {
            const before = player.hp;
            player.hp = Math.min(player.maxHp, player.hp + item.heal);
            msg.push(`Je healt ${player.hp - before} HP.`);
            used = true;
        }
    }

    if (item.hungerRestore) {
        const before = player.hunger;
        player.hunger = Math.min(100, player.hunger + item.hungerRestore);
        msg.push(`Honger +${player.hunger - before}.`);
        used = true;
    }

    if (item.thirstRestore) {
        const before = player.thirst;
        player.thirst = Math.min(100, player.thirst + item.thirstRestore);
        msg.push(`Dorst +${player.thirst - before}.`);
        used = true;
    }

    if (!used) {
        write("Dit item kun je nu niet gebruiken.");
        return;
    }

    removeItem(slot.key, 1);
    write(msg.join(" "));
    updateStats();
    updateInventory();
}

function equipArmorFromInventory(index) {
    const slot = player.inventory[index];
    if (!slot) return;

    const item = items[slot.key];
    if (item.type !== "armor") return;

    player.armor = {
        key: slot.key,
        hp: slot.hp
    };

    addLog(`${item.name} uitgerust.`);
    updateStats();
    updateInventory();
}

function getInventoryLabel(slot) {
    const item = items[slot.key];
    let label = item.name;

    if (slot.hp !== undefined) {
        label += ` (${slot.hp}hp)`;
    }

    if (slot.qty !== undefined) {
        label += ` x${slot.qty}`;
    }

    if (player.armor && player.armor.key === slot.key && player.armor.hp === slot.hp) {
        label += " [uitgerust]";
    }

    return label;
}

function updateInventory() {
    invEl.innerHTML = "";

    const head = document.createElement("div");
    head.className = "small-note";
    head.innerText = `Inventory (${getWeight().toFixed(1)}/${player.maxWeight}kg)`;
    invEl.appendChild(head);

    if (player.armor) {
        const armorItem = items[player.armor.key];
        const armorInfo = document.createElement("div");
        armorInfo.className = "small-note";
        armorInfo.innerText = `Armor: ${armorItem.name} (${player.armor.hp}hp, defense ${armorItem.defense})`;
        invEl.appendChild(armorInfo);
    }

    if (player.inventory.length === 0) {
        const empty = document.createElement("div");
        empty.className = "small-note";
        empty.innerText = "Je inventory is leeg.";
        invEl.appendChild(empty);
        return;
    }

    player.inventory.forEach((slot, i) => {
        const item = items[slot.key];

        const row = document.createElement("div");
        row.className = "inventory-row";

        const label = document.createElement("div");
        label.className = "inventory-label";
        label.innerText = getInventoryLabel(slot);
        row.appendChild(label);

        const canUse = item.heal || item.hungerRestore || item.thirstRestore;
        if (canUse) {
            const useBtn = document.createElement("button");
            useBtn.innerText = "Gebruik";
            useBtn.onclick = () => useItem(i);
            row.appendChild(useBtn);
        }

        if (item.type === "armor") {
            const equipBtn = document.createElement("button");
            equipBtn.innerText = "Equip";
            equipBtn.onclick = () => equipArmorFromInventory(i);
            row.appendChild(equipBtn);
        }

        const dropBtn = document.createElement("button");
        dropBtn.innerText = "Drop";
        dropBtn.onclick = () => dropItem(i);
        row.appendChild(dropBtn);

        invEl.appendChild(row);
    });
}