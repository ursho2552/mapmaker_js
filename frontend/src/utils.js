export const generateColorStops = (colors) => {
    const numColors = colors.length;
    return colors.map((color, i) => [i / (numColors - 1), color]);
};

export const hexToRgb = (hex) => {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const bigint = parseInt(hex, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    };
};

export const getInterpolatedColorFromValue = (value, min, max, colorStops) => {
    if (isNaN(value) || value == null) return 'rgba(0,0,0,0)';
    if (min === max) return colorStops[colorStops.length - 1][1];

    const normValue = (value - min) / (max - min);

    for (let i = 0; i < colorStops.length - 1; i++) {
        const [start, colorStart] = colorStops[i];
        const [end, colorEnd] = colorStops[i + 1];

        if (normValue >= start && normValue <= end) {
            const ratio = (normValue - start) / (end - start);
            const rgbStart = hexToRgb(colorStart);
            const rgbEnd = hexToRgb(colorEnd);

            const r = Math.round(rgbStart.r + ratio * (rgbEnd.r - rgbStart.r));
            const g = Math.round(rgbStart.g + ratio * (rgbEnd.g - rgbStart.g));
            const b = Math.round(rgbStart.b + ratio * (rgbEnd.b - rgbStart.b));

            return `rgb(${r},${g},${b})`;
        }
    }

    return colorStops[colorStops.length - 1][1];
};
