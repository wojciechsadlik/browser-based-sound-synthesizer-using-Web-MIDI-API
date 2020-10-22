export default class MIDI_Communicator {
    private midiAccess: WebMidi.MIDIAccess | null;

    constructor() {
        this.midiAccess = null;

        this.init();
    }

    private init() {
        navigator.requestMIDIAccess().then(
            this.onMIDIAccessGained,
            this.onMIDIAccessRejected);
    }

    private onMIDIAccessGained(midi: WebMidi.MIDIAccess) {
        console.log(midi);
        this.midiAccess = midi;

        console.log("MIDI access gained");            
    }

    private onMIDIAccessRejected() {
        alert("MIDI access rejected");

        console.log("MIDI access rejected");
    }
}