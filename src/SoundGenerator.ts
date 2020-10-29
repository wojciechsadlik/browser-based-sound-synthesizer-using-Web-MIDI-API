import Voice from './Voice';
import WaveformData from './WaveformData';

export default class SoundGenerator {
    private context: AudioContext;
    private oscillators: Map<number, Voice[]>;
    private waveforms: WaveformData[];
    // private masterGainNode: GainNode | null;
    // private selectedWaveType: OscillatorType | null;

    constructor(context: AudioContext) {
        this.context = context;
        this.oscillators = new Map<number, Voice[]>();
        this.waveforms = [];

        // this.masterGainNode = this.context.createGain();
        // this.masterGainNode.connect(this.context.destination);

        // this.selectedWaveType = null;
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

    public setVolume = (waveformId: number, value: number): void => {
        if (this.waveforms[waveformId])
            this.waveforms[waveformId].volume = value;
    }

    public setWaveType = (waveType: OscillatorType | null): void => {
        this.selectedWaveType = waveType;
    }

    private generateSound = (frequency: number): OscillatorNode => {
        let osc = this.context.createOscillator();
        osc.connect(this.masterGainNode as GainNode);
        let vc = new Voice(this.context, 'square');

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

