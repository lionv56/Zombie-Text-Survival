function generateLoot(room){
    if(room.generated) return;
    room.generated = true;

    // max 3 weapons
    let weaponCount = rand(0,3);
    for(let i=0;i<weaponCount;i++){
        if(Math.random()<0.7) room.ground.push({key:"knife",qty:1});
        else room.ground.push({key:"pistol",qty:1});
    }

    // medkit 0-1
    if(Math.random()<0.4) room.ground.push({key:"medkit",qty:1});

    // bandages 1-3
    if(Math.random()<0.8) room.ground.push({key:"bandage",qty:rand(1,3)});

    // ammo 2-6
    if(Math.random()<0.7) room.ground.push({key:"ammo",qty:rand(2,6)});
}

function rand(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }