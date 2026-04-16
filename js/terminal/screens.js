const screens = {
    // Main Screen
    main: {
        header: [
            "Welcome to Vault Archive Terminal",
            "CLI Mode Active..",
            "",
            "Type 'Help' For Command List"
        ],
        options: {
            "fallout lore": "lore",
            "mod listings": "mods",
            "radio": "radio"
        }
    },

    // Fallout Radio Branch
    radio: {
        header: [
            "FALLOUT RADIO"
        ],
        options: {
            "Diamond City Radio": "",
            "Galaxy News Radio": "",
            "back": "main"
        }
    },

    // Mod Listings Branch
    mods: {
        header: [
            "MOD LISTINGS DATABASE"
        ],
        options: {
            "back": "main"
        }
    },

    // Fallout Lore Branch
    lore: {
        header: [
            "FALLOUT LORE DATABASE"
        ],
        options: {
            "2077": "lore_2077",
            "full timeline": "lore_full",
            "back": "main"
        }
    },

    lore_2077: {
        header: [
            "2077 - The Great War"
        ],
        contentKey:
            "lore_2077",
        options: {
            "back": "lore"
        }
    },

    lore_full: {
        header: [
            "Complete Fallout Timeline"
        ],
        contentKey: 
            "lore_full",
        options: {
            "back": "lore"
        }
    }

};
