import $ from '../jquery';

export default function htmlDecode(value) {
    return $('<div/>').html(value).text();
}
