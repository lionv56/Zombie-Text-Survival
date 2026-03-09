let log = [];

function addLog(msg) {
    log.unshift(msg);
    if (log.length > 8) log.pop();
    renderText();
}

function clearLog() {
    log = [];
    renderText();
}

function startCombat(zombies) {
    combatState = {
        zombies,
        turn: 1
    };

    clearLog();
    addLog(`${zombies.length} zombie(s) verschijnen!`);
    write("Je bent in gevecht.");
    showCombatMenu();
}

function showCombatMenu() {
    if (!combatState) return;

    choicesEl.innerHTML = "";

    const attackBtn = document.createElement("button");
    attackBtn.innerText = "Aanvallen";
    attackBtn.onclick = () => chooseTarget();
    choicesEl.appendChild(attackBtn);

    const healItems = player.inventory.filter(slot => {
        const item = items[slot.key];
        return item.heal || item.hungerRestore || item.thirstRestore;
    });

    if (healItems.length > 0) {
        const useBtn = document.createElement("button");
        useBtn.innerText = "Gebruik item";
        useBtn.onclick = () => showCombatItemMenu();
        choicesEl.appendChild(useBtn);
    }

    const fleeBtn = document.createElement("button");
    fleeBtn.innerText = "Vluchten";
    fleeBtn.onclick = fleeCombat;
    choicesEl.appendChild(fleeBtn);
}

function showCombatItemMenu() {
    choicesEl.innerHTML = "";
    write("Kies een item om te gebruiken:");

    player.inventory.forEach((slot, index) => {
        const item = items[slot.key];
        if (!(item.heal || item.hungerRestore || item.thirstRestore)) return;

        const btn = document.createElement("button");
        btn.innerText = getInventoryLabel(slot);
        btn.onclick = () => {
            useItem(index);
            if (combatState && player.hp > 0) {
                enemiesAttack();
            }
        };
        choicesEl.appendChild(btn);
    });

    const backBtn = document.createElement("button");
    backBtn.innerText = "Terug";
    backBtn.onclick = showCombatMenu;
    choicesEl.appendChild(backBtn);
}

function chooseTarget() {
    if (!combatState) return;

    choicesEl.innerHTML = "";
    write("Welke zombie wil je aanvallen?");

    combatState.zombies.forEach((zombie, zIndex) => {
        const btn = document.createElement("button");
        btn.innerText = `${zombie.name} (${zombie.hp}hp)`;
        btn.onclick = () => chooseWeapon(zIndex);
        choicesEl.appendChild(btn);
    });

    const backBtn = document.createElement("button");
    backBtn.innerText = "Terug";
    backBtn.onclick = showCombatMenu;
    choicesEl.appendChild(backBtn);
}

function chooseWeapon(zIndex) {
    choicesEl.innerHTML = "";
    write("Kies je wapen:");

    const weapons = player.inventory.filter(slot => {
        const item = items[slot.key];
        return !!item.damage && slot.hp > 0;
    });

    weapons.forEach(slot => {
        const item = items[slot.key];
        const btn = document.createElement("button");
        btn.innerText = `${item.name} (${slot.hp}hp)`;
        btn.onclick = () => attackZombie(zIndex, slot);
        choicesEl.appendChild(btn);
    });

    const fistsBtn = document.createElement("button");
    fistsBtn.innerText = "Vuisten";
    fistsBtn.onclick = () => attackZombie(zIndex, null);
    choicesEl.appendChild(fistsBtn);

    const backBtn = document.createElement("button");
    backBtn.innerText = "Terug";
    backBtn.onclick = () => chooseTarget();
    choicesEl.appendChild(backBtn);
}

function damageWeapon(slot) {
    if (!slot) return;
    slot.hp -= 1;

    if (slot.hp <= 0) {
        slot.hp = 0;
        addLog(`${items[slot.key].name} is kapot!`);
    }

    updateInventory();
}

function fleeCombat() {
    if (!combatState) return;

    const fleeChance = 0.45 + (player.skills.level * 0.03);
    if (Math.random() <= fleeChance) {
        addLog("Je weet te ontsnappen.");
        combatState = null;
        showRoom(currentRoom.key);
        return;
    }

    addLog("Vluchten mislukt!");
    enemiesAttack();
}

function enemiesAttack() {
    if (!combatState) return;

    combatState.zombies.forEach(z => {
        const raw = rand(z.damage[0], z.damage[1]);
        const finalDamage = reduceDamage(raw);
        player.hp -= finalDamage;
        addLog(`${z.name} raakt je voor ${finalDamage}.`);
    });

    player.stamina = Math.min(player.maxStamina, player.stamina + 1);
    updateStats();
    updateInventory();

    if (player.hp <= 0) {
        player.hp = 0;
        updateStats();
        write("Je bent dood... GAME OVER");
        choicesEl.innerHTML = "";
        combatState = null;
        return;
    }

    showCombatMenu();
}

function attackZombie(zIndex, slot) {
    if (!combatState) return;

    const zombie = combatState.zombies[zIndex];
    if (!zombie) {
        showCombatMenu();
        return;
    }

    let damage = 0;
    let staminaCost = 2;

    if (player.stamina < staminaCost) {
        staminaCost = 0;
        addLog("Je bent uitgeput. Je aanval is zwakker.");
    } else {
        player.stamina -= staminaCost;
    }

    if (Math.random() < 0.15) {
        addLog("Je mist!");
        updateStats();
        enemiesAttack();
        return;
    }

    if (slot) {
        const weapon = items[slot.key];

        if (slot.hp <= 0) {
            addLog(`${weapon.name} is kapot.`);
            showCombatMenu();
            return;
        }

        if (weapon.ammoType) {
            if (getItemQty(weapon.ammoType) <= 0) {
                addLog("Geen ammo!");
                showCombatMenu();
                return;
            }
            removeItem(weapon.ammoType, 1);
        }

        damage = rand(weapon.damage[0], weapon.damage[1]) + getDamageBonus();
        if (Math.random() < 0.15) {
            damage *= 2;
            addLog("CRITICAL!");
        }

        zombie.hp -= damage;
        damageWeapon(slot);
        addLog(`${weapon.name} doet ${damage} damage.`);
    } else {
        damage = rand(1, 3) + getDamageBonus();
        zombie.hp -= damage;
        addLog(`Je vuisten doen ${damage} damage.`);
    }

    if (zombie.hp <= 0) {
        addLog(`${zombie.name} sterft.`);
        addXP(zombie.xp);
        combatState.zombies.splice(zIndex, 1);

        if (Math.random() < 0.40) {
            const lootDrop = Math.random() < 0.5 ? "cloth" : "scrap";
            addItem(lootDrop, 1);
            addLog(`Je vindt ${items[lootDrop].name}.`);
        }
    }

    updateStats();
    updateInventory();

    if (combatState.zombies.length === 0) {
        write("Alle zombies verslagen!");
        combatState = null;
        showRoom(currentRoom.key);
        return;
    }

    enemiesAttack();
}