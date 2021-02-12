export function mapCode(code) {
    return code.split('_').map((n)=>+n);
}

export const getDisplay = (visible) => visible ? undefined : {display: 'none'};

export const getVisibility = (visible) => visible ? undefined : {visibility: 'hidden'};
