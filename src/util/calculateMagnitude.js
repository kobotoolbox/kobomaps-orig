/// https://stackoverflow.com/questions/23917074/javascript-flooring-number-to-order-of-magnitude/23917134#23917134
export default function calculateMagnitude(num) {
    const order = Math.floor(Math.log(num) / Math.LN10
        + 0.000000001); // because float math sucks like that
    return Math.pow(10, order);
}
