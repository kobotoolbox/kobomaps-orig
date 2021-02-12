/**
 * This takes in a set of data and finds the min and max,
 * then uses super complex math to figure out the optimal min and max,
 * like round to nice managable numbers and decide if we should baseline
 * off of zero or not
 * then returns back an array with keys span and min
 */
import calculateMagnitude from '../util/calculateMagnitude';
export default function calculateMinSpread(data) {
    data.push(0);
    //loop over the data to pre process it and figure out the below:
    let min = Math.min.apply(null, data);
    let max = Math.max.apply(null, data);

    //figure out the order of magnitude of max
    const maxMagnitude = calculateMagnitude(max);
    if (maxMagnitude < 1) {
        if (max < 0) {
            max = 0;
        } else {
            max = maxMagnitude * 10;
        }
    } else if (maxMagnitude === 1) {
        max = 10;
    } else if (max % maxMagnitude !== 0) {
        max = (Math.floor(max / maxMagnitude) + 1) * maxMagnitude;
    }

    //figure out the order of magnitude of max
    const minMagnitude = calculateMagnitude(min);

    if (min === 0 || minMagnitude === 1) {
        min = 0;
    } else if (minMagnitude < 1) {
        min = Math.floor(min / minMagnitude) * minMagnitude;
        min = parseFloat(min.toFixed(Math.log(10) / Math.log((1.0 / minMagnitude)))); //making up for crappy float rounding errors
    } else if (min % minMagnitude !== 0) {
        min = Math.floor(min / minMagnitude) * minMagnitude;
    }

    //now we decide if we want to base line off zero
    //We don't baseline off zero if the min is negative and the max is positive
    if (!(min < 0 && max > 0)) {
        //now we want to figure out if max or min is closer to zero
        let closerToZero = min;
        if (max < 0) { //max is closer
            closerToZero = max;
        }
        //now we see if the number closer to zero, is further from zero than max is from min. and if the absolute
        //value of the number involved are more than 1000

        if (!(Math.abs(closerToZero) > Math.abs(max - min) && Math.abs(closerToZero) > 1000)) {
            if (max > 0) {
                min = 0;
            } else {
                max = 0;
            }
        }

    }

    //calculate the spread
    const spread = max - min;

    return {min, spread};
}
