import Voice from './Voice';
import WaveformData from './WaveformData';

export default class SoundGenerator {
    private context: AudioContext;
    private voices: Map<number, Voice[]>;
    private waveforms: Map<number, WaveformData>;
    private masterGain: GainNode;
    private compressor: DynamicsCompressorNode;

    constructor(context: AudioContext) {
        this.context = context;

        this.voices = new Map<number, Voice[]>();

        this.waveforms = new Map<number, WaveformData>();

        this.compressor = this.context.createDynamicsCompressor();
        this.compressor.connect(context.destination)
        
        this.masterGain = this.context.createGain();
        this.masterGain.connect(this.compressor);
    }
    
    public noteOn = (noteNumber: number): void => {
        let voices = this.generateVoices(this.noteNumberToFrequency(noteNumber));
        
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
            throw new Error('waveform doesn\'t exist');
    }

    public setWaveType = (waveformId: number, waveType: OscillatorType): void | never => {
        if (typeof this.waveforms.get(waveformId) !== 'undefined')
            this.waveforms.get(waveformId)!.type = waveType;
        else
            throw new Error('waveform doesn\'t exist');
    }

    public addWaveform = (id: number, waveform: WaveformData): void => {
        this.waveforms.set(id, waveform);
    }

    public removeWaveform = (id: number): void | never => {
        if (typeof this.waveforms.get(id) !== 'undefined')
            this.waveforms.delete(id);
        else
            throw new Error('waveform doesn\'t exist');
    }

    private generateVoices = (frequency: number): Voice[] => {
        let voices: Voice[] = [];
        
        this.waveforms.forEach((waveformData) => {
            if (waveformData.type) {
                let voice = new Voice(this.context, waveformData.type, this.masterGain);
                voice.setVolume(waveformData.volume);
                voice.frequency.value = frequency;
                voices.push(voice);
            }
        });

        return voices;
    }

    private noteNumberToFrequency = (noteNumber: number): number => {
        return 440 * Math.pow(2, (noteNumber - 69) / 12);
    }
}

