import {NoteOnEvent, NoteOffEvent} from './CustomEvents';

export default class KeyboardMIDIInput extends EventTarget {
    private dict: {[id:string]: number} = {
        'q': 57,
        'w': 59,
        'e': 60,
        'r': 62,
        't': 64,
        'y': 65,
        'u': 67,
        'i': 69,
        'o': 71,
        'p': 72
    }

    private pressed: {[id:string]: boolean} = {
        'q': false,
        'w': false,
        'e': false,
        'r': false,
        't': false,
        'y': false,
        'u': false,
        'i': false,
        'o': false,
        'p': false
    }

    constructor() {
        super();

        window.addEventListener('keydown', this.keyDown);
        window.addEventListener('keyup', this.keyUp);
    }

    private keyDown = (e: KeyboardEvent) => {
        if (typeof this.pressed[e.key] !== 'undefined') {
            if (!this.pressed[e.key]) {
                this.dispatchEvent(new NoteOnEvent(this.dict[e.key], 125))
                this.pressed[e.key] = true;
            }
        }
    }

    private keyUp = (e: KeyboardEvent) => {
        if (typeof this.pressed[e.key] !== 'undefined') {
            this.dispatchEvent(new NoteOffEvent(this.dict[e.key], 125))
            this.pressed[e.key] = false;
        }
    }
}