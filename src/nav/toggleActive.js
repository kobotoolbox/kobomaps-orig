export default function toggleActive(item, state) {
    item.toggleClass('active', state);
    item.siblings('ul').toggle(state);
}
