export default class MIDI_Communicator {
    private midiAccess: WebMidi.MIDIAccess | null;
    private midiInputSelectElem: HTMLSelectElement | null;
    private activeInput: WebMidi.MIDIInput | null;
    readonly eventTarget: EventTarget; 

    constructor() {
        this.midiAccess = null;
        this.midiInputSelectElem = null;
        this.activeInput = null;
        this.eventTarget = new EventTarget();
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
        let input = this.getInputs().get(inputId);
        
        if (typeof input === 'undefined')
            this.setActiveInput(null);
        else
            this.setActiveInput(input);
    }

    private setActiveInput = (input: WebMidi.MIDIInput | null): void => {
        if (this.activeInput)
            this.activeInput.onmidimessage = () => {};

        this.activeInput = input;

        if (this.activeInput)
            this.activeInput.onmidimessage = this.onMIDIMessage;
    }

    private onMIDIMessage = (e: WebMidi.MIDIMessageEvent): void => {
        switch (e.data[0] & 0xf0) {
            case 0x90:
                if (e.data[2] !== 0) {
                    this.eventTarget.dispatchEvent(new CustomEvent('noteOn', { detail: {noteNumber: e.data[1]} } as EventInit));
                }
                break;
            case 0x80:
                this.eventTarget.dispatchEvent(new CustomEvent('noteOff', { detail: {noteNumber: e.data[1]} } as EventInit));
        }
    }

    private onstatechange = (e: WebMidi.MIDIConnectionEvent): void => {
        let midiPort = e.port;
        if (midiPort.type === 'input') {
            if (midiPort.connection === 'open') {
                this.updateInputSelect();
            } else if (midiPort.connection == 'closed') {
                if (this.activeInput && e.port.id === this.activeInput.id) {
                    this.setActiveInput(null);
                }
            }
            
            this.updateInputSelect();
        }
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

            if (this.activeInput && this.activeInput.id === input.id) {
                option.defaultSelected = true;
            }
            
            this.midiInputSelectElem!.add(option);
        }
    }
    
}