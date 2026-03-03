const textEl = document.getElementById("text");
const choicesEl = document.getElementById("choices");
const invEl = document.getElementById("inventory");
const statsEl = document.getElementById("stats");

function showRoom(key){
    const room = rooms[key];
    currentRoom = room;

    generateLoot(room);

    textEl.innerText = room.text;
    choicesEl.innerHTML = "";

    // movement buttons
    Object.keys(rooms).forEach(r=>{
        if(r!==key){
            const b=document.createElement("button");
            b.innerText="Ga naar "+r;
            b.onclick=()=>showRoom(r);
            choicesEl.appendChild(b);
        }
    });

    // loot buttons
    room.ground.forEach((slot,i)=>{
        const item = items[slot.key];
        const b = document.createElement("button");
        b.innerText = `Pak ${item.name} x${slot.qty}`;
        b.onclick = ()=>{
            addItem(slot.key,slot.qty);
            room.ground.splice(i,1);
            showRoom(key);
        };
        choicesEl.appendChild(b);
    });
}

function write(t){ textEl.innerText = t; }
function updateStats(){ statsEl.innerText="HP: "+player.hp; }

// START GAME
addItem("knife",1);
addItem("bandage",2);
updateStats();
showRoom("street");