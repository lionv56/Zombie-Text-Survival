const recipes = {
    bandage: {
        name: "Bandage maken",
        needs: { cloth: 2 },
        gives: { bandage: 1 }
    },

    medkit: {
        name: "Medkit maken",
        needs: { bandage: 2, alcohol: 1, cloth: 1 },
        gives: { medkit: 1 }
    }
};

function canCraft(recipeKey) {
    const recipe = recipes[recipeKey];
    if (!recipe) return false;

    return Object.entries(recipe.needs).every(([key, qty]) => getItemQty(key) >= qty);
}

function craft(recipeKey) {
    const recipe = recipes[recipeKey];
    if (!recipe) return;

    if (!canCraft(recipeKey)) {
        write("Niet genoeg materialen.");
        return;
    }

    for (const [key, qty] of Object.entries(recipe.needs)) {
        removeItem(key, qty);
    }

    for (const [key, qty] of Object.entries(recipe.gives)) {
        addItem(key, qty);
    }

    write(`${recipe.name} gelukt.`);
    updateInventory();
    updateStats();
}

function showCraftingMenu() {
    write("Crafting menu");
    choicesEl.innerHTML = "";

    Object.entries(recipes).forEach(([key, recipe]) => {
        const btn = document.createElement("button");

        const needsText = Object.entries(recipe.needs)
            .map(([itemKey, qty]) => `${items[itemKey].name} x${qty}`)
            .join(", ");

        btn.innerText = `${recipe.name} (${needsText})${canCraft(key) ? "" : " - mist items"}`;
        btn.onclick = () => {
            craft(key);
            showCraftingMenu();
        };

        choicesEl.appendChild(btn);
    });

    const backBtn = document.createElement("button");
    backBtn.innerText = "Terug";
    backBtn.onclick = () => showRoom(currentRoom.key);
    choicesEl.appendChild(backBtn);
}