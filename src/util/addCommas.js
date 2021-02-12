import formatNumber from 'format-number';

export default function addCommas(nStr) {
    return formatNumber()(+nStr);
}
