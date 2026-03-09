function addXP(amount) {
    player.skills.xp += amount;

    while (player.skills.xp >= 20) {
        player.skills.xp -= 20;
        player.skills.level++;

        player.maxHp += 5;
        player.maxStamina += 1;
        player.hp = Math.min(player.maxHp, player.hp + 5);

        addLog(`Level up! Je bent nu level ${player.skills.level}.`);
    }

    updateStats();
}

function getDamageBonus() {
    return player.skills.level - 1;
}