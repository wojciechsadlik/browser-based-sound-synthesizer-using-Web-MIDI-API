export default class MIDI_Communicator {
    private midiAccess: WebMidi.MIDIAccess | null;

    constructor() {
        this.midiAccess = null;
    }

    public async requestAccess() {
        try {
            this.midiAccess = await navigator.requestMIDIAccess();
            console.log('MIDI access gained');
        } catch(err) {
            console.error('MIDI access rejected ' + err);
        }
    }

    public getInputs(): WebMidi.MIDIInputMap | never {
        if (!this.midiAccess) {
            throw new Error('No MIDI access');
        } else {
            return this.midiAccess.inputs;
        }
    }
}