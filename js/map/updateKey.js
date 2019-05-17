import $ from '../jquery';
import addCommas from '../util/addCommas';
import htmlDecode from '../util/htmlDecode';

export default function updateKey(min, span, title, unit) {
    const $percentleft = $('#percentleft');
    $percentleft.attr('title', addCommas(min) + ' ' + htmlDecode(unit));
    $percentleft.text(addCommas(min) + ' ' + htmlDecode(unit));

    const $percentright = $('#percentright');
    $percentright.attr('title', addCommas((min + span)) + ' ' + htmlDecode(unit));
    $percentright.text(addCommas((min + span)) + ' ' + htmlDecode(unit));


    $('#spanLegendText').html(title);

}
