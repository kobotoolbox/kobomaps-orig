import addCommas from '../util/addCommas';
import htmlDecode from '../util/htmlDecode';
import {updateLeft, updateRight, updateLegend} from "./legend-dom";

export default function updateKey(min, span, title, unit) {
    updateLeft(addCommas(min) + ' ' + htmlDecode(unit));

    updateRight(addCommas((min + span)) + ' ' + htmlDecode(unit));


    updateLegend(title);

}
