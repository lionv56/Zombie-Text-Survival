function tickSurvival() {
    if (!gameStarted) return;
    if (combatState) return;

    player.hunger = Math.max(0, player.hunger - 1);
    player.thirst = Math.max(0, player.thirst - 2);

    if (player.hunger <= 0 || player.thirst <= 0) {
        player.hp = Math.max(0, player.hp - 1);
        addLog("Je verzwakt door honger of dorst.");
    }

    player.stamina = Math.min(player.maxStamina, player.stamina + 1);

    updateStats();

    if (player.hp <= 0) {
        write("Je bent gestorven door uitputting... GAME OVER");
        choicesEl.innerHTML = "";
        gameStarted = false;
    }
}

setInterval(tickSurvival, 8000);