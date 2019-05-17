import getHexadecimal from '../util/getHexadecimal';

/**
 * Given the percentage in question, the min percentage value, and the spread between
 * the min percentage and the max, this function returns back your color as a
 * string in the form "#RRGGBB"
 */
export default function calculateColor(percentage, min, spread) {
    //calculate the color
    const red = 255;
    const blue = 255 - ((percentage - min) * (1 / spread) * 255);
    const green = 255 - ((percentage - min) * (1 / spread) * 255);
    const color = '#' + getHexadecimal(red) + getHexadecimal(green) + getHexadecimal(blue);

    return color;
}
