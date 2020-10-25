export default class MIDI_Communicator {
    private midiAccess: WebMidi.MIDIAccess | null;
    private midiInputSelectElem: HTMLSelectElement | null;
    private activeInput: WebMidi.MIDIInput | null;

    constructor() {
        this.midiAccess = null;
        this.midiInputSelectElem = null;
        this.activeInput = null;
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

    public setSelectedInput = (inputId: string): void | never => {
        console.log(inputId);
        let input = this.getInputs().get(inputId);
        
        if (typeof input === 'undefined')
            this.setActiveInput(null);
        
        if (!input) {
            throw new Error(inputId + ' inputId doesn\'t match');
        }
    }

    private setActiveInput = (input: WebMidi.MIDIInput | null): void => {
        if (this.activeInput)
            this.activeInput.onmidimessage = () => {};

        if (input)
            this.activeInput = input;
        else
            this.activeInput = null;

        if (this.activeInput)
            this.activeInput.onmidimessage = this.onMIDIMessage;
    }

    private onMIDIMessage = (e: WebMidi.MIDIMessageEvent): void => {
        console.log(e.data);
    }

    private onstatechange = (e: WebMidi.MIDIConnectionEvent): void => {
        if (this.activeInput && e.port.id === this.activeInput.id) {
            this.setActiveInput(null);
        }

        this.updateInputSelect();
    }

    private updateInputSelect = (): void => {
        for (let i = this.midiInputSelectElem!.options.length - 1; i >= 1; --i) {
            this.midiInputSelectElem!.options.remove(i);
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