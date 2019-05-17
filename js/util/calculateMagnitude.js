export default function calculateMagnitude(num) {
    let magnitude;
    num = Math.abs(num);

    if (num === 0 || num === Infinity)
        return 0;

    if (num >= 1) {
        for (magnitude = 1; magnitude <= num; magnitude *= 10) {
            if (num - magnitude < magnitude * 10 - magnitude) {
                break;
            }
        }
    } else {
        for (magnitude = 0.1; num - magnitude < 0; magnitude /= 10) {
            if (magnitude < 0.00000001) {
                break;
            }
        }
    }
    return magnitude;
}
