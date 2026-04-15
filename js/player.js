const player = {
    hp: 100,
    maxHp: 100,

    stamina: 10,
    maxStamina: 10,

    hunger: 100,
    thirst: 100,

    inventory: [],
    maxWeight: 30,

    skills: {
        level: 1,
        xp: 0
    },

    armor: null,
    visitedRooms: {},

    tutorialSeen: false,
    tutorialStep: 0,
    inTutorial: false
};

let currentRoom = null;
let combatState = null;
let gameStarted = false;
let tutorialMode = null;