const rooms = {
    street: {
        key: "street",
        name: "Straat",
        text: "Je staat op een verlaten straat. Auto's staan scheef geparkeerd en in de verte hoor je gegrom.",
        exits: [
            { text: "Ga naar huis", next: "house" },
            { text: "Ga naar winkel", next: "shop" },
            { text: "Ga naar kliniek", next: "clinic" }
        ],
        ground: [],
        generated: false,
        lootProfile: "street"
    },

    house: {
        key: "house",
        name: "Huis",
        text: "Een verlaten huis. De voordeur hangt scheef en het ruikt muf. Binnen kan nog bruikbare loot liggen.",
        exits: [
            { text: "Ga naar straat", next: "street" },
            { text: "Ga naar slaapkamer", next: "bedroom" }
        ],
        ground: [],
        generated: false,
        lootProfile: "house"
    },

    bedroom: {
        key: "bedroom",
        name: "Slaapkamer",
        text: "Een stoffige slaapkamer. De kastdeuren staan open en het bed is half omgegooid.",
        exits: [
            { text: "Ga terug naar huis", next: "house" }
        ],
        ground: [],
        generated: false,
        lootProfile: "bedroom"
    },

    shop: {
        key: "shop",
        name: "Winkel",
        text: "Een geplunderde buurtwinkel. De schappen zijn half leeg, maar misschien ligt er nog wat achter de toonbank.",
        exits: [
            { text: "Ga naar straat", next: "street" },
            { text: "Ga naar opslagruimte", next: "storage" }
        ],
        ground: [],
        generated: false,
        lootProfile: "shop"
    },

    storage: {
        key: "storage",
        name: "Opslag",
        text: "Een donkere opslagruimte. Tussen dozen en kapotte kratten kan nog bruikbaar materiaal liggen.",
        exits: [
            { text: "Ga terug naar winkel", next: "shop" }
        ],
        ground: [],
        generated: false,
        lootProfile: "storage"
    },

    clinic: {
        key: "clinic",
        name: "Kliniek",
        text: "Een kleine kliniek. De wachtruimte is leeg, maar medische spullen zijn hier waarschijnlijker dan elders.",
        exits: [
            { text: "Ga naar straat", next: "street" }
        ],
        ground: [],
        generated: false,
        lootProfile: "clinic"
    }
};