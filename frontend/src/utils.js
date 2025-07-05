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

export const generateColorbarTicks = (min, max, numBins) => {
    if (min == null || max == null) return { tickvals: [], ticktext: [] };

    const range = max - min;
    const step = range / numBins;
    const tickvals = [];
    const ticktext = [];

    // Decide precision based on range
    let precision;
    if (range >= 1000) {
        precision = 0;
    } else if (range >= 100) {
        precision = 1;
    } else if (range >= 1) {
        precision = 2;
    } else if (range >= 0.01) {
        precision = 3;
    } else {
        precision = 4;
    }

    for (let i = 0; i <= numBins; i++) {
        const val = min + step * i;
        tickvals.push(val);
        ticktext.push(val.toFixed(precision));
    }

    return { tickvals, ticktext };
};