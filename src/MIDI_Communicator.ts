export default class MIDI_Communicator {
    private midiAccess: WebMidi.MIDIAccess | null;
    private midiInputSelectElem: HTMLSelectElement | null;

    constructor() {
        this.midiAccess = null;
        this.midiInputSelectElem = null;
    }

    public async init(midiInputSelectElem: HTMLSelectElement) {
        try {
            this.midiAccess = await navigator.requestMIDIAccess();
            console.log('MIDI access gained');

            this.midiInputSelectElem = midiInputSelectElem;

            this.updateInputSelect();

            this.midiAccess.onstatechange = this.onstatechange;
        } catch(err) {
            console.error('MIDI access rejected ' + err);
        }
    }

    public getInputs = (): WebMidi.MIDIInputMap | never => {
        if (!this.midiAccess) {
            throw new Error('No MIDI access');
        } else {
            return this.midiAccess.inputs;
        }
    }

    private onstatechange = (e: WebMidi.MIDIConnectionEvent): void => {
        this.updateInputSelect();
    }

    private updateInputSelect = (): void => {
        for (let i = this.midiInputSelectElem!.size; i >= 0; --i) {
            this.midiInputSelectElem!.remove(i);
        }

        for (let input of Array.from(this.getInputs().values())) {
            let option = document.createElement('option');
    
            if (input.name)
                option.text = input.name;
            else
                option.text = input.id;
            
            option.value = input.id;
            
            this.midiInputSelectElem!.add(option);
        }
    }
    
}