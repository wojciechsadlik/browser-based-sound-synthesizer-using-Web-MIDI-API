import Voice from './Voice';
import WaveformData from './WaveformData';

export default class SoundGenerator {
    private context: AudioContext;
    private voices: Map<number, Voice[]>;
    private waveforms: WaveformData[];

    constructor(context: AudioContext) {
        this.context = context;
        this.voices = new Map<number, Voice[]>();
        this.waveforms = [];
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

    public setVolume = (waveformId: number, value: number): void | never => {
        if (this.waveforms[waveformId])
            this.waveforms[waveformId].volume = value;
        else
            throw new Error('waveform doesn\'t exist');
    }

    public setWaveType = (waveformId: number, waveType: OscillatorType | null): void | never => {
        if (this.waveforms[waveformId])
            this.waveforms[waveformId].type = waveType;
        else
            throw new Error('waveform doesn\'t exist');
    }

    public addWaveform = (waveform: WaveformData): void => {
        this.waveforms.push(waveform);
    }

    public removeWaveform = (id: number): void | never => {
        if (this.waveforms[id])
            this.waveforms.splice(id, 1);
        else
            throw new Error('waveform doesn\'t exist');
    }

    private generateVoices = (frequency: number): Voice[] => {
        let voices: Voice[] = [];

        for (let waveformData of this.waveforms) {
            if (waveformData.type) {
                let voice = new Voice(this.context, waveformData.type);
                voice.setVolume(waveformData.volume);
                voice.frequency.value = frequency;
                voices.push(voice);
            }
        }

        return voices;
    }

    private noteNumberToFrequency = (noteNumber: number): number => {
        return 440 * Math.pow(2, (noteNumber - 69) / 12);
    }
}

