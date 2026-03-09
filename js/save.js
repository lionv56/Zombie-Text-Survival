function saveGame() {
    const saveData = {
        player,
        rooms,
        currentRoomKey: currentRoom ? currentRoom.key : null,
        combatState,
        log,
        gameStarted
    };

    localStorage.setItem("zombieTextSurvivalSave", JSON.stringify(saveData));
    addLog("Game opgeslagen.");
    renderText();
}

function loadGame() {
    const raw = localStorage.getItem("zombieTextSurvivalSave");
    if (!raw) {
        write("Geen save gevonden.");
        return;
    }

    const saveData = JSON.parse(raw);

    Object.assign(player, saveData.player);

    Object.keys(rooms).forEach(key => {
        if (saveData.rooms[key]) {
            Object.assign(rooms[key], saveData.rooms[key]);
        }
    });

    combatState = saveData.combatState || null;
    log = saveData.log || [];
    gameStarted = saveData.gameStarted ?? true;

    if (saveData.currentRoomKey && rooms[saveData.currentRoomKey]) {
        currentRoom = rooms[saveData.currentRoomKey];
    } else {
        currentRoom = rooms.street;
    }

    updateInventory();
    updateStats();

    if (combatState) {
        write("Gevecht geladen.");
        showCombatMenu();
    } else {
        showRoom(currentRoom.key);
    }
}