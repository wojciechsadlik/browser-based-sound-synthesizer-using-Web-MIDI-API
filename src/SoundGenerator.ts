export default class SoundGenerator {
    private context: AudioContext;
    private oscillators: Map<number, OscillatorNode>;
    private masterGainNode: GainNode | null;
    private selectedWaveType: OscillatorType | null;

    constructor() {
        this.context = new window.AudioContext();
        this.oscillators = new Map<number, OscillatorNode>();
        this.masterGainNode = this.context.createGain();
        this.selectedWaveType = null;
    }

    
    public noteOn = (noteNumber: number): void => {
        let osc = this.generateSound(this.noteNumberToFrequency(noteNumber));
        
        this.oscillators.set(noteNumber, osc);
    }

    public noteOff = (noteNumber: number): void => {
        let activeOscillator = this.oscillators.get(noteNumber);
        
        if (typeof activeOscillator !== 'undefined') {
            activeOscillator.stop();
        }

        this.oscillators.delete(noteNumber);
    }

    private generateSound = (frequency: number): OscillatorNode => {
        let osc = this.context.createOscillator();
        osc.connect(this.masterGainNode as AudioNode);

        if (this.selectedWaveType) {
            osc.type = this.selectedWaveType;
        }

        osc.frequency.value = frequency;

        osc.start();

        return osc;
    }

    private noteNumberToFrequency = (noteNumber: number): number => {
        return 440 * Math.pow(2, (noteNumber - 69) / 12);
    }
}