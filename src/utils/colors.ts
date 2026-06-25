export const LEVEL_COLORS = [
    '#ff00ff', // Level 1 - Magenta
    '#00ffcc', // Level 2 - Cyan
    '#ffcc00', // Level 3 - Yellow
    '#ff0033', // Level 4 - Red
    '#9933ff', // Level 5 - Purple
    '#33ff33', // Level 6 - Green
    '#ff6600', // Level 7 - Orange
    '#ffffff'  // Level 8 - White (Insane speed)
];

export const getLevelColor = (level: number) => {
    return LEVEL_COLORS[(level - 1) % LEVEL_COLORS.length];
};
