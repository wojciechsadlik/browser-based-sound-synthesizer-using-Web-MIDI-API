export default class KeyboardMIDIInput extends EventTarget {
    private dict: {[id:string]: number} = {
        'q': 57,
        'w': 59,
        'e': 60,
        'r': 62,
        't': 64,
        'y': 65,
        'u': 67,
        'i': 69
    }

    constructor() {
        super();

        window.addEventListener('keydown', this.keyDown);
        window.addEventListener('keyup', this.keyUp);
    }

    private keyDown = (e: KeyboardEvent) => {
        this.dispatchEvent(new CustomEvent('noteOn', {detail: {noteNumber: this.dict[e.key]}} ))
    }

    private keyUp = (e: KeyboardEvent) => {
        this.dispatchEvent(new CustomEvent('noteOff', {detail: {noteNumber: this.dict[e.key]}} ))
    }
}