const TAU = Math.PI * 2;
const DEGREES = 180 / Math.PI;

const ADDENDUM = 0.55;
const DEDENDUM = 0.65;
const TIP_HALF_WIDTH = 0.165;
const ROOT_HALF_WIDTH = 0.34;
const BACKLASH = 0.06;
const BORE = 0.38;

interface PlacedGear {
    teeth: number;
    x: number;
    y: number;
    phase: number;
    ratio: number;
}

const round = (value: number) => Math.round(value * 1000) / 1000;

const point = (radius: number, angle: number) =>
    `${round(radius * Math.cos(angle))} ${round(radius * Math.sin(angle))}`;

const circle = (radius: number) => {
    const r = round(radius);
    return `M ${r} 0 A ${r} ${r} 0 1 0 ${-r} 0 A ${r} ${r} 0 1 0 ${r} 0 Z`;
};

export const pitchRadius = (teeth: number) => teeth / 2;

export const tipRadius = (teeth: number) => pitchRadius(teeth) + ADDENDUM;

export function gearPath(teeth: number): string {
    const pitch = TAU / teeth;
    const tip = tipRadius(teeth);
    const root = pitchRadius(teeth) - DEDENDUM;
    const tipHalf = pitch * TIP_HALF_WIDTH;
    const rootHalf = pitch * ROOT_HALF_WIDTH;

    const segments = [`M ${point(root, -rootHalf)}`];
    for (let tooth = 0; tooth < teeth; tooth++) {
        const centre = tooth * pitch;
        segments.push(
            `L ${point(tip, centre - tipHalf)}`,
            `L ${point(tip, centre + tipHalf)}`,
            `L ${point(root, centre + rootHalf)}`,
            `L ${point(root, centre + pitch - rootHalf)}`,
        );
    }
    segments.push('Z', circle(tip * BORE));

    return segments.join(' ');
}

// Each gear is phased so its gap faces the previous gear's tooth across the pitch point, then
// turns against it at the inverse of the tooth ratio. Phase is in degrees, positions in modules.
export function drivetrain(sequence: number[]): PlacedGear[] {
    const placed: PlacedGear[] = [];

    for (const teeth of sequence) {
        const previous = placed.at(-1);
        if (!previous) {
            placed.push({teeth, x: tipRadius(teeth), y: 0, phase: 0, ratio: 1});
            continue;
        }

        const offset = previous.phase / DEGREES / (TAU / previous.teeth);
        const phase = Math.PI + (TAU / teeth) * (-offset - 0.5);

        placed.push({
            teeth,
            x: round(previous.x + pitchRadius(previous.teeth) + pitchRadius(teeth) + BACKLASH),
            y: 0,
            phase: round((((phase * DEGREES) % 360) + 360) % 360),
            ratio: round((-previous.ratio * previous.teeth) / teeth),
        });
    }

    return placed;
}
