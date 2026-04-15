function tickSurvival() {
    if (!gameStarted) return;
    if (combatState) return;
    if (player.inTutorial) return;

    player.hunger--;
    player.thirst -= 2;

    if (player.hunger <= 0 || player.thirst <= 0) {
        player.hp--;
        addLog("Je verzwakt door honger of dorst!");
    }

    player.hunger = Math.max(0, player.hunger);
    player.thirst = Math.max(0, player.thirst);

    updateStats();

    if (player.hp <= 0) {
        write("Je bent gestorven... GAME OVER");
        choicesEl.innerHTML = "";
    }
}

setInterval(tickSurvival, 8000);