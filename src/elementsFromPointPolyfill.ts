export const elementsFromPointPolyfill = (x: number, y: number): Element[] => {
    const elements: Array<Element> = [];
    const pointerEvents: Array<string> = [];
    let el: Element | null = null;

    do {
        if (el !== document.elementFromPoint(x, y)) {
            el = document.elementFromPoint(x, y);
            if (el && "style" in el) {
                const _el = el as HTMLElement;

                elements.push(el);
                pointerEvents.push(_el.style.pointerEvents);
                _el.style.pointerEvents = "none";
            }
        } else {
            el = null;
        }
    } while (el);

    for (let i = 0; i < elements.length; i++) {
        const _el = elements[i] as HTMLElement;
        _el.style.pointerEvents = pointerEvents[i];
    }

    return elements;
};

if (typeof document !== "undefined" && typeof document.elementsFromPoint === "undefined") {
    document.elementsFromPoint = elementsFromPointPolyfill;
}
