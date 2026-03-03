function randomZombie(){
    if(Math.random()<0.5) fightZombie();
    else write("Geen zombies hier.");
}

function fightZombie(){
    write("Een zombie valt je aan!");
    const weapon = player.inventory.find(i=>items[i.key].damage);
    if(weapon) write("Je verslaat de zombie met een wapen!");
    else {
        player.hp -= 20;
        write("Je raakt gewond (-20 HP)");
    }
    updateStats();
}