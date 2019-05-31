import $ from '../jquery';

export function getCurrentIndicator() {
    const indicator = $.address.parameter('indicator');
    return indicator ? mapCode(indicator) : [];
}

export function mapCode(code) {
    return code.split('_').map((n)=>+n);
}
