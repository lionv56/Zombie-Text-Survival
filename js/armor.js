function reduceDamage(dmg) {
    if (!player.armor) return dmg;

    const armorItem = items[player.armor.key];
    const reduced = Math.max(0, dmg - armorItem.defense);

    player.armor.hp -= 1;

    const invArmor = player.inventory.find(slot =>
        slot.key === player.armor.key && slot.hp !== undefined
    );

    if (invArmor) {
        invArmor.hp = player.armor.hp;
    }

    if (player.armor.hp <= 0) {
        addLog(`${armorItem.name} is kapot!`);
        player.armor.hp = 0;

        if (invArmor) {
            invArmor.hp = 0;
        }

        player.armor = null;
    }

    updateInventory();
    return reduced;
}