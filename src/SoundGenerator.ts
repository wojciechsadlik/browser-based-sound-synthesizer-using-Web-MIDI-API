export default class SoundGenerator {
    private context: AudioContext;
    private oscillators: OscillatorNode[];
    private masterGainNode: GainNode | null;

    constructor() {
        this.context = new window.AudioContext();
        this.oscillators = [];
        this.masterGainNode = this.context.createGain();
    }

    
    public noteOn = (noteNumber: number): void => {

    }

    public noteOff = (noteNumber: number): void => {

    }

    private noteNumberToFrequency = (noteNumber: number): number => {
        return 440 * Math.pow(2, (noteNumber - 69) / 12);
    }
}