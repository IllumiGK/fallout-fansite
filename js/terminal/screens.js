const screens = {
    main: {
        header: [
            "Vault Archive Terminal",
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

    lore: {
        header: [
            "FALLOUT LORE DATABASE"
        ],
        options: {
            "2077": "lore-2077",
            "full timeline": "lore-full",
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
    }
};
