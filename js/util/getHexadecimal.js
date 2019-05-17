export default function getHexadecimal(number) {
    number = Math.round(isNaN(number) ? 255 : number).toString(16);

    return number.length === 1 ? '0' + number : number;
}
