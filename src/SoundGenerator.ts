import Voice from './Voice';
import WaveformData from './WaveformData';

export default class SoundGenerator {
    private context: AudioContext;
    private voices: Map<number, Voice[]>;
    private waveforms: Map<number, WaveformData>;
    private masterGain: GainNode;
    private compressor: DynamicsCompressorNode;
    private outputNode: AudioNode;
    private destination: AudioNode;

    constructor(context: AudioContext) {
        this.context = context;

        this.voices = new Map<number, Voice[]>();

        this.waveforms = new Map<number, WaveformData>();

        this.destination = context.destination;

        this.compressor = this.context.createDynamicsCompressor();
        this.compressor.connect(this.destination);
        this.outputNode = this.compressor;
        
        this.masterGain = this.context.createGain();
        this.masterGain.connect(this.compressor);
    }

    public setDestination = (destination: AudioNode) => {
        this.destination = destination;

        this.outputNode.disconnect();

        this.outputNode.connect(destination);
    }

    public setCompressorOn(turnOn: boolean) {
        this.compressor.disconnect();
        this.masterGain.disconnect();

        if (turnOn) {
            this.compressor.connect(this.destination);
            this.masterGain.connect(this.compressor);
        } else {
            this.masterGain.connect(this.destination);
        }
    }
    
    public noteOn = (noteNumber: number, velocity: number): void => {
        console.log(velocity);
        let voices = this.generateVoices(SoundGenerator.noteNumberToFrequency(noteNumber), velocity);
        
        for (let voice of voices) {
            voice.start();
        }

        this.voices.set(noteNumber, voices);
    }

    public noteOff = (noteNumber: number): void => {
        let voices = this.voices.get(noteNumber);
        
        if (voices) {
            for (let voice of voices) {
                voice.stop();
            }
        }
        
        this.voices.delete(noteNumber);
    }

    public setMasterVolume = (value: number) : void => {
        this.masterGain.gain.value = value;
    }

    public setVolume = (waveformId: number, value: number): void | never => {
        if (typeof this.waveforms.get(waveformId) !== 'undefined')
            this.waveforms.get(waveformId)!.volume = value;
        else
            throw new Error(`waveform ${waveformId} doesn\'t exist`);
    }

    public setDelay = (waveformId: number, value: number): void | never => {
        if (typeof this.waveforms.get(waveformId) !== 'undefined')
            this.waveforms.get(waveformId)!.delay = value;
        else
            throw new Error(`waveform ${waveformId} doesn\'t exist`);
    }

    public setWaveType = (waveformId: number, waveType: OscillatorType): void | never => {
        if (typeof this.waveforms.get(waveformId) !== 'undefined')
            this.waveforms.get(waveformId)!.type = waveType;
        else
            throw new Error(`waveform ${waveformId} doesn\'t exist`);
    }

    public addWaveform = (id: number, waveform: WaveformData): void => {
        this.waveforms.set(id, waveform);
    }

    public removeWaveform = (waveformId: number): void | never => {
        if (typeof this.waveforms.get(waveformId) !== 'undefined')
            this.waveforms.delete(waveformId);
        else
            throw new Error(`waveform ${waveformId} doesn\'t exist`);
    }

    static readonly noteNumberToFrequency = (noteNumber: number): number => {
        return 440 * Math.pow(2, (noteNumber - 69) / 12);
    }

    private generateVoices = (frequency: number, velocity: number): Voice[] => {
        let voices: Voice[] = [];
        
        this.waveforms.forEach((waveformData) => {
            if (waveformData.type) {
                let voice = new Voice(this.context, waveformData.type, this.masterGain);
                voice.setVolume(waveformData.volume * velocity);
                console.log(waveformData.volume * velocity)
                voice.setDelay(waveformData.delay, frequency);
                voice.frequency.value = frequency;
                voices.push(voice);
            }
        });

        return voices;
    }
}

