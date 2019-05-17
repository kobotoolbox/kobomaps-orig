export default function calculateMagnitude(num) {
    let magnitude;
    num = Math.abs(num);

    if (num === 0 || num === Infinity)
        return 0;

    if (num >= 1) {
        magnitude = 0;
        for (let i = 1; i <= num; i = i * 10) {
            if (num - i < ((i * 10) - (1 * i))) {
                magnitude = i;
                break;
            }
        }
        return magnitude;
    } else { //it's a decimal value
        magnitude = 0.1;
        for (magnitude = 0.1; (num - magnitude) < 0; magnitude = magnitude / 10) {
            if (magnitude < 0.00000001) {
                break;
            }
        }
        return magnitude;
    }
}
