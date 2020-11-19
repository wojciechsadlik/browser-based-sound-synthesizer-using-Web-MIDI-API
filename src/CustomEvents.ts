export class NoteOnEvent extends Event {
    noteNumber: number;
    velocity: number;

    constructor(noteNumber: number, velocity: number) {
        super('noteOn');
        this.noteNumber = noteNumber;
        this.velocity = velocity;
    }
}

export class NoteOffEvent extends Event {
    noteNumber: number;
    velocity: number;

    constructor(noteNumber: number, velocity: number) {
        super('noteOff');
        this.noteNumber = noteNumber;
        this.velocity = velocity;
    }
}