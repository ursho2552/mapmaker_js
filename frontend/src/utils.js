import { divergingColors, sequentialColors } from './constants';

export const generateColorStops = (colors) => {
    const step = 1 / colors.length;
    return colors.flatMap((color, i) => {
        const start = i * step;
        const end = (i + 1) * step;
        return [[start, color], [end, color]];
    });
};

export const getColorscaleForIndex = (index) => {
    const isDiverging = index.includes('Change') || index.includes('Temperature');
    return generateColorStops(isDiverging ? divergingColors : sequentialColors);
};

export const hexToRgb = (hex) => {
    const normalized = hex.replace('#', '');
    const fullHex = normalized.length === 3
        ? normalized.split('').map(c => c + c).join('')
        : normalized;

    const value = parseInt(fullHex, 16);
    return {
        r: (value >> 16) & 255,
        g: (value >> 8) & 255,
        b: value & 255,
    };
};

export const getInterpolatedColorFromValue = (value, min, max, colorStops) => {
    if (isNaN(value) || value == null) return 'rgba(0,0,0,0)';
    if (min === max) return colorStops[colorStops.length - 1][1];

    const norm = (value - min) / (max - min);

    for (let i = 0; i < colorStops.length - 1; i++) {
        const [start, startColor] = colorStops[i];
        const [end, endColor] = colorStops[i + 1];

        if (norm >= start && norm <= end) {
            const ratio = (norm - start) / (end - start);
            const rgbStart = hexToRgb(startColor);
            const rgbEnd = hexToRgb(endColor);

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

    const precision = range >= 1000 ? 0 :
        range >= 100 ? 1 :
            range >= 1 ? 2 :
                range >= 0.01 ? 3 : 4;

    for (let i = 0; i <= numBins; i++) {
        const val = min + step * i;
        tickvals.push(val);
        ticktext.push(val.toFixed(precision));
    }

    return { tickvals, ticktext };
};