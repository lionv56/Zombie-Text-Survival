function getWeight() {
    return player.inventory.reduce((sum, slot) => sum + items[slot.key].weight * slot.qty, 0);
}

function addItem(key, qty=1){
    const item = items[key];
    if(getWeight() + item.weight * qty > player.maxWeight){
        write("Te zwaar om mee te nemen.");
        return;
    }

    const found = player.inventory.find(s => s.key === key);
    if(found) found.qty += qty;
    else player.inventory.push({ key, qty });

    updateInventory();
}

function dropItem(index){
    const slot = player.inventory[index];
    currentRoom.ground.push(slot);
    player.inventory.splice(index,1);
    write(`Je dropped ${items[slot.key].name} x${slot.qty}`);
    updateInventory();
    showRoom(currentRoom.key);
}

function useItem(index){
    const slot = player.inventory[index];
    const item = items[slot.key];

    if(!item.heal){ write("Dit item kan je nu niet gebruiken."); return; }

    player.hp = Math.min(100, player.hp + item.heal);
    slot.qty--;
    if(slot.qty <= 0) player.inventory.splice(index,1);

    write(`Je gebruikt ${item.name} en geneest ${item.heal} HP`);
    updateStats();
    updateInventory();
}

function updateInventory(){
    invEl.innerHTML = `Inventory (${getWeight().toFixed(1)}/${player.maxWeight}kg)<br>`;
    player.inventory.forEach((slot,i)=>{
        const item = items[slot.key];
        const btnUse = item.heal ? `<button onclick="useItem(${i})">Gebruik</button>` : "";
        const btnDrop = `<button onclick="dropItem(${i})">Drop</button>`;
        invEl.innerHTML += `${item.name} x${slot.qty} ${btnUse} ${btnDrop}<br>`;
    });
}